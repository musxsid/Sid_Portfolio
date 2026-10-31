import { useEffect, useRef } from "react";

/**
 * NewsletterBackground: Minimalist Kinetic Grid & Ambient Quanta Spotlight
 * Engineered specifically for the Newsletter section:
 * - Minimal, quiet, luxury obsidian atmosphere (no distracting rolling waves)
 * - Interactive cursor-driven warm amber/coral spotlight with fluid spring inertia
 * - Microscopic architectural crosshairs that subtly illuminate as the cursor passes
 * - Sparse, weightless stardust motes with faint constellation connections
 * - High-DPI Retina support and 60-120 FPS performance
 */
export default function NewsletterBackground() {
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

    // Minimal Ambient Quanta (Just 14 subtle, breathing luminous motes)
    const moteCount = 14;
    const motes = [];
    const moteColors = [
      "rgba(255, 122, 69, 0.65)", // Warm Coral
      "rgba(255, 185, 70, 0.55)", // Amber Gold
      "rgba(255, 255, 255, 0.50)", // Starlight White
    ];

    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.4 + 0.8,
        color: moteColors[i % moteColors.length],
        baseAlpha: Math.random() * 0.35 + 0.2,
        pulseSpeed: 0.015 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Grid spacing for architectural coordinate crosses
    const gridSpacing = 120;
    const crossSize = 3;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse spring inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;

      // ─── 1. Minimal Architectural Crosshair Grid with Interactive Illumination ───
      const cols = Math.ceil(width / gridSpacing);
      const rows = Math.ceil(height / gridSpacing);

      for (let c = 0; c <= cols; c++) {
        const gx = c * gridSpacing;
        for (let r = 0; r <= rows; r++) {
          const gy = r * gridSpacing;

          let crossAlpha = 0.035;

          // Light up crosshairs near cursor
          if (mouse.active && mouse.x > -500) {
            const dx = gx - mouse.x;
            const dy = gy - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              const proximity = 1 - dist / 220;
              crossAlpha += proximity * 0.22;
            }
          }

          ctx.strokeStyle = `rgba(255, 255, 255, ${crossAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(gx - crossSize, gy);
          ctx.lineTo(gx + crossSize, gy);
          ctx.moveTo(gx, gy - crossSize);
          ctx.lineTo(gx, gy + crossSize);
          ctx.stroke();
        }
      }

      // ─── 2. Interactive Soft Ambient Spotlight ───
      if (mouse.active && mouse.x > -500) {
        const spotlight = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          340
        );
        spotlight.addColorStop(0, "rgba(255, 122, 69, 0.07)");
        spotlight.addColorStop(0.4, "rgba(234, 88, 12, 0.025)");
        spotlight.addColorStop(1, "transparent");

        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 340, 0, Math.PI * 2);
        ctx.fill();
      }

      // ─── 3. Minimal Constellation Filaments Between Close Motes ───
      for (let i = 0; i < motes.length; i++) {
        for (let j = i + 1; j < motes.length; j++) {
          const dx = motes[i].x - motes[j].x;
          const dy = motes[i].y - motes[j].y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 110;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.strokeStyle = `rgba(255, 122, 69, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(motes[i].x, motes[i].y);
            ctx.lineTo(motes[j].x, motes[j].y);
            ctx.stroke();
          }
        }
      }

      // ─── 4. Weightless Stardust Quanta ───
      motes.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.phase += m.pulseSpeed;

        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;
        if (m.y < -10) m.y = height + 10;
        if (m.y > height + 10) m.y = -10;

        // Subtle elastic deflection from cursor
        if (mouse.active) {
          const dx = m.x - mouse.x;
          const dy = m.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 1) {
            const force = (1 - dist / 120) * 1.1;
            m.x += (dx / dist) * force;
            m.y += (dy / dist) * force;
          }
        }

        const currentAlpha = m.baseAlpha + Math.sin(m.phase) * 0.15;
        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = Math.max(0.08, Math.min(1, currentAlpha));
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

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
      style={{ opacity: 0.9 }}
    />
  );
}
