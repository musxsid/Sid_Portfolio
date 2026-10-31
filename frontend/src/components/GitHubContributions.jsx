import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Trophy, 
  GitPullRequest, 
  ExternalLink,
  Code2
} from "lucide-react";
import { portfolioApi } from "../services/api";
import GitHubBackgroundCanvas from "./GitHubBackgroundCanvas";

function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function GitHubContributions() {
  const [data, setData] = useState(null);
  const [repoCount, setRepoCount] = useState(13);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    portfolioApi.getGitHubContributions().then((res) => {
      if (isMounted) {
        setData(res);
      }
    });
    portfolioApi.getGitHubProjects().then((repos) => {
      if (isMounted && Array.isArray(repos) && repos.length > 0) {
        setRepoCount(repos.length);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute 52 columns (weeks) x 7 rows (days)
  const weeks = [];
  if (data && data.days) {
    for (let i = 0; i < data.days.length; i += 7) {
      weeks.push(data.days.slice(i, i + 7));
    }
  }

  // Format date nicely e.g. "May 26th"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${month} ${day}${suffix}`;
  };

  const handleMouseEnter = (day, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current
      ? containerRef.current.getBoundingClientRect()
      : { left: 0, top: 0, width: window.innerWidth };

    const rawX = rect.left - containerRect.left + rect.width / 2;
    const rawY = rect.top - containerRect.top - 10;

    // Smart horizontal edge detection so tooltip never gets cut off on edges
    const isNearRight = rawX > containerRect.width - 160;
    const isNearLeft = rawX < 140;

    let alignX = "-50%";
    let caretLeft = "50%";

    if (isNearRight) {
      alignX = "-90%";
      caretLeft = "90%";
    } else if (isNearLeft) {
      alignX = "-10%";
      caretLeft = "10%";
    }

    setTooltipPos({
      x: rawX,
      y: rawY,
      alignX,
      caretLeft,
    });
    setHoveredDay(day);
  };

  // APP THEME COLOR MAPPING: White baseline with Orange/Coral filled progress marks
  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "bg-accent-warm/40 border border-accent-warm/50 hover:bg-accent-warm/60";
      case 2:
        return "bg-accent-warm/65 border border-accent-warm/75 hover:bg-accent-warm/80";
      case 3:
        return "bg-accent-warm/90 border border-accent-warm shadow-[0_0_8px_rgba(255,122,69,0.5)] hover:bg-accent-warm";
      case 4:
        return "bg-[#ff7a45] border border-white/70 shadow-[0_0_12px_rgba(255,122,69,0.9)] hover:bg-orange-400";
      default:
        // Empty days: crisp white translucent baseline matching app theme
        return "bg-white/[0.12] border border-white/10 hover:bg-white/30";
    }
  };

  const monthLabels = [
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"
  ];

  return (
    <section 
      id="github" 
      aria-label="GitHub Engineering Activity"
      className="relative min-h-screen py-24 md:py-32 w-full z-10 bg-[#070912] overflow-hidden flex flex-col justify-center"
    >
      {/* Interactive Git Telemetry & Specular Spotlight Canvas Background */}
      <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] z-0">
        <GitHubBackgroundCanvas />
      </div>

      {/* Warm Ambient Atmosphere (Full Screen Immersion) */}
      <div className="absolute top-1/4 left-1/4 w-[60vw] h-[450px] bg-accent-warm/[0.045] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[400px] bg-amber-500/[0.035] blur-[180px] rounded-full pointer-events-none" />

      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        
        {/* ========================================================= */}
        {/* UNBOXED SECTION HEADER & LIVE PROFILE STRIP               */}
        {/* ========================================================= */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10"
        >
          <div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
              Engineering <span className="text-accent-warm">Activity.</span>
            </h2>
          </div>

          {/* Unboxed GitHub Profile Badge & Quick Link */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <img
                src="https://avatars.githubusercontent.com/u/180562649?v=4"
                alt="Siddharth GitHub Profile"
                className="w-11 h-11 rounded-full border-2 border-accent-warm/60 shadow-[0_0_15px_rgba(255,122,69,0.3)] object-cover"
              />
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>musxsid</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-warm shadow-[0_0_6px_#ff7a45]" />
                </p>
                <p className="text-xs text-gray-400 font-sans font-medium">
                  Siddharth
                </p>
              </div>
            </div>

            <a
              href="https://github.com/musxsid"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 cursor-pointer ml-auto sm:ml-0"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>github.com/musxsid</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </motion.header>

        {/* ========================================================= */}
        {/* THE UNBOXED CONTRIBUTION MATRIX: White & Orange Theme     */}
        {/* ========================================================= */}
        <motion.div 
          ref={containerRef} 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative py-8 select-none"
        >
          
          {/* Top Status Bar: Contributions Count & Live Streak Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {data?.totalContributions || 151} Contributions
              </span>
              <span className="text-xs font-sans px-3 py-1 rounded-full bg-accent-warm/15 text-accent-warm border border-accent-warm/30 font-semibold tracking-wide">
                Past 52 Weeks
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-sans font-medium text-gray-400">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-accent-warm" />
                <strong className="text-white">{data?.currentStreak || 5}-Day</strong> Current Streak
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <strong className="text-white">{data?.longestStreak || 14}-Day</strong> Longest Streak
              </span>
            </div>
          </div>

          {/* Calendar Grid Canvas (Scrollable on small screens) */}
          <div className="relative overflow-x-auto pb-4 scrollbar-none">
            <div className="min-w-[760px] max-w-full">
              
              {/* Month Labels Along the Top */}
              <div className="flex justify-between pl-8 pr-2 pb-3 text-xs font-sans font-medium text-gray-400">
                {monthLabels.map((m, idx) => (
                  <span key={idx}>{m}</span>
                ))}
              </div>

              {/* Grid: Day Labels + 52 Weeks Columns */}
              <div className="flex gap-2 items-center">
                
                {/* Day Labels Mon, Wed, Fri */}
                <div className="flex flex-col justify-between py-1 text-[0.7rem] font-sans font-medium text-gray-400 w-7 shrink-0 h-[106px]">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* 52 Columns of White & Orange Squares */}
                <div className="flex gap-[4px] flex-grow justify-between pr-4">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[4px]">
                      {week.map((day, dIdx) => (
                        <div
                          key={dIdx}
                          onMouseEnter={(e) => handleMouseEnter(day, e)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-3.5 h-3.5 rounded-[3px] cursor-pointer transition-transform duration-150 hover:scale-135 hover:z-20 ${getLevelColor(
                            day.level
                          )}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>

          {/* Interactive Floating Tooltip (Rendered outside scroll container to prevent edge clipping) */}
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                style={{
                  left: `${tooltipPos.x}px`,
                  top: `${tooltipPos.y}px`,
                  transform: `translate(${tooltipPos.alignX || "-50%"}, -100%)`,
                }}
                className="absolute pointer-events-none z-50 px-3.5 py-2 rounded-xl bg-black/95 border border-white/20 text-white text-xs font-sans font-medium shadow-[0_10px_25px_rgba(0,0,0,0.85)] backdrop-blur-xl whitespace-nowrap"
              >
                {hoveredDay.count === 0 ? (
                  <span>No contributions on {formatDate(hoveredDay.date)}.</span>
                ) : (
                  <span>
                    <strong className="text-accent-warm font-bold">{hoveredDay.count} contribution{hoveredDay.count > 1 ? "s" : ""}</strong> on {formatDate(hoveredDay.date)}.
                  </span>
                )}
                {/* Tooltip downward caret aligned with hover target */}
                <div 
                  className="absolute top-full -mt-[1px] border-solid border-t-black/95 border-t-4 border-x-transparent border-x-4 border-b-0 -translate-x-1/2" 
                  style={{ left: tooltipPos.caretLeft || "50%" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Calendar Footer: White & Orange Legend */}
          <div className="flex flex-col sm:flex-row items-center justify-end pt-4 border-t border-white/10 text-xs text-gray-400 gap-3 font-sans font-medium">
            {/* WHITE & ORANGE APP THEME LEGEND */}
            <div className="flex items-center gap-2">
              <span className="text-[0.7rem] text-gray-400 uppercase tracking-wider">Less</span>
              {/* Level 0: White */}
              <span className="w-3.5 h-3.5 rounded-[3px] bg-white/[0.12] border border-white/10" title="0 contributions (White)" />
              {/* Level 1: Orange 40% */}
              <span className="w-3.5 h-3.5 rounded-[3px] bg-accent-warm/40 border border-accent-warm/50" title="Low activity" />
              {/* Level 2: Orange 65% */}
              <span className="w-3.5 h-3.5 rounded-[3px] bg-accent-warm/65 border border-accent-warm/75" title="Moderate activity" />
              {/* Level 3: Orange 90% */}
              <span className="w-3.5 h-3.5 rounded-[3px] bg-accent-warm/90 border border-accent-warm" title="High activity" />
              {/* Level 4: Pure Warm Coral Solid */}
              <span className="w-3.5 h-3.5 rounded-[3px] bg-[#ff7a45] border border-white/70 shadow-[0_0_8px_#ff7a45]" title="Peak velocity" />
              <span className="text-[0.7rem] text-gray-400 uppercase tracking-wider">More</span>
            </div>
          </div>

        </motion.div>

        {/* ========================================================= */}
        {/* RECRUITER ARCHITECTURAL DOSSIER (OUT OF SQUARE DIVS!)     */}
        {/* Spacious, unboxed layout on a clean architectural grid    */}
        {/* ========================================================= */}
        <motion.section 
          aria-label="Recruiter Key Engineering Metrics" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12 mt-6 border-t border-white/10"
        >
          <div className="mb-8">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Recruiter Overview</span>
              <span className="text-xs font-sans font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/15">
                Technical Highlights
              </span>
            </h3>
          </div>

          {/* 4 Unboxed Metric Pillars with Interactive Scroll and Hover Motion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pt-4">
            
            {/* Pillar 1: Repositories & Architecture */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col relative group cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-accent-warm/15 text-accent-warm border border-accent-warm/30 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,122,69,0.35)] transition-all duration-300">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-black text-white group-hover:text-accent-warm transition-colors">
                    {repoCount}+
                  </p>
                  <p className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">
                    Repositories Built
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed font-light">
                Distributed SaaS, local LLM orchestration pipelines, audio streaming engines, and JWT microservices.
              </p>
            </motion.div>

            {/* Pillar 2: Annual Commit Output */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col relative group cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/30 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.35)] transition-all duration-300">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {data?.totalContributions || 151}+
                  </p>
                  <p className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">
                    Annual Commits
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed font-light">
                Continuous delivery cadence with clean atomic commits, semantic versioning, and rigorous documentation.
              </p>
            </motion.div>

            {/* Pillar 3: Engineering Consistency */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col relative group cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-accent-warm/15 text-accent-warm border border-accent-warm/30 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,122,69,0.35)] transition-all duration-300">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-black text-white group-hover:text-accent-warm transition-colors">
                    14 Days
                  </p>
                  <p className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">
                    Longest Streak
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed font-light">
                Demonstrated stamina in iterative software sprints, feature delivery, bug isolation, and code refactoring.
              </p>
            </motion.div>

            {/* Pillar 4: Polyglot Technology Stack */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col relative group cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-accent-warm/15 text-accent-warm border border-accent-warm/30 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,122,69,0.35)] transition-all duration-300">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-black text-white group-hover:text-accent-warm transition-colors">
                    5 Stacks
                  </p>
                  <p className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">
                    Polyglot Runtimes
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed font-light">
                Java (Spring Boot), JavaScript/TypeScript (React 19), Go, Python, and C# (.NET Core).
              </p>
            </motion.div>

          </div>
        </motion.section>

      </div>
    </section>
  );
}
