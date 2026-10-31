import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, CheckCircle2, ArrowRight, Loader2, ShieldCheck, Lock, Radio } from "lucide-react";
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
      className="relative py-28 sm:py-32 z-20 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#090d16] to-black"
    >
      {/* Dynamic Atmospheric Canvas Background: Celestial Liquid Waves & Stardust Quanta */}
      <NewsletterBackground />

      {/* Ambient Radial Deep Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[360px] bg-accent-warm/[0.08] blur-[180px] rounded-full pointer-events-none z-0" />

      {/* Widened Architectural Section Container */}
      <div className="section-container max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Sculpted Liquid-Glass Frosted Card with Interactive Hover Shine */}
        <motion.div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleCardMouseMove}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="group relative rounded-3xl sm:rounded-[36px] bg-gradient-to-b from-white/[0.08] via-[#090d16]/45 to-black/60 border border-white/[0.14] hover:border-white/[0.25] p-8 sm:p-14 md:p-18 backdrop-blur-3xl backdrop-saturate-[160%] shadow-[0_25px_80px_rgba(0,0,0,0.75),inset_0_1px_1.5px_rgba(255,255,255,0.22),inset_0_-1px_1px_rgba(0,0,0,0.4)] text-center overflow-hidden transition-all duration-500"
        >
          {/* 1. Dynamic Mouse-Driven Specular Glare (Hover Only) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18) 0%, rgba(255,122,69,0.08) 35%, transparent 75%)`,
            }}
          />

          {/* 2. Prismatic Diagonal Light Sheen Sweep on Hover */}
          <div
            className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/[0.14] to-transparent pointer-events-none skew-x-12 z-10"
          />

          {/* 3. Luminous Optical Rim Highlights */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent-warm/75 to-transparent transition-opacity duration-300 group-hover:via-white/90 z-20" />
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-white/40 blur-[1px] transition-opacity duration-300 group-hover:opacity-100 opacity-60 z-20" />

          {/* Professional Architectural Kicker Badge */}
          <div className="relative z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-warm/10 border border-accent-warm/25 text-accent-warm text-xs font-mono font-medium tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(255,122,69,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-warm animate-ping" />
            ENGINEERING DISPATCHES
          </div>

          {/* Prominent Architectural Heading */}
          <h2 className="relative z-20 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            Stay in the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-warm via-[#ff884d] to-amber-400">
              Loop.
            </span>
          </h2>

          {/* Refined Engineering Subtitle */}
          <p className="relative z-20 text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Curated deep dives into distributed backend architectures, applied AI orchestration, and production engineering trade-offs. Strictly zero spam.
          </p>

          {/* Subscription Form / Confirmation State */}
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-20 p-6 sm:p-8 rounded-2xl bg-accent-warm/10 border border-accent-warm/35 text-accent-warm max-w-lg mx-auto flex items-center justify-center gap-3.5 shadow-[0_0_30px_rgba(255,122,69,0.25)] backdrop-blur-xl"
            >
              <CheckCircle2 className="w-7 h-7 text-accent-warm shrink-0" />
              <div className="text-left text-sm sm:text-base">
                <p className="font-bold text-white tracking-tight">You're subscribed!</p>
                <p className="text-xs sm:text-sm text-accent-warm/90 mt-0.5">Thank you for joining. First dispatch coming soon.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-20 max-w-xl mx-auto">
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
                    className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-accent-warm/70 focus:ring-4 focus:ring-accent-warm/20 transition-all backdrop-blur-xl shadow-inner font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-gray-100 text-black font-bold text-sm sm:text-base transition-all duration-300 shadow-[0_4px_25px_rgba(255,255,255,0.25)] hover:shadow-[0_4px_35px_rgba(255,122,69,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-xs sm:text-sm text-red-400 font-medium text-left pl-2"
                >
                  {errorMessage}
                </motion.p>
              )}

              {/* Professional Trust & Reliability Guarantees */}
              <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-400 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-warm shrink-0" />
                  <span>1-click instant unsubscribe</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-accent-warm shrink-0" />
                  <span>Zero spam or trackers</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-accent-warm shrink-0" />
                  <span>Direct from Siddharth</span>
                </div>
              </div>
            </form>
          )}

        </motion.div>

      </div>
    </section>
  );
}
