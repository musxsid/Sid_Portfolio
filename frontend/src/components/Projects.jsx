import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import projectsData from "../data/projectsData";
import AnimatedHeading from "./AnimatedHeading";

function ProjectCard({ project, index, scrollYProgress }) {
  const start = 0.15 + (index * 0.21);
  const enter = start + 0.08;
  const exit = start + 0.14;
  const end = index === 3 ? 1.0 : start + 0.22;

  const sStart = Math.max(0, start);
  const sEnter = Math.max(0, Math.min(1, enter));
  const sExit = Math.max(0, Math.min(1, exit));
  const sEnd = Math.min(1, end);

  const x = useTransform(
    scrollYProgress,
    [sStart, sEnter, sExit, sEnd],
    ["-80vw", "0vw", "0vw", "80vw"]
  );

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
      className="absolute inset-0 flex items-center justify-center px-4 md:px-0 w-full"
    >
      <div className="premium-card flex flex-col h-[65vh] w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden group">

        <div className="w-full h-[50%] relative overflow-hidden bg-[#050505] border-b border-white/10">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
        </div>

        <div className="p-6 md:p-8 flex flex-col flex-grow relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <h3 className="text-3xl md:text-4xl font-black text-white mb-2 relative z-10">{project.title}</h3>
          <p className="text-accent-warm font-bold text-[1.1rem] mb-4 relative z-10">{project.tagline}</p>
          <p className="text-gray-300 text-[1.05rem] leading-relaxed mb-6 flex-grow relative z-10 max-w-3xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto relative z-10">
            {project.techStack.map((tech) => (
              <span key={tech} className="px-4 py-2 text-[0.8rem] font-bold tracking-wider uppercase border border-white/20 rounded-full text-gray-300 bg-black/30 backdrop-blur-md">
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default function Projects() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.15], ["45vh", "10vh"]);
  const headingScale = useTransform(scrollYProgress, [0, 0.15], [2, 0.55]);

  const bgOpacity = useTransform(scrollYProgress, [0, 0.15, 0.9, 1.0], [0, 1, 1, 0]);

  // Scroll-Interactive Fluid Mesh Coordinates
  // As the user scrolls, these massive liquid colors sweep dynamically across the screen
  const blob1X = useTransform(scrollYProgress, [0, 1], ["-30vw", "50vw"]);
  const blob1Y = useTransform(scrollYProgress, [0, 1], ["-20vh", "80vh"]);
  
  const blob2X = useTransform(scrollYProgress, [0, 1], ["60vw", "-40vw"]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ["80vh", "-20vh"]);
  
  const blob3Y = useTransform(scrollYProgress, [0, 1], ["-40vh", "100vh"]);
  const blob3Scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.5]);

  const blob4X = useTransform(scrollYProgress, [0, 1], ["20vw", "-60vw"]);
  const blob4Scale = useTransform(scrollYProgress, [0, 1], [1.5, 0.8]);

  return (
    <section ref={containerRef} id="projects" className="relative h-[600vh] w-full z-10 bg-[#0a0a0a]">
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col items-center justify-start">

        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 z-0 bg-[#070b14]"
        >
          {/* Dynamic, Scroll-Interactive Premium Fluid Mesh */}
          {/* Massive organic shapes that constantly rotate (live animation) AND sweep across the screen on scroll! */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-70">
            
            {/* Deep Blue Fluid */}
            <motion.div
              style={{ x: blob1X, y: blob1Y }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-blue-600/30 rounded-[40%_60%_70%_30%] blur-[160px]"
            />
            
            {/* Warm Accent Fluid */}
            <motion.div
              style={{ x: blob2X, y: blob2Y }}
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-[70vw] h-[70vw] bg-accent-warm/20 rounded-[60%_40%_30%_70%] blur-[160px]"
            />
            
            {/* Emerald Fluid */}
            <motion.div
              style={{ y: blob3Y, scale: blob3Scale }}
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-[-10vw] w-[90vw] h-[90vw] bg-emerald-600/20 rounded-[50%_50%_60%_40%] blur-[160px]"
            />
            
            {/* Indigo Fluid */}
            <motion.div
              style={{ x: blob4X, scale: blob4Scale }}
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-20vh] right-0 w-[100vw] h-[100vw] bg-indigo-600/20 rounded-[40%_60%_50%_50%] blur-[160px]"
            />

          </div>
        </motion.div>

        <motion.div
          style={{ y: headingY, scale: headingScale }}
          className="absolute top-0 z-40 flex items-center justify-center w-full pointer-events-none"
        >
          <AnimatedHeading
            text="Selected Work."
            scrollYProgress={scrollYProgress}
            className="font-display text-[4rem] sm:text-[5rem] md:text-[7rem] font-black tracking-tighter drop-shadow-2xl whitespace-nowrap"
          />
        </motion.div>

        {/* Pushed further down to provide maximum clearance for the heading to sit perfectly in your red box */}
        <div className="absolute top-[34vh] md:top-[32vh] w-full h-[60vh] flex items-center justify-center z-20">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
