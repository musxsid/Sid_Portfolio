import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, CheckCircle2, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { portfolioApi } from "../services/api";

export default function Newsletter() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px 0px" });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

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
    } catch (_err) {
      setStatus("error");
      setErrorMessage("Unable to connect to newsletter service. Try again later.");
    }
  };

  return (
    <section 
      ref={sectionRef} 
      id="newsletter" 
      className="relative py-24 z-20 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#090d16] to-black"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[300px] bg-accent-warm/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="section-container max-w-4xl mx-auto px-6 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl bg-black/60 border border-white/15 p-8 sm:p-12 md:p-16 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center overflow-hidden"
        >
          {/* Subtle top gradient glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent-warm/60 to-transparent" />

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Stay in the <span className="text-accent-warm">Loop.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Get occasional engineering write-ups on building scalable Java Spring Boot microservices, high-performance APIs, and reactive React animation tricks. Zero spam.
          </p>

          {/* Form */}
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 max-w-md mx-auto flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-left text-sm">
                <p className="font-bold text-white">You're subscribed!</p>
                <p className="text-xs text-emerald-300/80">Thank you for joining. First dispatch coming soon.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="relative flex flex-col sm:flex-row gap-3 items-center">
                
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-warm focus:ring-2 focus:ring-accent-warm/30 transition-all backdrop-blur-md"
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

              <p className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1.5">
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

