/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Award,
  ChevronRight,
  MessageSquare,
  Activity,
  Send,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { InterviewSession } from '../types.js';

interface InterviewCoachProps {
  interviews: InterviewSession[];
  onStartInterview: (mode: 'technical' | 'hr' | 'system_design' | 'coding', jobTitle: string) => Promise<InterviewSession | null>;
  onSubmitAnswer: (sessionId: string, answer: string) => Promise<InterviewSession | null>;
}

export default function InterviewCoach({ interviews, onStartInterview, onSubmitAnswer }: InterviewCoachProps) {
  const [mode, setMode] = useState<'technical' | 'hr' | 'system_design' | 'coding'>('technical');
  const [jobTitle, setJobTitle] = useState('AI Applications Engineer');
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);

  const handleStart = async () => {
    setIsSubmitting(true);
    try {
      const sess = await onStartInterview(mode, jobTitle);
      setCurrentSession(sess);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentSession || !answerText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = await onSubmitAnswer(currentSession.id, answerText);
      setCurrentSession(updated);
      setAnswerText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper mode labels
  const modeLabels = {
    technical: "Technical Core",
    hr: "Behavioral & HR",
    system_design: "System Design",
    coding: "Coding Sandbox"
  };

  // Past sessions
  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const currentActiveSession = currentSession || interviews.find(i => i.status === 'ongoing') || null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-white">
          AI Mock Interview Coach
        </h1>
        <p className="text-sm text-zinc-400">
          Rehearse under real-time conditions with specialized AI interview panels. Receive instant question critiques and full competency reports.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Setup interview or Past history */}
        <div className="space-y-6">
          {/* Setup new interview block */}
          {!currentActiveSession && (
            <div className="rounded-2xl glass p-5 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Play className="h-4 w-4 text-blue-500" /> Start Practice Session
              </h2>
              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Interview Mode</label>
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-blue-500 font-medium"
                >
                  <option value="technical">Technical core (Algorithms, Frameworks)</option>
                  <option value="hr">Behavioral & HR (Leadership, Situation)</option>
                  <option value="system_design">System Design (Architecture, scale)</option>
                  <option value="coding">Coding Sandbox (TypeScript/Python)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Target Job / Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Architect"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <button
                onClick={handleStart}
                disabled={isSubmitting || !jobTitle.trim()}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Generating Question..." : "Launch Simulator"}
              </button>
            </div>
          )}

          {/* Active interview controller status */}
          {currentActiveSession && (
            <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-5 text-left">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-semibold">Active Simulator</span>
              <h3 className="text-sm font-bold text-zinc-200 mt-1">{currentActiveSession.jobTitle}</h3>
              <div className="mt-3 text-xs text-zinc-400 space-y-1.5">
                <p>• Mode: <span className="text-zinc-300 font-medium">{modeLabels[currentActiveSession.mode]}</span></p>
                <p>• Progress: <span className="text-zinc-300 font-medium">Question {currentActiveSession.userAnswers.length + 1} of 3</span></p>
              </div>
              <button
                onClick={() => setCurrentSession(null)}
                className="mt-4 flex items-center justify-center gap-1 w-full rounded-lg border border-white/10 bg-[#0d0d12]/40 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              >
                <RotateCcw className="h-3 w-3" /> Stop Interview
              </button>
            </div>
          )}

          {/* Past completed interview reports */}
          {completedInterviews.length > 0 && (
            <div className="rounded-2xl glass p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Past Evaluation Reports</h2>
              <div className="space-y-2">
                {completedInterviews.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setCurrentSession(session)}
                    className={`w-full rounded-lg p-2.5 text-left text-xs transition border ${
                      currentActiveSession?.id === session.id
                        ? "agent-active border-blue-500/50 text-white"
                        : "bg-transparent border-transparent hover:bg-white/5 text-zinc-400"
                    }`}
                  >
                    <div className="font-bold truncate">{session.jobTitle}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5 flex justify-between">
                      <span>{modeLabels[session.mode]}</span>
                      <span className="text-blue-400 font-bold">Grade: {session.feedback?.overallScore}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Dialogue practice screen or Evaluation report */}
        <div className="space-y-6 lg:col-span-2">
          {isSubmitting && !currentActiveSession ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="rounded-full border-2 border-blue-500 border-t-transparent p-4"
              />
              <h3 className="mt-6 text-sm font-bold text-zinc-200">Constructing scenario panel...</h3>
              <p className="mt-2 text-xs text-zinc-500 max-w-sm">
                The AURA Interview Agent is formulating a high-fidelity industry-standard question based on the role profile.
              </p>
            </div>
          ) : currentActiveSession?.status === 'ongoing' ? (
            <div className="space-y-6">
              {/* Active question card */}
              <div className="rounded-2xl glass p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-blue-500/10 border-l border-b border-blue-500/20 px-3 py-1 font-mono text-[9px] text-blue-400 font-bold">
                  Q{currentActiveSession.userAnswers.length + 1} / 3
                </div>
                <div className="flex gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400 border border-blue-500/20 self-start">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Active Question</span>
                    <h3 className="text-sm font-bold text-zinc-100 mt-1 leading-relaxed">
                      {currentActiveSession.questions[currentActiveSession.currentQuestionIndex]}
                    </h3>
                  </div>
                </div>

                {/* Input Answer form */}
                <div className="mt-6 space-y-3">
                  <textarea
                    rows={6}
                    value={answerText}
                    onChange={e => setAnswerText(e.target.value)}
                    placeholder="Structure your answer (describe the architecture, methodology, scale patterns, or behavior story)..."
                    className="w-full rounded-lg border border-white/10 bg-[#0d0d12] p-4 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-blue-500 leading-relaxed font-medium"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500">Try to be structured, direct, and mention metrics</span>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !answerText.trim()}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Evaluating..." : "Submit Answer"} <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic incremental chat timeline (Shows past answers + immediate critiquing inline!) */}
              {currentActiveSession.userAnswers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Session Transcript & Critiques</h3>
                  {currentActiveSession.userAnswers.map((ua, i) => (
                    <div key={i} className="rounded-2xl bg-[#0d0d12] p-5 border border-white/5 space-y-3">
                      <div className="text-[11px] font-bold text-zinc-400">Question {i + 1}: <span className="font-normal text-zinc-500 italic">"{ua.question}"</span></div>
                      <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/30 p-3 rounded-lg border border-white/5">
                        <span className="font-semibold text-zinc-400 font-mono text-[10px] block mb-1">Your Answer:</span>
                        "{ua.answer}"
                      </div>
                      <div className="text-xs text-emerald-400 leading-relaxed bg-emerald-950/10 p-3 rounded-lg border border-emerald-950/10">
                        <span className="font-semibold text-emerald-500 font-mono text-[10px] block mb-1">AURA Live Feedback:</span>
                        {ua.feedback}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : currentActiveSession?.status === 'completed' && currentActiveSession.feedback ? (
            /* COMPLETED COMPREHENSIVE EVALUATION REPORT */
            <div className="space-y-6">
              {/* Master Grade */}
              <div className="rounded-2xl glass p-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">Committee Review</span>
                    <h2 className="text-md font-bold text-zinc-200 mt-0.5">Mock Evaluation Report</h2>
                  </div>
                  <span className="rounded bg-blue-500/15 border border-blue-500/20 px-3 py-1 font-mono text-xl font-bold text-blue-400">
                    Grade: {currentActiveSession.feedback.overallScore}%
                  </span>
                </div>

                <p className="mt-5 text-xs text-zinc-400 leading-relaxed">
                  {currentActiveSession.feedback.detailedAnalysis}
                </p>
              </div>

              {/* 4 Metric score meters */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "Communication & Clarity", score: currentActiveSession.feedback.communicationScore },
                  { name: "Technical Accuracy", score: currentActiveSession.feedback.accuracyScore },
                  { name: "Executive Confidence", score: currentActiveSession.feedback.confidenceScore },
                  { name: "Problem Solving Logic", score: currentActiveSession.feedback.problemSolvingScore }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl glass p-5">
                    <div className="flex justify-between items-center text-xs font-semibold text-zinc-300 mb-2">
                      <span>{item.name}</span>
                      <span className="font-mono">{item.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0d0d12] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations list */}
              <div className="rounded-2xl glass p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-1.5 mb-4">
                  <BookOpen className="h-4.5 w-4.5" /> Study Pointers & Recommendations
                </h3>
                <div className="space-y-2.5">
                  {currentActiveSession.feedback.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-lg bg-[#0d0d12] p-3.5 border border-white/5">
                      <span className="rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 font-mono text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset trigger */}
              <button
                onClick={() => setCurrentSession(null)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/50 py-3 text-xs text-zinc-300 hover:bg-zinc-900 transition"
              >
                Start New Practice Session <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[400px]">
              <MessageSquare className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-sm font-bold text-zinc-300">Simulator Idle</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                Complete the configuration form on the left panel to launch the real-time dialogue simulator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
