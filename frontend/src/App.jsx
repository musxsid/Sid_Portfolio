import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const { scrollYProgress } = useScroll();

  // Dynamic world-class color interpolation for the background
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "#000000", // Deep black (Hero)
      "#0f0f15", // Very dark navy (Experience)
      "#1a1025", // Deep midnight purple (Projects)
      "#151b18", // Dark emerald/pine (Skills)
      "#000000", // Back to deep black (Contact/Footer)
    ]
  );

  return (
    <motion.div 
      style={{ backgroundColor }} 
      className="relative min-h-screen text-white transition-colors duration-500"
    >
      <Navbar />
      <main className="perspective-container">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}
