import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, CheckCircle2, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { portfolioApi } from "../services/api";
import NewsletterBackground from "./NewsletterBackground";

export default function Newsletter() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-60px 0px" });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await portfolioApi.subscribeNewsletter(cleanEmail);
      if (res.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(res.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Unable to connect to newsletter service. Try again later.");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="relative min-h-screen w-full flex items-center justify-center py-20 sm:py-24 z-20 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#090d16] to-black"
    >
      {/* Premium Minimal & Interactive Background Animation */}
      <NewsletterBackground />

      {/* Ambient Subtle Depth Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[360px] bg-accent-warm/[0.06] blur-[180px] rounded-full pointer-events-none z-0" />

      {/* Full-Screen Section Container */}
      <div className="section-container max-w-5xl xl:max-w-6xl w-full mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center justify-center">

        {/* Liquid-Glass Frosted Card with Refined Subtle Specular Sheen */}
        <motion.div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleCardMouseMove}
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="group relative w-full rounded-3xl sm:rounded-[36px] bg-gradient-to-b from-white/[0.06] via-[#090d16]/45 to-black/60 border border-white/[0.12] hover:border-white/[0.20] p-10 sm:p-14 md:p-20 backdrop-blur-3xl backdrop-saturate-[150%] shadow-[0_20px_60px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.12)] text-center overflow-hidden transition-all duration-500"
        >
          {/* Subtle Muted Mouse Glare (Softened & Non-Glossy) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(450px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.05) 0%, rgba(255,122,69,0.02) 35%, transparent 70%)`,
            }}
          />

          {/* Subtle Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent-warm/50 to-transparent transition-opacity duration-300 group-hover:via-accent-warm/75 z-20" />

          {/* Original Heading */}
          <h2 className="relative z-20 font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Stay in the <span className="text-accent-warm">Loop.</span>
          </h2>

          {/* Original Subtitle */}
          <p className="relative z-20 text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed font-sans">
            Get occasional engineering write-ups. Zero spam.
          </p>

          {/* Form */}
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-20 p-6 rounded-2xl bg-accent-warm/10 border border-accent-warm/30 text-accent-warm max-w-md mx-auto flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,122,69,0.2)] backdrop-blur-md"
            >
              <CheckCircle2 className="w-6 h-6 text-accent-warm shrink-0" />
              <div className="text-left text-sm">
                <p className="font-bold text-white">You're subscribed!</p>
                <p className="text-xs text-accent-warm/80">Thank you for joining. First dispatch coming soon.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-20 max-w-md mx-auto">
              <div className="relative flex flex-col sm:flex-row gap-3 items-center">

                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-warm focus:ring-2 focus:ring-accent-warm/30 transition-all backdrop-blur-md font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-200 text-black font-bold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>

              {status === "error" && (
                <p className="mt-3 text-xs text-red-400 font-medium">
                  {errorMessage}
                </p>
              )}

              {/* Original Unsubscribe Disclaimer */}
              <p className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1.5 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-warm" />
                Unsubscribe anytime in one click. Respecting your inbox always.
              </p>
            </form>
          )}

        </motion.div>

      </div>
    </section>
  );
}
