import { useEffect, useRef } from "react";

export default function GitHubBackgroundCanvas() {
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

    // 1. Git Pipeline Trajectory Tracks
    const branchCount = 4;
    const branches = [];
    for (let i = 0; i < branchCount; i++) {
      branches.push({
        baseY: (height / (branchCount + 1)) * (i + 1),
        speed: 0.15 + i * 0.08,
        amplitude: 20 + i * 8,
        freq: 0.002 + i * 0.0005,
        color: i % 2 === 0 ? "rgba(255, 122, 69, 0.08)" : "rgba(255, 179, 0, 0.06)",
        // Fast commit packets travelling along this branch
        packets: [
          { x: Math.random() * width, speed: 1.2 + Math.random() * 1.5, size: 2.2 },
          { x: Math.random() * width, speed: 0.8 + Math.random() * 1.2, size: 1.8 },
        ],
      });
    }

    // 2. Git Telemetry Star Nodes & Embers
    const particleCount = Math.min(Math.floor((width * height) / 24000), 55);
    const particles = [];

    const colors = [
      "rgba(255, 122, 69, 0.70)",   // Warm Coral
      "rgba(255, 179, 0, 0.60)",   // Amber
      "rgba(255, 255, 255, 0.60)",  // White
      "rgba(16, 185, 129, 0.55)",   // Git Success Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseOffset: Math.random() * Math.PI * 2,
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

      // Smooth mouse movement interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.04;
        mouse.y += (-1000 - mouse.y) * 0.04;
      }

      // 1. Dynamic Interactive Specular Aura Under Cursor
      if (mouse.x > -500 && mouse.y > -500) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          340
        );
        glow.addColorStop(0, "rgba(255, 122, 69, 0.13)");
        glow.addColorStop(0.35, "rgba(255, 179, 0, 0.05)");
        glow.addColorStop(0.7, "rgba(255, 122, 69, 0.02)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Render Git Branch Pipeline Tracks
      branches.forEach((b) => {
        ctx.beginPath();
        const speed = time * b.speed;

        for (let x = 0; x <= width; x += 35) {
          let mouseInfluence = 0;
          if (mouse.x > -500 && mouse.y > -500) {
            const dx = x - mouse.x;
            const dy = b.baseY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              const factor = 1 - dist / 220;
              mouseInfluence = Math.sin(factor * Math.PI) * 22 * (dy < 0 ? -1 : 1);
            }
          }

          const y = b.baseY + Math.sin(x * b.freq + speed) * b.amplitude + mouseInfluence;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Render moving commit packets along branch
        b.packets.forEach((pkt) => {
          pkt.x += pkt.speed;
          if (pkt.x > width) pkt.x = 0;

          const pktY = b.baseY + Math.sin(pkt.x * b.freq + speed) * b.amplitude;

          ctx.beginPath();
          ctx.arc(pkt.x, pktY, pkt.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 122, 69, 0.75)";
          ctx.fill();

          // Packet glow tail
          ctx.beginPath();
          ctx.arc(pkt.x, pktY, pkt.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 122, 69, 0.15)";
          ctx.fill();
        });
      });

      // 3. Update Particles & Mouse Elasticity
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Fluid repulsion from cursor
        if (mouse.x > -500 && mouse.y > -500) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (1 - dist / 140) * 2.5;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }
      });

      // 4. Draw Interconnected Network Proximity Lines
      const maxDist = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.20;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 122, 69, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // 5. Interactive Constellation Lines to Mouse
      if (mouse.x > -500 && mouse.y > -500) {
        particles.forEach((p) => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 170) {
            const alpha = (1 - dist / 170) * 0.40;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(255, 179, 0, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        });
      }

      // 6. Draw Glowing Particles / Git Commits
      particles.forEach((p) => {
        const pulse = 0.4 + 0.6 * Math.sin(time * 2.2 + p.pulseOffset);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulse;
        ctx.fill();

        if (p.radius > 1.6) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 122, 69, 0.12)";
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

