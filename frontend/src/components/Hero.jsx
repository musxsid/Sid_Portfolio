import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Mail } from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";
import Laptop3D from "./Laptop3D";
import HeroOrb from "./HeroOrb";

export default function Hero() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], 
  });

  const textX = useTransform(scrollYProgress, [0, 0.6], ["0vw", "-22vw"]);
  const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.75]);
  
  const orbScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.5]);
  
  const laptopX = useTransform(scrollYProgress, [0, 0.7], ["100vw", "26vw"]);

  const handleScroll = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={containerRef} id="hero" className="relative h-[600vh] w-full z-10 bg-[#0a0a0a]">
      
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex items-center justify-center">
        
        {/* Animated Orb Content */}
        <motion.div
          style={{ scale: orbScale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <HeroOrb />
        </motion.div>

        {/* Animated Text Content */}
        <motion.div
          style={{ x: textX, scale: textScale }}
          className="absolute flex flex-col items-center justify-center text-center origin-center z-10 w-full max-w-5xl px-6"
        >
          <p className="text-[0.85rem] md:text-[1rem] font-bold tracking-[0.4em] uppercase text-gray-400 mb-6 drop-shadow-md">
            Full-Stack Developer
          </p>

          <AnimatedHeading 
            text="Siddharth."
            scrollYProgress={scrollYProgress} 
            className="font-display text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl"
          />

          <p className="font-display text-xl sm:text-3xl md:text-[2.25rem] font-medium text-gray-300 leading-snug max-w-4xl mx-auto mb-16 tracking-tight drop-shadow-md">
            Architecting scalable backend systems.
            <br />
            Building premium frontend experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <motion.a
              href="#projects"
              onClick={(e) => handleScroll(e, "#projects")}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 md:px-12 py-4 md:py-5 rounded-full bg-white text-black font-bold text-[1.05rem] hover:bg-gray-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] pointer-events-auto"
            >
              <span>View Work</span>
              <ArrowDown className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 md:px-12 py-4 md:py-5 rounded-full bg-black/40 text-white font-bold text-[1.05rem] hover:bg-black/60 transition-all duration-300 backdrop-blur-md border border-white/10 pointer-events-auto"
            >
              <Mail className="w-5 h-5" />
              <span>Contact</span>
            </motion.a>
          </div>
        </motion.div>

        {/* 3D Laptop Component */}
        <motion.div
          style={{ x: laptopX }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-[20vh] md:translate-y-[22vh]"
        >
          <Laptop3D scrollYProgress={scrollYProgress} />
        </motion.div>

        {/* Removed global viewport gradient blur completely as it was overlapping the screen and darkening the Explore Experience text */}
      </div>
    </section>
  );
}
