import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Server, Monitor, Wrench } from "lucide-react";
import skillsData from "../data/skillsData";

const categoryMeta = {
  Backend: {
    icon: Server,
  },
  Frontend: {
    icon: Monitor,
  },
  Tools: {
    icon: Wrench,
  },
};

function SkillCategory({ category, skills, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = categoryMeta[category].icon;

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
      className="flex"
    >
      <div className="premium-card p-10 sm:p-14 w-full flex flex-col items-start bg-white group hover:bg-[#fafafc] transition-colors duration-500">
        
        {/* Category Header */}
        <div className="flex flex-col items-start mb-10">
          <div className="w-16 h-16 rounded-2xl bg-bg-warm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out">
            <Icon className="w-8 h-8 text-text-primary" />
          </div>
          <h3 className="font-display text-[2rem] font-black tracking-tight text-text-primary">
            {category}
          </h3>
        </div>

        {/* Skill Pills */}
        <div className="flex flex-wrap gap-3 mt-auto w-full">
          {skills.map((skill, i) => (
            <motion.span
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.15 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-5 py-2.5 rounded-full text-[0.9rem] font-bold tracking-wide border border-border-warm text-text-primary bg-white shadow-sm hover:shadow-md cursor-default transition-all duration-300"
            >
              {skill.name}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  return (
    <section id="skills" className="relative py-32 sm:py-40 lg:py-48 bg-white">
      <div className="section-container relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 lg:mb-32 text-center w-full max-w-3xl"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-none mb-8">
            Expertise.
          </h2>
          <p className="text-text-secondary text-[1.2rem] font-medium">
            The tools and technologies I use to build premium experiences.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch w-full max-w-6xl">
          {Object.entries(skillsData).map(([category, skills], index) => (
            <SkillCategory
              key={category}
              category={category}
              skills={skills}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
