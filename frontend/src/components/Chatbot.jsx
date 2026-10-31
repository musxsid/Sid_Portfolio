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
  Minimize2,
  ShieldCheck,
  BookmarkCheck,
  FileText,
  Mail,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { portfolioApi, API_BASE_URL } from '../services/api';

// Ultra-Premium Proprietary AI Identity: Celestial Quantum Nexus & Neural Spark
const AuraLogo = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <defs>
      <linearGradient id="auraNexusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="22%" stopColor="#ffd4b8" />
        <stop offset="58%" stopColor="#ff7a45" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="auraOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff9f68" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#ea580c" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ff7a45" stopOpacity="0.85" />
      </linearGradient>
      <radialGradient id="auraCoreGleam" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#ffe6d5" />
        <stop offset="70%" stopColor="#ff6b35" />
        <stop offset="100%" stopColor="#c2410c" />
      </radialGradient>
      <filter id="auraGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Dual Quantum Orbit Synchrotron Rings */}
    <ellipse
      cx="16"
      cy="16"
      rx="12.5"
      ry="5.2"
      transform="rotate(-30 16 16)"
      stroke="url(#auraOrbitGrad)"
      strokeWidth="1.2"
      strokeDasharray="2.5 3"
      opacity="0.85"
    />
    <ellipse
      cx="16"
      cy="16"
      rx="12.5"
      ry="5.2"
      transform="rotate(30 16 16)"
      stroke="url(#auraOrbitGrad)"
      strokeWidth="1.2"
      strokeDasharray="2.5 3"
      opacity="0.85"
    />

    {/* Orbital Photonic Nodes */}
    <circle cx="5.2" cy="12" r="1.1" fill="#ffffff" opacity="0.95" />
    <circle cx="26.8" cy="20" r="1.1" fill="#ffb088" opacity="0.95" />
    <circle cx="26.8" cy="12" r="1.1" fill="#ffffff" opacity="0.95" />
    <circle cx="5.2" cy="20" r="1.1" fill="#ffb088" opacity="0.95" />

    {/* Primary 4-Point Celestial AI Spark */}
    <path
      d="M16 2.5C16 9.8 9.8 16 2.5 16C9.8 16 16 22.2 16 29.5C16 22.2 22.2 16 29.5 16C22.2 16 16 9.8 16 2.5Z"
      fill="url(#auraNexusGrad)"
      filter="url(#auraGlowFilter)"
    />

    {/* Secondary Inner Precision Refraction Spark */}
    <path
      d="M16 7.5C16 12.2 12.2 16 7.5 16C12.2 16 16 19.8 16 24.5C16 19.8 19.8 16 24.5 16C19.8 16 16 12.2 16 7.5Z"
      fill="#ffffff"
      opacity="0.6"
    />

    {/* Radiant Central Singularity Core */}
    <circle cx="16" cy="16" r="3.4" fill="url(#auraCoreGleam)" />
    <circle cx="16" cy="16" r="1.3" fill="#ffffff" />
  </svg>
);

function GitHubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}


function renderLinkPill(title, url, key) {
  const resolvedUrl = (url && url.startsWith("/api")) ? `${API_BASE_URL}${url}` : url;
  const isGitHub = url.toLowerCase().includes("github.com");
  const isLinkedIn = url.toLowerCase().includes("linkedin.com");
  const isResume = url.toLowerCase().includes("resume") || url.toLowerCase().endsWith(".pdf");
  const isEmail = url.toLowerCase().startsWith("mailto:") || (url.includes("@") && !url.includes("/"));

  if (isGitHub) {
    const isGenericTitle = !title || /^(github|repo|github repo|repository|link|source|explore)$/i.test(title.trim());

    if (isGenericTitle) {
      return (
        <a
          key={key}
          href={resolvedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 my-0.5 rounded-full bg-white/[0.08] hover:bg-accent-warm text-accent-warm hover:text-white border border-accent-warm/30 hover:border-accent-warm font-sans font-semibold text-[0.74rem] transition-all shadow-sm active:scale-95 cursor-pointer align-middle"
          title="Open repository on GitHub"
        >
          <GitHubIcon className="w-3.5 h-3.5 shrink-0" />
          <span>GitHub</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-80 shrink-0" />
        </a>
      );
    }

    return (
      <span key={key} className="inline-flex items-center gap-1.5 align-middle flex-wrap my-0.5">
        <strong className="text-white font-bold">{title}</strong>
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] hover:bg-accent-warm text-accent-warm hover:text-white border border-accent-warm/30 hover:border-accent-warm font-sans font-semibold text-[0.72rem] transition-all shadow-sm active:scale-95 cursor-pointer"
          title={`Open ${title} on GitHub`}
        >
          <GitHubIcon className="w-3 h-3 shrink-0" />
          <span>GitHub</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-80 shrink-0" />
        </a>
      </span>
    );
  }

  if (isLinkedIn) {
    const cleanTitle = (title || "Connect on LinkedIn").replace(/^[📬\s]+/, "");
    return (
      <a
        key={key}
        href={resolvedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 my-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] hover:border-accent-warm/50 text-gray-200 hover:text-white border border-white/15 font-sans font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer align-middle"
      >
        <LinkedInIcon className="w-3.5 h-3.5 text-[#0a66c2] group-hover:text-white shrink-0" />
        <span>{cleanTitle}</span>
        <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
      </a>
    );
  }

  if (isResume) {
    const cleanTitle = (title || "Download Siddharth's Resume (PDF)").replace(/^[📄\s]+/, "");
    return (
      <a
        key={key}
        href={resolvedUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="inline-flex items-center gap-2 px-3.5 py-1.5 my-1 rounded-xl bg-gradient-to-r from-accent-warm/25 to-orange-500/15 hover:from-accent-warm hover:to-orange-500 text-accent-warm hover:text-white border border-accent-warm/40 hover:border-transparent font-sans font-bold text-xs transition-all shadow-[0_0_12px_rgba(255,122,69,0.18)] hover:shadow-[0_0_20px_rgba(255,122,69,0.45)] active:scale-95 cursor-pointer align-middle"
      >
        <FileText className="w-3.5 h-3.5 shrink-0 text-accent-warm group-hover:text-white" />
        <span>{cleanTitle}</span>
        <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
      </a>
    );
  }

  if (isEmail) {
    const email = url.replace("mailto:", "");
    return (
      <a
        key={key}
        href={`mailto:${email}`}
        className="inline-flex items-center gap-1.5 px-3 py-1 my-0.5 rounded-full bg-white/[0.06] hover:bg-accent-warm text-gray-200 hover:text-white border border-white/15 hover:border-accent-warm font-sans font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer align-middle"
      >
        <Mail className="w-3 h-3 shrink-0 text-accent-warm" />
        <span>{title || email}</span>
      </a>
    );
  }

  return (
    <a
      key={key}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-warm font-semibold hover:underline inline-flex items-center gap-0.5 underline-offset-2 transition-colors mx-0.5 align-middle"
    >
      <span>{title || url}</span>
      <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-80" />
    </a>
  );
}

function parseInlineFormatting(str) {
  if (!str) return null;
  // Clean raw HTML break tags, remove pipes between or before links, and strip leading emoji pins
  const cleaned = str
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/(?<=\))\s*\|\s*(?=\[|\*\*\[)/g, " ")
    .replace(/\|\s*(?=\[|\*\*\[)/g, " ")
    .replace(/(?<=\))\s*\|/g, " ");

  const parts = [];
  const regex = /(\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|(https?:\/\/[^\s)\]]+))/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleaned.substring(lastIndex, match.index));
    }

    const key = `inline-${match.index}`;

    if (match[1].startsWith("**[") && match[2] && match[3]) {
      parts.push(renderLinkPill(match[2], match[3], key));
    } else if (match[1].startsWith("[") && match[4] && match[5]) {
      parts.push(renderLinkPill(match[4], match[5], key));
    } else if (match[1].startsWith("**") && match[6]) {
      parts.push(
        <strong key={key} className="text-white font-bold tracking-tight">
          {match[6]}
        </strong>
      );
    } else if (match[1].startsWith("`") && match[7]) {
      parts.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded-md bg-white/10 text-amber-300 font-mono text-[0.8em] border border-white/10"
        >
          {match[7]}
        </code>
      );
    } else if (match[8]) {
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

    // Source provenance line detection:
    // Matches: 📌 **Source:** ... or 📌 Source: ... or **Source:** ... or Source: ...
    const sourceMatch = trimmed.match(/^(?:📌\s*)?(?:\*\*)?Sources?(?:\*\*)?:(?:\*\*)?\s*(.+)$/i);
    if (sourceMatch) {
      if (currentTable) {
        blocks.push({ type: 'table', rows: currentTable });
        currentTable = null;
      }
      blocks.push({ type: 'source', text: sourceMatch[1].trim() });
      continue;
    }

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

    // Markdown Table detection
    const isTableLine = (trimmed.startsWith("|") && trimmed.includes("|", 1)) ||
      (trimmed.endsWith("|") && trimmed.includes("|", 0)) ||
      (/^\|?[\s\-:]+(\|[\s\-:]+)+\|?$/.test(trimmed));

    if (isTableLine) {
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

        if (block.type === 'h2' || block.type === 'h3') {
          return (
            <div key={idx} className="flex items-center gap-2 mt-3.5 mb-2 pb-1.5 border-b border-white/10">
              <span className="w-1.5 h-4 rounded-full bg-accent-warm shadow-[0_0_8px_#ff7a45]" />
              <h4 className="font-display font-extrabold text-white text-sm sm:text-base tracking-tight">
                {parseInlineFormatting(block.text)}
              </h4>
            </div>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote key={idx} className="pl-3 py-1.5 my-2 border-l-2 border-accent-warm bg-accent-warm/5 text-gray-300 italic text-xs rounded-r-lg">
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
          const keyValMatch = block.text.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
          if (keyValMatch) {
            const label = keyValMatch[1];
            const val = keyValMatch[2];
            return (
              <div key={idx} className="flex items-start gap-2.5 my-1.5 p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.045] border border-white/5 hover:border-accent-warm/25 transition-all duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-warm shrink-0 mt-2 shadow-[0_0_8px_#ff7a45]" />
                <div className="flex-1 text-xs sm:text-[0.84rem] min-w-0">
                  <span className="font-bold text-white tracking-tight mr-1.5 font-sans">{label}:</span>
                  <span className="text-gray-300 font-light leading-relaxed">{parseInlineFormatting(val)}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="flex items-start gap-2.5 my-1 leading-relaxed text-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warm shrink-0 mt-2 shadow-[0_0_8px_#ff7a45]" />
              <div className="flex-1 text-xs sm:text-[0.84rem]">{parseInlineFormatting(block.text)}</div>
            </div>
          );
        }

        if (block.type === 'number') {
          return (
            <div key={idx} className="flex items-start gap-2.5 my-1.5 leading-relaxed text-gray-200">
              <span className="w-5 h-5 rounded-full bg-accent-warm/15 text-accent-warm font-mono text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-accent-warm/30 shadow-[0_0_8px_rgba(255,122,69,0.2)]">
                {block.num}
              </span>
              <div className="flex-1 text-xs sm:text-[0.84rem]">{parseInlineFormatting(block.text)}</div>
            </div>
          );
        }

        if (block.type === 'source') {
          return (
            <div key={idx} className="mt-4 pt-3.5 border-t border-white/10">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-[0.68rem] font-sans font-extrabold tracking-wider text-accent-warm uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-warm shrink-0 drop-shadow-[0_0_8px_rgba(255,122,69,0.7)]" />
                  <span>Verified Provenance & Citation</span>
                </span>
                <span className="text-[0.62rem] text-emerald-400 font-sans font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-1 shrink-0 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Authentic Record
                </span>
              </div>

              {/* Structured Source Card */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-accent-warm/[0.08] via-white/[0.02] to-transparent border border-accent-warm/25 shadow-inner backdrop-blur-md flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-accent-warm/15 border border-accent-warm/30 flex items-center justify-center shrink-0 mt-0.5 text-accent-warm shadow-[0_0_10px_rgba(255,122,69,0.2)]">
                  <BookmarkCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-wider block mb-0.5">
                    Citation Origin
                  </span>
                  <div className="text-xs text-gray-200 font-medium leading-relaxed font-sans">
                    {parseInlineFormatting(block.text)}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={idx} className="leading-relaxed text-gray-200 my-1">
            {parseInlineFormatting(block.text)}
          </div>
        );
      })}
    </div>
  );
}

const INITIAL_MESSAGES = [
  {
    type: 'bot',
    text: "Hello! I am **AURA**, Siddharth's AI assistant. I have verified access to Siddharth's 13 GitHub repositories (including `simplyAudio`, `OmniStay ERP`, and `DocuVault`), system architectures, verified work experience, and official resume.\n\nAsk me anything about his technical stack, engineering decisions, or career background!\n\n📌 **Source:** Official Portfolio System & GitHub Ledger"
  }
];

// Adaptive dynamic section styling: frosted glassy dialog reflecting each section's energy
const SECTION_THEMES = {
  hero: {
    name: "Hero",
    bgGlass: "bg-[#09070b]/60",
    topGradient: "from-transparent via-[#ff7a45]/90 to-transparent",
    ambientLight: "from-[#ff7a45]/20 via-amber-500/8 to-transparent",
    radialGlow: "bg-[#ff7a45]/25",
    borderRing: "border-white/18 ring-1 ring-[#ff7a45]/30",
    glowShadow: "shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(255,122,69,0.22)]",
    headerBg: "bg-white/[0.04]",
    accentText: "text-[#ff7a45]",
    accentBorder: "border-[#ff7a45]/40",
    orbGradient: "linear-gradient(135deg, rgba(255, 122, 69, 0.95) 0%, rgba(234, 88, 12, 0.95) 55%, rgba(194, 65, 12, 0.95) 100%)",
    orbShadow: "shadow-[0_0_35px_rgba(255,122,69,0.65),0_12px_28px_rgba(0,0,0,0.6)]"
  },
  about: {
    name: "About",
    bgGlass: "bg-[#030914]/60",
    topGradient: "from-transparent via-cyan-400/90 to-transparent",
    ambientLight: "from-cyan-500/20 via-blue-600/8 to-transparent",
    radialGlow: "bg-cyan-500/25",
    borderRing: "border-white/18 ring-1 ring-cyan-500/30",
    glowShadow: "shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(6,182,212,0.22)]",
    headerBg: "bg-cyan-950/20",
    accentText: "text-cyan-400",
    accentBorder: "border-cyan-500/40",
    orbGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.95) 0%, rgba(14, 116, 144, 0.95) 55%, rgba(15, 23, 42, 0.95) 100%)",
    orbShadow: "shadow-[0_0_35px_rgba(6,182,212,0.65),0_12px_28px_rgba(0,0,0,0.6)]"
  },
  experience: {
    name: "Experience",
    bgGlass: "bg-[#060618]/60",
    topGradient: "from-transparent via-indigo-400/90 to-transparent",
    ambientLight: "from-indigo-500/20 via-blue-600/8 to-transparent",
    radialGlow: "bg-indigo-500/25",
    borderRing: "border-white/18 ring-1 ring-indigo-500/30",
    glowShadow: "shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(99,102,241,0.22)]",
    headerBg: "bg-indigo-950/20",
    accentText: "text-indigo-400",
    accentBorder: "border-indigo-500/40",
    orbGradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(79, 70, 229, 0.95) 55%, rgba(49, 46, 129, 0.95) 100%)",
    orbShadow: "shadow-[0_0_35px_rgba(99,102,241,0.65),0_12px_28px_rgba(0,0,0,0.6)]"
  },
  projects: {
    name: "Projects",
    bgGlass: "bg-[#0c0503]/60",
    topGradient: "from-transparent via-[#ff7a45]/95 to-transparent",
    ambientLight: "from-[#ff7a45]/22 via-orange-600/10 to-transparent",
    radialGlow: "bg-[#ff7a45]/28",
    borderRing: "border-white/18 ring-1 ring-[#ff7a45]/35",
    glowShadow: "shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_55px_rgba(255,122,69,0.25)]",
    headerBg: "bg-[#ff7a45]/[0.05]",
    accentText: "text-accent-warm",
    accentBorder: "border-accent-warm/40",
    orbGradient: "linear-gradient(135deg, rgba(255, 122, 69, 0.95) 0%, rgba(234, 88, 12, 0.95) 55%, rgba(194, 65, 12, 0.95) 100%)",
    orbShadow: "shadow-[0_0_35px_rgba(255,122,69,0.65),0_12px_28px_rgba(0,0,0,0.6)]"
  },
  github: {
    name: "GitHub",
    bgGlass: "bg-[#020e08]/60",
    topGradient: "from-transparent via-emerald-400/90 to-transparent",
    ambientLight: "from-emerald-500/20 via-teal-600/8 to-transparent",
    radialGlow: "bg-emerald-500/25",
    borderRing: "border-white/18 ring-1 ring-emerald-500/30",
    glowShadow: "shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(16,185,129,0.22)]",
    headerBg: "bg-emerald-950/20",
    accentText: "text-emerald-400",
    accentBorder: "border-emerald-500/40",
    orbGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 55%, rgba(6, 78, 59, 0.95) 100%)",
    orbShadow: "shadow-[0_0_35px_rgba(16,185,129,0.65),0_12px_28px_rgba(0,0,0,0.6)]"
  },
  skills: {
    name: "Skills",
    bgGlass: "bg-[#0c0316]/60",
    topGradient: "from-transparent via-purple-400/90 to-transparent",
    ambientLight: "from-purple-500/20 via-violet-600/8 to-transparent",
    radialGlow: "bg-purple-500/25",
    borderRing: "border-white/18 ring-1 ring-purple-500/30",
    glowShadow: "shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(168,85,247,0.22)]",
    headerBg: "bg-purple-950/20",
    accentText: "text-purple-400",
    accentBorder: "border-purple-500/40",
    orbGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.95) 0%, rgba(147, 51, 234, 0.95) 55%, rgba(88, 28, 135, 0.95) 100%)",
    orbShadow: "shadow-[0_0_35px_rgba(168,85,247,0.65),0_12px_28px_rgba(0,0,0,0.6)]"
  },
  newsletter: {
    name: "Newsletter",
    bgGlass: "bg-[#0c0702]/60",
    topGradient: "from-transparent via-amber-400/90 to-transparent",
    ambientLight: "from-amber-500/20 via-orange-500/8 to-transparent",
    radialGlow: "bg-amber-500/25",
    borderRing: "border-white/18 ring-1 ring-amber-400/30",
    glowShadow: "shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(245,158,11,0.22)]",
    headerBg: "bg-amber-950/20",
    accentText: "text-amber-400",
    accentBorder: "border-amber-400/40",
    orbGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 55%, rgba(146, 64, 14, 0.95) 100%)",
    orbShadow: "shadow-[0_0_35px_rgba(245,158,11,0.65),0_12px_28px_rgba(0,0,0,0.6)]"
  },
  contact: {
    name: "Contact",
    bgGlass: "bg-[#0e0307]/60",
    topGradient: "from-transparent via-rose-400/90 to-transparent",
    ambientLight: "from-rose-500/20 via-[#ff7a45]/8 to-transparent",
    radialGlow: "bg-rose-500/25",
    borderRing: "border-white/18 ring-1 ring-rose-400/30",
    glowShadow: "shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(244,63,94,0.22)]",
    headerBg: "bg-rose-950/20",
    accentText: "text-rose-400",
    accentBorder: "border-rose-400/40",
    orbGradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.95) 0%, rgba(225, 29, 72, 0.95) 55%, rgba(159, 18, 57, 0.95) 100%)",
    orbShadow: "shadow-[0_0_35px_rgba(244,63,94,0.65),0_12px_28px_rgba(0,0,0,0.6)]"
  }
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Dynamic active section listener for adaptive frosted glass theme
  useEffect(() => {
    const sectionIds = [
      "hero",
      "about",
      "experience",
      "projects",
      "github",
      "skills",
      "newsletter",
      "contact"
    ];

    const detectActiveSection = () => {
      if (window.scrollY < 200) {
        setCurrentSection("hero");
        return;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
        setCurrentSection("contact");
        return;
      }

      const viewportCenter = window.innerHeight * 0.45;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            setCurrentSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", detectActiveSection, { passive: true });
    window.addEventListener("resize", detectActiveSection, { passive: true });
    detectActiveSection();
    return () => {
      window.removeEventListener("scroll", detectActiveSection);
      window.removeEventListener("resize", detectActiveSection);
    };
  }, []);

  const theme = SECTION_THEMES[currentSection] || SECTION_THEMES.hero;

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
          text: "I encountered an issue connecting to the AI model. You can explore Siddharth's projects directly on [GitHub](https://github.com/musxsid) or [Download his Resume](/resume/Siddharth_Shakyawal_Resume.pdf)!\n\n📌 **Source:** Fallback Local Knowledge Base"
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
      {/* Floating Action Button: Geometric Circular AI Orb */}
      <motion.button
        className={`fixed bottom-6 right-6 w-14 h-14 sm:w-[58px] sm:h-[58px] rounded-full z-[10000] flex items-center justify-center text-white backdrop-blur-2xl border border-white/25 ring-1 ring-white/20 transition-all duration-500 cursor-pointer ${theme.orbShadow} ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        style={{
          background: theme.orbGradient
        }}
        whileHover={{ scale: 1.1, rotate: 6, y: -2 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open AURA AI Assistant"
      >
        {/* Subtle Inner Optical Rim Flare */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/40 pointer-events-none" />

        <div className="relative flex items-center justify-center">
          <AuraLogo size={28} className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]" />
          {/* Luminous Online Status Ping */}
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black/80 shadow-[0_0_10px_#10b981]" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
      </motion.button>

      {/* Sculpted Architectural AURA Chatbot Modal Window with Dynamic Section Frosted Glass */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className={`fixed bottom-4 sm:bottom-6 right-3 sm:right-6 ${theme.bgGlass} backdrop-blur-3xl backdrop-saturate-[180%] ${theme.borderRing} rounded-[28px] sm:rounded-[32px] rounded-br-[12px] sm:rounded-br-[16px] ${theme.glowShadow} z-[10000] flex flex-col overflow-hidden transition-all duration-700 ease-out ${
              isExpanded
                ? "w-[94vw] sm:w-[580px] md:w-[620px] h-[630px] sm:h-[650px] max-h-[88vh]"
                : "w-[92vw] sm:w-[395px] md:w-[415px] h-[520px] sm:h-[545px] max-h-[82vh]"
            }`}
          >
            {/* Ambient Caustics Top Glow & Precision Horizon Line */}
            <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${theme.topGradient} pointer-events-none z-20 transition-all duration-700 ease-out`} />
            <div className={`absolute inset-0 bg-gradient-to-b ${theme.ambientLight} pointer-events-none z-0 transition-all duration-700 ease-out`} />
            <div className={`absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-700 ease-out ${theme.radialGlow}`} />

            {/* Sleek Executive AURA Header with Dynamic Section Tint */}
            <div className={`flex items-center justify-between px-4 py-3 sm:px-4.5 sm:py-3.5 border-b border-white/10 ${theme.headerBg} backdrop-blur-xl relative z-10 transition-colors duration-700`}>
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border ${theme.accentBorder} flex items-center justify-center ${theme.accentText} shadow-[0_0_18px_rgba(255,255,255,0.15)] transition-all duration-500`}>
                    <AuraLogo size={22} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-black/80 shadow-[0_0_8px_#10b981]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight font-display">
                      AURA
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full text-[0.56rem] font-bold font-mono tracking-wider uppercase bg-white/10 text-gray-200 border border-white/15">
                      AI
                    </span>
                    <span className="hidden xs:inline-flex px-2 py-0.5 rounded-full text-[0.6rem] font-sans font-medium tracking-wide bg-white/[0.06] border border-white/10 text-gray-300 backdrop-blur-sm transition-all duration-500">
                      {theme.name}
                    </span>
                  </div>
                  <p className="text-[0.68rem] text-gray-400 font-sans flex items-center gap-1 mt-0.5">
                    <span>Portfolio AI</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-emerald-400 font-medium">Online</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                  title={isExpanded ? "Standard view" : "Expand view"}
                  aria-label="Toggle size"
                >
                  {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button
                  onClick={handleReset}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-red-500/20 hover:border-red-500/40 border border-white/10 text-gray-300 hover:text-red-300 transition-all cursor-pointer shadow-sm active:scale-95"
                  aria-label="Close chat"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Compact Sculpted Messages Area with Deep Frosted Glass Refraction */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 custom-scrollbar bg-black/15 z-10">
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[94%] sm:max-w-[88%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-1 transition-all ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-br from-accent-warm to-[#ea580c] text-white shadow-[0_0_10px_rgba(255,122,69,0.4)]'
                        : 'bg-white/10 text-white border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                    }`}>
                      {msg.type === 'user' ? <User size={14} /> : <AuraLogo size={16} />}
                    </div>

                    {/* Message Bubble Card */}
                    <div className={`text-xs sm:text-[0.82rem] ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-[#ff7a45] via-[#ea580c] to-[#d9480f] text-white font-medium rounded-2xl rounded-tr-xs shadow-[0_4px_20px_rgba(255,122,69,0.35)] px-3.5 py-2.5'
                        : 'bg-white/[0.055] hover:bg-white/[0.07] text-gray-100 rounded-2xl rounded-tl-xs border border-white/15 hover:border-white/25 shadow-xl backdrop-blur-2xl p-3.5 sm:p-4 transition-all'
                    }`}>
                      {msg.type === 'user' ? (
                        <span className="leading-relaxed">{msg.text}</span>
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
                  <div className="flex items-end gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mb-1 border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.1)]">
                      <AuraLogo size={16} />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-xs bg-white/[0.05] border border-white/15 flex items-center gap-2 shadow-xl backdrop-blur-xl">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-accent-warm rounded-full animate-bounce shadow-[0_0_6px_#ff7a45]" />
                        <span className="w-1.5 h-1.5 bg-accent-warm rounded-full animate-bounce shadow-[0_0_6px_#ff7a45]" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-accent-warm rounded-full animate-bounce shadow-[0_0_6px_#ff7a45]" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <span className="text-[0.7rem] text-gray-200 font-sans font-medium">AURA is synthesizing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Frosted Glass & Ambient Glow */}
            <div className="p-3 sm:p-3.5 bg-black/40 border-t border-white/10 backdrop-blur-2xl z-10 transition-colors duration-700">
              <div className="flex items-center gap-2 relative">
                <div className="relative flex-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent-warm/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                    placeholder="Ask about tech stack, projects, resume..."
                    disabled={isTyping}
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-accent-warm/70 focus:bg-white/[0.09] focus:ring-1 focus:ring-accent-warm/50 rounded-full pl-9 pr-3.5 py-2.5 text-xs sm:text-[0.82rem] text-white placeholder-gray-400 focus:outline-none transition-all duration-200 disabled:opacity-50 shadow-inner font-sans"
                  />
                </div>
                <button
                  onClick={() => handleSend(input)}
                  disabled={isTyping || !input.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-r from-accent-warm to-[#ea580c] hover:from-[#ff8a5c] hover:to-[#f97316] text-white hover:shadow-[0_0_18px_rgba(255,122,69,0.5)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
