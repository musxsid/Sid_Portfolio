import { useEffect, useRef } from "react";

export default function AboutLiquidBackground() {
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

    // Liquid glowing orbs configuration
    const orbs = [
      {
        x: width * 0.2,
        y: height * 0.3,
        radius: 280,
        color: "rgba(255, 122, 69, 0.12)", // Warm Coral
        vx: 0.35,
        vy: 0.25,
      },
      {
        x: width * 0.75,
        y: height * 0.4,
        radius: 340,
        color: "rgba(59, 130, 246, 0.09)", // Deep Midnight Blue
        vx: -0.3,
        vy: 0.3,
      },
      {
        x: width * 0.5,
        y: height * 0.75,
        radius: 260,
        color: "rgba(245, 158, 11, 0.08)", // Golden Amber
        vx: 0.25,
        vy: -0.35,
      },
    ];

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 1. Draw Liquid Orbs with Organic Motion
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < 50 || orb.x > width - 50) orb.vx *= -1;
        if (orb.y < 50 || orb.y > height - 50) orb.vy *= -1;

        // Subtle reaction to mouse
        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          orb.x -= (dx / dist) * 0.6;
          orb.y -= (dy / dist) * 0.6;
        }

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.6, orb.color.replace(/[\d.]+\)$/, "0.03)"));
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      // 2. Interactive Liquid Cursor Glow Wave
      if (mouse.x > 0 && mouse.y > 0) {
        const cursorGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          260
        );
        cursorGlow.addColorStop(0, "rgba(255, 122, 69, 0.15)");
        cursorGlow.addColorStop(0.5, "rgba(59, 130, 246, 0.06)");
        cursorGlow.addColorStop(1, "transparent");

        ctx.fillStyle = cursorGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Subtle Liquid Wave Overlay lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const waveSpacing = 90;
      for (let y = 0; y < height; y += waveSpacing) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 30) {
          const waveY =
            y + Math.sin((x + Date.now() * 0.02) * 0.005) * 12;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
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
