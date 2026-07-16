const projectsData = [
  {
    id: 1,
    title: "SimplyNotes",
    tagline: "Secure Full-Stack Note Management",
    description:
      "A production-grade note-taking platform featuring role-based access control, JWT authentication, and a polished React frontend backed by a robust Spring Boot API layer with PostgreSQL persistence.",
    highlights: [
      "Role-based access control with JWT authentication",
      "RESTful CRUD operations with Spring Data JPA",
      "Responsive React UI with real-time state management",
    ],
    techStack: ["React", "Spring Boot", "PostgreSQL", "JWT", "REST API"],
    size: "large",
    accentColor: "blue",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "AI Feedback Analyzer",
    tagline: "Algorithmic Sentiment Analysis Engine",
    description:
      "An AI-powered web application that analyzes supervisor feedback transcripts using a local LLM (Ollama). It generates structured insights including evidence extraction, rubric scoring, KPI mapping, and gap analysis.",
    highlights: [
      "Local LLM integration via Ollama for privacy-focused processing",
      "Structured data extraction (KPI mapping, rubric scoring, gap analysis)",
      "High-performance JavaScript architecture",
    ],
    techStack: ["JavaScript", "Ollama", "LLM", "REST API", "AI Agents"],
    size: "large",
    accentColor: "purple",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "SuperUtility",
    tagline: "Kotlin Android Utility toolkit",
    description:
      "A robust Android utility application written entirely in Kotlin. Engineered for high performance with clean architecture, delivering essential tools in a highly polished and deeply native mobile experience.",
    highlights: [
      "100% Kotlin codebase leveraging Coroutines and Flow",
      "Clean architecture with separation of concerns",
      "Native Android performance optimizations",
    ],
    techStack: ["Kotlin", "Android SDK", "Coroutines", "Mobile"],
    size: "large",
    accentColor: "emerald",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Spring Boot Basics",
    tagline: "Enterprise Backend Architecture",
    description:
      "A comprehensive implementation of core Spring Boot features, demonstrating mastery over dependency injection, JPA/Hibernate integration, and RESTful API design patterns for enterprise applications.",
    highlights: [
      "Dependency Injection and Inversion of Control patterns",
      "Database migrations and ORM mapping with Hibernate",
      "Robust exception handling and API response mapping",
    ],
    techStack: ["Java", "Spring Boot", "Hibernate", "JPA"],
    size: "large",
    accentColor: "rose",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
  },
];

export default projectsData;
