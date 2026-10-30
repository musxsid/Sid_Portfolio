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

    // Warm luminous liquid particles matching portfolio palette
    const particleCount = Math.min(Math.floor((width * height) / 30000), 40);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.6 + 0.8,
        color: Math.random() > 0.4 ? "rgba(255, 122, 69, 0.55)" : "rgba(255, 179, 0, 0.45)",
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // 1. Subtle Organic Flowing Liquid Waves (silk streamlines)
      const waveCount = 4;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const yOffset = (height / (waveCount + 1)) * (w + 1);
        const waveFreq = 0.0016 + w * 0.0005;
        const waveAmp = 30 + w * 10;
        const speed = time * (0.5 + w * 0.15);

        ctx.moveTo(0, yOffset + Math.sin(speed) * waveAmp);

        for (let x = 0; x <= width; x += 35) {
          // Soft interactive liquid displacement near mouse
          let mouseInfluence = 0;
          if (mouse.x > 0 && mouse.y > 0) {
            const dx = x - mouse.x;
            const dy = yOffset - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              const factor = (1 - dist / 220);
              mouseInfluence = Math.sin(factor * Math.PI) * 20 * (dy < 0 ? -1 : 1);
            }
          }

          const y = yOffset + Math.sin(x * waveFreq + speed) * waveAmp + mouseInfluence;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = w % 2 === 0
          ? "rgba(255, 122, 69, 0.04)"
          : "rgba(255, 179, 0, 0.03)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Interactive Liquid Specular Bloom Under Cursor
      if (mouse.x > 0 && mouse.y > 0) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          320
        );
        glow.addColorStop(0, "rgba(255, 122, 69, 0.08)");
        glow.addColorStop(0.4, "rgba(255, 159, 104, 0.03)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Floating Luminous Liquid Embers
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Fluid repulsion from mouse
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (1 - dist / 120) * 1.5;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + p.pulseOffset);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulse;
        ctx.fill();
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
