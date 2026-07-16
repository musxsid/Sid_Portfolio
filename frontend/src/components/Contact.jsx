import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, User, Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-32 sm:py-40 lg:py-48 bg-bg-warm">
      <div className="section-container relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 lg:mb-24 w-full max-w-3xl"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-none mb-8">
            Connect.
          </h2>
          <p className="text-text-secondary text-[1.2rem] font-medium max-w-lg mx-auto">
            Have a project in mind or want to discuss an opportunity? I&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Form Container */}
        <div className="w-full flex justify-center">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full max-w-[650px] flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              {/* Name */}
              <div className="floating-label-group w-full">
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light pointer-events-none z-10" />
                  <input
                    type="text"
                    name="name"
                    id="contact-name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="!pl-14"
                  />
                  <label htmlFor="contact-name" className="!left-14">
                    Name
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="floating-label-group w-full">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light pointer-events-none z-10" />
                  <input
                    type="email"
                    name="email"
                    id="contact-email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="!pl-14"
                  />
                  <label htmlFor="contact-email" className="!left-14">
                    Email
                  </label>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="floating-label-group w-full">
              <div className="relative">
                <MessageSquare className="absolute left-5 top-[1.75rem] w-5 h-5 text-text-light pointer-events-none z-10" />
                <textarea
                  name="message"
                  id="contact-message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  rows={5}
                  className="!pl-14 resize-none"
                />
                <label htmlFor="contact-message" className="!left-14">
                  Message
                </label>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto self-center mt-4 inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-text-primary text-white font-bold text-[1.05rem] hover:bg-accent-soft transition-all duration-300 shadow-xl shadow-black/10"
            >
              {submitted ? (
                <span>Sent Successfully</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
