import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { API_BASE_URL } from "./services/api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import GitHubContributions from "./components/GitHubContributions";
import Skills from "./components/Skills";
import Newsletter from "./components/Newsletter";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Chatbot from "./components/Chatbot";

export default function App() {
  const { scrollYProgress } = useScroll();

  // Fire-and-forget silent pre-warm to awaken Render / Koyeb free container on user arrival
  useEffect(() => {
    try {
      fetch(`${API_BASE_URL}/health`, { method: "GET", mode: "cors" }).catch(() => {
        // Silent catch: pre-warm trigger only
      });
    } catch {
      // Ignore network errors on pre-warm
    }
  }, []);

  // Premium Butter-Smooth Inertia Scroll Engine (Lenis)
  // Eliminates section-skipping momentum spikes and provides silky 60-120fps inter-section gliding
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85, // Balanced wheel damping to prevent skipping across small sections
      touchMultiplier: 1.2,
      infinite: false,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Dynamic world-class color interpolation for the background across all sections
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
    [
      "#000000", // Deep black (Hero)
      "#080811", // Deep midnight (About)
      "#0f0f15", // Very dark navy (Experience)
      "#080b13", // Deep tech slate (Projects & GitHub Activity)
      "#080b13", // Deep obsidian (Skills)
      "#090d16", // Midnight navy (Newsletter)
      "#000000", // Deep black (Contact/Footer)
    ]
  );

  return (
    <motion.div 
      style={{ backgroundColor }} 
      className="relative min-h-screen text-white transition-colors duration-500"
    >
      <CustomCursor />
      <Navbar />
      <main className="perspective-container">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <GitHubContributions />
        <Skills />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </motion.div>
  );
}
