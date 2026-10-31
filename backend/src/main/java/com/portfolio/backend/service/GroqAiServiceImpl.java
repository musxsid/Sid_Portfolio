package com.portfolio.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.backend.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class GroqAiServiceImpl implements GroqAiService {

    private final GitHubService gitHubService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqApiUrl;

    @Value("${groq.model:openai/gpt-oss-120b}")
    private String primaryModel;

    @Value("${groq.fallback-model:openai/gpt-oss-20b}")
    private String fallbackModel;

    @Autowired
    public GroqAiServiceImpl(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public ChatResponseDto processChat(ChatRequestDto request) {
        if (request == null || request.getMessage() == null || request.getMessage().isBlank()) {
            return ChatResponseDto.builder()
                    .success(false)
                    .error("User message cannot be empty")
                    .response("Please ask a question about Siddharth's background, location, experience, technical skills, or repositories.\n\n📌 **Source:** [Official Resume & Portfolio]")
                    .build();
        }

        // If API key is present, attempt LLM completion with Groq
        if (groqApiKey != null && !groqApiKey.isBlank()) {
            String systemPrompt = buildGroundingSystemPrompt();
            String[] modelsToTry = new String[]{primaryModel, fallbackModel, "llama-3.3-70b-versatile"};
            for (String model : modelsToTry) {
                try {
                    ChatResponseDto response = executeGroqChat(model, systemPrompt, request);
                    if (response != null && response.isSuccess()) {
                        return response;
                    }
                } catch (Exception e) {
                    log.warn("Groq inference failed on model {}: {}. Attempting fallback...", model, e.getMessage());
                }
            }
        }

        // Deterministic local grounded intelligence engine
        return buildLocalGroundedFallback(request.getMessage());
    }

    private ChatResponseDto executeGroqChat(String model, String systemPrompt, ChatRequestDto request) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + groqApiKey);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));

        if (request.getHistory() != null && !request.getHistory().isEmpty()) {
            int start = Math.max(0, request.getHistory().size() - 6);
            for (int i = start; i < request.getHistory().size(); i++) {
                ChatMessageDto msg = request.getHistory().get(i);
                if (msg != null && msg.getContent() != null && !msg.getContent().isBlank()) {
                    String role = "user".equalsIgnoreCase(msg.getRole()) ? "user" : "assistant";
                    messages.add(Map.of("role", role, "content", msg.getContent()));
                }
            }
        }

        messages.add(Map.of("role", "user", "content", request.getMessage()));

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", messages);
        body.put("max_tokens", 850);
        body.put("temperature", 0.2);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);
        ResponseEntity<String> response = restTemplate.exchange(groqApiUrl, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                String reply = choices.get(0).path("message").path("content").asText();
                List<String> sources = extractLinks(reply);

                return ChatResponseDto.builder()
                        .success(true)
                        .model("AURA-Intelligence (" + model + ")")
                        .response(reply)
                        .sources(sources)
                        .build();
            }
        }

        return null;
    }

    private String buildGroundingSystemPrompt() {
        StringBuilder sb = new StringBuilder();
        sb.append("You are AURA, the official AI assistant for Siddharth Shakyawal (GitHub: @musxsid).\n");
        sb.append("Your mission is to assist recruiters, engineering leads, founders, and visitors with 100% ACCURATE, FACTUAL, and UNHALLUCINATED technical and biographical information strictly grounded in Siddharth's portfolio application and official resume.\n\n");

        sb.append("### CRITICAL GROUNDING & ACCURACY POLICY:\n");
        sb.append("- You MUST answer ANY question a recruiter or client could ask about Siddharth, including: his location/residence in Kota, Rajasthan / Pune, contact information, education at Christ University, internships at Angel Bot AI and CodeArrest Softwares, tech stack, and GitHub repositories.\n");
        sb.append("- DO NOT invent, extrapolate, or hallucinate skills, experiences, dates, or repositories not explicitly listed below.\n");
        sb.append("- MANDATORY SOURCE CITATION: At the very end of EVERY single response, you MUST append a verified source line in this exact format:\n");
        sb.append("  📌 **Source:** [Specific Source, e.g. 'Official Resume', 'GitHub @musxsid/<repo>', 'Experience at Angel Bot AI', 'Portfolio Arsenal', etc.]\n\n");

        sb.append("### STRICT OUTPUT FORMATTING RULES:\n");
        sb.append("1. NEVER USE MARKDOWN TABLES (do NOT use '| col | col |' syntax). Tables break on mobile screens.\n");
        sb.append("2. NEVER USE RAW HTML TAGS (such as <br>, <div>, <span>, or <p>). Use clean Markdown line breaks instead.\n");
        sb.append("3. Structure answers with clean bullet points (-), bold sub-labels (**Role:**, **Tech Stack:**, **Key Impact:**).\n");
        sb.append("4. CLICKABLE GITHUB REPOSITORIES: Whenever you mention any project or repository, ALWAYS provide its direct link formatted as [Project Name](https://github.com/musxsid/<repo-name>). The UI will automatically render it as a bold title with a clickable [GitHub] button. Never print bare URLs.\n");
        sb.append("5. When asked for his resume, provide the direct download link: [Download Siddharth's Resume (PDF)](/api/public/resume/file).\n");
        sb.append("6. If asked an off-topic question unrelated to Siddharth (e.g. world trivia, jokes, unrelated coding problems), politely decline: 'I am AURA, Siddharth's official AI assistant, and I strictly provide verified information regarding Siddharth's background, projects, and technical architecture.'\n\n");

        sb.append("### VERIFIED BIOGRAPHICAL PROFILE (Official Resume):\n");
        sb.append("- Full Name: Siddharth Shakyawal\n");
        sb.append("- Current / Home Location: Kota, Rajasthan 324010, India\n");
        sb.append("- College / Academic Location: Christ University, Lavasa, Pune (Maharashtra, India)\n");
        sb.append("- Relocation & Work Mode: Actively open to on-site relocation (Pune, Bengaluru, Delhi NCR, Hyderabad, Mumbai, etc.) and remote/hybrid software engineering roles\n");
        sb.append("- Email: siddharthshakya2004@gmail.com | Phone: +91 9256265129\n");
        sb.append("- LinkedIn: [linkedin.com/in/siddharth-shakyawal-925889356](https://linkedin.com/in/siddharth-shakyawal-925889356) | GitHub: [github.com/musxsid](https://github.com/musxsid)\n");
        sb.append("- Degree: Bachelor of Computer Applications (BCA) (2024–2027), Christ University, Lavasa, Pune\n");
        sb.append("- Seeking: AI/ML, Backend, or AI Systems Engineering role\n");
        sb.append("- Summary: Software Engineer specializing in Backend Systems and Applied AI/ML, proficient in Python, Java (Spring Boot), and React. Experienced in architecting hallucination-free Structured RAG pipelines, deterministic data retrieval layers, and LLM orchestration workflows.\n\n");

        sb.append("### TECHNICAL SKILLS & PRODUCTION ARSENAL:\n");
        sb.append("- Languages: Java, Python, TypeScript, JavaScript, C#, Kotlin, C++, SQL\n");
        sb.append("- Backend: Spring Boot (3/4), Spring AI, Spring Security (OAuth2/JWT), REST APIs, JPA/Hibernate, RabbitMQ, .NET Core (MVC)\n");
        sb.append("- Frontend: React 19, Tailwind CSS 4, Framer Motion, HTML5, CSS3, JavaScript\n");
        sb.append("- AI / LLM: Structured RAG Pipelines, Prompt Engineering, LLM Integration (Llama, Groq, Ollama), Vector Embeddings\n");
        sb.append("- Databases & Caching: MongoDB, PostgreSQL, MySQL, SQL Server, Redis, MinIO (S3), Firebase\n");
        sb.append("- Tools & DevOps: Git, GitHub, Docker, Docker Compose, Postman, Maven\n\n");

        sb.append("### PRODUCTION WORK EXPERIENCE:\n");
        sb.append("1. **Angel Bot AI** (Delhi, India) — Software Developer Intern (24 Jun 2026 – 14 Aug 2026):\n");
        sb.append("   - Project: **Git in Bits (DevPulse AI) – Engineering Intelligence Platform**\n");
        sb.append("   - Tech Stack: React 19, Spring Boot 3, MongoDB, Spring AI, Groq (Llama 3.3 70B), Tailwind CSS, Docker\n");
        sb.append("   - Developed full-stack dashboard computing 6 core KPIs, tracking 15.1h avg PR merge times and code churn (+2.7M lines) from MongoDB.\n");
        sb.append("   - Implemented multi-domain health scoring engine (0–100) evaluating PR turnaround, branch hygiene, and CI/CD pass rates across 5 dimensions.\n");
        sb.append("   - Engineered structured RAG pipeline with Spring AI and Groq that pre-aggregated metrics in MongoDB, reducing hallucinated LLM responses to 0% and cutting inference latency to <1.2s.\n");
        sb.append("   - Implemented rate-limited delta sync with 5-minute cooldown guards, reducing external GitHub API calls by 85% and achieving zero-token reads on reloads.\n");
        sb.append("   - Secured multi-tenant data access with server-side OAuth2 session validation in RAM, blocking 100% of unauthorized cross-tenant IDOR exploits.\n\n");

        sb.append("2. **CodeArrest Softwares Pvt. Ltd.** (Kota, India) — Full Stack Developer Intern (24 Jun 2025 – 23 Aug 2025):\n");
        sb.append("   - Project: **JobHive – Online Job Application Portal**\n");
        sb.append("   - Tech Stack: .NET Core (MVC), C#, SQL Server, Entity Framework Core, HTML, CSS, JavaScript\n");
        sb.append("   - Developed full-stack job portal using .NET Core (MVC) and SQL Server supporting multi-role recruitment workflows.\n");
        sb.append("   - Implemented multi-parameter filtering across title, compensation, and location, reducing query execution time by 35%.\n");
        sb.append("   - Integrated Entity Framework Core with indexed relational schemas, ensuring 100% transactional consistency across applicant tracking.\n\n");

        sb.append("### VERIFIED CORE PROJECTS (From Resume & GitHub):\n");
        sb.append("1. **[OmniStay ERP System](https://github.com/musxsid/omnistay-erp)**: Full-Stack Hotel Management & Booking Engine (Java 17, Spring Boot, PostgreSQL, React 19, Hibernate JPA, REST APIs, LLM Integration). ACID PostgreSQL folio ledger, automated night audit batch service (<500ms), and AI review analyzer.\n");
        sb.append("2. **[simplyAudio](https://github.com/musxsid/simplyAudio)**: Event-Driven Audio Microservices Platform (Java, Spring Boot, RabbitMQ, Keycloak SSO, Docker Compose, MinIO S3, React 19). Asynchronous RabbitMQ queues, Keycloak OAuth2/OIDC SSO, and MinIO S3-compatible cloud storage.\n");
        sb.append("3. **[Triage](https://github.com/musxsid/Triage)**: Full-Stack Productivity SaaS (React.js, Spring Boot, Java, MySQL, Spring Security JWT, Tailwind CSS, Framer Motion). Stateless auth (<50ms session validation) and 3-tier hierarchical workspace schema.\n");
        sb.append("4. **[Supervisor Feedback Analyzer](https://github.com/musxsid/supervisor-feedback-analyzer)**: Workplace Performance Analytics (JavaScript, React 19, local Llama 3.2 via Ollama, Spring AI, Spring Boot). Parses unstructured reviews with deterministic JSON schema enforcement.\n");
        sb.append("5. **[DocuVault](https://github.com/musxsid/DocuVault)**: Secure Document Ingestion & Vector Storage Pipeline (Python, FastAPI, Vector Embeddings). Cryptographically secured indexing pipeline with content chunking and semantic embeddings.\n");
        sb.append("6. **[Go Auth Microservice](https://github.com/musxsid/go-auth-postgres)**: Cloud-Native Auth Microservice (Go, PostgreSQL, Argon2id, Docker, RS256 JWT). Sub-5ms low latency HTTP service with pgx connection pools and RS256 asymmetric JWT signing.\n");
        sb.append("7. **[Sid Portfolio](https://github.com/musxsid/Sid_Portfolio)**: Creative Engineering Portfolio (React 19, Tailwind CSS 4, Spring Boot 3, PostgreSQL, Groq AI). Real-time GitHub sync, automated image discovery, and grounded AI assistant.\n\n");

        return sb.toString();
    }

    private List<String> extractLinks(String text) {
        List<String> links = new ArrayList<>();
        if (text == null) return links;
        Pattern pattern = Pattern.compile("\\[([^\\]]+)\\]\\((https?://[^)]+|/[^)]+)\\)");
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
            links.add(matcher.group(2));
        }
        return links;
    }

    private ChatResponseDto buildLocalGroundedFallback(String userQuery) {
        String lower = userQuery.toLowerCase().trim();
        StringBuilder reply = new StringBuilder();

        // 1. Location & Residence queries
        if (lower.contains("live") || lower.contains("living") || lower.contains("location") 
                || lower.contains("where is") || lower.contains("where does") || lower.contains("stay") 
                || lower.contains("city") || lower.contains("state") || lower.contains("based in") 
                || lower.contains("reside") || lower.contains("relocate") || lower.contains("where are you")) {
            reply.append("### 📍 Location & Relocation Availability\n\n");
            reply.append("Siddharth Shakyawal is primarily based in **Kota, Rajasthan (324010), India**, and is currently pursuing his degree in **Lavasa, Pune (Maharashtra)** at Christ University.\n\n");
            reply.append("- **Current / Home Location:** Kota, Rajasthan (324010)\n");
            reply.append("- **Academic Location:** Christ University, Lavasa, Pune\n");
            reply.append("- **Work & Relocation Preference:** Actively open to **on-site relocation** (Pune, Bengaluru, Delhi NCR, Hyderabad, Mumbai, etc.) as well as hybrid and remote software engineering opportunities worldwide.\n\n");
            reply.append("📫 **Direct Contact:** [siddharthshakya2004@gmail.com](mailto:siddharthshakya2004@gmail.com) | **Phone:** +91 9256265129\n\n");
            reply.append("📌 **Source:** Official Resume & Biographical Records");
        }
        // 2. Education & Degree
        else if (lower.contains("education") || lower.contains("college") || lower.contains("university") 
                || lower.contains("degree") || lower.contains("bca") || lower.contains("christ") 
                || lower.contains("graduat") || lower.contains("study") || lower.contains("academics")) {
            reply.append("### 🎓 Academic Background & Education\n\n");
            reply.append("- **Degree:** Bachelor of Computer Applications (BCA)\n");
            reply.append("- **Institution:** Christ University, Lavasa, Pune\n");
            reply.append("- **Duration:** 2024 – 2027\n");
            reply.append("- **Core Competencies:** Distributed computing, data structures & algorithms, relational database systems, and applied AI systems engineering.\n\n");
            reply.append("📄 [Download Siddharth's Resume (PDF)](/api/public/resume/file)\n\n");
            reply.append("📌 **Source:** Official Resume / Education Section");
        }
        // 3. Contact & Hiring / Social Links
        else if (lower.contains("contact") || lower.contains("hire") || lower.contains("email") 
                || lower.contains("phone") || lower.contains("call") || lower.contains("number") 
                || lower.contains("reach") || lower.contains("linkedin") || lower.contains("github link") 
                || lower.contains("connect") || lower.contains("recruiter")) {
            reply.append("### 📬 Contact & Professional Links\n\n");
            reply.append("You can connect directly with Siddharth through any of the verified channels below:\n\n");
            reply.append("- **Email:** [siddharthshakya2004@gmail.com](mailto:siddharthshakya2004@gmail.com)\n");
            reply.append("- **Phone / WhatsApp:** +91 9256265129\n");
            reply.append("- **Location:** Kota, Rajasthan (324010) & Pune, India (Open to Relocation / Remote)\n");
            reply.append("- **LinkedIn:** [linkedin.com/in/siddharth-shakyawal-925889356](https://linkedin.com/in/siddharth-shakyawal-925889356)\n");
            reply.append("- **GitHub:** [github.com/musxsid](https://github.com/musxsid)\n");
            reply.append("- **Resume:** [Download Siddharth's Resume (PDF)](/api/public/resume/file)\n\n");
            reply.append("📌 **Source:** Official Resume & Portfolio Contact Section");
        }
        // 4. Work Experience & Internships
        else if (lower.contains("experience") || lower.contains("intern") || lower.contains("company") 
                || lower.contains("angel bot") || lower.contains("codearrest") || lower.contains("work history") 
                || lower.contains("job") || lower.contains("career") || lower.contains("past roles")) {
            reply.append("### 💼 Production Work Experience\n\n");
            reply.append("Siddharth has completed two verified engineering internships:\n\n");
            reply.append("1. **Angel Bot AI** (Delhi, India) — Software Developer Intern *(24 Jun 2026 – 14 Aug 2026)*:\n");
            reply.append("   - **Platform:** Git in Bits (DevPulse AI) – Engineering Intelligence Platform\n");
            reply.append("   - **Tech Stack:** React 19, Spring Boot 3, MongoDB, Spring AI, Groq (Llama 3.3 70B), Docker\n");
            reply.append("   - Computed 6 core KPIs, tracking 15.1h avg PR turnaround and code churn (+2.7M lines).\n");
            reply.append("   - Engineered a structured RAG pipeline cutting inference latency to <1.2s with 0% hallucinations.\n");
            reply.append("   - Built rate-limited delta sync with 5-minute cooldown guards, reducing GitHub API calls by 85%.\n");
            reply.append("   - Secured multi-tenant data access with server-side OAuth2 session validation in RAM.\n\n");
            reply.append("2. **CodeArrest Softwares Pvt. Ltd.** (Kota, India) — Full Stack Developer Intern *(24 Jun 2025 – 23 Aug 2025)*:\n");
            reply.append("   - **Platform:** JobHive – Online Job Application Portal\n");
            reply.append("   - **Tech Stack:** .NET Core (MVC), C#, SQL Server, Entity Framework Core, HTML, CSS, JavaScript\n");
            reply.append("   - Implemented multi-parameter filtering across title, compensation, and location, optimizing query execution by 35%.\n");
            reply.append("   - Integrated Entity Framework Core with indexed relational schemas ensuring 100% transactional consistency.\n\n");
            reply.append("📌 **Source:** Official Resume / Production Work Experience");
        }
        // 5. Technical Skills & Arsenal
        else if (lower.contains("skill") || lower.contains("stack") || lower.contains("arsenal") 
                || lower.contains("languages") || lower.contains("backend") || lower.contains("frontend") 
                || lower.contains("technolog") || lower.contains("framework") || lower.contains("tools")) {
            reply.append("### ⚡ Siddharth's Technical Arsenal\n\n");
            reply.append("Grounded directly in his official resume and production systems:\n\n");
            reply.append("- **Programming Languages:** Java (17/21), Python, TypeScript, JavaScript, C#, Kotlin, C++, SQL\n");
            reply.append("- **Backend & APIs:** Spring Boot (3/4), Spring AI, Spring Security (OAuth2/JWT), REST APIs, JPA/Hibernate, RabbitMQ, .NET Core (MVC)\n");
            reply.append("- **Frontend Architecture:** React 19, Tailwind CSS 4, Framer Motion, HTML5, CSS3, Vite\n");
            reply.append("- **Applied AI & LLM:** Structured RAG Pipelines, Prompt Engineering, LLM Integration (Groq Llama 3.3 70B, Ollama Llama 3.2), Vector Embeddings, Semantic Search\n");
            reply.append("- **Databases & Storage:** PostgreSQL, MongoDB, MySQL, SQL Server, Redis, MinIO (S3), Firebase\n");
            reply.append("- **DevOps & Infrastructure:** Git, GitHub, Docker, Docker Compose, Postman, Maven\n\n");
            reply.append("📄 [Download Verified Resume (PDF)](/api/public/resume/file)\n\n");
            reply.append("📌 **Source:** Official Resume & Portfolio Arsenal");
        }
        // 6. Resume Download
        else if (lower.contains("resume") || lower.contains("cv") || lower.contains("pdf")) {
            reply.append("### 📄 Siddharth Shakyawal — Official Resume\n\n");
            reply.append("You can inspect or download Siddharth's authentic, up-to-date resume directly:\n\n");
            reply.append("👉 **[Download Siddharth's Resume (PDF)](/api/public/resume/file)**\n\n");
            reply.append("- **Summary:** Software Engineer specializing in Backend Systems & Applied AI/ML.\n");
            reply.append("- **Education:** BCA at Christ University, Lavasa, Pune (2024–2027).\n");
            reply.append("- **Location:** Kota, Rajasthan (324010) & Pune (Open to Relocation & Remote).\n");
            reply.append("- **Contact:** [siddharthshakya2004@gmail.com](mailto:siddharthshakya2004@gmail.com) | +91 9256265129\n\n");
            reply.append("📌 **Source:** Official Resume (PDF)");
        }
        // 7. simplyAudio
        else if (lower.contains("simplyaudio") || lower.contains("audio") || lower.contains("music stream")) {
            reply.append("### 🎧 simplyAudio — Event-Driven Audio Microservices Platform\n\n");
            reply.append("A distributed, high-concurrency music streaming and cataloging platform engineered by Siddharth.\n\n");
            reply.append("- **Tech Stack:** Java, Spring Boot 3, RabbitMQ, Keycloak SSO, Docker Compose, MinIO S3, React 19\n");
            reply.append("- **Event-Driven Architecture:** Asynchronous RabbitMQ message queues decoupling high-throughput media ingestion from real-time analytics.\n");
            reply.append("- **Centralized Security:** Keycloak OAuth2 / OIDC single sign-on with fine-grained RBAC.\n");
            reply.append("- **Object Storage:** High-throughput audio chunking partitioned across MinIO S3-compatible cloud storage.\n\n");
            reply.append("🔗 **Explore Repository:** [simplyAudio on GitHub](https://github.com/musxsid/simplyAudio)\n\n");
            reply.append("📌 **Source:** GitHub Repository [musxsid/simplyAudio]");
        }
        // 8. OmniStay ERP
        else if (lower.contains("omnistay") || lower.contains("hotel") || lower.contains("erp") || lower.contains("ledger")) {
            reply.append("### 🏨 OmniStay ERP — Hotel Management & Relational Ledger\n\n");
            reply.append("A full-stack enterprise hotel management and booking system built with **Java 17**, **Spring Boot**, **PostgreSQL**, and **React 19**.\n\n");
            reply.append("- **Relational Folio Ledger:** Multi-tenant PostgreSQL folio billing engine ensuring 100% audit reconciliation across room charges and POS billing with ACID guarantees.\n");
            reply.append("- **Night Audit Service:** Automated batch service executing daily roll-forwards and occupancy metrics in <500ms.\n");
            reply.append("- **AI Review Analyzer:** Built-in LLM integration extracting structured guest sentiments and operational insights with 95%+ precision.\n\n");
            reply.append("🔗 **Explore Repository:** [omnistay-erp on GitHub](https://github.com/musxsid/omnistay-erp)\n\n");
            reply.append("📌 **Source:** GitHub Repository [musxsid/omnistay-erp] & Official Resume");
        }
        // 9. Supervisor Feedback Analyzer
        else if (lower.contains("supervisor") || lower.contains("feedback") || lower.contains("llama") || lower.contains("ollama")) {
            reply.append("### 🧠 Supervisor Feedback Analyzer — Workplace Performance Analytics\n\n");
            reply.append("An end-to-end evaluation platform utilizing local LLM inference via **Ollama (Llama 3.2)**, **Spring AI**, **Spring Boot**, and **React 19**.\n\n");
            reply.append("- **Deterministic Schema Enforcement:** Parses multi-dimensional unstructured performance reviews into structured JSON without hallucinations.\n");
            reply.append("- **Organizational Analytics:** Computes evidence-backed managerial competency scores, sentiment telemetry, and growth trajectories.\n\n");
            reply.append("🔗 **Explore Repository:** [supervisor-feedback-analyzer on GitHub](https://github.com/musxsid/supervisor-feedback-analyzer)\n\n");
            reply.append("📌 **Source:** GitHub Repository [musxsid/supervisor-feedback-analyzer]");
        }
        // 10. Git In Bits (GIBs)
        else if (lower.contains("gibs") || lower.contains("git in bits") || lower.contains("devpulse")) {
            reply.append("### 📊 Git In Bits (GIBs) — Engineering Intelligence Platform\n\n");
            reply.append("Full-stack engineering intelligence platform engineered by Siddharth at Angel Bot AI.\n\n");
            reply.append("- **Tech Stack:** Spring Boot 3, React 19, MongoDB, Spring AI, Groq (Llama 3.3 70B), Docker\n");
            reply.append("- **Key Engineering:** Ingests GitHub PR velocities and code churn (+2.7M lines), computes 5-dimension health scores (0-100), and generates structured RAG briefings with <1.2s latency.\n\n");
            reply.append("🔗 **Explore Repository:** [Git In Bits (GIBs) on GitHub](https://github.com/musxsid/GIBs-Git_In_Bits-main)\n\n");
            reply.append("📌 **Source:** Experience Record (Angel Bot AI) & GitHub [musxsid/GIBs-Git_In_Bits-main]");
        }
        // 11. DocuVault
        else if (lower.contains("docuvault") || lower.contains("document") || lower.contains("vector")) {
            reply.append("### 📑 DocuVault — Secure Document Ingestion & Semantic Search Pipeline\n\n");
            reply.append("Enterprise document intelligence platform engineered with **Python**, **FastAPI**, and **Vector Embeddings**.\n\n");
            reply.append("- Implements automated content chunking, cosine similarity retrieval, and AES-256 encrypted storage for sensitive enterprise documents.\n\n");
            reply.append("🔗 **Explore Repository:** [DocuVault on GitHub](https://github.com/musxsid/DocuVault)\n\n");
            reply.append("📌 **Source:** GitHub Repository [musxsid/DocuVault]");
        }
        // 12. Go Auth Microservice
        else if (lower.contains("go auth") || lower.contains("go-auth") || lower.contains("argon2")) {
            reply.append("### 🔒 Go Auth Microservice — Cloud-Native Low Latency Auth\n\n");
            reply.append("High-concurrency authentication engine engineered in **Go** with **PostgreSQL** and **Docker**.\n\n");
            reply.append("- Implements Argon2id password hashing, RS256 asymmetric JWT signing with key rotation, and pgx connection pools achieving **<5ms request handling**.\n\n");
            reply.append("🔗 **Explore Repository:** [go-auth-postgres on GitHub](https://github.com/musxsid/go-auth-postgres)\n\n");
            reply.append("📌 **Source:** GitHub Repository [musxsid/go-auth-postgres]");
        }
        // 13. JobHive
        else if (lower.contains("jobhive") || lower.contains("dotnet") || lower.contains(".net") || lower.contains("c#")) {
            reply.append("### 💼 JobHive — Online Recruitment Portal\n\n");
            reply.append("Full-stack recruitment portal built on **.NET Core (MVC)**, **C#**, **SQL Server**, and **Entity Framework Core**.\n\n");
            reply.append("- Engineered multi-role applicant tracking and multi-parameter filtering, reducing query execution time by 35%.\n\n");
            reply.append("🔗 **Explore Repository:** [JobHive on GitHub](https://github.com/musxsid/JobHive)\n\n");
            reply.append("📌 **Source:** Official Resume & GitHub [musxsid/JobHive]");
        }
        // 14. Sid Portfolio
        else if (lower.contains("portfolio") || lower.contains("sid portfolio") || lower.contains("website") || lower.contains("app")) {
            reply.append("### ⚡ Sid Portfolio — Creative Engineering Platform\n\n");
            reply.append("Interactive developer portfolio built with **React 19**, **Tailwind CSS 4**, **Spring Boot 3**, and **PostgreSQL**.\n\n");
            reply.append("- Real-time GitHub repository and contribution sync directly into PostgreSQL.\n");
            reply.append("- Hardware-accelerated canvas shaders, interactive aerospace chronometer skills radar, and grounded AURA AI assistant.\n\n");
            reply.append("🔗 **Explore Repository:** [Sid Portfolio on GitHub](https://github.com/musxsid/Sid_Portfolio)\n\n");
            reply.append("📌 **Source:** GitHub Repository [musxsid/Sid_Portfolio]");
        }
        // 15. General Projects / Work Overview
        else if (lower.contains("project") || lower.contains("repos") || lower.contains("built") || lower.contains("github")) {
            reply.append("### 🚀 Verified Software Engineering Projects\n\n");
            reply.append("Siddharth has engineered **13 verified repositories** on GitHub across distributed backends, microservices, and applied AI:\n\n");
            reply.append("1. **[OmniStay ERP](https://github.com/musxsid/omnistay-erp)** — Hotel management & ACID PostgreSQL ledger.\n");
            reply.append("2. **[simplyAudio](https://github.com/musxsid/simplyAudio)** — Event-driven audio microservices with RabbitMQ & Keycloak SSO.\n");
            reply.append("3. **[Git In Bits (GIBs)](https://github.com/musxsid/GIBs-Git_In_Bits-main)** — Engineering intelligence platform with Groq LLM briefings.\n");
            reply.append("4. **[Supervisor Feedback Analyzer](https://github.com/musxsid/supervisor-feedback-analyzer)** — Workplace telemetry via local Llama 3.2.\n");
            reply.append("5. **[DocuVault](https://github.com/musxsid/DocuVault)** — Vector embeddings and secure document intelligence pipeline.\n");
            reply.append("6. **[Go Auth Microservice](https://github.com/musxsid/go-auth-postgres)** — Sub-5ms low latency auth service with Argon2id.\n");
            reply.append("7. **[JobHive](https://github.com/musxsid/JobHive)** — .NET Core recruitment portal with Entity Framework Core.\n");
            reply.append("8. **[Sid Portfolio](https://github.com/musxsid/Sid_Portfolio)** — Real-time engineering portfolio with dynamic GitHub sync.\n\n");
            reply.append("🔗 **Explore All Repositories:** [GitHub Profile (@musxsid)](https://github.com/musxsid)\n\n");
            reply.append("📌 **Source:** GitHub Live Repositories & Official Resume");
        }
        // 16. Who is Siddharth / Bio / Summary / About
        else if (lower.contains("who is") || lower.contains("about") || lower.contains("tell me about") 
                || lower.contains("summary") || lower.contains("profile") || lower.contains("bio") || lower.contains("background")) {
            reply.append("### 👨‍💻 About Siddharth Shakyawal\n\n");
            reply.append("Siddharth is a **Software Engineer** specializing in **Backend Systems** and **Applied AI/ML**, proficient in Python, Java (Spring Boot), Go, and React.\n\n");
            reply.append("- **Location:** Based in Kota, Rajasthan (324010) & studying in Lavasa, Pune (Open to Relocation & Remote).\n");
            reply.append("- **Academics:** Pursuing BCA (2024–2027) at Christ University, Lavasa, Pune.\n");
            reply.append("- **Experience:** Software Developer Intern at Angel Bot AI (Delhi) and CodeArrest Softwares (Kota).\n");
            reply.append("- **Key Expertise:** Structured RAG pipelines, deterministic LLM orchestration, event-driven microservices (RabbitMQ), ACID relational folio ledgers, and container meshes.\n\n");
            reply.append("📄 [Download Siddharth's Resume (PDF)](/api/public/resume/file) [Connect on LinkedIn](https://linkedin.com/in/siddharth-shakyawal-925889356)\n\n");
            reply.append("📌 **Source:** Official Resume / Summary & Executive Profile");
        }
        // 17. Off-Topic / General Guardrail
        else {
            reply.append("### ⚡ AURA — Siddharth's Portfolio Intelligence\n\n");
            reply.append("I am trained on Siddharth Shakyawal's official resume, verified work experience, GitHub repositories, and system architecture.\n\n");
            reply.append("I can provide full details on:\n");
            reply.append("- **📍 Location & Relocation:** Based in Kota, Rajasthan / Pune (open to on-site relocation & remote)\n");
            reply.append("- **🎓 Academics:** BCA at Christ University, Pune (2024–2027)\n");
            reply.append("- **💼 Internships:** Production experience at Angel Bot AI & CodeArrest Softwares\n");
            reply.append("- **⚡ Tech Stack:** Java (Spring Boot), Python, Go, React 19, RabbitMQ, Docker\n");
            reply.append("- **🚀 Projects:** [simplyAudio](https://github.com/musxsid/simplyAudio), [OmniStay ERP](https://github.com/musxsid/omnistay-erp), [Git in Bits](https://github.com/musxsid/GIBs-Git_In_Bits-main), and 10 others\n");
            reply.append("- **📄 Official Resume:** [Download Resume (PDF)](/api/public/resume/file)\n\n");
            reply.append("What specific information would you like to explore?\n\n");
            reply.append("📌 **Source:** Official Resume & Portfolio Index");
        }

        return ChatResponseDto.builder()
                .success(true)
                .model("deterministic-grounded-engine")
                .response(reply.toString())
                .sources(extractLinks(reply.toString()))
                .build();
    }
}
