import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Sparkles } from 'lucide-react';

const AIChatLogo = ({ className, size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M12 7l1.5 3 3 1.5-3 1.5L12 16l-1.5-3-3-1.5 3-1.5L12 7z" fill="currentColor" stroke="none" />
  </svg>
);

const predefinedQA = [
  {
    question: "What technologies do you use?",
    answer: "I specialize in React, Node.js, Java, and modern web technologies. I love building responsive and interactive applications!"
  },
  {
    question: "How can I contact you?",
    answer: "You can reach out to me via the Contact section on this page, or connect with me on LinkedIn and GitHub. My links are in the footer."
  },
  {
    question: "Tell me about your projects.",
    answer: "I've built several full-stack applications including e-commerce platforms, portfolio websites, and AI integrations. Check out the Projects section above for details!"
  },
  {
    question: "Are you open to work?",
    answer: "Yes, I am always open to discussing new opportunities, collaborations, and exciting projects!"
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! I'm Sid's AI Assistant. How can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOptionClick = (qa) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: qa.question }]);
    
    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'bot', text: qa.answer }]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      {/* Floating Action Button */}
      <motion.button
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-[10000] flex items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        style={{
          background: 'linear-gradient(135deg, #ea580c, #f97316)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <AIChatLogo size={28} />
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[10000] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center">
                  <AIChatLogo size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Sid's Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-orange-500' : 'bg-orange-500/20'}`}>
                      {msg.type === 'user' ? <User size={12} className="text-white" /> : <AIChatLogo size={14} className="text-orange-500" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.type === 'user' 
                        ? 'bg-orange-600/90 text-white rounded-br-sm' 
                        : 'bg-white/10 text-gray-200 rounded-bl-sm border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <AIChatLogo size={14} className="text-orange-500" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white/10 rounded-bl-sm border border-white/5 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Options Area */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                <Sparkles size={12} className="text-orange-400" /> Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {predefinedQA.map((qa, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(qa)}
                    disabled={isTyping}
                    className="text-xs bg-white/5 hover:bg-transparent border border-white/10 hover:border-orange-500/40 hover:text-white text-gray-300 py-1.5 px-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    {qa.question}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Future Input Area (Disabled for now as per "first make it in ui" with "predefined options") */}
            <div className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message (API coming soon)..." 
                disabled
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors disabled:opacity-50"
              />
              <button disabled className="p-2 rounded-full bg-orange-600/50 text-white/50 cursor-not-allowed">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
