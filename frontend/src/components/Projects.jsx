import { motion, useInView, useScroll } from "framer-motion";
import { useRef } from "react";
import projectsData from "../data/projectsData";
import AnimatedHeading from "./AnimatedHeading";

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 2) * 0.2, ease: "easeOut" }}
      className="premium-card flex flex-col h-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden group cursor-pointer"
    >
      <div className="w-full h-48 md:h-64 relative overflow-hidden bg-[#111]">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{project.title}</h3>
        <p className="text-accent-warm font-bold text-[0.9rem] mb-4">{project.tagline}</p>
        <p className="text-gray-300 text-[0.95rem] leading-relaxed mb-6 flex-grow">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.techStack.map((tech) => (
            <span key={tech} className="px-3 py-1 text-[0.75rem] font-bold tracking-wider uppercase border border-white/20 rounded-full text-gray-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  return (
    <section id="projects" ref={sectionRef} className="py-24 relative z-20">
      <div className="section-container max-w-6xl mx-auto px-6">
        <div className="mb-20 text-center">
          <AnimatedHeading 
            text="Selected Work."
            scrollYProgress={scrollYProgress}
            className="font-display text-5xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
