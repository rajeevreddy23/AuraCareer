/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  MessageSquare,
  Sparkles,
  User,
  Trash2,
  FileText,
  Github,
  Award,
  Play,
  Brain,
  Terminal,
  Compass
} from 'lucide-react';
import { ChatMessage } from '../types.js';

interface AuraChatProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => Promise<void>;
}

const QUICK_PROMPTS = [
  { text: "What career matches React and Node.js?", icon: Compass, color: "text-amber-400" },
  { text: "Rewrite: 'Fixed bugs and deployed servers.'", icon: FileText, color: "text-indigo-400" },
  { text: "Give me an advanced system design mock question.", icon: Play, color: "text-emerald-400" },
  { text: "Suggest a portfolio project for an AI Architect.", icon: Terminal, color: "text-sky-400" }
];

export default function AuraChat({ chatHistory, onSendMessage, onClearHistory }: AuraChatProps) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isSending]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const originalText = inputText;
    setInputText('');
    setIsSending(true);
    try {
      await onSendMessage(originalText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPromptClick = (text: string) => {
    setInputText(text);
  };

  // Helper badge renderers for specialized agent tags
  const getAgentBadge = (agentId: string | undefined) => {
    if (!agentId) return { label: "AURA Router", style: "bg-amber-500/10 text-amber-400 border-amber-500/20" };

    const maps: Record<string, { label: string, style: string }> = {
      resume_intelligence: { label: "Resume Agent", style: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" },
      career_strategy: { label: "Strategy Agent", style: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
      interview_coach: { label: "Interview Coach", style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
      skill_gap_analyzer: { label: "Skill Analyzer", style: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
      job_matching: { label: "Job Matcher", style: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
      learning_planner: { label: "Learning Agent", style: "bg-teal-500/15 text-teal-400 border-teal-500/20" },
      portfolio_reviewer: { label: "Portfolio Agent", style: "bg-rose-500/15 text-rose-400 border-rose-500/20" }
    };

    return maps[agentId] || { label: "AURA Agent", style: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  };

  return (
    <div className="flex flex-col rounded-2xl glass overflow-hidden h-[540px]">
      {/* Chat header */}
      <div className="flex justify-between items-center border-b border-white/5 bg-[#0d0d12]/20 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <div>
            <h2 className="text-xs font-bold text-zinc-200">AURA Unified Workspace</h2>
            <p className="text-[10px] text-zinc-500">Autonomous Router & Career Multi-Agents</p>
          </div>
        </div>
        <button
          onClick={onClearHistory}
          title="Clear chat log"
          className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-300 transition hover:bg-zinc-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6 space-y-6">
            <div className="rounded-full bg-blue-500/10 p-4 border border-blue-500/20 text-blue-400">
              <MessageSquare className="h-8 w-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-200">AURA Dialogue Lounge</h3>
              <p className="mt-1 text-[11px] text-zinc-500 max-w-sm leading-relaxed">
                Initiate a dynamic discussion. The AURA Router Agent will automatically delegate your query to specialized career specialists.
              </p>
            </div>

            {/* Quick starts */}
            <div className="grid gap-2 max-w-lg w-full sm:grid-cols-2 text-left">
              {QUICK_PROMPTS.map((qp, i) => {
                const Icon = qp.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleQuickPromptClick(qp.text)}
                    className="rounded-lg border border-white/10 bg-zinc-900/50 p-3 text-xs text-zinc-300 hover:bg-zinc-800/80 hover:border-blue-500 transition flex items-start gap-2.5"
                  >
                    <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${qp.color}`} />
                    <span>{qp.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              const badge = getAgentBadge(msg.agentId);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {/* User/Agent Avatar */}
                  <div className={`rounded-lg p-1.5 h-8 w-8 flex items-center justify-center border flex-shrink-0 ${
                    isUser ? "bg-zinc-900 border-white/15 text-blue-400" : "bg-blue-600 border-blue-500 text-white"
                  }`}>
                    {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>

                  {/* Bubble content */}
                  <div>
                    {/* Badge header */}
                    {!isUser && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold border ${badge.style}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}

                    <div className={`rounded-xl px-4 py-2.5 text-xs leading-relaxed border ${
                      isUser
                        ? "bg-zinc-800 border-white/10 text-zinc-100"
                        : "bg-[#0d0d12] border-white/5 text-zinc-300"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated loading indicator */}
            {isSending && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="rounded-lg p-1.5 h-8 w-8 flex items-center justify-center bg-blue-600 border border-blue-500 text-white flex-shrink-0">
                  <Sparkles className="h-4 w-4 animate-spin" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold border bg-zinc-500/10 text-zinc-400 border-zinc-500/20 animate-pulse">
                      Router active
                    </span>
                  </div>
                  <div className="rounded-xl px-4 py-2.5 text-xs text-zinc-500 bg-[#0d0d12] border border-white/5 flex items-center gap-1.5">
                    Orchestrating agent workflows...
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-white/5 bg-[#0d0d12]/20 px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isSending}
            placeholder="Type your question or request... (e.g. Optimize my resume)"
            className="w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-blue-500 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !inputText.trim()}
            className="rounded-lg bg-blue-600 px-3.5 text-white hover:bg-blue-500 transition disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
