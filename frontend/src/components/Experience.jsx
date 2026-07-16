import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import experienceData from "../data/experienceData";

function TimelineCard({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <div className="premium-card p-10 sm:p-14 lg:p-16 flex flex-col gap-10 bg-white hover:bg-[#fafafc] transition-colors duration-500 relative z-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-light/50 pb-8">
          <div>
            <div className="mb-4">
              {item.type === "current" && (
                <span className="inline-flex items-center gap-2 text-text-primary text-[0.85rem] font-bold tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Current
                </span>
              )}
              {item.type === "past" && (
                <span className="inline-flex items-center gap-2 text-text-muted text-[0.85rem] font-bold tracking-widest uppercase">
                  Past
                </span>
              )}
            </div>

            <h3 className="font-display text-3xl sm:text-[2.25rem] font-black tracking-tight text-text-primary leading-tight">
              {item.role}
            </h3>
          </div>
          
          <div className="flex flex-col sm:items-end text-left sm:text-right">
            <span className="text-[1.2rem] font-bold text-accent-warm mb-1">
              {item.company}
            </span>
            <span className="text-[1rem] font-medium text-text-muted">
              {item.period}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/3">
            <p className="text-text-primary text-[1.1rem] leading-[1.7] font-medium">
              {item.description}
            </p>
          </div>
          
          <div className="lg:w-2/3 space-y-5">
            {item.highlights.map((highlight, i) => (
              <div
                key={i}
                className="flex items-start gap-4 text-[1.05rem] text-text-secondary leading-relaxed"
              >
                <div className="mt-[12px] w-[6px] h-[6px] rounded-full bg-text-light flex-shrink-0" />
                <span className="font-medium text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  return (
    <section id="experience" className="relative py-32 sm:py-40 lg:py-48 bg-white">
      <div className="section-container relative z-10 flex flex-col items-center">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 lg:mb-32 text-center w-full max-w-3xl"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-none mb-8">
            Experience.
          </h2>
          <p className="text-text-secondary text-[1.2rem] font-medium">
            Building robust systems for high-growth environments.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12 w-full max-w-5xl">
          {experienceData.map((item, index) => (
            <TimelineCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
