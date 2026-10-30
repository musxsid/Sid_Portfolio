import { useEffect, useRef } from "react";

export default function ProjectBackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Warm luminous liquid & constellation particles
    const particleCount = Math.min(Math.floor((width * height) / 22000), 65);
    const particles = [];

    const colors = [
      "rgba(255, 122, 69, 0.75)",   // Warm Coral
      "rgba(255, 179, 0, 0.65)",   // Golden Amber
      "rgba(255, 255, 255, 0.55)",  // Pure Star White
      "rgba(255, 107, 43, 0.70)",   // Deep Coral
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      });
    }

    let mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Activate when mouse is over or near the project section
      if (e.clientY >= rect.top - 120 && e.clientY <= rect.bottom + 120) {
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

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation with fluid inertia
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.04;
        mouse.y += (-1000 - mouse.y) * 0.04;
      }

      // 1. Dynamic Interactive Specular Liquid Glow Following Cursor
      if (mouse.x > -500 && mouse.y > -500) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          360
        );
        glow.addColorStop(0, "rgba(255, 122, 69, 0.14)");
        glow.addColorStop(0.35, "rgba(255, 179, 0, 0.06)");
        glow.addColorStop(0.7, "rgba(255, 122, 69, 0.02)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Liquid Flowing Wave Streamlines with Interactive Cursor Deflection
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const yOffset = (height / (waveCount + 1)) * (w + 1);
        const waveFreq = 0.0018 + w * 0.0006;
        const waveAmp = 28 + w * 12;
        const speed = time * (0.6 + w * 0.2);

        ctx.moveTo(0, yOffset + Math.sin(speed) * waveAmp);

        for (let x = 0; x <= width; x += 30) {
          let mouseInfluence = 0;
          if (mouse.x > -500 && mouse.y > -500) {
            const dx = x - mouse.x;
            const dy = yOffset - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 260) {
              const factor = 1 - dist / 260;
              mouseInfluence = Math.sin(factor * Math.PI) * 28 * (dy < 0 ? -1 : 1);
            }
          }

          const y = yOffset + Math.sin(x * waveFreq + speed) * waveAmp + mouseInfluence;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = w === 0
          ? "rgba(255, 122, 69, 0.08)"
          : w === 1
          ? "rgba(255, 179, 0, 0.06)"
          : "rgba(255, 122, 69, 0.04)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // 3. Update Particles and Interactive Fluid Repulsion
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges seamlessly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interactive elastic repulsion from cursor
        if (mouse.x > -500 && mouse.y > -500) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (1 - dist / 150) * 2.8;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }
      });

      // 4. Draw Interconnected Constellation Mesh Lines
      const maxConnectDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 122, 69, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 5. Draw Interactive Constellation Web to Cursor
      if (mouse.x > -500 && mouse.y > -500) {
        particles.forEach((p) => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.45;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(255, 179, 0, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      }

      // 6. Draw Glowing Embers & Star Points
      particles.forEach((p) => {
        const pulse = 0.4 + 0.6 * Math.sin(time * 2 + p.pulseOffset);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulse;
        ctx.fill();

        // Subtle outer glow halo for larger embers
        if (p.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 122, 69, 0.15)";
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
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
