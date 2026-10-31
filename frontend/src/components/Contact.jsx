import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, User, Mail, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import ContactBackground from "./ContactBackground";

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-60px 0px" });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please fill out all fields before sending.");
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
        setErrorMessage(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setSubmitStatus("error");
      setErrorMessage("Network error occurred. Please try again later.");
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
      {/* Background Animation Canvas */}
      <ContactBackground />

      {/* Ambient Deep Space Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[340px] bg-accent-warm/[0.06] blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-14"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Let's <span className="text-accent-warm">Talk.</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg font-normal text-gray-400 max-w-xl mx-auto leading-relaxed">
            Open for new opportunities and high-impact projects.
          </p>
        </motion.div>

        {/* Sculpted, Compact Liquid-Glass Contact Card (No Distracting Hover Shine) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="perspective-container"
        >
          <div className="relative max-w-2xl sm:max-w-[580px] mx-auto rounded-3xl sm:rounded-[32px] bg-gradient-to-b from-white/[0.06] via-[#080811]/50 to-black/70 border border-white/[0.12] p-6 sm:p-9 md:p-10 backdrop-blur-3xl backdrop-saturate-[150%] shadow-[0_20px_60px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300">

            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 px-4 text-center flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-warm/15 border border-accent-warm/35 flex items-center justify-center text-accent-warm mb-4 shadow-[0_0_25px_rgba(255,122,69,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-gray-300 max-w-sm mb-6 leading-relaxed">
                  Thank you for reaching out. I'll get back to you shortly.
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                {/* Clean Two-Column Row for Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-accent-warm" /> Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
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
                      className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-accent-warm" /> Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-3.5 py-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] focus:border-accent-warm focus:bg-white/[0.07] focus:ring-2 focus:ring-accent-warm/25 text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition-all duration-200 shadow-inner font-sans"
                    />
                  </div>
                </div>

                {/* Clean Message Area */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-accent-warm" /> Message
                  </label>
                  <textarea
                    id="contact-message"
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
                  className="w-full mt-2 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white hover:bg-gray-100 text-black font-bold text-xs sm:text-sm transition-all duration-300 shadow-[0_4px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_35px_rgba(255,122,69,0.35)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
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
