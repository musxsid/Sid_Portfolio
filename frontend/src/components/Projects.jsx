import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import projectsData from "../data/projectsData";

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1.2,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full"
    >
      <div className="premium-card w-full flex flex-col group cursor-pointer relative bg-white">
        
        {/* Project Image - Massive and Edge-to-Edge */}
        <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-[#f5f5f7] relative overflow-hidden">
          <img 
            src={`https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop`} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </div>

        {/* Content Section - Massive Padding */}
        <div className="p-10 sm:p-16 lg:p-20 flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div className="lg:w-1/2">
            <p className="text-[0.9rem] font-bold tracking-[0.2em] uppercase text-text-muted mb-4">
              {project.tagline}
            </p>
            <h3 className="font-display text-[2.5rem] sm:text-[3.5rem] font-black tracking-tight text-text-primary leading-none mb-6">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-3 mt-8">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-5 py-2 rounded-full text-[0.85rem] font-bold tracking-wide border border-border-warm text-text-primary bg-bg-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col justify-center">
            <p className="text-text-primary text-[1.2rem] leading-[1.7] mb-10 font-medium">
              {project.description}
            </p>

            <ul className="space-y-5">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 text-[1.05rem] text-text-secondary leading-relaxed"
                >
                  <div className="mt-[12px] w-[6px] h-[6px] rounded-full bg-accent-warm flex-shrink-0" />
                  <span className="font-medium">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  return (
    <section id="projects" className="relative py-32 sm:py-40 lg:py-48 bg-bg-warm">
      <div className="section-container relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 lg:mb-32 w-full max-w-3xl"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-none mb-8">
            Selected Work.
          </h2>
          <p className="text-text-secondary text-[1.2rem] font-medium max-w-2xl mx-auto">
            Thoughtfully engineered systems built with modern tools and clean architecture.
          </p>
        </motion.div>

        {/* Project Cards - Single Column, Massive Impact */}
        <div className="flex flex-col gap-16 lg:gap-24 w-full max-w-6xl">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
