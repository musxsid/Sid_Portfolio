import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Server, Monitor, Wrench } from "lucide-react";
import skillsData from "../data/skillsData";

const categoryMeta = {
  Backend: {
    icon: Server,
    color: "text-accent-warm",
    bg: "bg-accent-warm/10",
  },
  Frontend: {
    icon: Monitor,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  Tools: {
    icon: Wrench,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
};

function SequentialHeading({ text, scrollYProgress }) {
  const letters = Array.from(text);
  
  // Theme color dynamically updates with the active card
  const activeColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["#e55a28", "#3b82f6", "#34d399", "#34d399"]
  );

  return (
    <h2 className="font-display text-[4rem] sm:text-[5rem] md:text-[6rem] font-black tracking-tighter drop-shadow-2xl flex">
      {letters.map((char, i) => {
        const start = (i / letters.length) * 0.1;
        const end = start + 0.05;
        const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
        const y = useTransform(scrollYProgress, [start, end], ["20px", "0px"]);
        
        return (
          <motion.span 
            key={i} 
            style={{ 
              opacity, 
              y, 
              color: char === "." ? activeColor : "#ffffff" 
            }} 
            className="inline-block transition-colors duration-300"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </h2>
  );
}

function LiquidGlassSkillCard({ category, skills, index, scrollYProgress }) {
  const meta = categoryMeta[category] || categoryMeta.Backend;
  const Icon = meta.icon;

  const center = 0.2 + index * 0.3;
  // Significantly softened the transition math for a smooth, luxurious glide
  const start = center - 0.15;
  const enter = center; 
  const exit = center + 0.05;   
  const end = index === 2 ? 1.0 : center + 0.15;

  const sStart = Math.max(0, start);
  const sEnter = Math.max(0, Math.min(1, enter));
  const sExit = Math.max(0, Math.min(1, exit));
  const sEnd = Math.min(1, end);

  // Reduced travel distance for a much gentler motion
  const x = useTransform(
    scrollYProgress,
    [sStart, sEnter, sExit, sEnd],
    ["-15vw", "0vw", "0vw", "15vw"]
  );

  // Softened scaling
  const scale = useTransform(
    scrollYProgress,
    [sStart, sEnter, sExit, sEnd],
    [0.85, 1, 1, 0.85]
  );

  const opacity = useTransform(
    scrollYProgress,
    [sStart, sEnter, sExit, sEnd],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ x, scale, opacity, pointerEvents: opacity.get() > 0 ? "auto" : "none" }}
      className="absolute inset-0 flex items-center justify-start md:pl-20 w-full"
    >
      <div className="w-[85vw] md:w-[450px] p-8 md:p-10 bg-white/5 backdrop-blur-3xl border border-white/20 shadow-[0_15px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem]">
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-4 rounded-2xl ${meta.bg} border border-white/10 shadow-inner`}>
            <Icon className={`w-8 h-8 ${meta.color}`} />
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight">{category}</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className="px-4 py-2 text-[0.85rem] font-bold tracking-wider border border-white/15 bg-black/40 backdrop-blur-md rounded-2xl text-gray-200 shadow-sm transition-all hover:bg-white/10 hover:scale-105"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate rotation to perfectly align 0deg, 120deg, and 240deg notches with 3 o'clock (0deg CSS space)
  const dialRotation = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.5, 0.8, 1], 
    [80, 0, -120, -240, -320]
  );

  const headingY = useTransform(scrollYProgress, [0, 0.2], ["30vh", "8vh"]);

  // Dynamic Background Colors synced to the active skill category
  const bgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1.0], [0, 1, 1, 0]);
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["#140a05", "#050a14", "#05140a", "#140a05"] // Deep Orange -> Deep Blue -> Deep Emerald
  );

  // Dynamic Glow Colors for the Dial Center and Pointer
  const activeColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["#e55a28", "#3b82f6", "#34d399", "#34d399"]
  );
  const activeShadow = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["0px 0px 20px #e55a28", "0px 0px 20px #3b82f6", "0px 0px 20px #34d399", "0px 0px 20px #34d399"]
  );

  // Dynamic Notch Glows - They only glow when aligned with 3 o'clock!
  const notch0Color = useTransform(scrollYProgress, [0.15, 0.2, 0.25], ["#ffffff40", "#e55a28", "#ffffff40"]);
  const notch0Shadow = useTransform(scrollYProgress, [0.15, 0.2, 0.25], ["0px 0px 0px transparent", "0px 0px 20px #e55a28", "0px 0px 0px transparent"]);

  const notch1Color = useTransform(scrollYProgress, [0.45, 0.5, 0.55], ["#ffffff40", "#3b82f6", "#ffffff40"]);
  const notch1Shadow = useTransform(scrollYProgress, [0.45, 0.5, 0.55], ["0px 0px 0px transparent", "0px 0px 20px #3b82f6", "0px 0px 0px transparent"]);

  const notch2Color = useTransform(scrollYProgress, [0.75, 0.8, 0.85], ["#ffffff40", "#34d399", "#ffffff40"]);
  const notch2Shadow = useTransform(scrollYProgress, [0.75, 0.8, 0.85], ["0px 0px 0px transparent", "0px 0px 20px #34d399", "0px 0px 0px transparent"]);

  // Scroll-interactive fluid background orbs
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-20vh", "80vh"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["80vh", "-20vh"]);
  const orb1X = useTransform(scrollYProgress, [0, 1], ["-10vw", "40vw"]);
  const orb2X = useTransform(scrollYProgress, [0, 1], ["80vw", "30vw"]);

  return (
    <section ref={containerRef} id="skills" className="relative h-[400vh] w-full z-10 bg-[#0a0a0a]">
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col items-center justify-start">
        
        {/* Themed Background that morphs colors based on the active card */}
        <motion.div style={{ opacity: bgOpacity, backgroundColor: bgColor }} className="absolute inset-0 z-0">
          {/* Scroll-Interactive Background Animation */}
          <motion.div 
            style={{ y: orb1Y, x: orb1X, backgroundColor: activeColor }}
            className="absolute w-[60vw] h-[60vw] rounded-full blur-[160px] opacity-20 mix-blend-screen transition-colors duration-700"
          />
          <motion.div 
            style={{ y: orb2Y, x: orb2X, backgroundColor: activeColor }}
            className="absolute w-[70vw] h-[70vw] rounded-full blur-[150px] opacity-10 mix-blend-screen transition-colors duration-700"
          />
        </motion.div>

        {/* Sequential Letter-by-Letter Heading */}
        <motion.div
          style={{ y: headingY }}
          className="absolute top-0 z-40 flex items-center justify-center w-full pointer-events-none mt-10"
        >
          <SequentialHeading text="Arsenal." scrollYProgress={scrollYProgress} />
        </motion.div>

        <div className="absolute top-[20vh] md:top-[15vh] w-full h-[80vh] flex flex-col md:flex-row items-center justify-center z-20 px-4 md:px-10">
          
          {/* LEFT SIDE: The Mechanical Dial */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative h-[40vh] md:h-full">
            
            {/* The Stationary Container */}
            <div className="relative w-[220px] h-[220px] md:w-[320px] md:h-[320px]">
              
              {/* The Fixed Pointer at 3 o'clock - Color Syncs to Active Card */}
              <motion.div 
                style={{ borderColor: activeColor, boxShadow: activeShadow }}
                className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-8 h-16 border-[3px] rounded-xl z-20 bg-black/80 backdrop-blur-md flex items-center justify-center" 
              >
                <div className="w-1 h-8 bg-white/20 rounded-full" />
              </motion.div>

              {/* The Rotating Dial Ring */}
              <motion.div 
                style={{ rotate: dialRotation }}
                className="absolute inset-0 rounded-full border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center bg-black/40 backdrop-blur-md"
              >
                {/* Dial Track */}
                <div className="absolute inset-6 rounded-full border border-dashed border-white/20" />
                
                {/* Center Hub - Color Syncs to Active Card */}
                <div className="absolute w-12 h-12 bg-white/5 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-xl shadow-inner z-10">
                  <motion.div 
                    style={{ backgroundColor: activeColor, boxShadow: activeShadow }}
                    className="w-3 h-3 rounded-full transition-colors duration-300" 
                  />
                </div>

                {/* Rotating Notch 0 (Backend) - Glows Orange at 3 o'clock */}
                <div className="absolute inset-0 flex items-center justify-end" style={{ transform: "rotate(0deg)" }}>
                  <motion.div 
                    style={{ backgroundColor: notch0Color, boxShadow: notch0Shadow }} 
                    className="w-3 h-10 rounded-l-full translate-x-1/2 z-10" 
                  />
                </div>

                {/* Rotating Notch 1 (Frontend) - Glows Blue at 3 o'clock */}
                <div className="absolute inset-0 flex items-center justify-end" style={{ transform: "rotate(120deg)" }}>
                  <motion.div 
                    style={{ backgroundColor: notch1Color, boxShadow: notch1Shadow }} 
                    className="w-3 h-10 rounded-l-full translate-x-1/2 z-10" 
                  />
                </div>

                {/* Rotating Notch 2 (Tools) - Glows Emerald at 3 o'clock */}
                <div className="absolute inset-0 flex items-center justify-end" style={{ transform: "rotate(240deg)" }}>
                  <motion.div 
                    style={{ backgroundColor: notch2Color, boxShadow: notch2Shadow }} 
                    className="w-3 h-10 rounded-l-full translate-x-1/2 z-10" 
                  />
                </div>
                
              </motion.div>
            </div>
          </div>

          {/* RIGHT SIDE: The Smooth Liquid Glass Cards */}
          <div className="w-full md:w-1/2 h-[40vh] md:h-full relative flex items-center justify-center md:justify-start mt-8 md:mt-0">
            {Object.entries(skillsData).map(([category, skills], index) => (
              <LiquidGlassSkillCard 
                key={category} 
                category={category} 
                skills={skills} 
                index={index} 
                scrollYProgress={scrollYProgress} 
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
