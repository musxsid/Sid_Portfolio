import { motion, useTransform } from "framer-motion";
import { Globe, ShieldCheck, Database, ChevronDown } from "lucide-react";

export default function Laptop3D({ scrollYProgress }) {
  // Laptop opens early in the scroll
  const screenRotateX = useTransform(scrollYProgress, [0.1, 0.35], [-90, -5]);
  
  // Angle kept at 15deg so keyboard remains visible
  const laptopRotateY = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const laptopRotateX = useTransform(scrollYProgress, [0, 1], [40, 15]);
  const laptopScale = useTransform(scrollYProgress, [0, 1], [0.6, 0.85]);
  
  // Screen turns on ONLY AFTER it completely faces the user (0.35). Explicit clamps added.
  const screenGlow = useTransform(scrollYProgress, [0.35, 0.4, 1, 1], [0, 1, 1, 1]);

  // Slides pop in sequentially, completely separated to prevent overlap
  // With the massive 600vh scroll height, these are now beautifully slow and readable!
  // Slide 1: Web Development
  const slide1Opacity = useTransform(scrollYProgress, [0.35, 0.40, 0.48, 0.52], [0, 1, 1, 0]);
  const slide1Scale = useTransform(scrollYProgress, [0.35, 0.40, 0.52], [0.85, 1, 0.85]);

  // Slide 2: Security
  const slide2Opacity = useTransform(scrollYProgress, [0.55, 0.60, 0.68, 0.72], [0, 1, 1, 0]);
  const slide2Scale = useTransform(scrollYProgress, [0.55, 0.60, 0.72], [0.85, 1, 0.85]);

  // Slide 3: Scalability 
  const slide3Opacity = useTransform(scrollYProgress, [0.75, 0.80, 0.86, 0.90], [0, 1, 1, 0]);
  const slide3Scale = useTransform(scrollYProgress, [0.75, 0.80, 0.90], [0.85, 1, 0.85]);

  // Slide 4: Redirect Downward - Explicitly clamped to stay 1 indefinitely!
  const slide4Opacity = useTransform(scrollYProgress, [0.91, 0.94, 1, 1], [0, 1, 1, 1]);
  const slide4Scale = useTransform(scrollYProgress, [0.91, 0.94, 1, 1], [0.85, 1, 1, 1]);

  return (
    <div className="perspective-[2500px] w-full max-w-[700px] md:max-w-[900px] flex items-center justify-center relative z-20">
      
      {/* THE HINGE AXIS */}
      <motion.div 
        style={{ rotateY: laptopRotateY, rotateX: laptopRotateX, scale: laptopScale }}
        className="relative w-full h-0 transform-style-3d origin-center flex justify-center"
      >
        
        {/* LAPTOP BASE - Mask image added here directly so ONLY the keyboard fades into the background, never the screen */}
        <div 
          className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-[#2a2a2a] to-[#111] rounded-b-2xl border border-[#444] origin-top transform-style-3d flex flex-col items-center justify-start p-4 md:p-8 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
          style={{ transform: "rotateX(-90deg)" }}
        >
          <div className="absolute inset-0 bg-black/50 blur-3xl transform translate-z-[-20px]" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-4 bg-[#0a0a0a] rounded-b-md border-b border-[#222] shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)]" />

          {/* Speaker Grills */}
          <div className="absolute top-12 left-4 w-6 h-[250px] flex flex-col gap-[2px] opacity-20">
            {Array.from({ length: 70 }).map((_, i) => <div key={`l-${i}`} className="w-full h-[1px] bg-black" />)}
          </div>
          <div className="absolute top-12 right-4 w-6 h-[250px] flex flex-col gap-[2px] opacity-20">
            {Array.from({ length: 70 }).map((_, i) => <div key={`r-${i}`} className="w-full h-[1px] bg-black" />)}
          </div>

          {/* Keyboard Deck */}
          <div className="w-full max-w-[80%] h-[60%] bg-[#0f0f0f] rounded-md grid grid-cols-12 gap-1 md:gap-1.5 p-2 border border-[#050505] shadow-[inset_0_5px_15px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] mt-6">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="bg-gradient-to-b from-[#333] to-[#1a1a1a] rounded-[2px] md:rounded-sm shadow-[0_2px_2px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]" />
            ))}
          </div>

          {/* Trackpad */}
          <div className="w-[40%] h-[25%] bg-[#151515] mt-6 rounded-md border border-[#050505] shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center relative">
            <div className="absolute top-0 w-16 h-1 bg-black/40 rounded-full" />
          </div>

          <div className="absolute bottom-0 left-0 w-full h-5 bg-gradient-to-r from-[#111] via-[#333] to-[#111] rounded-b-2xl transform-style-3d origin-bottom border-b border-[#444]" style={{ transform: "rotateX(90deg)" }} />
        </div>

        {/* LAPTOP SCREEN (Lid) */}
        <motion.div 
          style={{ rotateX: screenRotateX }}
          className="absolute bottom-0 left-0 w-full h-[600px] bg-gradient-to-t from-[#0a0a0a] to-[#1a1a1a] rounded-t-2xl rounded-b-sm border-2 border-[#333] border-b-[#000] origin-bottom overflow-hidden shadow-[0_-20px_50px_rgba(255,255,255,0.05)] flex flex-col transform-style-3d"
        >
          <div className="absolute inset-0 border border-[#000] rounded-t-2xl pointer-events-none" />

          {/* Webcam Module */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 z-30">
            <div className="w-1 h-1 rounded-full bg-[#050505] shadow-[inset_0_1px_1px_rgba(0,0,0,1)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#000] border border-[#1a1a1a] flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="w-1 h-1 rounded-full bg-accent-warm/30 blur-[0.5px]" />
              <motion.div style={{ opacity: screenGlow }} className="absolute top-[1px] right-[1px] w-[2px] h-[2px] rounded-full bg-accent-warm/80 animate-pulse" />
            </div>
            <div className="w-1 h-1 rounded-full bg-[#050505] shadow-[inset_0_1px_1px_rgba(0,0,0,1)]" />
          </div>

          {/* Screen Inner Bezel */}
          <div className="flex-grow mx-2 mb-2 mt-6 md:mx-3 md:mb-3 md:mt-8 bg-[#050505] rounded-t-md relative overflow-hidden border border-[#111] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
            
            {/* Screen Content Wrapper */}
            <motion.div style={{ opacity: screenGlow }} className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-warm/5 to-accent-warm/20 flex items-center justify-center">
              
              {/* Slide 1 */}
              <motion.div 
                style={{ opacity: slide1Opacity, scale: slide1Scale, pointerEvents: "none" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
              >
                <Globe className="w-20 h-20 text-accent-warm mb-6 drop-shadow-[0_0_20px_rgba(255,122,69,0.6)]" />
                <h3 className="font-display text-4xl font-bold text-white mb-3">Web Architecture</h3>
                <p className="text-gray-400 font-sans text-xl font-light">Building premium frontend experiences.</p>
              </motion.div>

              {/* Slide 2 */}
              <motion.div 
                style={{ opacity: slide2Opacity, scale: slide2Scale, pointerEvents: "none" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
              >
                <ShieldCheck className="w-20 h-20 text-accent-warm mb-6 drop-shadow-[0_0_20px_rgba(255,122,69,0.6)]" />
                <h3 className="font-display text-4xl font-bold text-white mb-3">Enterprise Security</h3>
                <p className="text-gray-400 font-sans text-xl font-light">Configuring advanced authentication.</p>
              </motion.div>

              {/* Slide 3 */}
              <motion.div 
                style={{ opacity: slide3Opacity, scale: slide3Scale, pointerEvents: "none" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
              >
                <Database className="w-20 h-20 text-accent-warm mb-6 drop-shadow-[0_0_20px_rgba(255,122,69,0.6)]" />
                <h3 className="font-display text-4xl font-bold text-white mb-3">Infinite Scalability</h3>
                <p className="text-gray-400 font-sans text-xl font-light">Architecting distributed databases.</p>
              </motion.div>

              {/* Slide 4 - Redirect Downward */}
              <motion.div 
                style={{ opacity: slide4Opacity, scale: slide4Scale, pointerEvents: "none" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
              >
                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="mb-6"
                >
                  <ChevronDown className="w-20 h-20 text-accent-warm drop-shadow-[0_0_20px_rgba(255,107,53,0.6)]" />
                </motion.div>
                <h3 className="font-display text-4xl font-bold text-white mb-3">Explore Experience</h3>
                <p className="text-gray-400 font-sans text-xl font-light">Scroll down to continue.</p>
              </motion.div>

            </motion.div>
          </div>
          
          <div className="h-6 md:h-8 w-full flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
             <div className="w-24 h-1 bg-white/5 rounded-full" />
          </div>

        </motion.div>

      </motion.div>

    </div>
  );
}
