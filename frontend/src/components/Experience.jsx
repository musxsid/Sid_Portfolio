import { motion, useInView, useScroll } from "framer-motion";
import { useRef } from "react";
import experienceData from "../data/experienceData";
import AnimatedHeading from "./AnimatedHeading";

function ExperienceCard({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`mb-16 flex flex-col md:flex-row justify-between items-center w-full ${isEven ? "md:flex-row-reverse" : ""}`}>
      {/* Empty space for the alternating layout */}
      <div className="hidden md:block w-[45%]" />
      
      {/* Center dot */}
      <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black border-[3px] border-accent-warm shadow-[0_0_20px_#e55a28] mt-2 md:mt-0">
        <div className="w-2 h-2 bg-accent-warm rounded-full" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 50 : -50, rotateY: isEven ? 10 : -10 }}
        animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        className="w-full pl-16 md:pl-0 md:w-[45%] perspective-container"
      >
        <div className="premium-card p-6 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <p className="text-accent-warm font-bold tracking-widest text-[0.8rem] mb-2 uppercase">
            {item.period}
          </p>
          <h3 className="text-2xl font-black text-white leading-tight mb-1">
            {item.role}
          </h3>
          <p className="text-gray-400 font-semibold mb-4 text-[0.95rem]">{item.company}</p>
          
          <p className="text-gray-300 text-[0.95rem] leading-relaxed mb-5">
            {item.description}
          </p>
          
          <ul className="space-y-3">
            {item.highlights.map((ach, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-400 text-[0.9rem]">
                <span className="text-accent-warm mt-0.5 text-xs">▹</span>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  return (
    <section id="experience" ref={sectionRef} className="py-24 relative z-20">
      <div className="section-container max-w-6xl mx-auto px-4 md:px-6">
        <div className="mb-20 text-center">
          <AnimatedHeading 
            text="Experience."
            scrollYProgress={scrollYProgress}
            className="font-display text-5xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-md"
          />
        </div>

        <div className="relative">
          {/* Vertical center line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

          {experienceData.map((item, index) => (
            <ExperienceCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
