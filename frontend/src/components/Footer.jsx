import { motion } from "framer-motion";
import { Heart, Mail } from "lucide-react";

/* Inline SVG icons for GitHub and LinkedIn */
function GithubIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socials = [
  { label: "GitHub", icon: GithubIcon, href: "https://github.com/siddharth" },
  {
    label: "LinkedIn",
    icon: LinkedinIcon,
    href: "https://linkedin.com/in/siddharth",
  },
  { label: "Email", icon: Mail, href: "mailto:hello@siddharth.dev" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-primary relative border-t border-border-light/50 overflow-hidden">
      <div className="section-container py-16 sm:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="font-display text-[1.75rem] font-black tracking-tighter text-text-primary">
              Siddharth<span className="text-accent-warm">.</span>
            </span>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-[1.05rem] text-text-secondary font-medium">
            <span>Built with</span>
            <Heart className="w-5 h-5 text-accent-warm fill-accent-warm" />
            <span>by Siddharth</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-text-secondary hover:text-text-primary transition-colors duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-[24px] h-[24px]" />
              </motion.a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
