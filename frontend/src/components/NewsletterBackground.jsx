import { useEffect, useRef } from "react";

/**
 * NewsletterBackground: Interactive Harmonic Signal Loops & Tech-Cyan Quantum Quanta
 * Designed specifically and exclusively for the Newsletter section ("Stay in the Loop"):
 * - Distinct, bespoke color palette: Electric Azure, Deep Indigo, Starlight White, and Warm Coral accents
 * - Flowing parametric topological flux loops that breathe and elastically flex toward cursor
 * - Silky dual-tone chromatic spotlight following mouse with spring inertia
 * - Luminous dispatch packets and dual-tone dynamic connection filaments
 * - 60-120 FPS high-performance Retina rendering
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

    // ─── App Theme Color Palette (Electric Azure, Tech Indigo, Starlight, Coral) ───
    const quantumColors = [
      { prefix: "rgba(56, 189, 248,", hex: "#38bdf8" },   // Electric Azure
      { prefix: "rgba(96, 165, 250,", hex: "#60a5fa" },   // Tech Cobalt
      { prefix: "rgba(129, 140, 248,", hex: "#818cf8" },  // Ethereal Indigo
      { prefix: "rgba(255, 255, 255,", hex: "#ffffff" },  // Starlight White
      { prefix: "rgba(255, 122, 69,", hex: "#ff7a45" },   // Warm Coral Accent
    ];

    // ─── 1. Flowing Topological "Loop" Streamlines ───
    const streamCount = 3;
    const streams = [];
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        baseYRatio: 0.28 + i * 0.22,
        speed: 0.0008 + i * 0.0004,
        frequency: 0.0022 + i * 0.0006,
        amplitude: 28 + i * 14,
        phase: i * 1.8,
        packets: [
          { progress: Math.random(), speed: 0.0018 + Math.random() * 0.0015, size: 2.2 },
          { progress: Math.random(), speed: 0.0012 + Math.random() * 0.0012, size: 1.6 }
        ]
      });
    }

    // ─── 2. Weightless Quantum Stardust Particles (30 clean, non-cluttered motes) ───
    const particleCount = 30;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const colorObj = quantumColors[i % quantumColors.length];
      particles.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.26,
        radius: Math.random() * 1.6 + 0.9,
        colorObj,
        alpha: Math.random() * 0.35 + 0.3,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse spring inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.075;
      mouse.y += (mouse.targetY - mouse.y) * 0.075;
      time += 1;

      const hasMouse = mouse.active && mouse.x > -500;

      // ─── A. Volumetric Dual-Tone Chromatic Spotlight (Under Cursor) ───
      if (hasMouse) {
        const glowRadius = 340;
        const radialGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        radialGlow.addColorStop(0, "rgba(56, 189, 248, 0.07)");     // Electric Cyan Core
        radialGlow.addColorStop(0.35, "rgba(99, 102, 241, 0.035)"); // Tech Indigo Mid
        radialGlow.addColorStop(0.7, "rgba(255, 122, 69, 0.015)");  // Subtle Coral Rim
        radialGlow.addColorStop(1, "transparent");

        ctx.fillStyle = radialGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // ─── B. Elegant Parametric "Loop" Stream Currents ───
      streams.forEach((stream, sIdx) => {
        const baseY = height * stream.baseYRatio;
        const points = [];
        const step = 20;

        ctx.save();
        ctx.beginPath();

        for (let x = -20; x <= width + 20; x += step) {
          let y = baseY + Math.sin(x * stream.frequency + time * stream.speed + stream.phase) * stream.amplitude;

          // Elastic magnetic bend toward cursor
          if (hasMouse) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.hypot(dx, dy);
            const influenceRadius = 240;
            if (dist < influenceRadius && dist > 1) {
              const pull = (1 - dist / influenceRadius) * 28;
              y += (dy / dist) * pull;
            }
          }

          if (x === -20) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          points.push({ x, y });
        }

        // Gradient for the stream line
        const streamGrad = ctx.createLinearGradient(0, 0, width, 0);
        if (sIdx === 0) {
          streamGrad.addColorStop(0, "rgba(56, 189, 248, 0.01)");
          streamGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.07)");
          streamGrad.addColorStop(1, "rgba(99, 102, 241, 0.01)");
        } else if (sIdx === 1) {
          streamGrad.addColorStop(0, "rgba(99, 102, 241, 0.01)");
          streamGrad.addColorStop(0.5, "rgba(129, 140, 248, 0.08)");
          streamGrad.addColorStop(1, "rgba(56, 189, 248, 0.01)");
        } else {
          streamGrad.addColorStop(0, "rgba(56, 189, 248, 0.01)");
          streamGrad.addColorStop(0.5, "rgba(255, 122, 69, 0.05)");
          streamGrad.addColorStop(1, "rgba(56, 189, 248, 0.01)");
        }

        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Render traveling dispatch packet motes along the stream
        stream.packets.forEach((packet) => {
          packet.progress += packet.speed;
          if (packet.progress > 1) packet.progress = 0;

          const approxIdx = Math.floor(packet.progress * (points.length - 1));
          const pt = points[approxIdx] || points[0];

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, packet.size, 0, Math.PI * 2);
          ctx.fillStyle = sIdx === 2 ? "rgba(255, 122, 69, 0.75)" : "rgba(56, 189, 248, 0.85)";
          ctx.shadowColor = sIdx === 2 ? "rgba(255, 122, 69, 0.8)" : "rgba(56, 189, 248, 0.9)";
          ctx.shadowBlur = 8;
          ctx.fill();
        });

        ctx.restore();
      });

      // ─── C. Dual-Tone Dynamic Connection Filaments ───
      const connectionDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDist * connectionDist) {
            const dist = Math.sqrt(distSq);
            let alpha = (1 - dist / connectionDist) * 0.15;

            // Highlight near cursor
            if (hasMouse) {
              const midX = (particles[i].x + particles[j].x) * 0.5;
              const midY = (particles[i].y + particles[j].y) * 0.5;
              const cursorDist = Math.hypot(midX - mouse.x, midY - mouse.y);
              if (cursorDist < 160) {
                alpha += (1 - cursorDist / 160) * 0.22;
              }
            }

            const lineGrad = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );
            lineGrad.addColorStop(0, `${particles[i].colorObj.prefix} ${alpha})`);
            lineGrad.addColorStop(1, `${particles[j].colorObj.prefix} ${alpha})`);

            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // ─── D. Update & Render Quantum Quanta Particles ───
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Elastic gravitational drift toward cursor
        if (hasMouse) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pullRadius = 170;

          if (dist < pullRadius && dist > 2) {
            const force = (1 - dist / pullRadius) * 0.55;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        const dynamicAlpha = Math.max(0.15, Math.min(0.9, p.alpha + Math.sin(p.phase) * 0.16));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorObj.prefix} ${dynamicAlpha})`;
        ctx.shadowColor = `${p.colorObj.prefix} 0.7)`;
        ctx.shadowBlur = p.radius * 3;
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
