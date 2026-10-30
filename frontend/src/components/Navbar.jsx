import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
const navLinks = [
  { label: "About Me", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const resumeUrl = "/resume/Siddharth_Resume.pdf";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;

    // Calculate exact absolute top position of the element
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    let targetY = absoluteTop;

    // Smart Offset: If the section is a massive sticky container (> 200vh),
    // scrolling to the very top yields a blank screen (scrollYProgress = 0).
    // We mathematically offset the target by 15% of its scrollable height.
    // Otherwise, for normal sections, offset by 90px for floating navbar clearance.
    if (el.offsetHeight > window.innerHeight * 2) {
      const scrollableDistance = el.offsetHeight - window.innerHeight;
      targetY += scrollableDistance * 0.15;
    } else {
      targetY = Math.max(0, targetY - 90);
    }

    // Custom Smooth Scrolling Engine
    // Replaces the jarring, hyper-fast native browser scroll with a luxurious, 
    // highly-damped custom animation curve that takes exactly 1.2 seconds.
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 2000; // 2.0 seconds for an even slower, cinematic scroll
    let startTime = null;

    // easeInOutQuart - super smooth acceleration and deceleration
    const easeInOutQuart = (t) => {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startY + distance * easeInOutQuart(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4" : "py-8"
          }`}
      >
        <div className="section-container">
          <div
            className={`mx-auto flex items-center justify-between transition-all duration-500 ${isScrolled
              ? "bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-transparent px-2"
              }`}
          >
            {/* Logo */}
            <a href="#" className="text-2xl font-black tracking-tighter text-white">
              Sid<span className="text-accent-warm">.</span>
            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="text-[0.95rem] font-bold text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-[0.95rem] font-bold rounded-full bg-white text-black hover:bg-gray-200 transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <Download className="w-4 h-4" /> Resume
              </motion.a>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[60] bg-black/80 flex flex-col justify-center items-center"
          >
            <button
              className="absolute top-8 right-8 p-4 text-white hover:text-accent-warm transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col items-center gap-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-4xl font-black text-white hover:text-accent-warm transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold rounded-full bg-white text-black"
              >
                <Download className="w-5 h-5" /> Download Resume
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
