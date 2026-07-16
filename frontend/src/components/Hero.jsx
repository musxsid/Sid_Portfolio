import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Mail } from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";
import HeroOrb from "./HeroOrb";

export default function Hero() {
  const ref = useRef(null);
  
  // Track scroll specifically for the Hero section (raw scroll progress, no delay)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Snappy, direct transforms based on scroll
  // The heading moves to the top left and scales down dynamically
  const headingX = useTransform(scrollYProgress, [0, 1], ["0vw", "-35vw"]);
  const headingY = useTransform(scrollYProgress, [0, 1], ["0vh", "-40vh"]);
  const headingScale = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  // Other elements fade and push back instantly without spring lag
  const otherY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const otherOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleScroll = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-24"
    >
      <HeroOrb />

      <div className="relative z-10 text-center w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        <motion.p
          style={{ y: otherY, opacity: otherOpacity }}
          className="text-[0.85rem] font-bold tracking-[0.4em] uppercase text-gray-400 mb-6"
        >
          Full-Stack Developer
        </motion.p>

        {/* Dynamic Heading that transforms to top-left on scroll */}
        <motion.div style={{ x: headingX, y: headingY, scale: headingScale }} className="origin-center lg:origin-left z-50">
          <AnimatedHeading 
            text="Siddharth."
            scrollYProgress={scrollYProgress}
            className="font-display text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl pointer-events-none"
          />
        </motion.div>

        <motion.p
          style={{ y: otherY, opacity: otherOpacity }}
          className="font-display text-xl sm:text-3xl md:text-[2.25rem] font-medium text-gray-300 leading-snug max-w-4xl mx-auto mb-16 tracking-tight drop-shadow-md pointer-events-none"
        >
          Architecting scalable backend systems.
          <br />
          Building premium frontend experiences.
        </motion.p>

        <motion.div
          style={{ y: otherY, opacity: otherOpacity }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
        >
          <motion.a
            href="#projects"
            onClick={(e) => handleScroll(e, "#projects")}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-white text-black font-bold text-[1.05rem] hover:bg-gray-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] relative z-20"
          >
            <span>View Work</span>
            <ArrowDown className="w-5 h-5" />
          </motion.a>

          <motion.a
            href="#contact"
            onClick={(e) => handleScroll(e, "#contact")}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-black/40 text-white font-bold text-[1.05rem] hover:bg-black/60 transition-all duration-300 backdrop-blur-md border border-white/10 relative z-20"
          >
            <Mail className="w-5 h-5" />
            <span>Contact</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
