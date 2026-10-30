import { useEffect, useRef } from "react";

/**
 * Minimalist Architectural Kinetic Grid & Refractive Spotlight Canvas
 * Engineered specifically for the "Selected Work" section:
 * - Minimal, uncluttered, luxury obsidian atmosphere
 * - Interactive cursor-driven architectural crosshair illumination
 * - Specular optical glow with smooth fluid inertia
 * - Weightless ambient quanta motes with elastic magnetic deflection
 * - High-DPI Retina support and 60-120 FPS performance
 */
export default function ProjectBackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse coordinates with fluid spring damping
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Activate when cursor is within or near the Projects section
      if (
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80 &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Weightless Ambient Quanta (Just 16 minimal, breathing luminous motes)
    const moteCount = 16;
    const motes = [];
    const moteColors = [
      "rgba(255, 122, 69, 0.75)", // Signature Warm Coral
      "rgba(255, 179, 0, 0.65)",  // Golden Amber
      "rgba(255, 255, 255, 0.60)", // Pure Star White
    ];

    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 1800),
        vx: (Math.random() - 0.5) * 0.28,
        vy: -0.15 - Math.random() * 0.22, // Gentle upward buoyant drift
        radius: Math.random() * 1.5 + 1.0,
        color: moteColors[i % moteColors.length],
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.015,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.085;
        mouse.y += (mouse.targetY - mouse.y) * 0.085;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.05;
        mouse.y += (-1000 - mouse.y) * 0.05;
      }

      const hasMouse = mouse.x > -500 && mouse.y > -500;

      // 1. Soft Specular Optical Caustic Glow (Follows cursor smoothly)
      if (hasMouse) {
        const glowRadius = 380;
        const radialGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        radialGlow.addColorStop(0, "rgba(255, 122, 69, 0.11)");
        radialGlow.addColorStop(0.35, "rgba(255, 179, 0, 0.04)");
        radialGlow.addColorStop(0.7, "rgba(255, 122, 69, 0.012)");
        radialGlow.addColorStop(1, "transparent");

        ctx.fillStyle = radialGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Minimalist Architectural Grid & Interactive Coordinate Crosshairs
      const gridStep = 96; // Spacious architectural blueprint spacing
      const mouseRadius = 260;

      // Draw faint baseline grid points
      const startX = 0;
      const startY = 0;

      for (let x = startX; x < width; x += gridStep) {
        for (let y = startY; y < height; y += gridStep) {
          let alpha = 0.04;
          let armLength = 3;
          let isHovered = false;

          if (hasMouse) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseRadius) {
              const factor = 1 - dist / mouseRadius;
              alpha = 0.04 + factor * 0.45;
              armLength = 3 + factor * 5;
              isHovered = true;
            }
          }

          ctx.beginPath();
          // Horizontal tick of crosshair
          ctx.moveTo(x - armLength, y);
          ctx.lineTo(x + armLength, y);
          // Vertical tick of crosshair
          ctx.moveTo(x, y - armLength);
          ctx.lineTo(x, y + armLength);

          ctx.strokeStyle = isHovered
            ? `rgba(255, 122, 69, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = isHovered ? 1.2 : 0.75;
          ctx.stroke();

          // If close to cursor, draw small radiant center core
          if (isHovered && alpha > 0.22) {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 179, 0, ${alpha * 0.9})`;
            ctx.fill();
          }
        }
      }

      // 3. Subtle Horizon Guideline with Gentle Cursor Deflection
      const horizonY = height * 0.48;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);

      for (let x = 0; x <= width; x += 40) {
        let deflect = 0;
        if (hasMouse) {
          const dx = x - mouse.x;
          const dy = horizonY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const factor = 1 - dist / 220;
            deflect = Math.sin(factor * Math.PI) * 16 * (dy < 0 ? -1 : 1);
          }
        }
        const wave = Math.sin(x * 0.002 + time * 0.8) * 4;
        ctx.lineTo(x, horizonY + wave + deflect);
      }

      ctx.strokeStyle = "rgba(255, 122, 69, 0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 4. Weightless Ambient Quanta with Fluid Repulsion
      motes.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;

        // Wrap around seamlessly
        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;
        if (m.y < 0) m.y = height;
        if (m.y > height) m.y = 0;

        // Interactive elastic repulsion from cursor
        if (hasMouse) {
          const dx = mouse.x - m.x;
          const dy = mouse.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (1 - dist / 140) * 2.2;
            m.x -= (dx / dist) * force;
            m.y -= (dy / dist) * force;
          }
        }

        // Draw ambient glowing mote
        const pulse = 0.35 + 0.65 * Math.sin(time * 2 + m.pulseOffset);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.globalAlpha = pulse;
        ctx.fill();

        // Subtle halo for motes near cursor
        if (hasMouse) {
          const dx = mouse.x - m.x;
          const dy = mouse.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const auraAlpha = (1 - dist / 180) * 0.25;
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 122, 69, ${auraAlpha})`;
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
