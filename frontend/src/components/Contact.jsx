import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  MapPin,
  Loader2,
  Sparkles,
} from "lucide-react";
import ContactBackground from "./ContactBackground";

export default function Contact() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-60px 0px" });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Specular shine tracking on card hover
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("siddharthshakya2004@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please complete all fields before transmitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "0cfe6ace-b08a-4e6f-ba27-3ec9a5a672fc",
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setFormData({ name: "", email: "", message: "" });
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.message || "Failed to dispatch message. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setSubmitStatus("error");
      setErrorMessage("Network error occurred. Try sending via direct email instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 sm:py-32 relative z-20 pb-44 overflow-hidden bg-gradient-to-b from-[#090d16] via-[#050508] to-black"
    >
      {/* 1. Distinctive Communication Beacon & Radar Signal Canvas */}
      <ContactBackground />

      {/* 2. Ambient Deep Space Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[340px] bg-accent-warm/[0.07] blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          {/* Status Kicker Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-warm/10 border border-accent-warm/25 text-accent-warm text-xs font-mono font-medium tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(255,122,69,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            AVAILABLE FOR OPPORTUNITIES
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Let's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-accent-warm">
              Talk.
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg font-normal text-gray-300 max-w-xl mx-auto leading-relaxed">
            Open for new opportunities and high-impact projects.
          </p>

          {/* Quick Telemetry Coordinates Strip (Addresses the blank page feeling) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6 text-xs text-gray-300">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-sm active:scale-95"
              title="Copy email to clipboard"
            >
              <Mail className="w-3.5 h-3.5 text-accent-warm" />
              <span className="font-mono text-[0.72rem] sm:text-xs">siddharthshakya2004@gmail.com</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-500 hover:text-gray-300" />
              )}
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-400 backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-accent-warm" />
              <span className="text-[0.72rem] sm:text-xs">India · Remote</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-400 backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 text-accent-warm" />
              <span className="text-[0.72rem] sm:text-xs">SLA: &lt; 24h</span>
            </span>
          </div>
        </motion.div>

        {/* Sculpted, Compact Liquid-Glass Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="perspective-container"
        >
          <div
            ref={cardRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleCardMouseMove}
            className="group relative max-w-2xl sm:max-w-[620px] mx-auto rounded-3xl sm:rounded-[32px] bg-gradient-to-b from-white/[0.08] via-[#080811]/50 to-black/70 border border-white/[0.14] hover:border-white/[0.24] p-6 sm:p-9 md:p-10 backdrop-blur-3xl backdrop-saturate-[160%] shadow-[0_24px_70px_rgba(0,0,0,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.22),inset_0_-1px_1px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500"
          >
            {/* Subtle Specular Radial Glare on Hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-10"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(480px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.07) 0%, rgba(255,122,69,0.03) 35%, transparent 70%)`,
              }}
            />

            {/* Subtle Top Optical Flare */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent-warm/50 to-transparent transition-opacity duration-300 group-hover:via-accent-warm/75 z-20" />

            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-20 py-8 px-4 text-center flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-warm/15 border border-accent-warm/35 flex items-center justify-center text-accent-warm mb-4 shadow-[0_0_25px_rgba(255,122,69,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display mb-2">
                  Message Transmitted!
                </h3>
                <p className="text-sm text-gray-300 max-w-sm mb-6 leading-relaxed">
                  Thank you for reaching out. Your dispatch has been received and I'll get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus("idle")}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-20 flex flex-col gap-4 sm:gap-5">
                {/* Structured Two-Column Row for Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="flex items-center justify-between text-[0.72rem] font-mono uppercase tracking-wider text-gray-400 mb-1.5"
                    >
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent-warm" /> Name
                      </span>
                      <span className="text-[0.62rem] text-gray-500 font-sans">Required</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-3.5 py-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] focus:border-accent-warm focus:bg-white/[0.07] focus:ring-2 focus:ring-accent-warm/25 text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition-all duration-200 shadow-inner font-sans"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="flex items-center justify-between text-[0.72rem] font-mono uppercase tracking-wider text-gray-400 mb-1.5"
                    >
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-accent-warm" /> Email
                      </span>
                      <span className="text-[0.62rem] text-gray-500 font-sans">Required</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-3.5 py-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] focus:border-accent-warm focus:bg-white/[0.07] focus:ring-2 focus:ring-accent-warm/25 text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition-all duration-200 shadow-inner font-sans"
                    />
                  </div>
                </div>

                {/* Structured Message Area */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="flex items-center justify-between text-[0.72rem] font-mono uppercase tracking-wider text-gray-400 mb-1.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-accent-warm" /> Message
                    </span>
                    <span className="text-[0.62rem] text-gray-500 font-sans">Project / Role Details</span>
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder="Tell me about your project, timeline, or engineering opportunity..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] focus:border-accent-warm focus:bg-white/[0.07] focus:ring-2 focus:ring-accent-warm/25 text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition-all duration-200 resize-none shadow-inner font-sans leading-relaxed"
                  />
                </div>

                {submitStatus === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 font-medium"
                  >
                    {errorMessage}
                  </motion.p>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white hover:bg-gray-100 text-black font-bold text-xs sm:text-sm transition-all duration-300 shadow-[0_4px_25px_rgba(255,255,255,0.22)] hover:shadow-[0_4px_35px_rgba(255,122,69,0.4)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5 text-black" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
