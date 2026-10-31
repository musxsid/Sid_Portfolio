import { useEffect, useRef } from "react";

/**
 * NewsletterBackground: Celestial Liquid Wave & Atmospheric Quanta Mesh
 * Designed specifically for the Newsletter section:
 * - Fluid, hardware-accelerated 2D canvas with DPR scaling
 * - 3 harmonious undulating atmospheric aurora waves (Warm Coral, Deep Navy, Golden Amber)
 * - Weightless ambient quanta motes with delicate constellation filaments
 * - Subtle geometric telemetry coordinate accents
 * - Responsive cursor deflection for an organic, living atmosphere
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

    // Mouse coordinates with smooth spring inertia
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

    // 1. Quanta Particles (Weightless stardust motes)
    const particleCount = 22;
    const particles = [];
    const colors = [
      "rgba(255, 122, 69, 0.75)", // Signature Warm Coral
      "rgba(255, 185, 70, 0.70)", // Golden Amber
      "rgba(255, 255, 255, 0.65)", // Pure Starlight White
      "rgba(147, 197, 253, 0.55)", // Ethereal Ice Blue
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.9,
        color: colors[i % colors.length],
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Harmonic Undulating Waves Configuration
    let time = 0;
    const waveLayers = [
      {
        baseY: 0.45,
        amplitude: 45,
        frequency: 0.0035,
        speed: 0.008,
        colorStart: "rgba(255, 122, 69, 0.08)",
        colorEnd: "rgba(234, 88, 12, 0.0)",
        crestColor: "rgba(255, 122, 69, 0.22)",
      },
      {
        baseY: 0.58,
        amplitude: 55,
        frequency: 0.0028,
        speed: -0.006,
        colorStart: "rgba(59, 130, 246, 0.07)",
        colorEnd: "rgba(15, 23, 42, 0.0)",
        crestColor: "rgba(96, 165, 250, 0.18)",
      },
      {
        baseY: 0.52,
        amplitude: 38,
        frequency: 0.0042,
        speed: 0.011,
        colorStart: "rgba(245, 158, 11, 0.06)",
        colorEnd: "rgba(180, 83, 9, 0.0)",
        crestColor: "rgba(251, 191, 36, 0.20)",
      },
    ];

    // Main 60-120 FPS render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse spring inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      time += 1;

      // ─── 1. Render Subtle Architectural Telemetry Coordinate Crosshairs ───
      const gridSpacingX = 160;
      const gridSpacingY = 120;
      const crossSize = 3;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let gx = gridSpacingX / 2; gx < width; gx += gridSpacingX) {
        for (let gy = gridSpacingY / 2; gy < height; gy += gridSpacingY) {
          ctx.beginPath();
          ctx.moveTo(gx - crossSize, gy);
          ctx.lineTo(gx + crossSize, gy);
          ctx.moveTo(gx, gy - crossSize);
          ctx.lineTo(gx, gy + crossSize);
          ctx.stroke();
        }
      }

      // ─── 2. Render Harmonic Undulating Liquid Aurora Waves ───
      waveLayers.forEach((w) => {
        const yCenter = height * w.baseY;
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 8) {
          // Compound sinusoidal harmonics
          const sine1 = Math.sin(x * w.frequency + time * w.speed);
          const sine2 = Math.cos(x * w.frequency * 0.65 - time * w.speed * 0.7);
          let y = yCenter + (sine1 + sine2 * 0.5) * w.amplitude;

          // Responsive interactive cursor lift
          if (mouse.active) {
            const dx = x - mouse.x;
            const dist = Math.abs(dx);
            if (dist < 260) {
              const influence = Math.cos((dist / 260) * (Math.PI / 2));
              y += (mouse.y - yCenter) * 0.22 * influence;
            }
          }

          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Wave Fill Gradient
        const waveGrad = ctx.createLinearGradient(0, yCenter - w.amplitude, 0, height);
        waveGrad.addColorStop(0, w.colorStart);
        waveGrad.addColorStop(1, w.colorEnd);
        ctx.fillStyle = waveGrad;
        ctx.fill();

        // Luminous crest stroke line
        ctx.strokeStyle = w.crestColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // ─── 3. Render Weightless Stardust Quanta & Constellation Filaments ───
      // Draw filaments between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 125;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * 0.16;
            ctx.strokeStyle = `rgba(255, 122, 69, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        // Wrap around boundaries smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Interactive mouse gentle deflection
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 1) {
            const force = (1 - dist / 140) * 1.5;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        const currentAlpha = p.alpha + Math.sin(p.phase) * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.fill();
        ctx.restore();
      });

      // ─── 4. Ambient Cursor Illumination Halo ───
      if (mouse.active && mouse.x > -500) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          320
        );
        glowGrad.addColorStop(0, "rgba(255, 122, 69, 0.08)");
        glowGrad.addColorStop(0.5, "rgba(255, 122, 69, 0.02)");
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 320, 0, Math.PI * 2);
        ctx.fill();
      }

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
