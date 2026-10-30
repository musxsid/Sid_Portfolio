import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  Star, 
  GitFork, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import ProjectBackgroundCanvas from "./ProjectBackgroundCanvas";
import { portfolioApi } from "../services/api";

function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const LANGUAGE_STYLES = {
  Java: { dot: "#ea580c", text: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
  JavaScript: { dot: "#eab308", text: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
  TypeScript: { dot: "#3b82f6", text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  "C#": { dot: "#a855f7", text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  Go: { dot: "#06b6d4", text: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
  Python: { dot: "#10b981", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
};

function ProjectCarousel({ images, title, language, techStack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#070a12] flex flex-col justify-between p-6 sm:p-8">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 font-mono text-xs text-gray-400">{title.toLowerCase().replace(/\s+/g, "-")}.service</span>
          </div>
          <span className="font-mono text-[0.7rem] text-accent-warm bg-accent-warm/10 px-2.5 py-1 rounded-full border border-accent-warm/30">
            {language || "BACKEND"} ARCHITECTURE
          </span>
        </div>

        {/* High-tech mock code/architecture preview */}
        <div className="my-auto py-6 font-mono text-xs text-gray-300 space-y-2">
          <div className="text-gray-500">// Distributed Architecture & API Payload</div>
          <div className="text-accent-warm flex items-center gap-2">
            <span className="text-white">$</span> curl -X GET https://api.musxsid.dev/v1/{title.toLowerCase().replace(/\s+/g, "-")}
          </div>
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-gray-300 font-mono text-[0.78rem] leading-relaxed shadow-inner">
            <p className="text-emerald-400">HTTP/2 200 OK</p>
            <p className="text-gray-400">Content-Type: application/json; charset=utf-8</p>
            <p className="text-gray-400">X-Service-Status: OPERATIONAL</p>
            <p className="mt-2 text-white">{"{"}</p>
            <p className="ml-4 text-orange-300">"status": <span className="text-emerald-300">"PRODUCTION_READY"</span>,</p>
            <p className="ml-4 text-orange-300">"engine": <span className="text-yellow-300">"{language || "Cloud Native"}"</span>,</p>
            <p className="ml-4 text-orange-300">"techStack": [{techStack?.slice(0, 4).map(t => `"${t}"`).join(", ")}]</p>
            <p className="text-white">{"}"}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/10 font-mono">
          <span className="flex items-center gap-2 text-accent-warm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            Backend Active
          </span>
          <span>Open Source Repository</span>
        </div>
      </div>
    );
  }

  return (
    <figure className="w-full h-full relative overflow-hidden bg-[#06080e] group/carousel m-0">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} - screenshot ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-contain opacity-90 group-hover/carousel:opacity-100 transition-opacity duration-500 p-2 sm:p-4"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-accent-warm rounded-full text-white opacity-0 group-hover/carousel:opacity-100 transition-all z-20 backdrop-blur-md border border-white/15 shadow-xl cursor-pointer"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-accent-warm rounded-full text-white opacity-0 group-hover/carousel:opacity-100 transition-all z-20 backdrop-blur-md border border-white/15 shadow-xl cursor-pointer"
            aria-label="Next screenshot"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "w-6 bg-accent-warm shadow-[0_0_8px_#ff7a45]"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </figure>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    portfolioApi.getGitHubProjects().then((data) => {
      if (isMounted) {
        setProjects(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeProject = projects[activeIndex] || projects[0];

  const handleNext = () => {
    if (projects.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    if (projects.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const scrollToSpotlight = () => {
    if (spotlightRef.current) {
      spotlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const langStyle = activeProject?.language
    ? LANGUAGE_STYLES[activeProject.language] || {
        dot: "#ff7a45",
        text: "text-accent-warm",
        border: "border-accent-warm/30",
        bg: "bg-accent-warm/10"
      }
    : null;

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      aria-label="Selected Engineering Work"
      className="relative min-h-screen py-24 md:py-32 w-full z-10 bg-[#080b13] overflow-hidden flex flex-col justify-center"
    >
      {/* Liquid Refraction Canvas with Organic Waves */}
      <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] z-0">
        <ProjectBackgroundCanvas />
      </div>

      {/* Atmospheric Warm Ambient Lighting (No harsh blue!) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[75vw] h-[450px] bg-accent-warm/[0.045] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-[45vw] h-[400px] bg-amber-500/[0.035] blur-[180px] rounded-full pointer-events-none" />

      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Semantic Section Header */}
        <header className="flex flex-col items-center justify-center text-center mb-10 md:mb-12">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-4">
            Selected <span className="text-accent-warm">Work.</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Dynamic repositories synchronized directly from GitHub, highlighting scalable backends, microservices, and reactive full-stack web applications.
          </p>
        </header>

        {/* ========================================================= */}
        {/* RE-ENGINEERED NAV PILLS: Centered & Liquid Glass (No Cutoff) */}
        {/* ========================================================= */}
        <nav 
          aria-label="Project selection tabs" 
          className="flex items-center justify-center gap-2 sm:gap-3 mb-10 flex-wrap max-w-5xl mx-auto px-2"
        >
          {projects.map((proj, idx) => {
            const isSelected = idx === activeIndex;
            const pLangStyle = LANGUAGE_STYLES[proj.language] || { dot: "#ff7a45" };

            return (
              <button
                key={proj.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 relative cursor-pointer backdrop-blur-xl ${
                  isSelected
                    ? "text-white bg-accent-warm shadow-[0_0_25px_rgba(255,122,69,0.5)] border border-accent-warm scale-105 font-bold"
                    : "text-gray-300 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/10 hover:border-accent-warm/40"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: isSelected ? "#ffffff" : pLangStyle.dot }}
                />
                <span className="truncate max-w-[150px] sm:max-w-none">{proj.title || proj.name}</span>
                {proj.stars > 0 && (
                  <span className={`inline-flex items-center gap-0.5 text-[0.7rem] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected ? 'bg-black/20 text-white font-bold' : 'bg-white/10 text-amber-300'
                  }`}>
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {proj.stars}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ========================================================= */}
        {/* FEATURED SPOTLIGHT SHOWCASE: Active Project Architecture   */}
        {/* ========================================================= */}
        {activeProject && (
          <div ref={spotlightRef} className="relative w-full max-w-6xl mx-auto mb-16">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeProject.id || activeIndex}
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl bg-black/60 border border-white/15 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden group/card"
              >
                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
                  
                  {/* Left Column: Visual Showcase / Interactive Carousel */}
                  <div className="lg:col-span-7 h-[300px] sm:h-[400px] lg:h-auto min-h-[320px] relative border-b lg:border-b-0 lg:border-r border-white/10">
                    <ProjectCarousel
                      images={activeProject.images}
                      title={activeProject.title || activeProject.name}
                      language={activeProject.language}
                      techStack={activeProject.techStack}
                    />
                  </div>

                  {/* Right Column: Project Metadata, Engineering Highlights & CTAs */}
                  <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative bg-gradient-to-br from-white/[0.04] to-transparent">
                    
                    <div>
                      {/* =================================================== */}
                      {/* REFINED METADATA STATUS BAR: High-End Liquid Pills  */}
                      {/* =================================================== */}
                      <div className="flex items-center gap-2 sm:gap-2.5 mb-5 flex-wrap">
                        {/* Language Pill */}
                        {activeProject.language && langStyle && (
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border backdrop-blur-md ${langStyle.bg} ${langStyle.border} ${langStyle.text}`}>
                            <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: langStyle.dot }} />
                            <span>{activeProject.language}</span>
                          </div>
                        )}

                        {/* Stars Pill */}
                        <div className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-300 backdrop-blur-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{activeProject.stars} {activeProject.stars === 1 ? "Star" : "Stars"}</span>
                        </div>

                        {/* Forks Pill */}
                        <div className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/[0.04] border border-white/10 text-gray-300 backdrop-blur-md">
                          <GitFork className="w-3.5 h-3.5 text-gray-400" />
                          <span>{activeProject.forks} {activeProject.forks === 1 ? "Fork" : "Forks"}</span>
                        </div>

                        {/* Category / Domain Badge */}
                        {activeProject.tagline && (
                          <div className="px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider bg-accent-warm/15 border border-accent-warm/30 text-accent-warm backdrop-blur-md hidden sm:inline-flex">
                            {activeProject.tagline.split(" ")[0]} Project
                          </div>
                        )}
                      </div>

                      {/* Project Title */}
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                        {activeProject.title || activeProject.name}
                      </h3>
                      
                      {/* Project Tagline */}
                      <p className="text-accent-warm font-bold text-sm mb-4">
                        {activeProject.tagline}
                      </p>

                      {/* Engineering Narrative */}
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                        {activeProject.description}
                      </p>
                    </div>

                    <div>
                      {/* Tech Stack Badges */}
                      <div className="mb-8">
                        <p className="text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold mb-2.5 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-accent-warm" />
                          <span>Core Technologies & Architecture</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProject.techStack?.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-[0.75rem] font-medium text-gray-300 bg-white/[0.04] rounded-full border border-white/10 hover:border-accent-warm/50 hover:text-white transition-colors backdrop-blur-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Links & Stepper Controls */}
                      <footer className="flex items-center justify-between pt-5 border-t border-white/10 gap-3">
                        <div className="flex items-center gap-3">
                          {activeProject.githubUrl && (
                            <a
                              href={activeProject.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <GitHubIcon className="w-4 h-4" />
                              <span>GitHub Repo</span>
                            </a>
                          )}

                          {activeProject.liveUrl && (
                            <a
                              href={activeProject.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15 backdrop-blur-md hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4 text-accent-warm" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>

                        {/* Card Stepper Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handlePrev}
                            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all border border-white/10 hover:border-accent-warm/50 cursor-pointer"
                            aria-label="Previous project"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-gray-400 font-mono px-2">
                            {activeIndex + 1}/{projects.length}
                          </span>
                          <button
                            onClick={handleNext}
                            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all border border-white/10 hover:border-accent-warm/50 cursor-pointer"
                            aria-label="Next project"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </footer>

                    </div>

                  </div>

                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================= */}
        {/* ALL PROJECTS EXPLORER GRID: Complete Accessibility        */}
        {/* ========================================================= */}
        <section aria-label="All Engineering Projects Grid" className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span>Explore All Repositories</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-accent-warm/15 text-accent-warm border border-accent-warm/30">
                  {projects.length} Total Repositories
                </span>
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                All production systems synchronized from GitHub. Click any repository to load its complete architecture and screenshots in the spotlight above.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent-warm animate-pulse" />
              <span>Interactive Project Deck</span>
            </div>
          </div>

          {/* 3-Column Structured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj, idx) => {
              const isSelected = idx === activeIndex;
              const pLangStyle = LANGUAGE_STYLES[proj.language] || {
                dot: "#ff7a45",
                text: "text-accent-warm",
                border: "border-accent-warm/30",
                bg: "bg-accent-warm/10"
              };

              return (
                <article
                  key={proj.id || idx}
                  onClick={() => {
                    setActiveIndex(idx);
                    scrollToSpotlight();
                  }}
                  className={`group rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden backdrop-blur-xl border ${
                    isSelected
                      ? "bg-white/[0.07] border-accent-warm shadow-[0_0_35px_rgba(255,122,69,0.25)] scale-[1.01]"
                      : "bg-white/[0.025] hover:bg-white/[0.05] border-white/10 hover:border-accent-warm/40 shadow-lg"
                  }`}
                >
                  {/* Active Accent Gradient Line */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-warm via-amber-400 to-accent-warm" />
                  )}

                  <div>
                    {/* Top row: Language & Stars */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold flex items-center gap-1.5 border ${pLangStyle.bg} ${pLangStyle.border} ${pLangStyle.text}`}>
                        <span className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: pLangStyle.dot }} />
                        {proj.language || "Code"}
                      </span>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {proj.stars > 0 && (
                          <span className="flex items-center gap-1 text-amber-300">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {proj.stars}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {proj.forks || 0}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h4 className={`text-lg sm:text-xl font-bold tracking-tight mb-1 transition-colors ${
                      isSelected ? "text-accent-warm" : "text-white group-hover:text-accent-warm"
                    }`}>
                      {proj.title || proj.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mb-3 line-clamp-1">
                      {proj.tagline}
                    </p>

                    {/* Description clamped */}
                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 mb-5 font-light">
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {proj.techStack?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[0.68rem] font-medium text-gray-300 bg-white/5 rounded-md border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                      {proj.techStack?.length > 4 && (
                        <span className="px-2 py-0.5 text-[0.68rem] font-medium text-gray-400 bg-white/5 rounded-md border border-white/5">
                          +{proj.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Card Footer: Spotlight Status & GitHub Link */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                      <span className={`font-semibold flex items-center gap-1.5 ${
                        isSelected ? "text-accent-warm font-bold" : "text-gray-400 group-hover:text-white"
                      }`}>
                        {isSelected ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-accent-warm shadow-[0_0_8px_#ff7a45]" />
                            <span>In Spotlight</span>
                          </>
                        ) : (
                          <>
                            <span>Inspect Project</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </span>

                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
                          aria-label={`Open ${proj.title} on GitHub`}
                        >
                          <GitHubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

      </div>
    </section>
  );
}
