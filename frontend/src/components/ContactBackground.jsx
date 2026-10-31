import { useEffect, useRef } from "react";

/**
 * ContactBackground: Ethereal Beacon Telemetry & Orbital Signal Rings
 * Designed specifically for the "Let's Talk" Contact section:
 * - Concentric radar / beacon signal pulses radiating outward into deep obsidian space
 * - Subtle resonant communication nodes with orbital signal satellites
 * - Interactive cursor-induced signal ripples that react organically to mouse motion
 * - High-DPI Retina support and 60-120 FPS performance
 */
export default function ContactBackground() {
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

    // Mouse coordinates with fluid spring tracking
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      lastPulseTime: 0,
    };

    // User-triggered ripples on cursor motion
    const userRipples = [];

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

        // Emit an interactive signal ring on movement every 240ms
        const now = Date.now();
        if (now - mouse.lastPulseTime > 240 && userRipples.length < 8) {
          userRipples.push({
            x: mouse.targetX,
            y: mouse.targetY,
            radius: 10,
            maxRadius: 280,
            speed: 1.8,
            color: "rgba(255, 122, 69,",
            opacity: 0.35,
          });
          mouse.lastPulseTime = now;
        }
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

    // Autonomous Communication Beacon Centers
    const beacons = [
      {
        relX: 0.18,
        relY: 0.35,
        baseColor: "rgba(255, 122, 69,",
        pulseInterval: 140,
        pulses: [],
        satelliteAngle: 0,
        satelliteDist: 34,
      },
      {
        relX: 0.82,
        relY: 0.45,
        baseColor: "rgba(59, 130, 246,",
        pulseInterval: 180,
        pulses: [],
        satelliteAngle: Math.PI,
        satelliteDist: 40,
      },
      {
        relX: 0.5,
        relY: 0.82,
        baseColor: "rgba(245, 158, 11,",
        pulseInterval: 160,
        pulses: [],
        satelliteAngle: Math.PI / 2,
        satelliteDist: 30,
      },
    ];

    // Sparse Ambient Telemetry Quanta (18 weightless particles)
    const particleCount = 18;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 800),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 0.8,
        color:
          i % 3 === 0
            ? "rgba(255, 122, 69, 0.6)"
            : i % 3 === 1
              ? "rgba(255, 255, 255, 0.55)"
              : "rgba(96, 165, 250, 0.5)",
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frameCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse spring inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      frameCount++;

      // ─── 1. Render Faint Radial Coordinate Guides ───
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.45, 340, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.45, 520, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ─── 2. Update and Render Autonomous Beacon Nodes & Signal Waves ───
      beacons.forEach((b) => {
        const bx = width * b.relX;
        const by = height * b.relY;

        // Spawn new beacon ring periodically
        if (frameCount % b.pulseInterval === 0) {
          b.pulses.push({
            radius: 8,
            maxRadius: Math.min(width, height) * 0.45,
            speed: 1.2,
            opacity: 0.3,
          });
        }

        // Draw and update active pulses
        for (let i = b.pulses.length - 1; i >= 0; i--) {
          const pulse = b.pulses[i];
          pulse.radius += pulse.speed;
          const progress = pulse.radius / pulse.maxRadius;
          const currentAlpha = (1 - progress) * pulse.opacity;

          if (progress >= 1 || currentAlpha <= 0.01) {
            b.pulses.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(bx, by, pulse.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${b.baseColor} ${currentAlpha})`;
          ctx.lineWidth = Math.max(0.7, 1.8 * (1 - progress));
          ctx.stroke();
          ctx.restore();
        }

        // Draw Beacon Core Node
        ctx.save();
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = `${b.baseColor} 0.8)`;
        ctx.shadowColor = `${b.baseColor} 0.9)`;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Beacon Orbital Satellite
        b.satelliteAngle += 0.02;
        const satX = bx + Math.cos(b.satelliteAngle) * b.satelliteDist;
        const satY = by + Math.sin(b.satelliteAngle) * b.satelliteDist;

        // Satellite trajectory track
        ctx.beginPath();
        ctx.arc(bx, by, b.satelliteDist, 0, Math.PI * 2);
        ctx.strokeStyle = `${b.baseColor} 0.06)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Satellite bead
        ctx.beginPath();
        ctx.arc(satX, satY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `${b.baseColor} 0.75)`;
        ctx.fill();
        ctx.restore();
      });

      // ─── 3. Update and Render Interactive User Ripples ───
      for (let i = userRipples.length - 1; i >= 0; i--) {
        const rip = userRipples[i];
        rip.radius += rip.speed;
        const prog = rip.radius / rip.maxRadius;
        const alpha = (1 - prog) * rip.opacity;

        if (prog >= 1 || alpha <= 0.01) {
          userRipples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${rip.color} ${alpha})`;
        ctx.lineWidth = 1.2 * (1 - prog);
        ctx.stroke();
        ctx.restore();
      }

      // ─── 4. Render Ambient Telemetry Quanta Particles ───
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.02;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Gentle cursor deflection
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 1) {
            const force = (1 - dist / 120) * 1.2;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        const alpha = 0.35 + Math.sin(p.phase) * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.fill();
        ctx.restore();
      });

      // ─── 5. Ambient Cursor Soft Light ───
      if (mouse.active && mouse.x > -500) {
        const cursorGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          260
        );
        cursorGlow.addColorStop(0, "rgba(255, 122, 69, 0.06)");
        cursorGlow.addColorStop(0.6, "rgba(255, 122, 69, 0.015)");
        cursorGlow.addColorStop(1, "transparent");
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 260, 0, Math.PI * 2);
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

