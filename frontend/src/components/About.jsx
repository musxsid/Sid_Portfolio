import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Cpu,
  Server,
  Layers,
  ExternalLink,
  Download,
  GraduationCap,
  MapPin,
  CheckCircle2
} from "lucide-react";
import AboutLiquidBackground from "./AboutLiquidBackground";
import { portfolioApi } from "../services/api";

function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

const ROLES = [
  "Software Developer",
  "AI / ML Engineer",
  "Python Developer",
  "Java Developer",
  "Backend Architect"
];

function DynamicTypingHeadline() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompletedWord, setIsCompletedWord] = useState(false);

  useEffect(() => {
    const fullText = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 38 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = fullText.substring(0, currentText.length + 1);
        setCurrentText(nextText);

        if (nextText === fullText) {
          setIsCompletedWord(true);
          setTimeout(() => {
            setIsDeleting(true);
            setIsCompletedWord(false);
          }, 2100);
        }
      } else {
        setIsCompletedWord(false);
        const nextText = fullText.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        if (nextText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex]);

  const chars = Array.from(currentText);

  return (
    <div className="flex items-center min-h-[55px] sm:min-h-[75px] lg:min-h-[85px] mb-8 overflow-visible">
      <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-black tracking-tight whitespace-nowrap flex items-center">
        {chars.map((char, idx) => {
          const isLatest = idx === chars.length - 1 && !isDeleting && !isCompletedWord;
          const letterColor = isCompletedWord ? "#ff7a45" : isLatest ? "#ffffff" : "#ff7a45";

          return (
            <span
              key={`${roleIndex}-${idx}`}
              style={{ color: letterColor }}
              className="inline-block transition-colors duration-200 drop-shadow-[0_0_15px_rgba(255,122,69,0.4)]"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="inline-block w-1.5 sm:w-2 h-7 sm:h-11 bg-accent-warm ml-2 rounded-full shadow-[0_0_14px_#ff7a45]"
        />
      </h2>
    </div>
  );
}

function InteractiveCyberPortrait({ isInView }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Mouse coordinate values normalized [0, 1]
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for 3D tilt
  const springConfig = { damping: 22, stiffness: 190, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [9, -9]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-9, 9]), springConfig);

  // Subtle opposite parallax translation for inner portrait photo
  const photoX = useSpring(useTransform(mouseX, [0, 1], [5, -5]), springConfig);
  const photoY = useSpring(useTransform(mouseY, [0, 1], [5, -5]), springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mouseX.set(x);
    mouseY.set(y);
    setGlarePos({ x: Math.round(x * 100), y: Math.round(y * 100) });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-5 flex justify-center items-center relative select-none"
      style={{ perspective: 1000 }}
    >
      {/* Ambient Floating Bracket Top-Left */}
      <motion.div
        animate={{ y: [-5, 6, -5], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 left-4 sm:left-8 text-accent-warm/40 group-hover:text-accent-warm/80 font-mono text-4xl sm:text-5xl font-light select-none pointer-events-none transition-colors"
      >
        &lt;
      </motion.div>

      {/* Ambient Floating Bracket Bottom-Right */}
      <motion.div
        animate={{ y: [6, -5, 6], rotate: [3, -3, 3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 right-4 sm:right-8 text-accent-warm/40 group-hover:text-accent-warm/80 font-mono text-4xl sm:text-5xl font-light select-none pointer-events-none transition-colors"
      >
        &gt;
      </motion.div>

      {/* Interactive 3D Card Container */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.025 }}
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
        className="relative w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] flex items-center justify-center group cursor-pointer"
      >
        {/* Layer 1: Autonomous Atmospheric Breathing Aura (Pulsing live, blooms on hover) */}
        <motion.div
          animate={{
            scale: isHovered ? 1.15 : [1, 1.08, 1],
            opacity: isHovered ? 0.65 : [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: isHovered ? 0.3 : 4.5,
            repeat: isHovered ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-[-24px] rounded-full bg-gradient-to-tr from-accent-warm/30 via-orange-500/20 to-transparent blur-[60px] pointer-events-none"
        />

        {/* Layer 2: Precision Outer Track Ring with Subtle High-Tech Bezel */}
        <div className="absolute inset-[-12px] rounded-full border border-white/10 group-hover:border-accent-warm/30 transition-colors duration-500 pointer-events-none">
          {/* Micro Cardinal Ticks */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-warm/60 shadow-[0_0_8px_#ff7a45]" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-warm/60 shadow-[0_0_8px_#ff7a45]" />
          <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-warm/40" />
          <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-warm/40" />
        </div>

        {/* Layer 3: Autonomous Luminous Corona Sweep (Refined Conic Glow) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: isHovered ? 6 : 9,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-6px] rounded-full pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 55%, rgba(255,122,69,0.15) 75%, #ff7a45 90%, #ffc107 97%, transparent 100%)",
            filter: "blur(3px)",
          }}
        />

        {/* Layer 4: Crisp High-Intensity Corona Edge */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: isHovered ? 6 : 9,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-5px] rounded-full pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 65%, rgba(255,122,69,0.3) 82%, #ff7a45 92%, #ffffff 98%, transparent 100%)",
          }}
        />

        {/* Layer 5: Autonomous Precision Orbital Tech Satellite Bead */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: isHovered ? 6 : 9,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-6px] rounded-full pointer-events-none"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_16px_#ff7a45,0_0_8px_#ff9f68] absolute top-0 left-1/2 -translate-x-1/2 border-2 border-accent-warm" />
        </motion.div>

        {/* Layer 6: Inner Circular Portrait Frame with Specular Liquid Glass Lens */}
        <div className="w-[calc(100%-16px)] sm:w-[calc(100%-20px)] h-[calc(100%-16px)] sm:h-[calc(100%-20px)] rounded-full overflow-hidden bg-[#0d1017] relative z-10 border border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.85)]">
          {/* Depth Parallax Photo */}
          <motion.img
            src="https://avatars.githubusercontent.com/u/180562649?v=4"
            alt="Siddharth - Software Developer"
            style={{ x: photoX, y: photoY }}
            className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Subtle Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Liquid Glass Interactive Specular Glare Reflection */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-full"
            style={{
              opacity: isHovered ? 0.85 : 0.25,
              background: `radial-gradient(circle 140px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.28) 0%, rgba(255,122,69,0.12) 40%, transparent 80%)`,
            }}
          />

          {/* Fine Inner Neon Edge Ring */}
          <div className="absolute inset-0 rounded-full border border-accent-warm/25 pointer-events-none shadow-[inset_0_0_20px_rgba(255,122,69,0.2)]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-60px 0px" });

  const [activeService, setActiveService] = useState(0);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("/resume/Siddharth_Shakyawal_Resume.pdf");
  const [gitStats, setGitStats] = useState({
    contributions: 151,
    repos: 13,
  });

  useEffect(() => {
    let isMounted = true;
    portfolioApi.getResume().then((url) => {
      if (isMounted && url && !url.includes("example-cloud-storage.com")) {
        setResumeUrl(url);
      }
    });

    portfolioApi.getGitHubContributions().then((res) => {
      if (isMounted && res && res.totalContributions) {
        setGitStats((prev) => ({ ...prev, contributions: res.totalContributions }));
      }
    });

    portfolioApi.getGitHubProjects().then((repos) => {
      if (isMounted && Array.isArray(repos) && repos.length > 0) {
        setGitStats((prev) => ({ ...prev, repos: repos.length }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Technical skills extracted directly from Siddharth's uploaded resume
  const resumeSkills = [
    "Java", "Python", "JavaScript", "TypeScript", "C#", "Kotlin", "SQL",
    "Spring Boot 3", "Spring Security (OAuth2)", "FastAPI", "Spring AI", "IAM (Keycloak, Kafka)", "RabbitMQ", ".NET Core (MVC)", "REST APIs", "JPA/Hibernate",
    "RAG Pipelines", "Prompt Engineering", "Llama 3.3 (70B)", "Groq", "Ollama",
    "React 19", "Tailwind CSS", "Framer Motion",
    "PostgreSQL", "MongoDB", "MySQL", "SQL Server", "Redis", "MinIO", "S3",
    "Docker", "Git", "GitHub", "Postman", "AWS", "IntelliJ IDEA"
  ];

  const services = [
    {
      icon: Cpu,
      title: "Applied AI & Structured RAG",
      subtitle: "Spring AI, Groq (Llama 3.3 70B), Ollama, and LLM Orchestration Pipelines",
    },
    {
      icon: Server,
      title: "Backend Systems & Microservices",
      subtitle: "Java (Spring Boot 3), FastAPI, OAuth2 Security, RabbitMQ & Multi-Tenant APIs",
    },
    {
      icon: Layers,
      title: "Full-Stack Web Architecture",
      subtitle: "React 19, PostgreSQL ACID Folio Ledgers, MongoDB & Framer Motion",
    },
  ];

  const stats = [
    { value: `${gitStats.contributions} +`, label: "GitHub Contributions" },
    { value: `${gitStats.repos} +`, label: "Repositories Built" },
    { value: "2", label: "Software Developer Internships" },
  ];

  const handleScroll = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-20 md:py-28 z-20 overflow-hidden bg-[#090c13] scroll-mt-24"
    >
      {/* 1. Dynamic Liquid Plasma Background (Reacts on hover & scroll) */}
      <AboutLiquidBackground />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent-warm/15 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-accent-warm/[0.04] blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">

        {/* ========================================================= */}
        {/* TOP ZONE: Hello + Dynamic Typewriter Title + Liquid Portrait */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-14 md:mb-16">

          {/* Left Column: Hello, Accent Line & Dynamic Typewriter Headline */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* "Hello ." */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hello
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-accent-warm inline-block animate-pulse shadow-[0_0_12px_#ff7a45]" />
            </div>

            {/* "—— I'm Siddharth" (Only Siddharth, no Shakyawal) */}
            <div className="flex items-center gap-4 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: 56 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-[2px] bg-accent-warm shadow-[0_0_8px_#ff7a45]"
              />
              <span className="text-gray-200 font-semibold text-lg sm:text-xl tracking-wide">
                I'm Siddharth
              </span>
            </div>

            {/* Dynamic Typing Animated Headline (No wrapping, single line) */}
            <DynamicTypingHeadline />

            {/* Liquid Theme Action Buttons: Pill Shaped (rounded-full) */}
            <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
              <motion.a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-accent-warm via-orange-500 to-amber-500 hover:from-orange-500 hover:to-accent-warm text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_35px_rgba(255,122,69,0.5)] hover:shadow-[0_0_55px_rgba(255,122,69,0.8)] cursor-pointer backdrop-blur-md"
              >
                Got a project?
              </motion.a>

              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-accent-warm/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] font-bold text-sm tracking-wide hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
              >
                <span>My resume</span>
                <Download className="w-4 h-4 text-accent-warm" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Interactive Cybernetic Portrait */}
          <InteractiveCyberPortrait isInView={isInView} />

        </div>

        {/* ========================================================= */}
        {/* MIDDLE ZONE: Architectural Moving Technical Skills Strip  */}
        {/* ========================================================= */}
        <div
          onMouseEnter={() => setIsMarqueeHovered(true)}
          onMouseLeave={() => setIsMarqueeHovered(false)}
          className="w-full my-12 sm:my-16 relative"
        >
          {/* Architectural Edge-to-Edge Track (No heavy isolated pill box) */}
          <div className="relative py-4 sm:py-5 border-y border-white/[0.08] bg-white/[0.015] backdrop-blur-md overflow-hidden group">

            {/* Glowing Accent Lines on Top & Bottom Track Borders */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-warm/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            {/* Liquid Edge Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#090c13] via-[#090c13]/85 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#090c13] via-[#090c13]/85 to-transparent z-10 pointer-events-none" />

            {/* Seamless Moving Marquee */}
            <motion.div
              animate={{ x: isMarqueeHovered ? "-20%" : ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: isMarqueeHovered ? 55 : 28,
                  ease: "linear",
                },
              }}
              className="flex items-center gap-3.5 sm:gap-5 whitespace-nowrap w-max"
            >
              {[...resumeSkills, ...resumeSkills].map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-accent-warm/50 transition-all duration-300 group/tech cursor-pointer select-none"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-warm/80 group-hover/tech:bg-accent-warm group-hover/tech:scale-125 transition-all duration-300 shadow-[0_0_8px_#ff7a45]" />
                  <span className="text-xs sm:text-[0.8rem] font-bold tracking-wider uppercase text-gray-300 group-hover/tech:text-white group-hover/tech:drop-shadow-[0_0_10px_rgba(255,122,69,0.7)] transition-all duration-300">
                    {skill}
                  </span>
                </div>
              ))}
            </motion.div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM ZONE: Services, Narrative, Aligned Education & Stats */}
        {/* ========================================================= */}
        <div className="flex flex-col">

          {/* Top Half: Services on Left & About Narrative on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-10">

            {/* Left: Strictly the 3 Core Services Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.45 }}
              className="lg:col-span-5 flex flex-col justify-start relative"
            >
              <div className="relative">
                {/* Vertical Connecting Line strictly between the 3 services */}
                <div className="absolute left-[13px] top-5 bottom-5 w-[2px] bg-white/10 z-0">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={isInView ? { height: "100%" } : {}}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                    className="w-full bg-accent-warm shadow-[0_0_10px_rgba(255,122,69,0.8)]"
                  />
                </div>

                {/* Service Items with Aligned Dots and Liquid Glass Backing */}
                <div className="flex flex-col gap-6 relative z-10">
                  {services.map((item, idx) => {
                    const Icon = item.icon;
                    const isHovered = activeService === idx;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setActiveService(idx)}
                        className="flex items-center gap-4 group cursor-pointer"
                      >
                        {/* Timeline Dot - Exactly Centered */}
                        <div className="w-7 flex justify-center shrink-0">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${isHovered
                              ? "bg-accent-warm border-white shadow-[0_0_15px_rgba(255,122,69,1)] scale-125"
                              : "bg-[#090c13] border-accent-warm/75"
                              }`}
                          />
                        </div>

                        {/* Liquid Glass Card Container */}
                        <div className={`p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex items-start gap-3.5 flex-grow ${isHovered
                          ? "bg-white/[0.08] border-accent-warm/50 shadow-[0_8px_30px_rgba(255,122,69,0.2)]"
                          : "bg-white/[0.03] border-white/10 hover:border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                          }`}>
                          <div className={`p-2.5 rounded-xl border transition-all duration-300 shrink-0 ${isHovered
                            ? "bg-accent-warm/20 border-accent-warm text-accent-warm shadow-[0_0_15px_rgba(255,122,69,0.3)]"
                            : "bg-white/5 border-white/10 text-gray-400 group-hover:text-white"
                            }`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <div>
                            <h4 className={`text-base font-bold transition-colors ${isHovered ? "text-accent-warm" : "text-white"
                              }`}>
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right: Resume Summary & Verified Production Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.45 }}
              className="lg:col-span-7 flex flex-col justify-start"
            >
              {/* "About me" Heading */}
              <div className="mb-4">
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  About me
                </h3>
              </div>

              {/* Exact Resume Summary from Siddharth's Uploaded Resume */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
                Software Engineer specializing in <strong className="text-white font-semibold">Backend Systems</strong> and <strong className="text-white font-semibold">Applied AI/ML</strong>, proficient in Python, Java (Spring Boot), and React. Experienced in architecting hallucination-free Structured RAG pipelines, deterministic data retrieval layers, and LLM orchestration workflows. Proven background building resilient data ingestion pipelines, scalable microservices, and secure, multi-tenant APIs.
              </p>

              {/* Verified Production Experience from Resume */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-accent-warm shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Angel Bot AI</strong> — Software Developer Intern: Engineered structured RAG pipelines using Spring AI & Groq (Llama 3.3 70B) and computed health score analytics.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-accent-warm shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">CodeArrest Softwares</strong> — Full Stack Developer Intern: Developed JobHive online job portal with .NET Core (MVC), SQL Server & Entity Framework Core.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-accent-warm shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Triage & OmniStay ERP</strong> — Full-stack SaaS platforms featuring Spring Security JWT authentication, JPA relational mapping & ACID-compliant Postgres folio ledgers.
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Bottom Half: Perfectly Aligned Education (Left) & GitHub Stats (Right) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          >
            {/* Left: Clean, Unboxed Education Aligned with Stats */}
            <div className="lg:col-span-5 flex items-center gap-4 group">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-accent-warm shrink-0 shadow-lg group-hover:scale-105 group-hover:border-accent-warm/50 transition-all">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-accent-warm transition-colors">
                  Bachelor of Computer Applications (BCA)
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-normal">
                  Christ University, Lavasa, Pune{" "}
                  <span className="text-accent-warm font-sans text-xs font-semibold ml-1">
                    (2024–2027)
                  </span>
                </p>
              </div>
            </div>

            {/* Right: Unboxed GitHub Stats directly across from Education */}
            <div className="lg:col-span-7 grid grid-cols-3 gap-6 sm:gap-10">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className="flex flex-col relative group cursor-pointer"
                >
                  <p className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-black text-white tracking-tight leading-none group-hover:text-accent-warm transition-colors duration-300">
                    {stat.value.split(" ")[0]}{" "}
                    <span className="text-accent-warm font-light">
                      {stat.value.split(" ")[1] || ""}
                    </span>
                  </p>

                  <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium leading-snug group-hover:text-gray-200 transition-colors">
                    {stat.label}
                  </p>

                  {/* Hairline Divider between stats (desktop only) */}
                  {idx < stats.length - 1 && (
                    <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-0 w-[1px] h-10 bg-white/10 pointer-events-none" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links & Location Bar */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <motion.a
                href="https://github.com/musxsid"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 hover:bg-[#161b22] text-white font-bold text-sm tracking-wide border border-white/20 hover:border-accent-warm shadow-xl backdrop-blur-xl transition-all group"
              >
                <div className="p-1 rounded-full bg-white text-black group-hover:bg-accent-warm group-hover:text-white transition-colors">
                  <GitHubIcon className="w-4 h-4" />
                </div>
                <span className="font-sans text-sm tracking-tight font-semibold">github.com/musxsid</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-accent-warm transition-colors ml-1" />
              </motion.a>

              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm tracking-wide border border-white/20 hover:border-accent-warm backdrop-blur-xl transition-all group"
              >
                <div className="p-1 rounded-full bg-[#0a66c2] text-white">
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold">LinkedIn</span>
              </motion.a>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-accent-warm" />
              <span>Kota, Rajasthan • Pune, India</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

