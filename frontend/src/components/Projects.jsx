import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ExternalLink, 
  Star, 
  GitFork, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  ChevronUp
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

const UNIFIED_LANG_STYLE = {
  dot: "#ff7a45",
  text: "text-accent-warm",
  border: "border-accent-warm/25",
  bg: "bg-accent-warm/10"
};

const LANGUAGE_STYLES = new Proxy({}, {
  get: () => UNIFIED_LANG_STYLE
});

function ProjectStagePreview({ project, images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [project?.id]);

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

  // If no UI screenshots (e.g., backend service like Go Auth or JobHive)
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full min-h-[380px] lg:min-h-[500px] bg-[#070a12] flex flex-col justify-between p-6 sm:p-8 font-sans">
        {/* Terminal Chrome Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 text-xs text-gray-400 font-sans font-medium">
              service://{project?.id || "backend"}.api
            </span>
          </div>
          <span className="text-[0.7rem] font-sans font-semibold tracking-wide text-accent-warm bg-accent-warm/10 px-2.5 py-0.5 rounded-full border border-accent-warm/20">
            {project?.language || "GO"} MICROSERVICE
          </span>
        </div>

        {/* Live Terminal Output Mock */}
        <div className="my-auto py-6 space-y-3 font-mono">
          <div className="text-gray-500 text-xs">// Distributed service health probe</div>
          <div className="text-accent-warm text-xs sm:text-sm flex items-center gap-2">
            <span className="text-white">$</span> curl -sI https://api.musxsid.dev/{project?.id}/health
          </div>
          
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm leading-relaxed text-gray-300 shadow-inner">
            <p className="text-emerald-400 font-semibold">HTTP/2 200 OK</p>
            <p className="text-gray-400">content-type: application/json; charset=utf-8</p>
            <p className="text-gray-400">x-service-latency: 3.4ms</p>
            <p className="mt-2 text-white">{"{"}</p>
            <p className="ml-4 text-orange-300">"service": <span className="text-emerald-300">"{project?.title || title}"</span>,</p>
            <p className="ml-4 text-orange-300">"runtime": <span className="text-yellow-300">"{project?.language || "Go 1.23"}"</span>,</p>
            <p className="ml-4 text-orange-300">"status": <span className="text-emerald-300">"HEALTHY"</span>,</p>
            <p className="ml-4 text-orange-300">"stack": [{project?.techStack?.slice(0, 3).map(t => `"${t}"`).join(", ")}]</p>
            <p className="text-white">{"}"}</p>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="flex items-center justify-between text-xs font-sans text-gray-400 pt-3 border-t border-white/10">
          <span className="flex items-center gap-2 text-accent-warm font-medium">
            <span className="w-2 h-2 rounded-full bg-accent-warm animate-pulse shadow-[0_0_8px_#ff7a45]" />
            Cluster Node Online
          </span>
          <span className="font-medium text-gray-400">100% Open Source</span>
        </div>
      </div>
    );
  }

  // Interactive Browser Mockup for Projects with Screenshots
  const mockUrl = `https://${(project?.id || "preview")}.musxsid.dev`;

  return (
    <figure className="w-full h-full min-h-[380px] lg:min-h-[500px] flex flex-col justify-between bg-[#06080f] relative group/carousel m-0 overflow-hidden">
      {/* Browser Chrome Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-white/[0.02] backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>

        <div className="px-4 py-1 rounded-full bg-black/40 border border-white/10 text-[0.72rem] text-gray-300 font-sans font-medium tracking-wide max-w-[200px] sm:max-w-xs truncate text-center">
          {mockUrl}
        </div>

        <div className="text-xs text-gray-400 font-sans font-medium tabular-nums">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-grow flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} screenshot ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full object-contain max-h-[340px] sm:max-h-[420px] rounded-lg shadow-2xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
          />
        </AnimatePresence>

        {/* Previous & Next Slide Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 hover:bg-accent-warm text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 backdrop-blur-md border border-white/15 shadow-xl cursor-pointer"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 hover:bg-accent-warm text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 backdrop-blur-md border border-white/15 shadow-xl cursor-pointer"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Carousel Thumbnail Dots Bar */}
      {images.length > 1 && (
        <div className="py-3 border-t border-white/5 flex items-center justify-center gap-2 bg-black/40 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-7 bg-accent-warm shadow-[0_0_8px_#ff7a45]"
                  : "w-2 bg-white/20 hover:bg-white/50"
              }`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </figure>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const headerRef = useRef(null);

  const { scrollYProgress: headerScroll } = useScroll({
    target: headerRef,
    offset: ["start 92%", "center 45%"],
  });

  // Scroll-synced color animation for "Selected Work."
  // "Selected" starts as warm orange (#ff7a45), smoothly turning into crisp pure white (#ffffff) at the end of scroll
  const selectedColor = useTransform(
    headerScroll,
    [0, 0.45, 1],
    ["#ff7a45", "#f59e0b", "#ffffff"]
  );

  // "Work." starts pure white (#ffffff) and smoothly transforms into vibrant warm orange (#ff7a45) with glowing aura
  const workColor = useTransform(
    headerScroll,
    [0, 0.45, 1],
    ["#ffffff", "#ff9d75", "#ff7a45"]
  );

  const workGlow = useTransform(
    headerScroll,
    [0, 1],
    ["0px 0px 0px rgba(255,122,69,0)", "0px 0px 24px rgba(255,122,69,0.55)"]
  );

  const headerY = useTransform(headerScroll, [0, 1], ["24px", "0px"]);
  const headerOpacity = useTransform(headerScroll, [0, 0.25, 1], [0.35, 0.8, 1]);

  const sortWithImagesFirst = (list) => {
    if (!Array.isArray(list)) return [];
    return [...list].sort((a, b) => {
      const aHas = a.images && a.images.length > 0;
      const bHas = b.images && b.images.length > 0;
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });
  };

  useEffect(() => {
    let isMounted = true;
    portfolioApi.getGitHubProjects().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setProjects(sortWithImagesFirst(data));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Smoothly center the active timeline item in the scrollable track
  useEffect(() => {
    if (trackRef.current && trackRef.current.children[activeIndex]) {
      trackRef.current.children[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  const activeProject = projects[activeIndex] || projects[0];
  const nextProject = projects[(activeIndex + 1) % projects.length];
  const prevProject = projects[(activeIndex - 1 + projects.length) % projects.length];

  const handleNext = () => {
    if (projects.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    if (projects.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const scrollToStage = () => {
    if (stageRef.current) {
      stageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const displayedProjects = isExpanded ? projects : projects.slice(0, 5);

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
      {/* Liquid Streamlines & Floating Embers Background */}
      <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] z-0">
        <ProjectBackgroundCanvas />
      </div>

      {/* Atmospheric Warm Ambient Lighting (No harsh blue) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[75vw] h-[450px] bg-accent-warm/[0.045] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-[45vw] h-[400px] bg-amber-500/[0.035] blur-[180px] rounded-full pointer-events-none" />

      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header with Scroll-Driven Color Changing Animation */}
        <motion.header 
          ref={headerRef}
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14"
        >
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-3">
            <motion.span style={{ color: selectedColor }} className="transition-colors duration-150">
              Selected
            </motion.span>{" "}
            <motion.span style={{ color: workColor, textShadow: workGlow }} className="transition-colors duration-150">
              Work.
            </motion.span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Production backends, distributed microservices, and applied AI systems synchronized directly from GitHub.
          </p>

          {/* Responsive Project Timeline Track (Smooth Horizontal Scroll Rail) */}
          <div className="relative w-full max-w-5xl mx-auto mt-8 flex items-center gap-2">
            <button
              onClick={() => {
                if (trackRef.current) {
                  trackRef.current.scrollBy({ left: -240, behavior: "smooth" });
                }
              }}
              className="hidden sm:flex p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10 cursor-pointer shrink-0"
              aria-label="Scroll projects left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={trackRef}
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-2 px-1 w-full scroll-smooth"
            >
              {projects.map((proj, idx) => {
                const isSelected = idx === activeIndex;
                const pLang = LANGUAGE_STYLES[proj.language] || { dot: "#ff7a45" };
                return (
                  <button
                    key={proj.id || idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-sans text-xs whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-accent-warm text-white font-bold shadow-[0_0_16px_rgba(255,122,69,0.5)] scale-105"
                        : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
                    }`}
                  >
                    <span 
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white shadow-[0_0_6px_#ffffff]" : ""}`} 
                      style={{ backgroundColor: isSelected ? "#ffffff" : pLang.dot }} 
                    />
                    <span className={`text-[0.68rem] font-display font-bold ${isSelected ? "text-white/90" : "text-gray-500"}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate max-w-[130px] sm:max-w-[180px] font-medium">{proj.title || proj.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (trackRef.current) {
                  trackRef.current.scrollBy({ left: 240, behavior: "smooth" });
                }
              }}
              className="hidden sm:flex p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10 cursor-pointer shrink-0"
              aria-label="Scroll projects right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.header>

        {/* ========================================================= */}
        {/* INTERACTIVE CINEMA STAGE: Active Project Showcase         */}
        {/* ========================================================= */}
        {activeProject && (
          <motion.div 
            ref={stageRef} 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl mx-auto mb-20"
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={activeProject.id || activeIndex}
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl bg-black/65 border border-white/15 backdrop-blur-2xl shadow-[0_25px_65px_rgba(0,0,0,0.85)] overflow-hidden"
              >
                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* Left Column: Interactive Device Mockup Stage */}
                  <div className="lg:col-span-7 relative border-b lg:border-b-0 lg:border-r border-white/10">
                    <ProjectStagePreview
                      project={activeProject}
                      images={activeProject.images}
                      title={activeProject.title || activeProject.name}
                    />
                  </div>

                  {/* Right Column: High-Impact Engineering Specifications */}
                  <div className="lg:col-span-5 p-6 sm:p-8 md:p-9 flex flex-col justify-between relative bg-gradient-to-br from-white/[0.03] to-transparent">
                    
                    <div>
                      {/* Top Minimalist Meta Line (No AI tags!) */}
                      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xs font-bold text-accent-warm tracking-wider uppercase">
                            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                          </span>
                          <span className="text-white/20">•</span>
                          {activeProject.language && langStyle && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: langStyle.dot }} />
                              {activeProject.language}
                            </span>
                          )}
                        </div>

                        {/* GitHub Stars & Forks Pill */}
                        <div className="flex items-center gap-2.5 text-xs text-gray-400 font-sans font-medium tabular-nums">
                          <span className="flex items-center gap-1 text-amber-300">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {activeProject.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3.5 h-3.5 text-gray-400" />
                            {activeProject.forks}
                          </span>
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                        {activeProject.title || activeProject.name}
                        <span className="text-accent-warm">.</span>
                      </h3>
                      
                      {/* Technical Tagline */}
                      <p className="text-accent-warm/95 font-semibold text-xs sm:text-sm mb-5 leading-snug">
                        {activeProject.tagline}
                      </p>

                      {/* Application Overview (from GitHub Repository Description) */}
                      <p className="text-xs sm:text-[0.85rem] text-gray-300 font-light leading-relaxed mb-6">
                        {activeProject.description || "Production-grade system architected with modular microservices, decoupled endpoints, and resilient database persistence."}
                      </p>
                    </div>

                    <div>
                      {/* Technologies Pill Row */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-1.5">
                          {activeProject.techStack?.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 text-[0.72rem] font-medium text-gray-300 bg-white/[0.04] rounded-full border border-white/10 hover:border-accent-warm/50 hover:text-white transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Links Bar */}
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        {activeProject.githubUrl && (
                          <a
                            href={activeProject.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <GitHubIcon className="w-4 h-4" />
                            <span>GitHub Source</span>
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
                            <span>Live App</span>
                          </a>
                        )}
                      </div>

                      {/* GUIDED NEXT / PREV FOOTER: Makes Other Projects 100% Discoverable */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-gray-400">
                        <button
                          onClick={handlePrev}
                          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                          <span>Prev: {prevProject?.title || "Previous"}</span>
                        </button>

                        <button
                          onClick={handleNext}
                          className="flex items-center gap-1.5 text-accent-warm font-semibold hover:text-white transition-colors cursor-pointer group"
                        >
                          <span>Next: {nextProject?.title || "Next Project"}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              </motion.article>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* ARCHITECTURAL PROJECT DIRECTORY: OUT OF SQUARE DIVS!     */}
        {/* Clean, unboxed linear index with hairline borders         */}
        {/* ========================================================= */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Complete Projects Directory" 
          className="pt-10 border-t border-white/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Repository Index
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {projects.length > 5 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-xs font-sans font-semibold text-gray-200 hover:text-white border border-white/15 hover:border-accent-warm/50 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(255,122,69,0.3)] hover:scale-105 active:scale-95"
                >
                  {isExpanded ? (
                    <>
                      <span>Collapse to 5 Major</span>
                      <ChevronUp className="w-3.5 h-3.5 text-accent-warm transition-transform group-hover:-translate-y-0.5" />
                    </>
                  ) : (
                    <>
                      <span>Show All ({projects.length})</span>
                      <ChevronDown className="w-3.5 h-3.5 text-accent-warm transition-transform group-hover:translate-y-0.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Unboxed Architectural List (Hairline Separators, No Boxy Cards) */}
          <div className="divide-y divide-white/10 border-y border-white/10 overflow-hidden">
            <AnimatePresence initial={false}>
              {displayedProjects.map((proj, idx) => {
                const isSelected = idx === activeIndex;

                return (
                  <motion.div
                    key={proj.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    whileHover={{
                      x: 6,
                      transition: { duration: 0.18, ease: "easeOut" }
                    }}
                    onClick={() => {
                      setActiveIndex(idx);
                      scrollToStage();
                    }}
                    className={`group py-4 px-3 sm:px-6 transition-all duration-200 cursor-pointer relative border-l-2 ${
                      isSelected
                        ? "bg-white/[0.05] border-accent-warm text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                        : "border-transparent hover:border-accent-warm/70 hover:bg-white/[0.03] text-gray-300"
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      
                      {/* Left Column (Cols 1-5): Number, Title, Language, Major Architecture Badge, Tagline */}
                      <div className="lg:col-span-5 flex items-start gap-3.5 min-w-0">
                        <span className="font-display text-xs sm:text-sm font-bold text-gray-500 w-7 shrink-0 pt-0.5 tabular-nums">
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className={`text-base font-bold tracking-tight transition-colors truncate ${
                              isSelected ? "text-accent-warm" : "text-white group-hover:text-accent-warm"
                            }`}>
                              {proj.title || proj.name}
                            </h4>

                            <span className="px-2.5 py-0.5 rounded-full text-[0.68rem] font-sans font-semibold flex items-center gap-1.5 bg-accent-warm/10 border border-accent-warm/25 text-accent-warm shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-warm shadow-[0_0_6px_#ff7a45]" />
                              {proj.language || "Code"}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 font-light truncate">
                            {proj.tagline || proj.description}
                          </p>
                        </div>
                      </div>

                      {/* Middle Column (Cols 6-9): Tech Stack Chips - Exactly Aligned Across All Rows, Never Wraps */}
                      <div className="hidden lg:flex lg:col-span-4 items-center gap-1.5 overflow-hidden">
                        {proj.techStack?.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 text-[0.72rem] font-sans font-medium text-gray-300 bg-white/[0.04] rounded-full border border-white/10 shrink-0 hover:border-accent-warm/40 hover:text-white transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                        {proj.techStack?.length > 3 && (
                          <span className="text-[0.7rem] text-gray-400 font-sans font-semibold px-2 py-0.5 bg-white/[0.03] rounded-full border border-white/5 shrink-0">
                            +{proj.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Right Column (Cols 10-12): Stars, Forks, Action Spotlight Trigger & GitHub Icon */}
                      <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0">
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-sans font-medium tabular-nums">
                          {proj.stars > 0 && (
                            <span className="flex items-center gap-1 text-amber-300">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {proj.stars}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3.5 h-3.5" />
                            {proj.forks || 0}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-sans font-semibold flex items-center gap-1 transition-colors ${
                            isSelected ? "text-accent-warm" : "text-gray-400 group-hover:text-white"
                          }`}>
                            {isSelected ? "Active on Stage" : "Load on Stage"}
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-accent-warm" />
                          </span>

                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10 hover:border-accent-warm/40 cursor-pointer hover:scale-105 active:scale-95"
                              aria-label={`Open ${proj.title} on GitHub`}
                            >
                              <GitHubIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Expand / Collapse Toggle Bar */}
          {projects.length > 5 && (
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-end gap-4 text-xs font-sans font-medium text-gray-400">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 hover:border-accent-warm/50 backdrop-blur-xl transition-all duration-300 font-sans font-semibold text-xs tracking-wide cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_0_20px_rgba(255,122,69,0.3)] hover:scale-105 active:scale-95"
              >
                {isExpanded ? (
                  <>
                    <span>Collapse to 5 Major Systems</span>
                    <ChevronUp className="w-4 h-4 text-accent-warm transition-transform group-hover:-translate-y-0.5" />
                  </>
                ) : (
                  <>
                    <span>Show All {projects.length} Repositories</span>
                    <ChevronDown className="w-4 h-4 text-accent-warm transition-transform group-hover:translate-y-0.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.section>

      </div>
    </section>
  );
}
