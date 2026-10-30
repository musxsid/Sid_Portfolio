import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const isHoveringRef = useRef(false);
  const isIdleRef = useRef(false);
  const idleTimeoutRef = useRef(null);
  
  // Motion values for smooth physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const size = useMotionValue(16);
  const backgroundColor = useMotionValue("rgba(229, 90, 40, 1)");
  const border = useMotionValue("0px solid rgba(229, 90, 40, 0)");

  // Springs for buttery smooth movement and scaling
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const smoothSize = useSpring(size, { damping: 30, stiffness: 300 });

  useEffect(() => {
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    const handleResize = () => {
      centerX = window.innerWidth / 2;
      centerY = window.innerHeight / 2;
      maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    };

    window.addEventListener("resize", handleResize);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);

      // Handle Idle Timeout
      isIdleRef.current = false;
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      
      idleTimeoutRef.current = setTimeout(() => {
        isIdleRef.current = true;
        // Automatically shrink the massive center bubble if left idle
        if (!isHoveringRef.current) {
          size.set(16);
        }
      }, 2000);

      // Disable custom cursor completely over chatbot
      if (e.target.closest('.chatbot-container')) {
        if (isVisible) setIsVisible(false);
        return;
      }

      // If hovering a button, lock it to the interactive state
      if (isHoveringRef.current) {
        size.set(48);
        backgroundColor.set("rgba(229, 90, 40, 0.2)");
        border.set("2px solid rgba(229, 90, 40, 0.8)");
        return;
      }


      // Calculate distance to center
      const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
      const normalizedDist = Math.min(dist / maxDist, 1);
      
      // Proximity: 1 is perfectly in center, 0 is touching the exact corners
      const proximity = 1 - normalizedDist; 
      
      // Exponential scaling: Base size 16px, scales up to massive 1000px at absolute center
      // Reduce the dynamic scaling massively if not on the first page (Hero)
      const isFirstPage = window.scrollY < window.innerHeight;
      const maxDynamicSize = isFirstPage ? 1000 : 150; 
      const dynamicSize = 16 + (maxDynamicSize * Math.pow(proximity, 2)); 
      
      size.set(dynamicSize);
      backgroundColor.set("rgba(229, 90, 40, 1)");
      border.set("0px solid rgba(229, 90, 40, 0)");
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('form')
      ) {
        isHoveringRef.current = true;
      } else {
        isHoveringRef.current = false;
      }
      moveCursor(e); 
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, size, backgroundColor, border, isVisible]);

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
        width: smoothSize,
        height: smoothSize,
        backgroundColor: backgroundColor,
        border: border,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}
