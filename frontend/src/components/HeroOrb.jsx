import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function HeroOrb() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 100, mass: 1.5 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 100, mass: 1.5 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [45, -45]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-45, 45]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none perspective-[1000px] overflow-hidden">
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] transform-style-3d opacity-80"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-warm/40 to-purple-500/40 rounded-full blur-[60px] animate-pulse" />

        <motion.div 
          animate={{ rotateZ: 360, rotateX: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20%] border-[2px] border-white/10 rounded-full"
          style={{ transformStyle: "preserve-3d" }}
        />
        
        <motion.div 
          animate={{ rotateZ: -360, rotateY: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[10%] border-[4px] border-white/20 rounded-full mix-blend-overlay shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          style={{ transformStyle: "preserve-3d" }}
        />

        <motion.div 
          animate={{ translateZ: [50, 150, 50], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-3 h-3 bg-white rounded-full shadow-[0_0_20px_#fff]"
        />
        <motion.div 
          animate={{ translateZ: [-50, -150, -50], scale: [1, 1.5, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[30%] right-[20%] w-4 h-4 bg-accent-warm rounded-full shadow-[0_0_20px_#e55a28]"
        />
      </motion.div>
    </div>
  );
}
