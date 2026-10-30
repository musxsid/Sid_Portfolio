import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, GitPullRequest } from "lucide-react";
import { portfolioApi } from "../services/api";

export default function GitHubContributions() {
  const [data, setData] = useState(null);
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
      : { left: 0, top: 0 };

    setTooltipPos({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
    setHoveredDay(day);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "bg-[#0e4429]";
      case 2:
        return "bg-[#006d32]";
      case 3:
        return "bg-[#26a641]";
      case 4:
        return "bg-[#39d353] shadow-[0_0_8px_rgba(57,211,83,0.5)]";
      default:
        return "bg-[#161b22]";
    }
  };

  const monthLabels = [
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"
  ];

  return (
    <section className="relative py-20 z-20 bg-[#070b14]/90 backdrop-blur-md">
      <div className="section-container max-w-6xl mx-auto px-6">
        
        {/* Widget Wrapper */}
        <div 
          ref={containerRef}
          className="relative rounded-2xl bg-[#0d1117] border border-[#30363d] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Top Bar matching image */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                {data?.totalContributions || 148} contributions in the last year
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/musxsid"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors py-1 px-3 rounded-lg bg-[#21262d] border border-[#30363d]"
              >
                <span>Contribution settings</span>
                <span className="text-[0.65rem]">▾</span>
              </a>
            </div>
          </div>

          {/* Calendar Box matching image */}
          <div className="rounded-xl border border-[#30363d] p-5 bg-[#090d16] relative overflow-x-auto select-none">
            
            {/* Month labels along the top */}
            <div className="flex justify-between pl-8 pr-2 pb-2 text-[0.75rem] font-medium text-gray-400 min-w-[720px]">
              {monthLabels.map((m, idx) => (
                <span key={idx}>{m}</span>
              ))}
            </div>

            {/* Grid Container */}
            <div className="flex gap-1.5 min-w-[720px]">
              
              {/* Day Labels Mon, Wed, Fri */}
              <div className="flex flex-col justify-between py-1 text-[0.7rem] font-medium text-gray-400 w-7 shrink-0">
                <span className="h-3 leading-3">Mon</span>
                <span className="h-3 leading-3">Wed</span>
                <span className="h-3 leading-3">Fri</span>
              </div>

              {/* 52 Columns */}
              <div className="flex gap-[3.5px] flex-grow">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3.5px]">
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-[2.5px] cursor-pointer transition-transform duration-150 hover:scale-125 hover:z-20 ${getLevelColor(
                          day.level
                        )}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

            </div>

            {/* Floating Tooltip matching image style */}
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
                    transform: "translate(-50%, -100%)",
                  }}
                  className="absolute pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-[#24292f] border border-[#444c56] text-white text-xs font-medium shadow-xl whitespace-nowrap"
                >
                  {hoveredDay.count === 0 ? (
                    <span>No contributions on {formatDate(hoveredDay.date)}.</span>
                  ) : (
                    <span>
                      <strong className="text-emerald-400">{hoveredDay.count} contribution{hoveredDay.count > 1 ? "s" : ""}</strong> on {formatDate(hoveredDay.date)}.
                    </span>
                  )}
                  {/* Tooltip downward caret */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-[#24292f] border-t-4 border-x-transparent border-x-4 border-b-0" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom bar of calendar: Learn how we count + Less/More Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t border-[#21262d] text-xs text-gray-400 gap-3">
              <a
                href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <span>Learn how we count contributions</span>
              </a>

              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#161b22]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#0e4429]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#006d32]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#26a641]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#39d353]" />
                <span>More</span>
              </div>
            </div>

          </div>

          {/* Contribution Activity Subtitle & Quick Stats */}
          <div className="pt-8">
            <h4 className="text-base font-semibold text-white mb-4">
              Contribution activity
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#161b22]/60 border border-[#30363d] flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Current Streak</p>
                  <p className="text-lg font-bold text-white">{data?.currentStreak || 5} days</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161b22]/60 border border-[#30363d] flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent-warm/10 text-accent-warm">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Longest Streak</p>
                  <p className="text-lg font-bold text-white">{data?.longestStreak || 14} days</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161b22]/60 border border-[#30363d] flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Repositories</p>
                  <p className="text-lg font-bold text-white">12+ active</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

