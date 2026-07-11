/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  CheckCircle,
  AlertCircle,
  Zap,
  Briefcase,
  Layers
} from 'lucide-react';
import { JobMatchResult } from '../types.js';

interface JobMatchProps {
  jobMatches: JobMatchResult[];
  onAnalyzeMatch: (title: string, desc: string) => Promise<void>;
}

const PRESETS = [
  {
    title: "OpenAI - AI Applications Engineer",
    company: "OpenAI",
    desc: `OpenAI is seeking an AI Applications Engineer to bridge high-scale server pipelines with large language model APIs.

Responsibilities:
- Build and optimize Retrieval-Augmented Generation (RAG) semantic indexing systems.
- Leverage vector databases (Chroma, Pinecone) to manage highly-scaled multi-tenant semantic embeddings.
- Implement strict JSON schema parsing and validations using Zod.
- Refactor complex Next.js routers and Python data engines.

Requirements:
- Advanced expertise in TypeScript, React, and Python.
- Proven familiarity with prompt engineering, LLM observability pipelines, and LLM evaluations.`
  },
  {
    title: "Stripe - Staff Frontend Architect",
    company: "Stripe",
    desc: `Stripe is seeking an expert Staff Frontend Architect to lead the engineering of next-generation client payment elements.

Key Skills Needed:
- Mastery of raw React, TypeScript, and micro-frontend structures.
- In-depth understanding of high-concurrency event loops, web workers, and browser rendering metrics.
- Familiarity with CI/CD optimization, Bazel, or complex monorepo compilation systems.`
  }
];

export default function JobMatch({ jobMatches, onAnalyzeMatch }: JobMatchProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeMatch, setActiveMatch] = useState<JobMatchResult | null>(jobMatches[0] || null);

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setJobTitle(preset.title);
    setJobDescription(preset.desc);
  };

  const handleAnalyze = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      await onAnalyzeMatch(jobTitle, jobDescription);
      // Wait for state sync, we will grab latest added item
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const latestMatch = jobMatches[0] || null;
  const currentSelected = activeMatch || latestMatch;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-white">
          AI Job Matching Engine
        </h1>
        <p className="text-sm text-zinc-400">
          Contrast your professional profile qualifications against any custom job description. Identify missing skills and generate study action plans.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Job Description inputs & presets */}
        <div className="space-y-6">
          {/* Presets */}
          <div className="rounded-2xl glass p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-500" /> Choose Predefined Job
            </h2>
            <div className="space-y-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(p)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900/50 p-2.5 text-left text-xs text-zinc-300 transition hover:border-blue-500 hover:bg-zinc-800/80"
                >
                  <div className="font-bold text-zinc-200">{p.title}</div>
                  <div className="text-[10px] text-zinc-500">{p.company}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form input */}
          <div className="rounded-2xl glass p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-sky-400" /> Enter Custom Job
            </h2>
            <div>
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Job Title / Target Role</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Machine Learning Developer"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Job Description</label>
              <textarea
                rows={8}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job post text, requirements, responsibilities..."
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] p-3 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobTitle.trim() || !jobDescription.trim()}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isAnalyzing ? "Comparing stacks..." : "Calculate Job Compatibility"}
            </button>
          </div>

          {/* Past matches list */}
          {jobMatches.length > 1 && (
            <div className="rounded-2xl glass p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Previous Matches</h2>
              <div className="space-y-1.5">
                {jobMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => setActiveMatch(match)}
                    className={`w-full rounded-lg p-2.5 text-left text-xs transition border ${
                      currentSelected?.id === match.id
                        ? "agent-active border-blue-500/50 text-white"
                        : "bg-transparent border-transparent hover:bg-white/5 text-zinc-400"
                    }`}
                  >
                    <div className="font-semibold truncate">{match.jobTitle}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      Company: {match.companyName} | Match: {match.matchPercentage}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Match results */}
        <div className="space-y-6 lg:col-span-2">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="rounded-full border-2 border-blue-500 border-t-transparent p-4"
              />
              <h3 className="mt-6 text-sm font-bold text-zinc-200">Analyzing compatibility criteria...</h3>
              <p className="mt-2 text-xs text-zinc-500 max-w-sm">
                AURA Job Match Agent is examining core prerequisites, technical stack overlap, and project experience matrices via Gemini API.
              </p>
            </div>
          ) : currentSelected ? (
            <div className="space-y-6">
              {/* Overall compatibility percentage */}
              <div className="rounded-2xl glass p-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{currentSelected.companyName}</span>
                <h2 className="text-md font-bold text-zinc-200 mt-0.5">{currentSelected.jobTitle}</h2>

                {/* Compatibility Progress Indicator */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0d0d12] rounded-xl p-5 border border-white/5">
                  <div>
                    <span className="text-xs text-zinc-500">Compatibility Rating</span>
                    <div className="mt-1 font-mono text-4xl font-extrabold tracking-tight text-zinc-200">
                      {currentSelected.matchPercentage}%
                    </div>
                  </div>
                  <div className="flex-1 max-w-[280px]">
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          currentSelected.matchPercentage >= 80 ? "bg-emerald-500" : currentSelected.matchPercentage >= 60 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${currentSelected.matchPercentage}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[10px] text-zinc-500 leading-relaxed">
                      {currentSelected.matchPercentage >= 80
                        ? "Highly compatible. Excellent credentials alignment."
                        : currentSelected.matchPercentage >= 60
                        ? "Moderate compatibility. Deficits in advanced criteria detected."
                        : "Low compatibility. Substantial tech stack omissions identified."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strong Matches vs Missing Skills */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Strong Matches */}
                <div className="rounded-2xl glass p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                    <CheckCircle className="h-4.5 w-4.5" /> Strong Qualification Alignment
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSelected.strongMatches.map((item, idx) => (
                      <span key={idx} className="rounded bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-1 text-xs font-mono text-emerald-300">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="rounded-2xl glass p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-3">
                    <AlertCircle className="h-4.5 w-4.5" /> Core Skill Deficits
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSelected.missingSkills.map((item, idx) => (
                      <span key={idx} className="rounded bg-amber-500/5 border border-amber-500/20 px-2.5 py-1 text-xs font-mono text-amber-300">
                        ✗ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Plan before applying */}
              <div className="rounded-2xl glass p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-1.5 mb-4">
                  <Zap className="h-4.5 w-4.5" /> Strategic Study & Action Plan
                </h3>
                <p className="text-[11px] text-zinc-500 mb-4">
                  Deploy these specific engineering measures on your career profile before filing your formal application to increase response callbacks.
                </p>
                <div className="space-y-3">
                  {currentSelected.actionPlan.map((action, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-[#0d0d12] p-3.5 border border-white/5">
                      <span className="rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 font-mono text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <Award className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-sm font-bold text-zinc-300">No Job Compared</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                Choose a predefined job template on the left panel or paste a custom description to review tech stack alignments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
