import { motion, useTransform } from "framer-motion";

function AnimatedLetter({ letter, index, total, scrollYProgress }) {
  // We want the color shifting to finish by the time the user scrolls halfway down the section
  const start = (index / total) * 0.4;
  const end = start + 0.15;
  
  const color = useTransform(
    scrollYProgress,
    [start, end],
    ["#ffffff", "#e55a28"] // White to Warm Accent Orange
  );

  return <motion.span style={{ color }}>{letter}</motion.span>;
}

export default function AnimatedHeading({ text, scrollYProgress, className }) {
  // Strip the trailing period if it exists to animate it separately with a different color if desired
  const hasPeriod = text.endsWith(".");
  const cleanText = hasPeriod ? text.slice(0, -1) : text;
  const nameArray = Array.from(cleanText);

  return (
    <motion.h2 className={className}>
      {nameArray.map((letter, i) => (
        <AnimatedLetter 
          key={i} 
          letter={letter} 
          index={i} 
          total={nameArray.length} 
          scrollYProgress={scrollYProgress} 
        />
      ))}
      {hasPeriod && (
        <motion.span 
          style={{ 
            color: useTransform(scrollYProgress, [0.4, 0.55], ["#e55a28", "#ffffff"]) 
          }}
        >
          .
        </motion.span>
      )}
    </motion.h2>
  );
}
