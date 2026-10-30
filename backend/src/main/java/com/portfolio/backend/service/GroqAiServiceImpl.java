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
                    .response("Please ask a question about Siddharth's background, projects, or technical skills.")
                    .build();
        }

        String systemPrompt = buildGroundingSystemPrompt();

        // Try primary model first, then fallback model
        String[] modelsToTry = new String[]{primaryModel, fallbackModel};
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

        // Deterministic local grounded fallback in case external API is unreachable
        return buildLocalGroundedFallback(request.getMessage());
    }

    private ChatResponseDto executeGroqChat(String model, String systemPrompt, ChatRequestDto request) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + groqApiKey);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));

        // Inject conversation history (up to last 6 turns for context continuity)
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
        body.put("max_tokens", 750);
        body.put("temperature", 0.2); // Low temperature for factual, unhallucinated answers

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
                        .model("AURA-Intelligence")
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
        sb.append("Your sole purpose is to provide recruiters, engineers, founders, and visitors with 100% ACCURATE, FACTUAL, and UNHALLUCINATED technical information strictly grounded in Siddharth's portfolio application and official resume.\n\n");

        sb.append("### CRITICAL GROUNDING & TOKEN PRESERVATION POLICY:\n");
        sb.append("- You ONLY answer questions related to Siddharth Shakyawal (his GitHub repositories, system architecture, programming skills, work experience, education, resume, and contact links).\n");
        sb.append("- DO NOT extrapolate, invent, assume, or hallucinate any details, technologies, dates, roles, or repositories not explicitly documented below.\n");
        sb.append("- DO NOT answer general knowledge questions, math problems, trivia, news, unrelated programming tutorials, or off-topic requests.\n");
        sb.append("- If a question is NOT about Siddharth or his portfolio, you MUST immediately decline in exactly ONE sentence: 'I am AURA, Siddharth's AI assistant, and I only provide verified information regarding Siddharth's projects, technical architecture, and background.'\n\n");

        sb.append("### STRICT OUTPUT FORMATTING RULES:\n");
        sb.append("1. NEVER USE MARKDOWN TABLES (do NOT use '| col | col |' syntax). Tables break on compact and mobile screens.\n");
        sb.append("2. NEVER USE RAW HTML TAGS (such as <br>, <div>, <span>, or <p>). Write standard clean Markdown line breaks instead.\n");
        sb.append("3. Structure answers with clean bullet points (-), bold sub-labels (**Project:**, **Tech Stack:**, **Key Alignment:**), and clear numbered steps where helpful.\n");
        sb.append("4. Keep responses concise, high-impact, and token-efficient.\n");
        sb.append("5. CRITICAL TRUTH: There is NO project named 'SimplyNotes' or 'SimplyNotes / SimplyAudio'. The authentic repository is strictly 'simplyAudio', an event-driven audio microservices platform.\n");
        sb.append("6. CLICKABLE GITHUB REPOSITORIES: Whenever you mention any project or repository, ALWAYS provide its direct link formatted as [Project Name](https://github.com/musxsid/<repo-name>). The UI will automatically render it as a bold title with a clickable [GitHub] button redirecting to that repository. Never print bare URLs in text.\n");
        sb.append("7. When asked for his resume, provide the direct download link: [Download Siddharth's Resume (PDF)](/resume/Siddharth_Shakyawal_Resume_october2026.pdf).\n");
        sb.append("8. When asked about contact or hiring, provide: Location: Kota, Rajasthan | Phone: +91 9256265129 | Email: siddharthshakya2004@gmail.com | LinkedIn: [linkedin.com/in/siddharth-shakyawal-925889356](https://linkedin.com/in/siddharth-shakyawal-925889356) | GitHub: [github.com/musxsid](https://github.com/musxsid).\n\n");

        sb.append("### VERIFIED BIOGRAPHICAL & RESUME PROFILE:\n");
        sb.append("- Full Name: Siddharth Shakyawal\n");
        sb.append("- Location: Kota, Rajasthan 324010 | Phone: +91 9256265129 | Email: siddharthshakya2004@gmail.com\n");
        sb.append("- Summary: Software Engineer specializing in Backend Systems and Applied AI/ML, proficient in Python, Java (Spring Boot), and React. Experienced in architecting hallucination-free Structured RAG pipelines, deterministic data retrieval layers, and LLM orchestration workflows. Proven background building resilient data ingestion pipelines, scalable microservices, and secure, multi-tenant APIs.\n");
        sb.append("- Education: Bachelor of Computer Applications (BCA) (2024–2027), Christ University, Lavasa, Pune\n");
        sb.append("- Categorized Technical Skills:\n");
        sb.append("  * Languages: Java, Python, TypeScript, JavaScript, C#, Kotlin, C++, SQL\n");
        sb.append("  * Backend: Spring Boot (3/4), Spring AI, Spring Security (OAuth2/JWT), REST APIs, JPA/Hibernate, RabbitMQ, .NET Core (MVC)\n");
        sb.append("  * Frontend: React (19), Tailwind CSS, Framer Motion, HTML, CSS, JavaScript\n");
        sb.append("  * AI / LLM: Structured RAG Pipelines, Prompt Engineering, LLM Integration (Llama, Groq, Ollama), Vector Embeddings\n");
        sb.append("  * Databases: MongoDB, PostgreSQL, MySQL, SQL Server, Redis, MinIO (S3), Firebase\n");
        sb.append("  * Tools & DevOps: Git, GitHub, Docker, Docker Compose, Postman, Maven\n\n");

        sb.append("### PRODUCTION WORK EXPERIENCE & SKILL ALIGNMENT:\n");
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

        sb.append("### VERIFIED CORE PROJECTS (From Resume & Application):\n");
        sb.append("1. **[OmniStay ERP System](https://github.com/musxsid/omnistay-erp)** — Full-Stack Hotel Management & Booking Engine:\n");
        sb.append("   - Tech Stack: Java 17, Spring Boot, PostgreSQL, React 19, Hibernate JPA, REST APIs, LLM Integration\n");
        sb.append("   - Designed ACID-compliant PostgreSQL folio ledger ensuring 100% audit reconciliation across room charges and POS billing.\n");
        sb.append("   - Engineered automated night audit batch service executing daily roll-forwards and occupancy metrics in <500ms.\n");
        sb.append("   - Built dual guest/staff portal with real-time room tracking and AI review analyzer with 95%+ KPI extraction precision.\n\n");
        sb.append("2. **[Triage](https://github.com/musxsid/Triage)** — Full-Stack Productivity & Task Triage SaaS:\n");
        sb.append("   - Tech Stack: React.js, Spring Boot, Java, MySQL, Spring Security (JWT), Tailwind CSS, Framer Motion\n");
        sb.append("   - Built stateless auth service using Spring Security and JWT with <50ms session validation and UUID share links.\n");
        sb.append("   - Engineered 3-tier hierarchical workspace and folder relational schema with JPA/Hibernate transactional integrity.\n");
        sb.append("   - Designed responsive Glassmorphism UI with dark mode support and real-time image previews.\n\n");
        sb.append("3. **[simplyAudio](https://github.com/musxsid/simplyAudio)** — Event-Driven Audio Microservices Platform:\n");
        sb.append("   - Tech Stack: Java, Spring Boot, RabbitMQ, Keycloak SSO, Docker Compose, MinIO (S3), React 19\n");
        sb.append("   - Asynchronous RabbitMQ event-driven architecture decoupling audio ingestion from real-time analytics.\n");
        sb.append("   - Centralized Keycloak OAuth2/OIDC SSO with role-based access control and token inspection.\n");
        sb.append("   - Containerized Docker mesh isolating streaming endpoints, MinIO S3 object storage, and databases.\n\n");
        sb.append("4. **[Supervisor Feedback Analyzer](https://github.com/musxsid/supervisor-feedback-analyzer)** — Workplace Performance Analytics:\n");
        sb.append("   - Tech Stack: JavaScript, React 19, Llama 3.2 via Ollama, Spring AI, Spring Boot, REST APIs, Tailwind CSS\n");
        sb.append("   - Parses unstructured reviews through local Llama 3.2 via Ollama and Spring AI with deterministic JSON schema enforcement.\n\n");
        sb.append("5. **[DocuVault](https://github.com/musxsid/DocuVault)** — Secure Document Ingestion & Vector Storage Pipeline:\n");
        sb.append("   - Tech Stack: Python, FastAPI, Vector Embeddings, Document Ingestion\n");
        sb.append("   - Cryptographically secured document indexing pipeline with content chunking and semantic embeddings.\n\n");
        sb.append("6. **[Go Auth Microservice](https://github.com/musxsid/go-auth-postgres)** — Cloud-Native Auth Microservice:\n");
        sb.append("   - Tech Stack: Go, PostgreSQL, Argon2id, Docker, RS256 JWT, REST APIs\n");
        sb.append("   - Sub-5ms low latency HTTP service engineered with pgx connection pools and RS256 asymmetric JWT signing.\n\n");

        sb.append("### AUTHENTIC SYNCHRONIZED GITHUB REPOSITORIES (13 Total):\n");
        try {
            List<GitHubProjectDto> liveProjects = gitHubService.getProjects();
            if (liveProjects != null && !liveProjects.isEmpty()) {
                for (GitHubProjectDto p : liveProjects) {
                    sb.append(String.format("- **%s** (%s):\n", p.getTitle() != null ? p.getTitle() : p.getName(), p.getLanguage()));
                    sb.append(String.format("  - Tagline: %s\n", p.getTagline()));
                    sb.append(String.format("  - Description: %s\n", p.getDescription()));
                    sb.append(String.format("  - Tech Stack: %s\n", p.getTechStack() != null ? String.join(", ", p.getTechStack()) : ""));
                    sb.append(String.format("  - GitHub URL: %s\n", p.getGithubUrl()));
                    sb.append(String.format("  - Stars: %d | Forks: %d\n\n", p.getStars(), p.getForks()));
                }
            }
        } catch (Exception e) {
            log.warn("Could not append live projects to system prompt: {}", e.getMessage());
        }

        sb.append("### GITHUB TELEMETRY & ACTIVITY:\n");
        try {
            GitHubContributionDataDto contrib = gitHubService.getContributions();
            if (contrib != null) {
                sb.append(String.format("- Annual Contributions: %d\n", contrib.getTotalContributions()));
                sb.append(String.format("- Current Streak: %d days | Longest Streak: %d days\n", contrib.getCurrentStreak(), contrib.getLongestStreak()));
                sb.append("- Automated Sync: Background cron synchronizing GitHub commits and repositories every 2 hours directly to PostgreSQL.\n\n");
            }
        } catch (Exception e) {
            log.warn("Could not append contributions to system prompt: {}", e.getMessage());
        }

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
        String lower = userQuery.toLowerCase();
        StringBuilder reply = new StringBuilder();

        if (lower.contains("simplyaudio") || lower.contains("audio") || lower.contains("music")) {
            reply.append("### 🎧 simplyAudio — Event-Driven Audio Microservices\n\n");
            reply.append("A distributed, enterprise-grade music streaming and cataloging platform engineered by Siddharth with **Spring Boot**, **React 19**, and asynchronous **RabbitMQ** event pipelines.\n\n");
            reply.append("**Architectural Highlights:**\n");
            reply.append("- **Event Broker:** RabbitMQ queues decouple high-throughput media ingestion from real-time analytics.\n");
            reply.append("- **SSO & Security:** Centralized Keycloak OAuth2 / OIDC authentication with fine-grained RBAC.\n");
            reply.append("- **Container Mesh:** Multi-service Docker Compose architecture isolating API Gateway, streaming backends, and MinIO S3 object storage.\n\n");
            reply.append("🔗 **Explore the Codebase:** [simplyAudio on GitHub](https://github.com/musxsid/simplyAudio)");
        } else if (lower.contains("omnistay") || lower.contains("hotel") || lower.contains("erp")) {
            reply.append("### 🏨 OmniStay ERP — Hotel Management & Relational Ledger\n\n");
            reply.append("A production hotel management and booking system built with **Java 17**, **Spring Boot 4**, **PostgreSQL**, and **React 19**.\n\n");
            reply.append("**Key Capabilities:**\n");
            reply.append("- Multi-tenant relational folio ledger for room charges, restaurant POS tabs, and payments with ACID guarantees.\n");
            reply.append("- Dynamic room matrix tracking, automated night audit batch processing, and AI review analysis.\n\n");
            reply.append("🔗 **Repository:** [omnistay-erp on GitHub](https://github.com/musxsid/omnistay-erp)");
        } else if (lower.contains("resume") || lower.contains("cv")) {
            reply.append("### 📄 Siddharth's Resume\n\n");
            reply.append("You can download Siddharth Shakyawal's latest verified resume directly:\n\n");
            reply.append("👉 **[Download Siddharth's Resume (PDF)](/resume/Siddharth_Shakyawal_Resume_october2026.pdf)**\n\n");
            reply.append("- **Education:** BCA at Christ University, Pune (2024–2027)\n");
            reply.append("- **Specialization:** Backend Architecture (Java Spring Boot, Go, Python) & Applied AI/ML.");
        } else if (lower.contains("contact") || lower.contains("hire") || lower.contains("email") || lower.contains("linkedin")) {
            reply.append("### 📬 Connect with Siddharth\n\n");
            reply.append("Siddharth is always open to discussing engineering opportunities, microservices architecture, and applied AI collaborations:\n\n");
            reply.append("- **LinkedIn:** [linkedin.com/in/siddharth-shakyawal-925889356](https://linkedin.com/in/siddharth-shakyawal-925889356)\n");
            reply.append("- **GitHub:** [github.com/musxsid](https://github.com/musxsid)\n");
            reply.append("- **Resume:** [Download Resume](/resume/Siddharth_Shakyawal_Resume_october2026.pdf)");
        } else {
            reply.append("### ⚡ AURA — Siddharth's Portfolio Intelligence\n\n");
            reply.append("I am trained on Siddharth Shakyawal's authentic GitHub repositories, verified resume, and system architecture data.\n\n");
            reply.append("**Notable Architectures Engineered by Sid:**\n");
            reply.append("- **[OmniStay ERP](https://github.com/musxsid/omnistay-erp)** — Full-stack hotel management with PostgreSQL folio ledgers.\n");
            reply.append("- **[simplyAudio](https://github.com/musxsid/simplyAudio)** — Event-driven RabbitMQ audio microservices with Keycloak SSO.\n");
            reply.append("- **[Supervisor Feedback Analyzer](https://github.com/musxsid/supervisor-feedback-analyzer)** — Deterministic workplace analytics via local Llama 3.2.\n");
            reply.append("- **[Git In Bits (GIBs)](https://github.com/musxsid/GIBs-Git_In_Bits-main)** — Engineering telemetry platform with AI briefings.\n");
            reply.append("- **[DocuVault](https://github.com/musxsid/DocuVault)** — Zero-knowledge air-gapped document intelligence pipeline.\n\n");
            reply.append("Feel free to ask me about any of these systems, his technical stack, or [download his resume](/resume/Siddharth_Shakyawal_Resume_october2026.pdf)!");
        }

        return ChatResponseDto.builder()
                .success(true)
                .model("deterministic-grounded-fallback")
                .response(reply.toString())
                .sources(extractLinks(reply.toString()))
                .build();
    }
}

