import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  User,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { portfolioApi } from '../services/api';

// High-Impact Proprietary AI Logo: Architectural Neural Nexus
const AuraLogo = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <defs>
      <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff7a45" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    {/* Outer Precision Hexagonal Architecture Contour */}
    <path
      d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z"
      stroke="url(#auraGradient)"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Inner Converging Neural Rays */}
    <path
      d="M12 6V9.5M12 14.5V18M6.5 9.2L9.5 11M14.5 13L17.5 14.8M17.5 9.2L14.5 11M9.5 13L6.5 14.8"
      stroke="#ff7a45"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    {/* Central Radiant Intelligence Core */}
    <circle cx="12" cy="12" r="2.6" fill="url(#auraGradient)" />
    <circle cx="12" cy="12" r="1.1" fill="#ffffff" />
  </svg>
);

const SUGGESTED_QUESTIONS = [
  "What is simplyAudio's architecture?",
  "What projects has Siddharth engineered?",
  "What is Sid's technical stack & experience?",
  "How can I get Siddharth's resume or contact info?"
];

function GitHubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function renderLinkPill(title, url, key) {
  const isGitHub = url.toLowerCase().includes("github.com");
  const isLinkedIn = url.toLowerCase().includes("linkedin.com");
  const isResume = url.toLowerCase().includes("resume") || url.toLowerCase().endsWith(".pdf");

  if (isGitHub) {
    // If title is generic (e.g. "GitHub", "GitHub Repo", "Link", or empty):
    const isGenericTitle = !title || /^(github|repo|github repo|repository|link|source|explore)$/i.test(title.trim());

    if (isGenericTitle) {
      return (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 mx-1 rounded-full bg-white/[0.08] hover:bg-accent-warm text-accent-warm hover:text-white border border-accent-warm/30 hover:border-accent-warm font-sans font-semibold text-[0.72rem] transition-all shadow-sm active:scale-95 cursor-pointer align-baseline"
          title="Open repository on GitHub"
        >
          <GitHubIcon className="w-3 h-3" />
          <span>GitHub</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
        </a>
      );
    }

    // Title is project name like "Git In Bits (GIBs)" or "Sid Portfolio":
    return (
      <span key={key} className="inline-flex items-center gap-1.5 align-baseline flex-wrap">
        <strong className="text-white font-bold">{title}</strong>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] hover:bg-accent-warm text-accent-warm hover:text-white border border-accent-warm/30 hover:border-accent-warm font-sans font-semibold text-[0.72rem] transition-all shadow-sm active:scale-95 cursor-pointer"
          title={`Open ${title} on GitHub`}
        >
          <GitHubIcon className="w-3 h-3" />
          <span>GitHub</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
        </a>
      </span>
    );
  }

  if (isLinkedIn) {
    return (
      <a
        key={key}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-0.5 mx-1 rounded-full bg-blue-500/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-sans font-semibold text-[0.72rem] transition-all shadow-sm active:scale-95 cursor-pointer align-baseline"
      >
        <span>{title || "LinkedIn"}</span>
        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
      </a>
    );
  }

  if (isResume) {
    return (
      <a
        key={key}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="inline-flex items-center gap-1.5 px-3 py-0.5 mx-1 rounded-full bg-accent-warm/15 hover:bg-accent-warm text-accent-warm hover:text-white border border-accent-warm/40 font-sans font-bold text-[0.75rem] transition-all shadow-sm active:scale-95 cursor-pointer align-baseline"
      >
        <span>{title || "Download Resume (PDF)"}</span>
        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
      </a>
    );
  }

  // Generic Markdown Link
  return (
    <a
      key={key}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-warm font-semibold hover:underline inline-flex items-center gap-0.5 underline-offset-2 transition-colors mx-0.5"
    >
      <span>{title || url}</span>
      <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-80" />
    </a>
  );
}

function parseInlineFormatting(str) {
  if (!str) return null;
  // Clean raw HTML break tags into spaces or standard breaks
  const cleaned = str.replace(/<br\s*\/?>/gi, " ");
  const parts = [];

  // Match:
  // 1. **[title](url)** -> Bold Markdown Link
  // 2. [title](url)     -> Standard Markdown Link
  // 3. **bold**         -> Bold text
  // 4. `code`           -> Inline code
  // 5. Bare URLs        -> https?://...
  const regex = /(\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|(https?:\/\/[^\s)\]]+))/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleaned.substring(lastIndex, match.index));
    }

    const key = `inline-${match.index}`;

    if (match[1].startsWith("**[") && match[2] && match[3]) {
      // Bold Markdown Link: **[Title](url)**
      parts.push(renderLinkPill(match[2], match[3], key));
    } else if (match[1].startsWith("[") && match[4] && match[5]) {
      // Standard Markdown Link: [Title](url)
      parts.push(renderLinkPill(match[4], match[5], key));
    } else if (match[1].startsWith("**") && match[6]) {
      // Bold text
      parts.push(
        <strong key={key} className="text-white font-bold">
          {match[6]}
        </strong>
      );
    } else if (match[1].startsWith("`") && match[7]) {
      // Inline code
      parts.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-mono text-[0.8em]"
        >
          {match[7]}
        </code>
      );
    } else if (match[8]) {
      // Bare URL
      parts.push(renderLinkPill("", match[8], key));
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < cleaned.length) {
    parts.push(cleaned.substring(lastIndex));
  }

  return parts.length > 0 ? parts : cleaned;
}

function parseCellItems(cellText) {
  if (!cellText) return null;
  // Split on <br>, <br/>, <br />, or newline
  const subItems = cellText.split(/<br\s*\/?>|\r?\n/i).map(s => s.trim()).filter(Boolean);
  if (subItems.length <= 1) {
    return <span>{parseInlineFormatting(cellText)}</span>;
  }

  return (
    <div className="space-y-1 my-0.5">
      {subItems.map((item, idx) => {
        const cleanItem = item.replace(/^[•\-*]\s*/, "");
        return (
          <div key={idx} className="flex items-start gap-1.5 leading-relaxed text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-warm mt-1.5 shrink-0 shadow-[0_0_6px_#ff7a45]" />
            <span className="flex-1">{parseInlineFormatting(cleanItem)}</span>
          </div>
        );
      })}
    </div>
  );
}

function FormattedChatMessage({ text }) {
  if (!text) return null;

  const rawLines = text.split(/\r?\n/);
  const blocks = [];
  let currentTable = null;
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = "";

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Code block detection
    if (trimmed.startsWith("```")) {
      if (!inCodeBlock) {
        if (currentTable) {
          blocks.push({ type: 'table', rows: currentTable });
          currentTable = null;
        }
        inCodeBlock = true;
        codeLang = trimmed.substring(3).trim();
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        blocks.push({ type: 'code', lang: codeLang, code: codeBuffer.join("\n") });
        codeBuffer = [];
        codeLang = "";
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Markdown Table detection: lines containing | and starting/ending with | or containing multiple |
    const isTableLine = (trimmed.startsWith("|") && trimmed.includes("|", 1)) ||
      (trimmed.endsWith("|") && trimmed.includes("|", 0)) ||
      (/^\|?[\s\-:]+(\|[\s\-:]+)+\|?$/.test(trimmed));

    if (isTableLine) {
      // Check if it is a separator line like |---|---|
      if (/^\|?[\s\-:]+(\|[\s\-:]+)+\|?$/.test(trimmed)) {
        continue;
      }

      let cleanRow = trimmed;
      if (cleanRow.startsWith("|")) cleanRow = cleanRow.substring(1);
      if (cleanRow.endsWith("|")) cleanRow = cleanRow.substring(0, cleanRow.length - 1);
      const cells = cleanRow.split("|").map(c => c.trim());

      if (!currentTable) {
        currentTable = [];
      }
      currentTable.push(cells);
      continue;
    } else {
      if (currentTable) {
        blocks.push({ type: 'table', rows: currentTable });
        currentTable = null;
      }
    }

    if (!trimmed) {
      blocks.push({ type: 'spacer' });
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push({ type: 'h3', text: trimmed.substring(4) });
    } else if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      blocks.push({ type: 'h2', text: trimmed.replace(/^#+\s*/, "") });
    } else if (trimmed.startsWith("> ")) {
      blocks.push({ type: 'quote', text: trimmed.substring(2) });
    } else if (/^[-*•]\s+/.test(trimmed)) {
      blocks.push({ type: 'bullet', text: trimmed.replace(/^[-*•]\s+/, "") });
    } else {
      const numMatch = trimmed.match(/^([0-9]+)\.\s+(.*)$/);
      if (numMatch) {
        blocks.push({ type: 'number', num: numMatch[1], text: numMatch[2] });
      } else {
        blocks.push({ type: 'paragraph', text: line });
      }
    }
  }

  if (currentTable) {
    blocks.push({ type: 'table', rows: currentTable });
  }

  return (
    <div className="space-y-2 text-xs sm:text-[0.85rem] text-gray-200 leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        if (block.type === 'spacer') {
          return <div key={idx} className="h-1.5" />;
        }

        if (block.type === 'table') {
          const hasHeaders = block.rows.length > 1;
          const headers = hasHeaders ? block.rows[0] : [];
          const dataRows = hasHeaders ? block.rows.slice(1) : block.rows;

          return (
            <div key={idx} className="my-3 overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  {hasHeaders && (
                    <thead className="bg-white/[0.05] border-b border-white/10">
                      <tr>
                        {headers.map((h, hIdx) => (
                          <th key={hIdx} className="py-2.5 px-3.5 font-bold text-accent-warm text-[0.72rem] tracking-wider uppercase font-sans">
                            {parseInlineFormatting(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-white/5">
                    {dataRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3.5 align-top text-gray-200">
                            {cIdx === 0 && row.length > 1 ? (
                              <strong className="text-white font-semibold block">{parseInlineFormatting(cell)}</strong>
                            ) : (
                              parseCellItems(cell)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        if (block.type === 'h2') {
          return (
            <h3 key={idx} className="font-display font-black text-accent-warm text-sm sm:text-base mt-3 mb-1">
              {parseInlineFormatting(block.text)}
            </h3>
          );
        }

        if (block.type === 'h3') {
          return (
            <h4 key={idx} className="font-display font-bold text-white text-xs sm:text-sm mt-2.5 mb-1">
              {parseInlineFormatting(block.text)}
            </h4>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote key={idx} className="pl-3 py-1 my-1.5 border-l-2 border-accent-warm bg-accent-warm/5 text-gray-300 italic text-xs rounded-r">
              {parseInlineFormatting(block.text)}
            </blockquote>
          );
        }

        if (block.type === 'code') {
          return (
            <div key={idx} className="my-2.5 rounded-xl border border-white/10 bg-black/70 overflow-hidden shadow-inner">
              {block.lang && (
                <div className="px-3 py-1 bg-white/5 border-b border-white/10 text-[0.65rem] font-mono text-accent-warm font-semibold tracking-wider uppercase">
                  {block.lang}
                </div>
              )}
              <pre className="p-3 text-[0.75rem] font-mono text-gray-200 overflow-x-auto leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div key={idx} className="flex items-start gap-2.5 my-1 leading-relaxed text-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warm shrink-0 mt-1.5 shadow-[0_0_6px_#ff7a45]" />
              <div className="flex-1">{parseInlineFormatting(block.text)}</div>
            </div>
          );
        }

        if (block.type === 'number') {
          return (
            <div key={idx} className="flex items-start gap-2.5 my-1 leading-relaxed text-gray-200">
              <span className="font-sans text-accent-warm text-xs font-bold shrink-0">{block.num}.</span>
              <div className="flex-1">{parseInlineFormatting(block.text)}</div>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed text-gray-200">
            {parseInlineFormatting(block.text)}
          </p>
        );
      })}
    </div>
  );
}

const INITIAL_MESSAGES = [
  {
    type: 'bot',
    text: "Hello! I am **AURA**, Siddharth's AI assistant. I have verified access to Siddharth's 13 GitHub repositories (including `simplyAudio`, `OmniStay ERP`, and `DocuVault`), system architectures, verified work experience, and official resume.\n\nAsk me anything about his technical stack, engineering decisions, or career background!"
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    // Append user message
    const updatedMessages = [...messages, { type: 'user', text: query }];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await portfolioApi.sendChatMessage(query, updatedMessages);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: res?.response || "I could not retrieve an answer right now. Please explore Siddharth's [GitHub](https://github.com/musxsid)!",
          model: res?.model
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: "I encountered an issue connecting to the AI model. You can explore Siddharth's projects directly on [GitHub](https://github.com/musxsid) or [Download his Resume](/resume/Siddharth_Shakyawal_Resume_october2026.pdf)!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
  };

  return (
    <div className="chatbot-container">
      {/* Floating Action Button with Ambient Breathing Aura */}
      <motion.button
        className={`fixed bottom-6 right-6 px-4 py-3.5 rounded-full z-[10000] flex items-center gap-2.5 text-white backdrop-blur-2xl border border-white/20 transition-all duration-300 cursor-pointer shadow-[0_0_35px_rgba(234,88,12,0.55)] ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
        style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.95), rgba(249, 115, 22, 0.85))'
        }}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open AURA AI Assistant"
      >
        <div className="relative flex items-center justify-center">
          <AuraLogo size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white" />
        </div>
        <span className="hidden sm:inline-block font-sans font-bold text-xs tracking-wide pr-1">
          Ask AURA
        </span>
      </motion.button>

      {/* Spacious AURA Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`fixed bottom-3 sm:bottom-6 right-2 sm:right-6 bg-[#070913]/96 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] z-[10000] flex flex-col overflow-hidden transition-all duration-300 ${isExpanded
              ? "w-[96vw] sm:w-[720px] md:w-[780px] h-[780px] max-h-[92vh]"
              : "w-[95vw] sm:w-[500px] md:w-[550px] h-[650px] max-h-[88vh]"
              }`}
          >
            {/* Executive AURA Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent-warm/15 border border-accent-warm/30 flex items-center justify-center text-accent-warm shadow-[0_0_15px_rgba(255,122,69,0.3)]">
                  <AuraLogo size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight font-display">
                    AURA
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:flex p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title={isExpanded ? "Standard view" : "Expand view"}
                  aria-label="Toggle size"
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Spacious Messages Area */ }
  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-black/35">
    {messages.map((msg, idx) => (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        key={idx}
        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex items-end gap-2.5 max-w-[92%] sm:max-w-[88%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1 ${msg.type === 'user' ? 'bg-accent-warm text-white shadow-[0_0_10px_rgba(255,122,69,0.4)]' : 'bg-accent-warm/15 text-accent-warm border border-accent-warm/30 shadow-[0_0_10px_rgba(255,122,69,0.2)]'
            }`}>
            {msg.type === 'user' ? <User size={13} /> : <AuraLogo size={15} />}
          </div>

          <div className={`p-4 rounded-2xl text-xs sm:text-[0.85rem] ${msg.type === 'user'
            ? 'bg-accent-warm text-white font-medium rounded-br-sm shadow-[0_4px_20px_rgba(255,122,69,0.35)]'
            : 'bg-white/[0.05] text-gray-200 rounded-bl-sm border border-white/10 shadow-xl backdrop-blur-xl'
            }`}>
            {msg.type === 'user' ? (
              <span>{msg.text}</span>
            ) : (
              <FormattedChatMessage text={msg.text} />
            )}
          </div>
        </div>
      </motion.div>
    ))}

    {isTyping && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="flex items-end gap-2.5 max-w-[85%]">
          <div className="w-7 h-7 rounded-full bg-accent-warm/15 flex items-center justify-center shrink-0 mb-1 border border-accent-warm/30">
            <AuraLogo size={15} />
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.05] rounded-bl-sm border border-white/10 flex items-center gap-2 shadow-lg backdrop-blur-xl">
            <span className="w-1.5 h-1.5 bg-accent-warm rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-accent-warm rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 bg-accent-warm rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            <span className="text-[0.72rem] text-gray-400 font-sans font-medium ml-1">AURA is synthesizing answer...</span>
          </div>
        </div>
      </motion.div>
    )}
    <div ref={messagesEndRef} />
  </div>

  {/* Suggested Prompts Shelf */ }
  {
    messages.length <= 2 && (
      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02]">
        <p className="text-[0.68rem] text-gray-400 mb-2 flex items-center gap-1.5 font-sans font-semibold uppercase tracking-wider">
          <Sparkles size={11} className="text-accent-warm" /> Suggested Queries
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="text-[0.74rem] bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-accent-warm/50 hover:text-white text-gray-300 py-1.5 px-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left cursor-pointer shadow-sm active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    )
  }

  {/* Input Bar */ }
  <div className="p-3.5 bg-black/60 border-t border-white/10 flex items-center gap-2.5">
    <input
      ref={inputRef}
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isTyping) {
          handleSend(input);
        }
      }}
      placeholder="Ask AURA about simplyAudio, backend stack, resume..."
      disabled={isTyping}
      className="flex-1 bg-white/[0.05] border border-white/10 focus:border-accent-warm/60 focus:bg-white/[0.08] rounded-full px-5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
    />
    <button
      onClick={() => handleSend(input)}
      disabled={isTyping || !input.trim()}
      className="p-3 rounded-full bg-accent-warm text-white hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-[0_0_15px_rgba(255,122,69,0.35)] shrink-0"
      aria-label="Send message"
    >
      <Send size={15} />
    </button>
  </div>
          </motion.div >
        )
}
      </AnimatePresence >
    </div >
  );
}
