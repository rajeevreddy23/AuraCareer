/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Briefcase, FileText, Github, Brain, Award, Play, Terminal } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectTab }: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: Briefcase, category: 'Navigation', desc: 'View career score, application progress, and overall skills' },
    { id: 'resume', label: 'Resume Intelligence', icon: FileText, category: 'Navigation', desc: 'Score resume, verify ATS compatibility, rewrite bullet points' },
    { id: 'portfolio', label: 'GitHub Portfolio Analyzer', icon: Github, category: 'Navigation', desc: 'Analyze repo quality, languages, and calculate dev ratings' },
    { id: 'match', label: 'Job Matching Engine', icon: Award, category: 'Navigation', desc: 'Compare your profile against any custom job description' },
    { id: 'interview', label: 'Mock Interview Coach', icon: Play, category: 'Navigation', desc: 'Simulate high-pressure coding or architectural interviews' },
    { id: 'learning', label: 'AI Learning Planner', icon: Brain, category: 'Navigation', desc: 'Access customized day-by-day technological curriculums' },
    { id: 'projects', label: 'Portfolio Project Builder', icon: Terminal, category: 'Navigation', desc: 'Generate system architecture designs and full project plans' },
  ];

  const filtered = commands.filter(
    c => c.label.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Palette Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -8 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12]/95 shadow-2xl backdrop-blur-md"
        >
          {/* Search Input */}
          <div className="flex items-center border-b border-white/5 px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search features, tools, or agents... (e.g. Resume, Interview)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-700 outline-none"
              autoFocus
            />
            <span className="rounded border border-white/10 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 shadow-sm">
              ESC
            </span>
          </div>

          {/* Results list */}
          <div className="max-h-[300px] overflow-y-auto px-2 py-3">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No features or agents matched your search queries.
              </div>
            ) : (
              <div>
                <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  AURA Operations
                </div>
                {filtered.map(cmd => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        onSelectTab(cmd.id);
                        onClose();
                      }}
                      className="flex w-full items-start rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5"
                    >
                      <div className="mr-3 rounded-md bg-[#0d0d12] p-1.5 text-blue-400 border border-white/5">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-semibold text-zinc-100">{cmd.label}</div>
                        <div className="truncate text-[11px] text-zinc-400">{cmd.desc}</div>
                      </div>
                      <div className="ml-2 text-[10px] font-mono text-zinc-500 self-center">
                        Jump
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/5 bg-zinc-950/40 px-4 py-2.5 text-[10px] text-zinc-500">
            <div>
              Use <span className="font-mono text-zinc-400">↑↓</span> to navigate and <span className="font-mono text-zinc-400">Enter</span> to select
            </div>
            <div>
              AURA Operating System v1.0
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
