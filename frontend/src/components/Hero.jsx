import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Mail } from "lucide-react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

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
      {/* Cinematic Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-warm-peach/40 via-warm-blush/30 to-warm-sage/40 blur-[120px] rounded-full opacity-60 mix-blend-multiply" />
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center w-full max-w-5xl mx-auto px-6 flex flex-col items-center"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[0.8rem] font-bold tracking-[0.35em] uppercase text-text-secondary mb-10"
        >
          Backend-Focused Full-Stack Developer
        </motion.p>

        {/* Main Heading - Apple Style Massive Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[9.5rem] font-black tracking-tighter leading-[0.85] text-text-primary mb-10"
        >
          Siddharth<span className="text-accent-warm">.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-xl sm:text-3xl md:text-[2.25rem] font-medium text-text-secondary leading-snug max-w-4xl mx-auto mb-16 tracking-tight"
        >
          Architecting scalable backend systems.
          <br />
          Building premium full-stack experiences.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
        >
          <motion.a
            href="#projects"
            onClick={(e) => handleScroll(e, "#projects")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-text-primary text-white font-semibold text-[1.05rem] hover:bg-accent-soft transition-all duration-300 shadow-xl shadow-black/10"
          >
            <span>View Work</span>
            <ArrowDown className="w-5 h-5" />
          </motion.a>

          <motion.a
            href="#contact"
            onClick={(e) => handleScroll(e, "#contact")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-black/5 text-text-primary font-semibold text-[1.05rem] hover:bg-black/10 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            <span>Contact</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
