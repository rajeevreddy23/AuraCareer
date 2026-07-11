/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Zap,
  TrendingUp,
  Brain,
  ListRestart
} from 'lucide-react';
import { ResumeAnalysis } from '../types.js';

interface ResumeIntelProps {
  resumeAnalyses: ResumeAnalysis[];
  onAnalyzeResume: (text: string) => Promise<void>;
}

// Highly realistic developer resumes to let the user immediately trigger deep analysis
const PRESETS = [
  {
    name: "Alex Rivera - Standard Full-Stack Resume",
    text: `Alex Rivera
alex.rivera@example.com | San Francisco, CA

PROFESSIONAL EXPERIENCE:
Stripe, Software Engineer II (2023 - Present)
- Worked on merchant billing flows using React and Node.js.
- Cleaned up database queries to make it faster.
- Fixed consumer checkout ticket bugs.

Vercel, Frontend Engineer (2021 - 2023)
- Maintained React features and solved customer tickets.
- Worked on the Next.js landing dashboard page.
- Created a side project using Python and AI to search files.

EDUCATION:
University of California, Berkeley - B.S. in Computer Science (2021)

SKILLS:
React, Node.js, JavaScript, HTML, CSS, Git, Python, SQL`
  },
  {
    name: "John Doe - Junior Web Developer Resume",
    text: `John Doe
johndoe@example.com

EXPERIENCE:
Freelance Web Creator (2024 - 2026)
- Built website pages for small local restaurants.
- Fixed HTML bugs on WordPress.
- Setup hosting using cPanel.

EDUCATION:
High School Graduate (2023)

SKILLS:
HTML, CSS, basic JS, WordPress`
  }
];

export default function ResumeIntel({ resumeAnalyses, onAnalyzeResume }: ResumeIntelProps) {
  const [customText, setCustomText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysis | null>(resumeAnalyses[0] || null);

  const handlePresetAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    try {
      await onAnalyzeResume(text);
      // Wait for state sync, we will grab the latest added item
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCustomAnalyze = async () => {
    if (!customText.trim()) return;
    setIsAnalyzing(true);
    try {
      await onAnalyzeResume(customText);
      setCustomText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // When a new analysis is added, auto-select it as the active item
  const latestAnalysis = resumeAnalyses[0] || null;
  const currentSelected = activeAnalysis || latestAnalysis;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-white">
          Advanced Resume Intelligence Engine
        </h1>
        <p className="text-sm text-zinc-400">
          Upload your resume text, review ATS rankings, and analyze targeted impact-driven bullet rewrites.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Upload Resume / Select Preset */}
        <div className="space-y-6">
          {/* Preset trigger box */}
          <div className="rounded-2xl glass p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <ListRestart className="h-4 w-4 text-blue-500" /> Choose Professional Sample
            </h2>
            <p className="text-[11px] text-zinc-500 mb-4">
              Test AURA's extraction capabilities instantly by selecting a sample developer resume.
            </p>
            <div className="space-y-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  disabled={isAnalyzing}
                  onClick={() => {
                    setActiveAnalysis(null); // Reset to auto-select latest
                    handlePresetAnalyze(preset.text);
                  }}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900/50 p-3 text-left text-xs text-zinc-300 transition hover:border-blue-500 hover:bg-zinc-800/80 disabled:opacity-50"
                >
                  <div className="font-bold text-zinc-200">{preset.name}</div>
                  <div className="mt-1 text-[10px] text-zinc-500">Crawl, parse, and score with Gemini API</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Upload Input */}
          <div className="rounded-2xl glass p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Upload className="h-4 w-4 text-sky-400" /> Copy & Paste Resume Text
            </h2>
            <p className="text-[11px] text-zinc-500 mb-4">
              Paste standard plain text of your resume to parse.
            </p>
            <textarea
              rows={8}
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Paste professional experience, education, and skills sections here..."
              className="w-full rounded-lg border border-white/10 bg-[#0d0d12] p-3 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleCustomAnalyze}
              disabled={isAnalyzing || !customText.trim()}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isAnalyzing ? "Processing AI Agents..." : "Analyze Custom Resume"}
            </button>
          </div>

          {/* History selection */}
          {resumeAnalyses.length > 1 && (
            <div className="rounded-2xl glass p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Analysis History</h2>
              <div className="space-y-1.5">
                {resumeAnalyses.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveAnalysis(item)}
                    className={`w-full rounded-lg p-2.5 text-left text-xs transition border ${
                      currentSelected?.id === item.id
                        ? "agent-active border-blue-500/50 text-white"
                        : "bg-transparent border-transparent hover:bg-white/5 text-zinc-400"
                    }`}
                  >
                    <div className="font-semibold truncate">{item.fileName}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      Overall: {item.overallScore}% | {new Date(item.analyzedAt).toLocaleTimeString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Analysis Scores, Strengths, Before/After Comparisons */}
        <div className="space-y-6 lg:col-span-2">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="rounded-full border-2 border-blue-500 border-t-transparent p-4"
              />
              <h3 className="mt-6 text-sm font-bold text-zinc-200">Orchestrating specialized AI Agents...</h3>
              <p className="mt-2 text-xs text-zinc-500 max-w-sm">
                The AURA AI Router has delegated to the Resume Intelligence Agent. Generating ATS rankings, recruiter insights, and impact-driven rewrites.
              </p>
            </div>
          ) : currentSelected ? (
            <div className="space-y-6">
              {/* Score breakdown bar */}
              <div className="rounded-2xl glass p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Resume Metrics</span>
                    <h2 className="text-md font-bold text-zinc-200">{currentSelected.fileName}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Overall Grade:</span>
                    <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 font-mono text-xl font-bold text-blue-400">
                      {currentSelected.overallScore}%
                    </span>
                  </div>
                </div>

                {/* Score Grid indicators */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "ATS Score", val: currentSelected.atsScore, col: "bg-emerald-500" },
                    { label: "Recruiter Appeal", val: currentSelected.recruiterScore, col: "bg-blue-500" },
                    { label: "Technical Depth", val: currentSelected.technicalScore, col: "bg-purple-500" }
                  ].map((score, i) => (
                    <div key={i} className="rounded-lg bg-[#0d0d12] p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-zinc-400 font-medium">{score.label}</span>
                        <span className="font-mono text-sm font-semibold text-zinc-300">{score.val}%</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${score.col} rounded-full`} style={{ width: `${score.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-white/5 pt-4">
                  <h3 className="text-xs font-semibold text-zinc-400">Recruiter Impression Summary</h3>
                  <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{currentSelected.summary}</p>
                </div>
              </div>

              {/* Strengths & Weaknesses checklists */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl glass p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                    <CheckCircle className="h-4 w-4" /> Professional Strengths
                  </h3>
                  <ul className="space-y-2">
                    {currentSelected.strengths.map((st, i) => (
                      <li key={i} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span> {st}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl glass p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-3">
                    <AlertCircle className="h-4 w-4" /> Resume Gaps & Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {currentSelected.weaknesses.map((wk, i) => (
                      <li key={i} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span> {wk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Keywords Stack */}
              <div className="rounded-2xl glass p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-3">
                  <Brain className="h-4 w-4 text-purple-400" /> Missing ATS Keyterms
                </h3>
                <p className="text-[11px] text-zinc-500 mb-3">
                  Incorporate these terms inside your experience blocks to unlock advanced technical filters.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentSelected.missingKeywords.map((kw, i) => (
                    <span key={i} className="rounded-md bg-[#0d0d12] border border-white/5 px-2.5 py-1 text-xs font-mono text-purple-300">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Before/After Comparisons rewrite list */}
              <div className="rounded-2xl glass p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 mb-4">
                  <Zap className="h-4 w-4 text-blue-500" /> Active Bullet-Point Optimizations
                </h3>
                <div className="space-y-4">
                  {currentSelected.bulletPointsImprovements.map((bp, i) => (
                    <div key={i} className="rounded-xl bg-[#0d0d12] border border-white/5 overflow-hidden">
                      {/* Before label */}
                      <div className="bg-zinc-900/20 px-4 py-2 border-b border-white/5 text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                        Original Phrase
                      </div>
                      <div className="p-4 text-xs text-zinc-400 italic">
                        "{bp.before}"
                      </div>

                      {/* After label */}
                      <div className="bg-zinc-900/20 px-4 py-2 border-t border-b border-white/5 text-[10px] uppercase font-mono text-emerald-500 font-semibold tracking-wider flex justify-between">
                        AURA Intelligent Rewrite
                        <span className="text-[9px] text-zinc-500 font-normal">Impact score boost</span>
                      </div>
                      <div className="p-4 text-xs text-emerald-300 font-medium">
                        "{bp.after}"
                      </div>

                      {/* Recruiter Justification */}
                      <div className="bg-zinc-900/10 px-4 py-3 border-t border-white/5 text-[11px] text-zinc-500">
                        <span className="font-semibold text-zinc-400">Recruiter Reasoning:</span> {bp.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry summary comparative description */}
              <div className="rounded-2xl glass p-5 flex gap-4">
                <TrendingUp className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-zinc-300">Industry Trajectory Comparison</h4>
                  <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">{currentSelected.industryComparison}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <FileText className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-sm font-bold text-zinc-300">No Resume Loaded</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                Select a sample professional resume on the left panel or paste your custom details to initiate the AI Career Audit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
