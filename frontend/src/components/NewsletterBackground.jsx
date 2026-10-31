import { useEffect, useRef } from "react";

/**
 * NewsletterBackground: Minimalist Celestial Grid & Refractive Ambient Horizon
 * Engineered specifically for the full-screen Newsletter section:
 * - 100% wave-free: clean, dark luxury obsidian atmosphere
 * - Interactive cursor-driven warm coral & amber optical caustic glow
 * - Architectural blueprint crosshairs that dynamically illuminate and expand near cursor
 * - Weightless stardust quanta with delicate constellation connections and elastic deflection
 * - Retina DPR support and silky-smooth 60-120 FPS performance
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
        e.clientY >= rect.top - 100 &&
        e.clientY <= rect.bottom + 100 &&
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

    // Weightless Ambient Quanta Motes (Sparse, breathing, luxury)
    const moteCount = 18;
    const motes = [];
    const moteColors = [
      "rgba(255, 122, 69, 0.70)", // Warm Coral
      "rgba(255, 185, 70, 0.60)", // Amber Gold
      "rgba(255, 255, 255, 0.55)", // Starlight White
    ];

    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * (width || 1400),
        y: Math.random() * (height || 900),
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.5 + 0.8,
        color: moteColors[i % moteColors.length],
        baseAlpha: Math.random() * 0.4 + 0.25,
        pulseSpeed: 0.018 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Grid configuration for minimal architectural crosshairs
    const gridStep = 110;
    const mouseRadius = 260;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth fluid spring damping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const hasMouse = mouse.active && mouse.x > -500;

      // ─── 1. Soft Specular Optical Caustic Glow (Follows cursor smoothly) ───
      if (hasMouse) {
        const glowRadius = 400;
        const radialGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        radialGlow.addColorStop(0, "rgba(255, 122, 69, 0.09)");
        radialGlow.addColorStop(0.35, "rgba(255, 185, 70, 0.035)");
        radialGlow.addColorStop(0.7, "rgba(255, 122, 69, 0.01)");
        radialGlow.addColorStop(1, "transparent");

        ctx.fillStyle = radialGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // ─── 2. Minimalist Architectural Crosshair Grid ───
      const cols = Math.ceil(width / gridStep);
      const rows = Math.ceil(height / gridStep);

      for (let c = 0; c <= cols; c++) {
        const gx = c * gridStep;
        for (let r = 0; r <= rows; r++) {
          const gy = r * gridStep;

          let alpha = 0.035;
          let armLength = 3;
          let isNear = false;

          if (hasMouse) {
            const dx = gx - mouse.x;
            const dy = gy - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseRadius) {
              const factor = 1 - dist / mouseRadius;
              alpha = 0.035 + factor * 0.4;
              armLength = 3 + factor * 4.5;
              isNear = true;
            }
          }

          ctx.beginPath();
          ctx.moveTo(gx - armLength, gy);
          ctx.lineTo(gx + armLength, gy);
          ctx.moveTo(gx, gy - armLength);
          ctx.lineTo(gx, gy + armLength);

          ctx.strokeStyle = isNear
            ? `rgba(255, 122, 69, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = isNear ? 1.1 : 0.75;
          ctx.stroke();

          // Micro glowing bead at crosshair center when near cursor
          if (isNear && alpha > 0.2) {
            ctx.beginPath();
            ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 185, 70, ${alpha * 0.9})`;
            ctx.fill();
          }
        }
      }

      // ─── 3. Delicate Constellation Filaments Between Close Motes ───
      for (let i = 0; i < motes.length; i++) {
        for (let j = i + 1; j < motes.length; j++) {
          const dx = motes[i].x - motes[j].x;
          const dy = motes[i].y - motes[j].y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 120;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * 0.14;
            ctx.strokeStyle = `rgba(255, 122, 69, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(motes[i].x, motes[i].y);
            ctx.lineTo(motes[j].x, motes[j].y);
            ctx.stroke();
          }
        }
      }

      // ─── 4. Weightless Stardust Quanta Motes ───
      motes.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.phase += m.pulseSpeed;

        if (m.x < -15) m.x = width + 15;
        if (m.x > width + 15) m.x = -15;
        if (m.y < -15) m.y = height + 15;
        if (m.y > height + 15) m.y = -15;

        // Interactive elastic deflection from cursor
        if (hasMouse) {
          const dx = m.x - mouse.x;
          const dy = m.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 1) {
            const force = (1 - dist / 130) * 1.3;
            m.x += (dx / dist) * force;
            m.y += (dy / dist) * force;
          }
        }

        const currentAlpha = m.baseAlpha + Math.sin(m.phase) * 0.18;
        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 7;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
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
      style={{ opacity: 0.95 }}
    />
  );
}
