import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, User, Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add logic
  };

  return (
    <section id="contact" ref={sectionRef} className="py-32 relative z-20 pb-48">
      <div className="section-container max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-none mb-6 text-white">
            Let's Talk.
          </h2>
          <p className="text-[1.25rem] font-medium text-gray-400">
            Open for new opportunities and high-impact projects.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="perspective-container"
        >
          <motion.form 
            onSubmit={handleSubmit} 
            whileHover={{ rotateX: 2, rotateY: -1, scale: 1.01 }}
            className="premium-card p-10 sm:p-14 lg:p-20 flex flex-col gap-8 w-full transition-transform duration-500"
          >
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="floating-label-group flex-1">
                <input
                  type="text"
                  id="name"
                  placeholder=" "
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Name
                </label>
              </div>
              <div className="floating-label-group flex-1">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
              </div>
            </div>

            <div className="floating-label-group">
              <textarea
                id="message"
                placeholder=" "
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="resize-none"
              ></textarea>
              <label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Message
              </label>
            </div>

            <motion.button
              type="submit"
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto self-center mt-6 inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-white text-black font-bold text-[1.05rem] hover:bg-gray-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] relative overflow-hidden"
            >
              <span className="relative z-10">Send Message</span>
              <motion.div
                animate={{ x: isHovering ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative z-10"
              >
                <Send className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.form>
        </motion.div>

      </div>
    </section>
  );
}
