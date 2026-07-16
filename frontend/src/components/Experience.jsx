import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import experienceData from "../data/experienceData";

function ExperienceCard({ item, scrollYProgress, index }) {
  const isFirst = index === 0;
  
  const enterStart = isFirst ? 0.2 : 0.55;
  const enterEnd = isFirst ? 0.3 : 0.65;
  const exitStart = isFirst ? 0.45 : 0.95; 
  const exitEnd = isFirst ? 0.55 : 1.0;

  const opacity = useTransform(
    scrollYProgress,
    [enterStart - 0.05, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["30vh", "0vh", "0vh", "-30vh"]
  );

  const scale = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0.8, 1, 1, 0.8]
  );

  const dotOpacity = useTransform(
    scrollYProgress,
    [enterStart, enterEnd],
    [0, 1]
  );
  
  const dotScale = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: "none" }}
      className="absolute inset-0 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto px-4 z-20 pt-20"
    >
      {/* Timeline Checkpoint Dot */}
      <motion.div 
        style={{ opacity: dotOpacity, scale: dotScale }}
        className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black border-[3px] border-accent-warm shadow-[0_0_20px_#e55a28] z-30"
      >
        <div className="w-2 h-2 bg-accent-warm rounded-full" />
      </motion.div>

      {/* Card Content */}
      <div className={`w-full pl-16 md:pl-0 md:w-[45%] ${index % 2 === 0 ? "md:mr-[50%]" : "md:ml-[50%]"} perspective-container pointer-events-auto`}>
        <div className={`premium-card p-6 md:p-8 bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative overflow-hidden ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}>
          
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <p className="text-accent-warm font-bold tracking-widest text-[0.8rem] mb-2 uppercase relative z-10">
            {item.period}
          </p>
          <h3 className="text-2xl font-black text-white leading-tight mb-1 relative z-10">
            {item.role}
          </h3>
          <p className="text-gray-400 font-semibold mb-4 text-[0.95rem] relative z-10">{item.company}</p>
          
          <p className="text-gray-300 text-[0.95rem] leading-relaxed mb-5 relative z-10">
            {item.description}
          </p>
          
          <ul className="space-y-3 relative z-10">
            {item.highlights.map((ach, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-400 text-[0.9rem]">
                <span className="text-accent-warm mt-0.5 text-xs">▹</span>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], 
  });

  const headingY = useTransform(scrollYProgress, [0, 0.15], ["45vh", "8vh"]);
  const headingScale = useTransform(scrollYProgress, [0, 0.15], [2, 1]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const lineHeight = useTransform(scrollYProgress, [0.15, 0.9], ["0%", "85%"]);
  const lineOpacity = useTransform(scrollYProgress, [0.15, 0.2], [0, 1]);

  return (
    <section ref={containerRef} id="experience" className="relative h-[400vh] w-full z-10 bg-[#0a0a0a]">
      
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col items-center justify-start">
        
        {/* Independently Animated Background - Developer Grid Theme */}
        {/* The linear-gradient mask ensures the top and bottom 15% of the screen are PURE BLACK, creating a perfectly blended transition with the Hero section */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]">
          
          {/* Subtle slow-moving architectural grid that loops infinitely */}
          <motion.div 
            animate={{ y: [0, 40] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-50%] w-[200%] h-[200%] bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"
          />

          {/* Very faint glowing accents to give it depth */}
          <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-accent-warm/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Dynamic Heading */}
        <motion.div
          style={{ y: headingY, scale: headingScale, opacity: headingOpacity }}
          className="absolute top-0 z-40 flex items-center justify-center w-full"
        >
          <h2 className="font-display text-[4rem] sm:text-[5rem] md:text-[7rem] font-black tracking-tighter text-white drop-shadow-2xl">
            Experience<span className="text-accent-warm">.</span>
          </h2>
        </motion.div>

        {/* The Vertical Timeline Line */}
        <motion.div 
          style={{ height: lineHeight, opacity: lineOpacity }}
          className="absolute top-[15vh] md:top-[18vh] left-[20px] md:left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-accent-warm via-white/20 to-transparent z-10"
        />

        {/* Experience Cards */}
        {experienceData.map((item, index) => (
          <ExperienceCard 
            key={item.id} 
            item={item} 
            scrollYProgress={scrollYProgress} 
            index={index} 
          />
        ))}

      </div>
    </section>
  );
}
