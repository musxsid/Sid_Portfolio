import { motion, useScroll, useTransform } from "framer-motion";
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

  // Dynamic world-class color interpolation for the background across all sections
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
    [
      "#000000", // Deep black (Hero)
      "#080811", // Deep midnight (About)
      "#0f0f15", // Very dark navy (Experience)
      "#080b13", // Deep tech slate (Projects & GitHub Activity)
      "#151b18", // Dark emerald/pine (Skills)
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
