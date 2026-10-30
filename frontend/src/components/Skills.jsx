import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Server, 
  Brain, 
  Layout, 
  Database, 
  ShieldCheck, 
  ExternalLink
} from "lucide-react";

// ============================================================================
// AUTHENTIC ENGINEERING ARSENAL DATA (100% Grounded in Siddharth's Resume)
// ============================================================================
const ARSENAL_CATEGORIES = [
  {
    id: "backend",
    num: "01",
    indexLabel: "01 // 04",
    title: "Backend Architecture",
    domain: "Distributed Systems & APIs",
    statusBadge: "Grounded in Resume",
    tagline: "High-concurrency event-driven microservices, asynchronous message brokers, and ACID-compliant relational folio ledgers.",
    icon: Server,
    roman: "I",
    angle: 0,
    accent: "#ff7a45",
    languages: ["Java (17/21)", "Python", "Go", "C#", "Kotlin", "C++", "SQL"],
    frameworks: [
      "Spring Boot 3/4",
      "FastAPI",
      ".NET Core (MVC)",
      "RabbitMQ",
      "Keycloak SSO",
      "JPA / Hibernate",
      "Entity Framework Core",
      "REST APIs"
    ],
    systems: [
      "Event-Driven Microservices",
      "ACID Folio Ledgers",
      "Argon2id & RS256 Auth",
      "Multi-Tenant Session Isolation"
    ],
    highlights: [
      {
        project: "simplyAudio",
        url: "https://github.com/musxsid/simplyAudio",
        tags: ["RabbitMQ", "Keycloak SSO", "MinIO S3"],
        text: "Asynchronous RabbitMQ message queues decoupling audio ingestion from real-time analytics with MinIO S3 object storage."
      },
      {
        project: "OmniStay ERP",
        url: "https://github.com/musxsid/omnistay-erp",
        tags: ["PostgreSQL ACID", "Spring Boot", "React 19"],
        text: "ACID PostgreSQL folio ledger ensuring 100% audit reconciliation across room charges; automated night audit roll-forwards in <500ms."
      },
      {
        project: "Triage",
        url: "https://github.com/musxsid/Triage",
        tags: ["Spring Security", "JWT", "MySQL"],
        text: "Stateless auth service with Spring Security & JWT achieving <50ms session validation with UUID share links."
      }
    ],
    stats: [
      { label: "API Execution Latency", value: "<50ms APIs" },
      { label: "Polyglot Runtimes", value: "7 Languages" },
      { label: "Ledger Guarantee", value: "100% ACID" },
      { label: "Security Standard", value: "OAuth2 / RS256" }
    ]
  },
  {
    id: "ai",
    num: "02",
    indexLabel: "02 // 04",
    title: "Applied AI & Structured RAG",
    domain: "LLM Orchestration & Telemetry",
    statusBadge: "Grounded in Resume",
    tagline: "Deterministic local inference, hallucination-free RAG pipelines, and automated repository health telemetry.",
    icon: Brain,
    roman: "II",
    angle: 90,
    accent: "#f59e0b",
    languages: ["Python", "Java 21", "TypeScript", "Prompt Engineering", "SQL"],
    frameworks: [
      "Spring AI",
      "Groq AI Acceleration",
      "Ollama",
      "Vector Embeddings",
      "Semantic Search",
      "FastAPI"
    ],
    systems: [
      "Structured RAG Pipelines",
      "Llama 3.3 (70B)",
      "Llama 3.2 via Ollama",
      "Deterministic JSON Extraction",
      "Telemetry Health Scoring"
    ],
    highlights: [
      {
        project: "Git in Bits (Angel Bot AI)",
        url: "https://github.com/musxsid/GIBs-Git_In_Bits-main",
        tags: ["Spring AI", "Groq Llama 3.3", "MongoDB"],
        text: "Structured RAG pipeline with Spring AI and Groq pre-aggregating MongoDB telemetry, cutting inference latency to <1.2s with 0% hallucinations."
      },
      {
        project: "Supervisor Feedback Analyzer",
        url: "https://github.com/musxsid/supervisor-feedback-analyzer",
        tags: ["Ollama", "Llama 3.2", "FastAPI"],
        text: "Deterministic workplace analytics parsing unstructured reviews via local Llama 3.2 on Ollama with strict JSON schema enforcement."
      },
      {
        project: "DocuVault",
        url: "https://github.com/musxsid/DocuVault",
        tags: ["Vector Embeddings", "Semantic Search", "FastAPI"],
        text: "Cryptographically secured document indexing and semantic embeddings with Python & FastAPI for large corporate corpora."
      }
    ],
    stats: [
      { label: "RAG Inference Latency", value: "<1.2s RAG" },
      { label: "Engine Model Scale", value: "70B Params" },
      { label: "Hallucination Rate", value: "0% Verified" },
      { label: "API Call Reduction", value: "85% Delta Guard" }
    ]
  },
  {
    id: "frontend",
    num: "03",
    indexLabel: "03 // 04",
    title: "Frontend Engineering & UI",
    domain: "Reactive Interfaces & Physics",
    statusBadge: "Grounded in Resume",
    tagline: "High-performance reactive web architecture, hardware-accelerated shaders, and responsive kinetic design systems.",
    icon: Layout,
    roman: "III",
    angle: 180,
    accent: "#ff7a45",
    languages: ["TypeScript", "JavaScript (ESNext)", "HTML5", "CSS3 / SCSS"],
    frameworks: [
      "React 19",
      "Next.js",
      "Tailwind CSS 4",
      "Framer Motion",
      "Vite 8",
      "TanStack Query"
    ],
    systems: [
      "Hardware Canvas Shaders",
      "Interactive Kinetic Grids",
      "Liquid Glassmorphism",
      "High-DPI Retina UI"
    ],
    highlights: [
      {
        project: "Sid Portfolio",
        url: "https://github.com/musxsid/Sid_Portfolio",
        tags: ["React 19", "Tailwind CSS 4", "Framer Motion"],
        text: "Dynamic GitHub ingestion, interactive contribution calendar, and hardware-accelerated kinetic spotlight canvas."
      },
      {
        project: "OmniStay ERP Guest Portal",
        url: "https://github.com/musxsid/omnistay-erp",
        tags: ["React 19", "Tailwind CSS", "REST APIs"],
        text: "Dual guest/staff responsive portal with real-time room tracking and automated night audit dashboards."
      },
      {
        project: "Triage UI",
        url: "https://github.com/musxsid/Triage",
        tags: ["Framer Motion", "Tailwind CSS", "Glassmorphism"],
        text: "Responsive Glassmorphism UI with real-time task board previews, drag-and-drop triage, and dark mode support."
      }
    ],
    stats: [
      { label: "Render Frame Rate", value: "60–120 FPS" },
      { label: "Core UI Engine", value: "React 19" },
      { label: "Zero-Runtime CSS", value: "Tailwind v4" },
      { label: "Interaction Response", value: "<50ms Damped" }
    ]
  },
  {
    id: "cloud",
    num: "04",
    indexLabel: "04 // 04",
    title: "Cloud, Databases & DevOps",
    domain: "Storage & Infrastructure",
    statusBadge: "Grounded in Resume",
    tagline: "Resilient container meshes, relational & document stores, and automated delta synchronization pipelines.",
    icon: Database,
    roman: "IV",
    angle: 270,
    accent: "#fbbf24",
    languages: ["SQL", "Shell / Bash", "Docker Compose Config", "YAML"],
    frameworks: [
      "Docker",
      "Docker Compose",
      "Git & GitHub",
      "Postman",
      "Maven",
      "MinIO (S3-Compatible)"
    ],
    systems: [
      "PostgreSQL (ACID)",
      "MongoDB (Document)",
      "MySQL",
      "SQL Server",
      "Redis (In-Memory)",
      "Rate-Limited Delta Sync"
    ],
    highlights: [
      {
        project: "simplyAudio Mesh",
        url: "https://github.com/musxsid/simplyAudio",
        tags: ["MinIO S3", "Redis Cache", "Keycloak SSO"],
        text: "S3-compatible audio chunking partitioned across MinIO with sub-10ms Redis caching and Keycloak SSO."
      },
      {
        project: "Angel Bot AI Delta Sync",
        url: "https://github.com/musxsid/GIBs-Git_In_Bits-main",
        tags: ["Delta Sync", "Rate Limiting", "OAuth2"],
        text: "5-minute cooldown guards reducing external GitHub API calls by 85% with zero-token reads on reloads."
      },
      {
        project: "JobHive DB",
        url: "https://github.com/musxsid/JobHive",
        tags: ["SQL Server", ".NET Core MVC", "EF Core"],
        text: "Indexed relational schema with Entity Framework Core and SQL Server optimizing vacancy queries by 35%."
      }
    ],
    stats: [
      { label: "Transactional Integrity", value: "100% ACID" },
      { label: "Object Storage Mesh", value: "MinIO S3" },
      { label: "Rate-Limited Sync", value: "5-min Delta" },
      { label: "Cache Retrieval Speed", value: "Sub-10ms Redis" }
    ]
  }
];

// Sequential letter animation for the section headline
function AnimatedSkillLetter({ char, i, total, scrollYProgress, activeColor }) {
  const start = (i / total) * 0.1;
  const end = start + 0.05;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], ["18px", "0px"]);

  return (
    <motion.span
      style={{
        opacity,
        y,
        color: char === "." ? activeColor : "#ffffff",
      }}
      className="inline-block transition-colors duration-300"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

function SequentialHeading({ text, scrollYProgress, activeColor }) {
  const letters = Array.from(text);

  return (
    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white flex items-center justify-center">
      {letters.map((char, i) => (
        <AnimatedSkillLetter
          key={i}
          char={char}
          i={i}
          total={letters.length}
          scrollYProgress={scrollYProgress}
          activeColor={activeColor}
        />
      ))}
    </h2>
  );
}

// Station node capsule on the mechanical rotor (Upright engineering icons, no cramped text)
function ChronometerStationNode({ cat, idx, activeIndex, dialRotation, onSelectCategory, radius }) {
  const isDocked = idx === activeIndex;
  const Icon = cat.icon;
  const counterRotation = useTransform(dialRotation, (r) => -r);

  // Exact polar coordinates for node placement
  const rad = (cat.angle * Math.PI) / 180;
  const x = Math.round(radius * Math.cos(rad));
  const y = Math.round(radius * Math.sin(rad));

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <button
        onClick={() => onSelectCategory(idx)}
        className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
          isDocked
            ? "bg-gradient-to-tr from-accent-warm via-[#ff8c5a] to-amber-500 text-white shadow-[0_0_30px_rgba(255,122,69,0.85)] scale-110 border-2 border-white/90"
            : "bg-[#090c18]/90 text-gray-400 border border-white/15 hover:border-accent-warm/50 hover:text-white"
        }`}
        title={`Navigate to ${cat.title}`}
        aria-label={`Navigate to ${cat.title}`}
      >
        <motion.div style={{ rotate: counterRotation }}>
          <Icon className="w-6 h-6 sm:w-6.5 sm:h-6.5" />
        </motion.div>

        {isDocked && (
          <span className="absolute -inset-1 rounded-2xl border-2 border-accent-warm animate-ping pointer-events-none opacity-25" />
        )}
      </button>
    </div>
  );
}

// ============================================================================
// SLEEK MINIMALIST KINETIC CHRONOMETER WHEEL (Precision Engineering Instrument)
// ============================================================================
function KineticChronometerWheel({
  dialRotation,
  activeIndex,
  activeColor,
  activeShadow,
  onSelectCategory,
}) {
  const radius = 150;

  return (
    <div className="relative w-[340px] h-[340px] sm:w-[390px] sm:h-[390px] lg:w-[410px] lg:h-[410px] flex items-center justify-center select-none">
      
      {/* 1. Stationary Outer Housing */}
      <div className="absolute inset-0 rounded-full border border-white/10 bg-[#070914]/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,122,69,0.06)_0%,transparent_70%)] pointer-events-none" />
        {/* Clean Concentric Outer Hairline Rings */}
        <div className="absolute inset-2 rounded-full border border-white/5" />
        <div className="absolute inset-8 rounded-full border border-dashed border-white/5" />
      </div>

      {/* 2. Kinetic Rotating Rotor with Orbital Track & 4 Station Capsules */}
      <motion.div
        style={{ rotate: dialRotation }}
        className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none"
      >
        {/* Dashed Orbital Track */}
        <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-accent-warm/25" />
        {/* Inner Guide Circle */}
        <div className="absolute w-[210px] h-[210px] rounded-full border border-white/10" />

        {/* 4 Cardinal Station Nodes */}
        {ARSENAL_CATEGORIES.map((cat, idx) => (
          <ChronometerStationNode
            key={cat.id}
            cat={cat}
            idx={idx}
            activeIndex={activeIndex}
            dialRotation={dialRotation}
            onSelectCategory={onSelectCategory}
            radius={radius}
          />
        ))}
      </motion.div>

      {/* 3. Stationary Center Reactor Core */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#080a14] border-2 border-white/15 shadow-[0_0_35px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center z-20 pointer-events-none">
        <div className="absolute inset-2 rounded-full border border-dashed border-white/15" />
        <motion.div
          style={{ backgroundColor: activeColor, boxShadow: activeShadow }}
          className="w-3.5 h-3.5 rounded-full transition-colors duration-300 mb-1"
        />
        <span className="text-[0.62rem] font-mono font-black tracking-widest text-white/90">
          ARSENAL
        </span>
        <span className="text-[0.52rem] font-mono font-bold tracking-wider text-accent-warm">
          STATION 0{activeIndex + 1}
        </span>
      </div>

      {/* 4. Stationary Docking Reticle at 3 o'clock (Zero protruding obstruction) */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 flex items-center z-30 pointer-events-none"
        style={{ left: `calc(50% + ${radius}px)` }}
      >
        {/* Reticle HUD Chevron Frame */}
        <motion.div
          style={{ borderColor: activeColor, boxShadow: activeShadow }}
          className="w-9 h-16 sm:w-10 sm:h-18 border-[2.5px] rounded-2xl bg-black/85 backdrop-blur-md flex items-center justify-center -translate-x-1/2"
        >
          <div className="w-1 h-8 bg-white/30 rounded-full" />
        </motion.div>
      </div>

    </div>
  );
}

// ============================================================================
// POPPY ARCHITECTURAL SKILL DOSSIER (High-Stiffness Spring, Snappy Pop-In)
// Zero Collision, Instant 100ms Exit, Micro-Staggered Chip Reveal
// ============================================================================
function UnboxedSkillDossier({ category }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.90, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -14, transition: { duration: 0.1, ease: "easeOut" } }}
      transition={{
        type: "spring",
        stiffness: 480,
        damping: 24,
        mass: 0.75,
      }}
      className="relative w-full max-w-3xl select-none"
    >
      {/* 1. Header Bar: System Station Tag & Real-Time Sync Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.02 }}
        className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-accent-warm bg-accent-warm/15 border border-accent-warm/30 px-2.5 py-0.5 rounded-md shadow-[0_0_12px_rgba(255,122,69,0.25)]">
            {category.indexLabel}
          </span>
          <span className="font-mono text-[0.72rem] uppercase tracking-widest text-gray-400 font-semibold">
            {category.domain}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-warm animate-pulse shadow-[0_0_8px_#ff7a45]" />
          <span className="font-mono text-[0.68rem] tracking-wider uppercase text-gray-400 font-medium">
            {category.statusBadge}
          </span>
        </div>
      </motion.div>

      {/* 2. Main Title & Resume-Grounded Architectural Overview */}
      <motion.div 
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 460, damping: 22, delay: 0.04 }}
        className="mb-4"
      >
        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          {category.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 font-light mt-1.5 leading-relaxed max-w-3xl">
          {category.tagline}
        </p>
      </motion.div>

      {/* 3. Balanced 2-Column Architectural Layout (Zero Awkward Voids) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-2 items-start">
        
        {/* LEFT COLUMN: Stack, Runtimes & Architectural Capabilities (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Core Runtimes & Languages */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 22, delay: 0.06 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warm" />
              <span className="font-sans text-[0.68rem] font-bold tracking-wider uppercase text-gray-400">
                Languages & Core Runtimes
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {category.languages.map((item, idx) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.07 + idx * 0.02 }}
                  whileHover={{ scale: 1.08 }}
                  className="px-2.5 py-1 text-xs font-sans font-medium rounded-lg bg-white/[0.04] border border-white/10 text-gray-200 hover:border-accent-warm/40 hover:text-white transition-colors cursor-default"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Frameworks & Production Engines */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 22, delay: 0.10 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warm shadow-[0_0_6px_#ff7a45]" />
              <span className="font-sans text-[0.68rem] font-bold tracking-wider uppercase text-accent-warm">
                Frameworks & Production Engines
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {category.frameworks.map((item, idx) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.11 + idx * 0.02 }}
                  whileHover={{ scale: 1.08 }}
                  className="px-2.5 py-1 text-xs font-sans font-bold rounded-lg bg-accent-warm/10 border border-accent-warm/30 text-accent-warm shadow-[0_0_10px_rgba(255,122,69,0.1)] hover:bg-accent-warm/20 transition-colors cursor-default"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Architectural Patterns */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 22, delay: 0.14 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-warm" />
              <span className="font-sans text-[0.68rem] font-bold tracking-wider uppercase text-gray-400">
                Architectural Patterns
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {category.systems.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-0.5 text-[0.7rem] font-mono font-medium rounded-md bg-white/[0.02] border border-white/5 text-gray-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Production Evidence & Codebase Implementations (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[0.68rem] font-bold tracking-wider uppercase text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warm" />
              <span>Production Evidence in Repositories</span>
            </span>
            <span className="text-[0.65rem] font-mono text-gray-500">Live Codebases</span>
          </div>

          <div className="space-y-2">
            {category.highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 460, damping: 22, delay: 0.12 + i * 0.04 }}
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-accent-warm/40 transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-xs text-white hover:text-accent-warm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="group-hover:underline underline-offset-4">{h.project}</span>
                    <ExternalLink className="w-3 h-3 text-accent-warm opacity-80 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <div className="flex items-center gap-1">
                    {h.tags?.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded text-[0.62rem] font-mono bg-white/[0.04] text-gray-400 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {h.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Bottom Specs Footer (4-Column Balanced Telemetry Gauge Strip) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 22, delay: 0.18 }}
        className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {category.stats.map((s, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="font-display text-sm sm:text-base font-extrabold text-white tracking-tight">
              {s.value}
            </span>
            <span className="text-[0.64rem] font-mono uppercase tracking-wider text-gray-400 mt-0.5">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN EXPORTED ARSENAL SECTION
// ============================================================================
export default function Skills() {
  const containerRef = useRef(null);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const currentIdxRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.0005,
  });

  // Hysteresis deadband: prevents jitter near boundary thresholds and locks each station firmly
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      const cur = currentIdxRef.current;
      let nextIdx = cur;

      if (cur === 0) {
        if (v >= 0.20) nextIdx = 1;
      } else if (cur === 1) {
        if (v <= 0.14) nextIdx = 0;
        else if (v >= 0.53) nextIdx = 2;
      } else if (cur === 2) {
        if (v <= 0.47) nextIdx = 1;
        else if (v >= 0.86) nextIdx = 3;
      } else if (cur === 3) {
        if (v <= 0.80) nextIdx = 2;
      }

      if (nextIdx !== cur) {
        currentIdxRef.current = nextIdx;
        setActiveCategoryIdx(nextIdx);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Click handler to smooth-scroll straight into the station
  const scrollToCategory = (targetIndex) => {
    if (!containerRef.current) return;
    currentIdxRef.current = targetIndex;
    setActiveCategoryIdx(targetIndex);

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollHeight = container.offsetHeight - window.innerHeight;
    const targets = [0.06, 0.35, 0.68, 0.96];
    window.scrollTo({
      top: scrollTop + scrollHeight * targets[targetIndex],
      behavior: "smooth",
    });
  };

  // Continuous, silky smooth rotor rotation matching the 4 stations
  const dialRotation = useTransform(
    smoothProgress,
    [0.0, 0.33, 0.66, 1.0],
    [0, -90, -180, -270]
  );

  const headingY = useTransform(smoothProgress, [0, 0.15], ["10vh", "3vh"]);

  // Themed background opacity & subtle palette shifts matching our app theme
  const bgOpacity = useTransform(smoothProgress, [0, 0.08, 0.92, 1.0], [0, 1, 1, 0]);
  const bgColor = useTransform(
    smoothProgress,
    [0, 0.35, 0.65, 1],
    ["#090c16", "#080b13", "#070a12", "#090c16"]
  );

  // Active Glow Colors for Dial Center & Pointer (Warm Coral & Amber Theme)
  const activeColor = useTransform(
    smoothProgress,
    [0, 0.35, 0.65, 1],
    ["#ff7a45", "#f59e0b", "#ff7a45", "#fbbf24"]
  );
  const activeShadow = useTransform(
    smoothProgress,
    [0, 0.35, 0.65, 1],
    [
      "0px 0px 24px rgba(255,122,69,0.7)",
      "0px 0px 24px rgba(245,158,11,0.7)",
      "0px 0px 24px rgba(255,122,69,0.7)",
      "0px 0px 24px rgba(251,191,36,0.7)",
    ]
  );

  // Scroll-interactive fluid background orbs
  const orb1Y = useTransform(smoothProgress, [0, 1], ["-15vh", "75vh"]);
  const orb2Y = useTransform(smoothProgress, [0, 1], ["75vh", "-15vh"]);
  const orb1X = useTransform(smoothProgress, [0, 1], ["-10vw", "45vw"]);
  const orb2X = useTransform(smoothProgress, [0, 1], ["75vw", "25vw"]);

  const activeCategory = ARSENAL_CATEGORIES[activeCategoryIdx] || ARSENAL_CATEGORIES[0];

  return (
    <section
      ref={containerRef}
      id="skills"
      aria-label="Engineering Arsenal and Verified Technical Skills"
      className="relative h-[420vh] w-full z-10 bg-[#080b13]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-start">
        
        {/* 1. Fluid Background with scroll-interactive ambient blurs */}
        <motion.div
          style={{ opacity: bgOpacity, backgroundColor: bgColor }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <motion.div
            style={{ y: orb1Y, x: orb1X, backgroundColor: activeColor }}
            className="absolute w-[55vw] h-[55vw] rounded-full blur-[170px] opacity-25 mix-blend-screen transition-colors duration-700"
          />
          <motion.div
            style={{ y: orb2Y, x: orb2X, backgroundColor: activeColor }}
            className="absolute w-[65vw] h-[65vw] rounded-full blur-[160px] opacity-15 mix-blend-screen transition-colors duration-700"
          />
        </motion.div>

        {/* 2. Top Header Zone: Clean Heading */}
        <motion.div
          style={{ y: headingY }}
          className="absolute top-0 z-40 flex flex-col items-center justify-center w-full px-4 text-center mt-6 pointer-events-none"
        >
          <SequentialHeading
            text="Arsenal."
            scrollYProgress={smoothProgress}
            activeColor={activeColor}
          />
        </motion.div>

        {/* 3. Main Stage: Left Chronometer Dial & Right Dossier with Generous Breathing Space (gap-10 to gap-20) */}
        <div className="absolute top-[12vh] bottom-2 w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 xl:gap-20 z-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto left-0 right-0">
          
          {/* LEFT SIDE: Aerospace HUD Chronometer Dial (Preserved, no collision) */}
          <div className="shrink-0 flex items-center justify-center relative w-[340px] sm:w-[390px] lg:w-[410px]">
            <KineticChronometerWheel
              dialRotation={dialRotation}
              activeIndex={activeCategoryIdx}
              activeColor={activeColor}
              activeShadow={activeShadow}
              onSelectCategory={scrollToCategory}
            />
          </div>

          {/* RIGHT SIDE: Spacious Unboxed Architectural Dossier with Poppy Micro-Spring Animation */}
          <div className="flex-1 w-full min-w-0 min-h-[58vh] lg:h-full relative flex items-center justify-center lg:justify-start">
            <AnimatePresence mode="wait">
              <UnboxedSkillDossier
                key={activeCategory.id}
                category={activeCategory}
              />
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
