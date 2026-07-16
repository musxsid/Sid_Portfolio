import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Server, Monitor, Wrench } from "lucide-react";
import skillsData from "../data/skillsData";
import AnimatedHeading from "./AnimatedHeading";

const categoryMeta = {
  Backend: {
    icon: Server,
    color: "text-accent-warm",
    bg: "bg-accent-warm/10"
  },
  Frontend: {
    icon: Monitor,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  Tools: {
    icon: Wrench,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  }
};

function SkillCategoryCard({ category, skills }) {
  const meta = categoryMeta[category] || categoryMeta.Backend;
  const Icon = meta.icon;

  return (
    <div className="premium-card p-6 md:p-8 w-[280px] md:w-[320px] bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-4 mb-5">
        <div className={`p-3 rounded-xl ${meta.bg}`}>
          <Icon className={`w-6 h-6 ${meta.color}`} />
        </div>
        <h3 className="text-2xl font-black text-white">{category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span 
            key={skill.name} 
            className="px-3 py-1.5 text-[0.8rem] font-bold tracking-wide border border-white/10 bg-white/5 rounded-full text-gray-300"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Snappy direct rotation: wheel spins from 120 to -120 to bring each card to the top
  const rotateZ = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <section id="skills" ref={targetRef} className="relative h-[250vh] z-20 overflow-hidden">
      <div className="sticky top-0 h-screen flex flex-col justify-start pt-24 md:pt-32">
        
        <div className="w-full z-20 px-6 sm:px-12 md:px-24 mb-10 text-center">
          <AnimatedHeading 
            text="Arsenal."
            scrollYProgress={scrollYProgress}
            className="font-display text-5xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-md"
          />
        </div>

        {/* Physical Rotating Wheel Graphic */}
        <div className="absolute top-[40vh] left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] pointer-events-none">
          
          <motion.div 
            style={{ rotateZ }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* The physical glowing wheel ring */}
            <div className="absolute inset-16 rounded-full border-[2px] border-dashed border-white/20 animate-[spin_60s_linear_infinite_reverse]" />
            <div className="absolute inset-12 rounded-full border-[10px] border-white/5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]" />
            <div className="absolute inset-0 rounded-full border-4 border-accent-warm/20 shadow-[0_0_80px_rgba(229,90,40,0.1)]" />

            {/* Inner Hub */}
            <div className="absolute w-24 h-24 rounded-full bg-black border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-accent-warm/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-accent-warm shadow-[0_0_15px_#e55a28]" />
              </div>
            </div>

            {/* Cards orbiting the wheel */}
            {Object.entries(skillsData).map(([category, skills], index) => {
              const offsetAngle = (index - 1) * 120; // -120, 0, 120
              const radius = window.innerWidth < 768 ? 260 : 380; // Distance from center
              
              const angleRad = offsetAngle * (Math.PI / 180);
              const x = Math.sin(angleRad) * radius;
              const y = -Math.cos(angleRad) * radius; // Negative y goes up
              
              // Scale the active card to emphasize it
              const targetRotation = -(index - 1) * 120;
              const scale = useTransform(
                rotateZ,
                [targetRotation - 60, targetRotation, targetRotation + 60],
                [0.7, 1, 0.7]
              );
              const opacity = useTransform(
                rotateZ,
                [targetRotation - 60, targetRotation, targetRotation + 60],
                [0.3, 1, 0.3]
              );

              return (
                <motion.div 
                  key={category}
                  className="absolute pointer-events-auto"
                  style={{ transform: `translate(${x}px, ${y}px)`, scale, opacity }}
                >
                  {/* Counter-rotate the inner card so it stays upright */}
                  <motion.div 
                    style={{ rotateZ: useTransform(rotateZ, r => -r) }}
                    className="flex justify-center items-center origin-center"
                  >
                    <SkillCategoryCard category={category} skills={skills} />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
