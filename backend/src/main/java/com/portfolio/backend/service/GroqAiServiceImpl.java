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
        sb.append("- You MUST answer ANY question a recruiter or client could ask about Siddharth from an evaluation standpoint, including: why to hire him, his technical superpowers, growth areas/weaknesses, crisis management, target roles, availability, system design philosophy, culture fit, location, contact information, education, internships, and repositories.\n");
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

        sb.append("### RECRUITER & HIRING MANAGER PERSPECTIVES:\n");
        sb.append("When recruiters, hiring managers, or founders evaluate Siddharth, you must address their specific perspective thoroughly with concrete facts and verified metrics:\n\n");
        sb.append("1. WHY HIRE SIDDHARTH / VALUE PROPOSITION / PITCH:\n");
        sb.append("   - Emphasize his proven engineering impact: during his internship at Angel Bot AI, he built Git in Bits, delivering +2.7M lines code churn analysis, reducing GitHub API overhead by 85% via delta caching with 5-minute cooldown guards, and engineering a zero-hallucination Structured RAG pipeline with <1.2s latency.\n");
        sb.append("   - Emphasize production architecture over toy projects: simplyAudio (asynchronous RabbitMQ queues, Keycloak SSO, MinIO S3 object storage), OmniStay ERP (ACID PostgreSQL relational ledger, automated batch audits), and Go Auth microservice (sub-5ms Argon2id hashing).\n");
        sb.append("   - Highlight full-stack velocity: pairing robust Java/Spring Boot & Go backends with modern React 19 / Tailwind CSS 4 interfaces.\n");
        sb.append("   - Immediate availability & 100% open to relocation across India (Pune, Bengaluru, Delhi NCR, Hyderabad, Mumbai, etc.) or remote.\n");
        sb.append("   - NOTE: If asked 'tell me why i should hire not how' or 'why should we hire you', NEVER give a generic contact card! Deliver this complete executive pitch!\n\n");
        sb.append("2. CORE TECHNICAL STRENGTHS & SUPERPOWERS:\n");
        sb.append("   - Distributed systems & asynchronous message queues (RabbitMQ, MinIO S3).\n");
        sb.append("   - Deterministic AI & LLM orchestration (Structured RAG, Spring AI, Groq Llama 3.3 70B, Ollama Llama 3.2, zero hallucinations).\n");
        sb.append("   - Relational database consistency & query optimization (PostgreSQL ACID ledgers, SQL Server 35% query index speedup, MongoDB).\n");
        sb.append("   - Enterprise auth & security (Keycloak OAuth2/OIDC SSO, Argon2id sub-5ms hashing, RS256 JWT, session RAM validation).\n");
        sb.append("   - High-velocity full-stack delivery (React 19, Tailwind CSS 4, Spring Boot).\n\n");
        sb.append("3. WEAKNESSES & CONSTRUCTIVE AREAS OF GROWTH:\n");
        sb.append("   - Growth from backend focus into modern UI: Early on, Siddharth focused heavily on low-latency backend systems and databases; he proactively bridged this by mastering modern React 19, Tailwind CSS v4, and canvas shaders.\n");
        sb.append("   - Scaling containerization into Kubernetes operators: While highly proficient in Docker and Docker Compose meshes, he is actively expanding his expertise into advanced Kubernetes operator patterns and cloud-native Helm deployments.\n");
        sb.append("   - Balancing architectural perfectionism with rapid shipping: Strives for zero hallucinations and strict ACID guarantees; balances this with agile pragmatism to ship rapid increments.\n\n");
        sb.append("4. HANDLING PRESSURE, CRISIS & HARDEST CHALLENGES:\n");
        sb.append("   - GitHub API Rate-Limiting Crisis at Angel Bot AI: Solved 429 exhaustion under high team commit volumes by implementing a 5-minute cooldown delta sync in MongoDB, reducing external calls by 85%.\n");
        sb.append("   - RAG Latency & Hallucination Elimination: Replaced slow open-ended prompts with structured RAG (Spring AI + Groq Llama 3.3 70B), cutting latency to <1.2s and eliminating hallucinations (0%).\n");
        sb.append("   - Concurrent Room Billing Race Conditions in OmniStay ERP: Prevented double charges during simultaneous guest checkouts and automated night audits via PostgreSQL row-level pessimistic locking.\n\n");
        sb.append("5. TARGET ROLES, AVAILABILITY & RELOCATION:\n");
        sb.append("   - Target Roles: Software Engineer (SDE), Backend Engineer, Java / Spring Boot Developer, Applied AI / ML Engineer, Full Stack Engineer.\n");
        sb.append("   - Notice Period / Availability: Immediate Joiner (0 days notice). No non-compete constraints.\n");
        sb.append("   - Relocation: 100% open to on-site relocation (Pune, Bengaluru, Delhi NCR, Hyderabad, Mumbai, Chennai) as well as hybrid or remote roles.\n");
        sb.append("   - Academic timeline: Pursuing BCA (2024-2027) at Christ University, Lavasa, Pune with schedule flexibility for full-time engineering roles.\n\n");
        sb.append("6. SYSTEM DESIGN & SCALABILITY PHILOSOPHY:\n");
        sb.append("   - Asynchronous decoupling using RabbitMQ message brokers.\n");
        sb.append("   - Deterministic AI grounding with pre-aggregated DB context and JSON schema contracts.\n");
        sb.append("   - Strict relational ACID boundaries for financial and transactional states.\n");
        sb.append("   - Defense-in-depth zero-trust auth (OAuth2/OIDC, Argon2id, RS256, session RAM guards).\n");
        sb.append("   - Containerized environment parity with multi-stage Docker builds.\n\n");
        sb.append("7. CULTURE FIT, LEADERSHIP & WORK ETHIC:\n");
        sb.append("   - High ownership and initiative from database schema design to production commit.\n");
        sb.append("   - Clear technical communication with OpenAPI documentation and clean Git history.\n");
        sb.append("   - Agile velocity and continuous learning.\n\n");

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

        // 1. Recruiter Evaluation: Why Hire Siddharth / Differentiation / Pitch
        if ((lower.contains("why") && (lower.contains("hire") || lower.contains("choose") || lower.contains("pick") 
                || lower.contains("select") || lower.contains("consider") || lower.contains("bring"))) 
                || lower.contains("why hire") || lower.contains("hire not how") || lower.contains("why should i hire") 
                || lower.contains("why should we hire") || lower.contains("pitch") || lower.contains("value proposition") 
                || lower.contains("stand out") || lower.contains("differentiate") || lower.contains("reasons to hire") 
                || lower.contains("why him") || lower.contains("why you") || lower.contains("what sets you apart") 
                || lower.contains("what sets him apart") || lower.contains("hire siddharth") || lower.contains("candidate fit") 
                || lower.contains("selling point")) {
            reply.append("### 🎯 Why You Should Hire Siddharth Shakyawal\n\n");
            reply.append("Siddharth is a high-velocity **Software Engineer specializing in Backend Systems, Event-Driven Microservices, and Applied AI**. Here is the evidence-backed value proposition he brings to your engineering team:\n\n");
            reply.append("- **Proven Production Impact with Tangible Metrics:**\n");
            reply.append("  During his engineering internship at **Angel Bot AI**, Siddharth built the core intelligence engine for *Git in Bits (DevPulse AI)*:\n");
            reply.append("  - Engineered a **Structured RAG pipeline** (Spring AI + Groq Llama 3.3 70B) reducing hallucination rate to **0%** and inference latency to **<1.2s**.\n");
            reply.append("  - Built an intelligent delta sync layer with 5-minute cooldown guards, slashing external GitHub API requests by **85%**.\n");
            reply.append("  - Monitored real-time analytics for **+2.7M lines of code churn** and tracked average PR turnaround across 15.1 hours.\n\n");
            reply.append("- **Distributed Systems Architecture vs. Toy Code:**\n");
            reply.append("  Siddharth builds production-grade software designed for scale and concurrency:\n");
            reply.append("  - **[simplyAudio](https://github.com/musxsid/simplyAudio):** Asynchronous event-driven audio streaming platform using **RabbitMQ** message queues, **Keycloak OAuth2/OIDC SSO**, and **MinIO S3** distributed chunk storage.\n");
            reply.append("  - **[OmniStay ERP](https://github.com/musxsid/omnistay-erp):** Enterprise hotel management engine with strict **PostgreSQL ACID folio ledgers**, automated <500ms night audit roll-forwards, and zero transactional drift.\n");
            reply.append("  - **[Go Auth Microservice](https://github.com/musxsid/go-auth-postgres):** Cloud-native auth microservice in Go featuring **Argon2id hashing** and pgx connection pooling delivering **sub-5ms request latencies**.\n\n");
            reply.append("- **Full-Stack Execution Speed:**\n");
            reply.append("  Not limited to backends—he pairs robust Java (Spring Boot 3/4) and Go services with modern, reactive **React 19**, **Tailwind CSS v4**, and containerized Docker environments.\n\n");
            reply.append("- **Immediate Impact & 100% Relocation Mobility:**\n");
            reply.append("  - **Availability:** Ready for immediate onboarding with zero notice period delays.\n");
            reply.append("  - **Relocation:** Actively open to on-site relocation across major tech hubs (**Pune, Bengaluru, Delhi NCR, Hyderabad, Mumbai**) as well as remote/hybrid teams.\n\n");
            reply.append("📄 [Download Siddharth's Resume (PDF)](/api/public/resume/file) | 💼 [Connect on LinkedIn](https://linkedin.com/in/siddharth-shakyawal-925889356)\n\n");
            reply.append("📌 **Source:** Official Resume & Verified Production Engineering Records");
        }
        // 2. Recruiter Evaluation: Core Technical Strengths & Superpowers
        else if (lower.contains("strength") || lower.contains("superpower") || lower.contains("what is he best at") 
                || lower.contains("what are you best at") || lower.contains("strong suit") || lower.contains("core competence") 
                || lower.contains("technical strengths") || lower.contains("top skill")) {
            reply.append("### ⚡ Core Strengths & Engineering Superpowers\n\n");
            reply.append("Siddharth's technical expertise spans distributed backend engineering, deterministic AI orchestration, and high-concurrency systems:\n\n");
            reply.append("- **1. Event-Driven & Distributed Microservices:**\n");
            reply.append("  Deep practical experience decoupling high-throughput services using **RabbitMQ message queues**, asynchronous event workers, and containerized Docker networks (demonstrated in [simplyAudio](https://github.com/musxsid/simplyAudio)).\n\n");
            reply.append("- **2. Deterministic AI & Zero-Hallucination RAG:**\n");
            reply.append("  Expertise in building reliable production LLM systems. Implemented structured RAG architectures using **Spring AI**, **Groq (Llama 3.3 70B)**, and **Ollama (Llama 3.2)** with deterministic JSON schema validation, pre-aggregated database context, and <1.2s inference speeds.\n\n");
            reply.append("- **3. Database Integrity & High-Throughput Storage:**\n");
            reply.append("  Advanced proficiency in relational ACID modeling (PostgreSQL, SQL Server) with transaction isolation, indexing strategies (35% query speedup in JobHive), and multi-tenant billing ledgers (OmniStay ERP), alongside NoSQL caching with MongoDB and Redis.\n\n");
            reply.append("- **4. Enterprise Security & Auth Protocols:**\n");
            reply.append("  Implementation of battle-tested authentication architectures: Keycloak OAuth2/OIDC SSO, RS256 asymmetric JWT signing with key rotation, sub-5ms Argon2id hashing in Go, and server-side RAM session validation to prevent IDOR exploits.\n\n");
            reply.append("- **5. High-Velocity End-to-End Ownership:**\n");
            reply.append("  Autonomous engineering execution—from relational schema design and API contracts to modular React 19 UI integration and Docker Compose deployment.\n\n");
            reply.append("📄 [Download Siddharth's Resume (PDF)](/api/public/resume/file)\n\n");
            reply.append("📌 **Source:** Official Resume / Technical Competency Audit");
        }
        // 3. Recruiter Evaluation: Weaknesses, Shortcomings & Areas of Growth
        else if (lower.contains("weakness") || lower.contains("areas of improvement") || lower.contains("area of improvement") 
                || lower.contains("where does he struggle") || lower.contains("what can he improve") || lower.contains("flaw") 
                || lower.contains("shortcoming") || lower.contains("limitations") || lower.contains("constructive criticism") 
                || lower.contains("development areas")) {
            reply.append("### 🔍 Areas of Growth & Constructive Self-Awareness\n\n");
            reply.append("Siddharth maintains a growth-oriented, transparent approach to professional development:\n\n");
            reply.append("- **1. Frontend Evolution (Successfully Bridged):**\n");
            reply.append("  - *Context:* Early in his engineering journey, Siddharth focused intensely on low-level backend mechanics, ACID database consistency, and message brokers, treating frontend as secondary.\n");
            reply.append("  - *Growth Action:* Recognizing that elite software requires cohesive user experiences, he dedicated time to mastering modern frontend design—engineering this portfolio with **React 19**, **Tailwind CSS v4**, fluid canvas shaders, and Framer Motion to become a true high-velocity full-stack developer.\n\n");
            reply.append("- **2. Cloud Orchestration at Hyperscale (Active Focus):**\n");
            reply.append("  - *Context:* While highly skilled in Docker and multi-service **Docker Compose** architectures (used across all his microservices), his production experience with large-scale Kubernetes clusters and Helm charts is still actively expanding.\n");
            reply.append("  - *Growth Action:* He is currently building out Kubernetes operator patterns, ingress controllers, and cloud-native CI/CD pipelines to match his deep containerization proficiency.\n\n");
            reply.append("- **3. High Architectural Perfectionism:**\n");
            reply.append("  - *Context:* Siddharth naturally leans toward rigorous architectural purity—striving for 0% hallucinations in AI, sub-5ms auth latencies, and strict database isolation.\n");
            reply.append("  - *Growth Action:* He has actively embraced agile pragmatism: prioritizing rapid iterative delivery, MVP validation, and user feedback cycles without compromising foundational security or reliability.\n\n");
            reply.append("📌 **Source:** Professional Self-Assessment & Engineering Trajectory");
        }
        // 4. Recruiter Evaluation: Handling Pressure, Deadlines, Crisis & Hardest Challenge
        else if (lower.contains("pressure") || lower.contains("stress") || lower.contains("deadline") 
                || lower.contains("crisis") || lower.contains("difficult bug") || lower.contains("hardest challenge") 
                || lower.contains("challenge") || lower.contains("toughest") || lower.contains("obstacle") 
                || lower.contains("toughest problem") || lower.contains("problem solving") || lower.contains("how does he handle") 
                || lower.contains("under pressure") || lower.contains("critical issue")) {
            reply.append("### 🛡️ Handling Pressure, Critical Bugs & Complex Problem Solving\n\n");
            reply.append("Siddharth approaches high-pressure situations with methodical root-cause isolation and data-backed engineering. Key examples from production:\n\n");
            reply.append("- **1. Resolving GitHub Rate Limiting Crisis at Angel Bot AI:**\n");
            reply.append("  - *The Crisis:* High-frequency multi-repository syncs caused sudden HTTP 429 rate-limit exhaustion against the GitHub API, threatening to halt live engineering dashboards.\n");
            reply.append("  - *The Solution:* Siddharth immediately designed and deployed a rate-limited **delta synchronization layer** backed by MongoDB pre-aggregation with 5-minute cooldown guards.\n");
            reply.append("  - *The Outcome:* Reduced external API calls by **85%**, achieved zero-token reads on subsequent reloads, and maintained 100% dashboard uptime.\n\n");
            reply.append("- **2. Slashing LLM Hallucinations & High Latency (<1.2s Target):**\n");
            reply.append("  - *The Challenge:* Open-ended LLM prompts suffered from high inference latency (>4s) and occasional hallucinations when generating engineering summaries.\n");
            reply.append("  - *The Solution:* Re-architected the ingestion pipeline into a **Structured RAG architecture** (Spring AI + Groq Llama 3.3 70B). Metrics were computed deterministically at the database layer before prompt injection, bound by strict JSON schema contracts.\n");
            reply.append("  - *The Outcome:* Eliminated hallucinations entirely (**0%**) while bringing median response time down to **<1.2 seconds**.\n\n");
            reply.append("- **3. Multi-Terminal Concurrency & Ledger Integrity in OmniStay ERP:**\n");
            reply.append("  - *The Challenge:* Preventing race conditions and double charges during concurrent guest checkout operations and automated night audit batch processing.\n");
            reply.append("  - *The Solution:* Implemented PostgreSQL row-level pessimistic locking and atomic transaction boundaries across folio records.\n");
            reply.append("  - *The Outcome:* Guaranteed 100% financial ledger consistency and reconciliation with batch audit runtimes under 500ms.\n\n");
            reply.append("📌 **Source:** Production Experience Records (Angel Bot AI & OmniStay ERP)");
        }
        // 5. Recruiter Evaluation: Target Roles, Availability, Notice Period & Relocation
        else if (lower.contains("target role") || lower.contains("what role") || lower.contains("roles looking for") 
                || lower.contains("notice period") || lower.contains("when can he start") || lower.contains("when can you start") 
                || lower.contains("start date") || lower.contains("joining date") || lower.contains("availability") 
                || lower.contains("available to start") || lower.contains("immediate joiner") 
                || (lower.contains("open to") && (lower.contains("remote") || lower.contains("relocat"))) 
                || lower.contains("work mode")) {
            reply.append("### 💼 Target Roles, Availability & Relocation\n\n");
            reply.append("Here is Siddharth's current professional availability and role preferences:\n\n");
            reply.append("- **🎯 Target Engineering Roles:**\n");
            reply.append("  - **Backend Engineer / SDE I (Backend)** (Java / Spring Boot, Go, Python)\n");
            reply.append("  - **Software Development Engineer (Full Stack)** (Java / Spring Boot + React 19)\n");
            reply.append("  - **Applied AI / AI Systems Engineer** (Structured RAG, LLM Orchestration, Spring AI)\n");
            reply.append("  - **Distributed Systems / Microservices Engineer**\n\n");
            reply.append("- **⏱️ Availability & Notice Period:**\n");
            reply.append("  - **Notice Period:** **Immediate Joiner** (0 days). No notice period or non-compete constraints.\n");
            reply.append("  - **Earliest Start Date:** Immediate / Flexible based on hiring pipeline.\n\n");
            reply.append("- **📍 Location & Relocation:**\n");
            reply.append("  - **Current Locations:** Kota, Rajasthan (324010) & Lavasa, Pune (Christ University BCA 2024–2027).\n");
            reply.append("  - **On-Site Relocation:** **100% Open to Relocate** immediately to key tech hubs across India, including:\n");
            reply.append("    - **Pune, Maharashtra**\n");
            reply.append("    - **Bengaluru, Karnataka**\n");
            reply.append("    - **Delhi NCR / Gurugram / Noida**\n");
            reply.append("    - **Hyderabad, Telangana**\n");
            reply.append("    - **Mumbai, Maharashtra**\n");
            reply.append("  - **Work Modes:** Open to **On-site**, **Hybrid**, or **Remote** software engineering roles globally.\n\n");
            reply.append("📫 [Contact Siddharth Directly](mailto:siddharthshakya2004@gmail.com) | 📄 [Download Resume (PDF)](/api/public/resume/file)\n\n");
            reply.append("📌 **Source:** Official Resume / Candidate Availability Status");
        }
        // 6. Recruiter Evaluation: System Design & Scalability Philosophy
        else if (lower.contains("system design") || lower.contains("architecture philosophy") || lower.contains("scalability") 
                || lower.contains("how does he design") || lower.contains("how do you design") || lower.contains("design philosophy") 
                || lower.contains("distributed systems philosophy")) {
            reply.append("### 🏛️ System Design & Architectural Principles\n\n");
            reply.append("Siddharth designs backend and AI systems around five core engineering tenets:\n\n");
            reply.append("- **1. Asynchronous Decoupling via Message Brokers:**\n");
            reply.append("  Heavy compute tasks (audio encoding, batch analytics, vector indexing) must never block user-facing HTTP request-response cycles. Siddharth utilizes **RabbitMQ message queues** with dead-letter exchanges and worker pools (as seen in [simplyAudio](https://github.com/musxsid/simplyAudio)).\n\n");
            reply.append("- **2. Deterministic AI Grounding (Zero Raw Prompts):**\n");
            reply.append("  Never feed raw, unfiltered natural language into an LLM. Siddharth computes metrics and extracts data at the database layer first, strictly binding outputs with deterministic JSON schemas (Spring AI + Groq Llama 3.3) to prevent hallucinations and reduce token costs.\n\n");
            reply.append("- **3. Strict Relational ACID Boundaries:**\n");
            reply.append("  Financial, billing, and transactional data must remain immutable and consistent. Siddharth designs normalized schemas with explicit foreign keys, indexed query plans, and transaction isolation (as seen in [OmniStay ERP](https://github.com/musxsid/omnistay-erp)).\n\n");
            reply.append("- **4. Defense-in-Depth Security:**\n");
            reply.append("  Authentication and authorization are verified at every layer: stateless RS256 JWT tokens, Keycloak SSO, sub-5ms Argon2id hashing in Go, and in-memory server session guards against IDOR exploits.\n\n");
            reply.append("- **5. Containerized Environment Parity:**\n");
            reply.append("  Ensures zero 'works on my machine' issues by defining reproducible multi-stage Docker builds and Docker Compose meshes for all services, databases, and message brokers.\n\n");
            reply.append("📌 **Source:** Engineering Architecture Guidelines & GitHub Repositories");
        }
        // 7. Recruiter Evaluation: Culture Fit, Team Collaboration & Work Ethic
        else if (lower.contains("culture") || lower.contains("team player") || lower.contains("collaboration") 
                || lower.contains("teamwork") || lower.contains("work ethic") || lower.contains("communication") 
                || lower.contains("soft skill") || lower.contains("how is he to work with") || lower.contains("cultural fit")) {
            reply.append("### 🤝 Culture Fit, Collaboration & Work Ethic\n\n");
            reply.append("Siddharth brings a strong engineering mindset, high autonomy, and collaborative ethos to technical teams:\n\n");
            reply.append("- **1. High Ownership & Initiative:**\n");
            reply.append("  Takes complete ownership of features from inception to deployment. Does not wait for micro-management—analyzes business requirements, drafts schema models, builds RESTful endpoints, and verifies end-to-end integration.\n\n");
            reply.append("- **2. Clear Technical Communication:**\n");
            reply.append("  Experienced in cross-functional collaboration during his internships at **Angel Bot AI** and **CodeArrest Softwares**. Documents clean API contracts, produces readable Git commit histories, and clearly communicates architectural trade-offs.\n\n");
            reply.append("- **3. Agile Mindset & Rapid Iteration:**\n");
            reply.append("  Comfortable working in fast-paced sprint cycles. Values quick feedback loops, automated CI/CD checks, and pragmatic engineering that delivers customer value.\n\n");
            reply.append("- **4. Relentless Curiosity & Continuous Learning:**\n");
            reply.append("  Self-driven learner who proactively tracks modern industry standards—mastering Spring AI, React 19, Go microservices, and modern Docker architectures ahead of the curve.\n\n");
            reply.append("📄 [Download Siddharth's Resume (PDF)](/api/public/resume/file) | 💼 [Connect on LinkedIn](https://linkedin.com/in/siddharth-shakyawal-925889356)\n\n");
            reply.append("📌 **Source:** Peer & Supervisor Collaboration History (Official Resume)");
        }
        // 8. Contact & Scheduling (Strictly explicit contact / schedule requests)
        else if (lower.contains("how to contact") || lower.contains("how can i contact") || lower.contains("how do i contact") 
                || lower.contains("how to reach") || lower.contains("how can i reach") || lower.contains("how to hire") 
                || lower.contains("schedule an interview") || lower.contains("schedule a call") || lower.contains("book a call") 
                || lower.contains("email address") || lower.contains("phone number") || lower.contains("contact info") 
                || lower.contains("contact details") || lower.contains("whatsapp") || lower.contains("send an email") 
                || lower.contains("reach out") || (lower.contains("contact") && !lower.contains("why")) 
                || lower.contains("get in touch") || lower.contains("connect with")) {
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
        // 9. Location & Residence queries
        else if (lower.contains("live") || lower.contains("living") || lower.contains("location") 
                || lower.contains("where is") || lower.contains("where does") || (lower.contains("stay") && !lower.contains("omnistay")) 
                || lower.contains("city") || lower.contains("state") || lower.contains("based in") 
                || lower.contains("reside") || lower.contains("where are you")) {
            reply.append("### 📍 Location & Relocation Availability\n\n");
            reply.append("Siddharth Shakyawal is primarily based in **Kota, Rajasthan (324010), India**, and is currently pursuing his degree in **Lavasa, Pune (Maharashtra)** at Christ University.\n\n");
            reply.append("- **Current / Home Location:** Kota, Rajasthan (324010)\n");
            reply.append("- **Academic Location:** Christ University, Lavasa, Pune\n");
            reply.append("- **Work & Relocation Preference:** Actively open to **on-site relocation** (Pune, Bengaluru, Delhi NCR, Hyderabad, Mumbai, etc.) as well as hybrid and remote software engineering opportunities worldwide.\n\n");
            reply.append("📫 **Direct Contact:** [siddharthshakya2004@gmail.com](mailto:siddharthshakya2004@gmail.com) | **Phone:** +91 9256265129\n\n");
            reply.append("📌 **Source:** Official Resume & Biographical Records");
        }
        // 10. Education & Degree
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
        // 11. Work Experience & Internships
        else if (lower.contains("experience") || lower.contains("intern") || lower.contains("company") 
                || lower.contains("companies") || lower.contains("worked") || lower.contains("work history") 
                || lower.contains("job") || lower.contains("career") || lower.contains("past roles") 
                || lower.contains("angel bot") || lower.contains("codearrest") || lower.contains("previous work")) {
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
