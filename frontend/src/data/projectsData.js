const projectsData = [
  {
    id: 1,
    title: "SimplyNotes",
    tagline: "Secure Full-Stack Note Management",
    description:
      "A production-grade note-taking platform featuring role-based access control, JWT authentication, and a polished React frontend backed by a robust Spring Boot API layer with PostgreSQL persistence.",
    techStack: ["React", "Spring Boot", "PostgreSQL", "JWT", "REST API"],
    highlights: [
      "Role-based access control with JWT authentication",
      "RESTful CRUD operations with Spring Data JPA",
      "Responsive React UI with real-time state management",
    ],
    accentColor: "blue",
    size: "large",
  },
  {
    id: 2,
    title: "AI Feedback Analyzer",
    tagline: "Algorithmic Sentiment Analysis Engine",
    description:
      "An intelligent feedback processing system that performs real-time sentiment analysis on user-submitted text using custom algorithmic approaches, exposed via a clean REST API architecture.",
    techStack: ["Java", "Spring Boot", "REST API", "Algorithm Design"],
    highlights: [
      "Custom sentiment analysis algorithm implementation",
      "RESTful API with structured JSON responses",
      "Scalable architecture for high-throughput analysis",
    ],
    accentColor: "purple",
    size: "medium",
  },
];

export default projectsData;
