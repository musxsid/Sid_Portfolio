import { useEffect, useRef } from "react";

/**
 * NewsletterBackground: Interactive Celestial Stardust & Gravitational Constellation Mesh
 * Designed specifically for the Newsletter section:
 * - Minimal, quiet, luxury obsidian atmosphere
 * - Weightless stardust quanta (warm coral, golden amber, starlight white)
 * - Elastic gravitational attraction towards the cursor with silky spring inertia
 * - Hair-thin dynamic constellation filaments between close particles
 * - Soft volumetric ambient horizon glow that reacts organically to mouse movement
 * - High-DPI Retina scaling and 60-120 FPS performance
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

    // ─── Celestial Stardust Quanta Configuration ───
    const particleCount = 38;
    const particles = [];
    const colors = [
      "rgba(255, 122, 69,",   // Signature Warm Coral
      "rgba(255, 185, 70,",   // Golden Amber
      "rgba(255, 255, 255,",  // Starlight White
      "rgba(147, 197, 253,",  // Deep Space Azure
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.6 + 0.8,
        colorPrefix: colors[i % colors.length],
        alpha: Math.random() * 0.4 + 0.25,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        originX: Math.random() * (width || 1200),
        originY: Math.random() * (height || 600),
      });
    }

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse spring inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;
      frame++;

      const hasMouse = mouse.active && mouse.x > -500;

      // ─── 1. Ambient Volumetric Horizon Light (Follows Cursor) ───
      if (hasMouse) {
        const glowRadius = 360;
        const radialGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        radialGlow.addColorStop(0, "rgba(255, 122, 69, 0.08)");
        radialGlow.addColorStop(0.4, "rgba(234, 88, 12, 0.025)");
        radialGlow.addColorStop(0.8, "rgba(255, 122, 69, 0.005)");
        radialGlow.addColorStop(1, "transparent");

        ctx.fillStyle = radialGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // ─── 2. Faint Concentric Orbital Horizon Rings (Background Depth) ───
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 10]);
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ─── 3. Dynamic Hair-Thin Constellation Filaments ───
      const connectionDist = 115;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDist * connectionDist) {
            const dist = Math.sqrt(distSq);
            let alpha = (1 - dist / connectionDist) * 0.16;

            // Highlight connections near cursor
            if (hasMouse) {
              const midX = (particles[i].x + particles[j].x) * 0.5;
              const midY = (particles[i].y + particles[j].y) * 0.5;
              const cursorDist = Math.hypot(midX - mouse.x, midY - mouse.y);
              if (cursorDist < 160) {
                alpha += (1 - cursorDist / 160) * 0.22;
              }
            }

            ctx.strokeStyle = `rgba(255, 122, 69, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // ─── 4. Update and Render Stardust Quanta Motes ───
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        // Wrap around canvas boundaries smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Interactive Gravitational Spring & Elastic Deflection
        if (hasMouse) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pullRadius = 180;

          if (dist < pullRadius && dist > 2) {
            // Gentle gravitational drift toward cursor with elastic spring
            const force = (1 - dist / pullRadius) * 0.65;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        const dynamicAlpha = Math.max(0.12, Math.min(1, p.alpha + Math.sin(p.phase) * 0.18));
        const color = `${p.colorPrefix} ${dynamicAlpha})`;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = `${p.colorPrefix} 0.8)`;
        ctx.shadowBlur = p.radius * 3.5;
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
