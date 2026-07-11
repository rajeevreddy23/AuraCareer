/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Terminal,
  Layers,
  ChevronRight,
  Cpu,
  Database,
  Calendar,
  FileCode,
  Copy,
  Check
} from 'lucide-react';
import { ProjectSuggestion } from '../types.js';

interface ProjectBuilderProps {
  projects: ProjectSuggestion[];
  onGenerateProject: (goal: 'frontend' | 'backend' | 'ai_engineer') => Promise<void>;
}

export default function ProjectBuilder({ projects, onGenerateProject }: ProjectBuilderProps) {
  const [goal, setGoal] = useState<'frontend' | 'backend' | 'ai_engineer'>('ai_engineer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateProject(goal);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeProject = projects[0] || null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-white">
          AI Portfolio Project Architect
        </h1>
        <p className="text-sm text-zinc-400">
          Synthesize full architectural diagrams, database structures, phased development blueprints, and copyable GitHub README files for top-tier portfolios.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Form Setup */}
        <div className="space-y-6">
          <div className="rounded-2xl glass p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-blue-500" /> Plan Project Target
            </h2>
            <p className="text-[11px] text-zinc-500">
              Select your career milestone target. The AURA CTO Agent will architect a production-grade custom startup idea.
            </p>
            <div>
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Target Job Specialization</label>
              <div className="mt-1 grid gap-2">
                {[
                  { id: 'frontend', label: 'Senior Frontend Developer', desc: 'Focus on high-speed UI architectures' },
                  { id: 'backend', label: 'Backend Systems Engineer', desc: 'Focus on databases, scaling & APIs' },
                  { id: 'ai_engineer', label: 'AI Applications Engineer', desc: 'Focus on RAG, LLMs & Agents' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setGoal(opt.id as any)}
                    className={`w-full rounded-lg p-3 text-left transition border ${
                      goal === opt.id
                        ? "agent-active border-blue-500/50 text-white"
                        : "bg-[#0d0d12]/40 border-white/5 text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="font-bold text-xs">{opt.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              {isGenerating ? "Architecting schemas..." : "Synthesize Portfolio Project"}
            </button>
          </div>
        </div>

        {/* Right Columns: Architectural Suggestion */}
        <div className="space-y-6 lg:col-span-2">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="rounded-full border-2 border-blue-500 border-t-transparent p-4"
              />
              <h3 className="mt-6 text-sm font-bold text-zinc-200">Drafting system blueprints...</h3>
              <p className="mt-2 text-xs text-zinc-500 max-w-sm">
                AURA Strategy Agent is designing database relations, microservice flows, and compiling a comprehensive copyable README file via Gemini API.
              </p>
            </div>
          ) : activeProject ? (
            <div className="space-y-6">
              {/* Header block and tech stack list */}
              <div className="rounded-2xl glass p-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {activeProject.goal === 'frontend' ? 'Frontend Track' : activeProject.goal === 'backend' ? 'Backend Systems Track' : 'AI Systems Architect Track'}
                </span>
                <h2 className="text-md font-bold text-zinc-200 mt-2">{activeProject.title}</h2>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{activeProject.description}</p>

                {/* Tech stacks */}
                <div className="mt-5 border-t border-white/5 pt-4">
                  <h3 className="text-xs font-semibold text-zinc-400 mb-2">Designed Tech Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.techStack.map((tech, idx) => (
                      <span key={idx} className="rounded-md bg-[#0d0d12] border border-white/5 px-2.5 py-1 text-xs font-mono text-zinc-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Architecture and DB schema */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* System Architecture */}
                <div className="rounded-2xl glass p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 text-blue-500" /> System Architecture
                    </h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                      High-level model representation designed by our startup CTO.
                    </p>
                  </div>
                  <pre className="rounded bg-[#0d0d12] border border-white/5 p-3.5 text-[10px] font-mono text-blue-300 overflow-x-auto leading-relaxed">
                    {activeProject.architecture}
                  </pre>
                </div>

                {/* Database Design */}
                <div className="rounded-2xl glass p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                      <Database className="h-4 w-4 text-sky-400" /> Database Relational Schema
                    </h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                      Entity relationship outline and model definitions.
                    </p>
                  </div>
                  <pre className="rounded bg-[#0d0d12] border border-white/5 p-3.5 text-[10px] font-mono text-sky-300 overflow-x-auto leading-relaxed">
                    {activeProject.databaseDesign}
                  </pre>
                </div>
              </div>

              {/* Phased Roadmap Plan */}
              <div className="rounded-2xl glass p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                  <Calendar className="h-4.5 w-4.5 text-violet-400" /> Phased Deliverables Schedule
                </h3>
                <div className="space-y-4">
                  {activeProject.developmentPlan.map((phase, idx) => (
                    <div key={idx} className="rounded-lg bg-[#0d0d12] p-4 border border-white/5">
                      <h4 className="text-xs font-bold text-zinc-200">{phase.phase}</h4>
                      <div className="mt-2.5 space-y-1 text-xs text-zinc-400">
                        {phase.tasks.map((task, i) => (
                          <p key={i}>• {task}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub markdown README */}
              <div className="rounded-2xl glass p-6 relative">
                <button
                  onClick={() => handleCopy(activeProject.readmeMarkdown)}
                  className="absolute top-5 right-5 flex items-center gap-1 rounded bg-[#0d0d12] border border-white/10 px-2 py-1 text-[10px] text-zinc-400 hover:text-zinc-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" /> Copied README
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy Markdown
                    </>
                  )}
                </button>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-1.5">
                  <FileCode className="h-4.5 w-4.5 text-blue-500" /> Generated GitHub README.md
                </h3>
                <div className="max-h-[350px] overflow-y-auto rounded-lg bg-[#0d0d12] border border-white/5 p-4">
                  <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {activeProject.readmeMarkdown}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <Layers className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-sm font-bold text-zinc-300">Architect Idle</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                Select your target career milestone on the left panel to compile a customized full-stack startup blueprint.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
