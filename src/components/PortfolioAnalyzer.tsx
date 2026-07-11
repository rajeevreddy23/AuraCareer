/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Github,
  Star,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  GitBranch,
  FileCode,
  Terminal
} from 'lucide-react';
import { GitHubAnalysis } from '../types.js';

interface PortfolioAnalyzerProps {
  githubAnalyses: GitHubAnalysis[];
  onAnalyzeGitHub: (username: string) => Promise<void>;
}

export default function PortfolioAnalyzer({ githubAnalyses, onAnalyzeGitHub }: PortfolioAnalyzerProps) {
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    setIsAnalyzing(true);
    try {
      await onAnalyzeGitHub(username);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeAnalysis = githubAnalyses[0] || null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-white">
          AI GitHub Portfolio Auditor
        </h1>
        <p className="text-sm text-zinc-400">
          Audit repository star ratios, code complexity indices, README detailed structures, and language allocations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Input GitHub Profile */}
        <div className="space-y-6">
          <div className="rounded-2xl glass p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Github className="h-4 w-4 text-blue-500" /> Connect GitHub Account
            </h2>
            <p className="text-[11px] text-zinc-500 mb-4">
              Enter any developer username to crawl and perform a technical audit.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">GitHub Username</label>
                <div className="relative mt-1 flex rounded-lg border border-white/10 bg-[#0d0d12] overflow-hidden">
                  <span className="flex items-center pl-3 text-zinc-600 text-xs font-mono">github.com/</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. alexrivera-dev"
                    className="w-full bg-transparent p-2.5 text-xs text-zinc-200 outline-none placeholder-zinc-700 font-mono"
                  />
                </div>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !username.trim()}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {isAnalyzing ? "Crawling commits..." : "Scan & Audit GitHub"}
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="rounded-2xl glass p-5">
            <h3 className="text-xs font-semibold text-zinc-400 mb-2">Audit Indicators</h3>
            <div className="text-[11px] text-zinc-400 space-y-2 leading-relaxed">
              <p>• <span className="font-semibold text-zinc-300">Commit Quality:</span> Reviews commit descriptions, spacing, and frequency logs.</p>
              <p>• <span className="font-semibold text-zinc-300">README Readability:</span> Audits the presence of setup guidelines, API maps, and system diagrams.</p>
              <p>• <span className="font-semibold text-zinc-300">Role Density:</span> Maps codebase files to calculate exact Frontend, Backend, and AI percentages.</p>
            </div>
          </div>
        </div>

        {/* Right Columns: Analysis Results */}
        <div className="space-y-6 lg:col-span-2">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="rounded-full border-2 border-blue-500 border-t-transparent p-4"
              />
              <h3 className="mt-6 text-sm font-bold text-zinc-200">Executing Deep Code Crawl...</h3>
              <p className="mt-2 text-xs text-zinc-500 max-w-sm">
                AURA Portfolio Agent is reviewing repository branches, file sizes, testing densities, and commit descriptors.
              </p>
            </div>
          ) : activeAnalysis ? (
            <div className="space-y-6">
              {/* Header card and global developer scores */}
              <div className="rounded-2xl glass p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-400 border border-blue-500/20">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Connected Sandbox</span>
                      <h2 className="text-md font-bold text-zinc-200">@{activeAnalysis.username}</h2>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Audited: {new Date(activeAnalysis.analyzedAt).toLocaleDateString()}</span>
                </div>

                {/* Role Specific Tech Scores (Frontend, Backend, AI) */}
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-zinc-400 mb-4">Calculated Developer Role Density</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { name: "Frontend Rating", score: activeAnalysis.devScore.frontend, col: "from-blue-500 to-indigo-600", border: "border-blue-500/20" },
                      { name: "Backend Systems", score: activeAnalysis.devScore.backend, col: "from-purple-500 to-indigo-700", border: "border-purple-500/20" },
                      { name: "AI Core Architectures", score: activeAnalysis.devScore.ai, col: "from-emerald-400 to-teal-600", border: "border-emerald-500/20" }
                    ].map((role, idx) => (
                      <div key={idx} className={`rounded-lg bg-[#0d0d12] p-4 border ${role.border} flex flex-col justify-between h-[110px]`}>
                        <span className="text-[11px] font-medium text-zinc-500">{role.name}</span>
                        <div>
                          <span className="font-mono text-3xl font-extrabold tracking-tight text-zinc-200">{role.score}%</span>
                          <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${role.col} rounded-full`} style={{ width: `${role.score}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Languages & Code parameters */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Custom SVG Language percentage chart */}
                <div className="rounded-2xl glass p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                    <FileCode className="h-4 w-4 text-blue-500" /> Compiled Repository Languages
                  </h3>
                  <div className="space-y-3">
                    {activeAnalysis.languages.map((lang, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center text-xs font-medium text-zinc-400 mb-1">
                          <span className="font-mono">{lang.name}</span>
                          <span className="font-mono">{lang.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0d0d12] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-amber-500" : idx === 2 ? "bg-emerald-500" : "bg-zinc-500"
                            }`}
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commit and README indexes */}
                <div className="rounded-2xl glass p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                    <GitBranch className="h-4 w-4 text-sky-400" /> Repository Health Indices
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs text-zinc-400 mb-1">
                        <span>Commit Description Quality</span>
                        <span className="font-mono font-bold text-zinc-300">{activeAnalysis.commitQualityScore}/100</span>
                      </div>
                      <div className="h-2 w-full bg-[#0d0d12] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-500 to-blue-500" style={{ width: `${activeAnalysis.commitQualityScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-xs text-zinc-400 mb-1">
                        <span>README Documentation Detail</span>
                        <span className="font-mono font-bold text-zinc-300">{activeAnalysis.readmeQualityScore}/100</span>
                      </div>
                      <div className="h-2 w-full bg-[#0d0d12] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: `${activeAnalysis.readmeQualityScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Audited Repositories */}
              <div className="rounded-2xl glass p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-purple-400" /> Audited Core Repositories
                </h3>
                <div className="space-y-3">
                  {activeAnalysis.keyRepositories.map((repo, idx) => (
                    <div key={idx} className="rounded-lg bg-[#0d0d12] border border-white/5 p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-zinc-200 hover:underline cursor-pointer flex items-center gap-1">
                          <Github className="h-3.5 w-3.5 text-zinc-500" /> {repo.name}
                        </h4>
                        <div className="flex items-center gap-1 font-mono text-[11px] text-amber-500 font-semibold bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10">
                          <Star className="h-3 w-3 fill-amber-400" /> {repo.stars}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{repo.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {repo.languages.map((l, i) => (
                          <span key={i} className="rounded bg-zinc-900 border border-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Suggestions */}
              <div className="rounded-2xl glass p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-1.5 mb-3">
                  <AlertCircle className="h-4 w-4" /> Strategic Portfolio Enhancements
                </h3>
                <ul className="space-y-3">
                  {activeAnalysis.suggestions.map((sug, i) => (
                    <li key={i} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-3 border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                      <span className="rounded bg-blue-500/10 text-blue-400 px-1.5 py-0.5 font-mono text-[10px] border border-blue-500/20">
                        {i + 1}
                      </span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <Github className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-sm font-bold text-zinc-300">No GitHub Audited</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                Enter your GitHub profile name in the left panel to trigger a developer-role complexity audit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
