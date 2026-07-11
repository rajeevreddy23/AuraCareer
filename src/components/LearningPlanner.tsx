/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  CheckSquare,
  Square,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  BookOpen,
  Calendar
} from 'lucide-react';
import { LearningPlan } from '../types.js';

interface LearningPlannerProps {
  learningPlans: LearningPlan[];
  onGeneratePlan: (targetJob: string, level: 'beginner' | 'intermediate' | 'advanced', time: string) => Promise<void>;
  onToggleTask: (planId: string, dayNum: number, taskId: string, completed: boolean) => Promise<void>;
}

export default function LearningPlanner({ learningPlans, onGeneratePlan, onToggleTask }: LearningPlannerProps) {
  const [targetJob, setTargetJob] = useState('AI Applications Engineer');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [timeCommitment, setTimeCommitment] = useState('4 weeks');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!targetJob.trim()) return;
    setIsGenerating(true);
    try {
      await onGeneratePlan(targetJob, level, timeCommitment);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const activePlan = learningPlans[0] || null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-white">
          AI Learning Path Generator
        </h1>
        <p className="text-sm text-zinc-400">
          Formulate structured daily technological curriculums. Review lesson descriptions and audit academic task checkpoints.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Generate form */}
        <div className="space-y-6">
          <div className="rounded-2xl glass p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-blue-500" /> Plan Target Stack
            </h2>
            <div>
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Target Job / Specialization</label>
              <input
                type="text"
                value={targetJob}
                onChange={e => setTargetJob(e.target.value)}
                placeholder="e.g. AI Applications Developer"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Your Experience Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-blue-500 font-semibold"
              >
                <option value="beginner">Beginner (No prior exposure)</option>
                <option value="intermediate">Intermediate (Baseline familiarity)</option>
                <option value="advanced">Advanced (Experienced architect)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Available Duration</label>
              <input
                type="text"
                value={timeCommitment}
                onChange={e => setTimeCommitment(e.target.value)}
                placeholder="e.g. 4 weeks"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !targetJob.trim()}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isGenerating ? "Synthesizing schedule..." : "Generate AI Learning Path"}
            </button>
          </div>
        </div>

        {/* Right Columns: Syllabus details */}
        <div className="space-y-6 lg:col-span-2">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="rounded-full border-2 border-blue-500 border-t-transparent p-4"
              />
              <h3 className="mt-6 text-sm font-bold text-zinc-200">Sifting academic references...</h3>
              <p className="mt-2 text-xs text-zinc-500 max-w-sm">
                AURA Learning Planner Agent is constructing a step-by-step technological lesson path tailored precisely to your available availability.
              </p>
            </div>
          ) : activePlan ? (
            <div className="space-y-6">
              {/* Header overview & total progress */}
              <div className="rounded-2xl glass p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">{activePlan.level} syllabus</span>
                    <h2 className="text-md font-bold text-zinc-200 mt-0.5">{activePlan.targetJob} Roadmap</h2>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 bg-[#0d0d12] px-2.5 py-1 rounded border border-white/5">
                    <Clock className="h-3.5 w-3.5 text-blue-400" /> {activePlan.timeCommitment}
                  </div>
                </div>

                {/* Progress ratio */}
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-zinc-400 font-semibold mb-1.5">
                      <span>Course Progress Track</span>
                      <span>{activePlan.progress}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-[#0d0d12] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full" style={{ width: `${activePlan.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Roadmap Cards */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Lesson Timeline</h3>
                {activePlan.days.map((day) => (
                  <div key={day.day} className={`rounded-2xl border p-5 transition-all ${day.completed ? "bg-[#0d0d12]/40 border-white/5" : "glass border-white/10"}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold border flex-shrink-0 ${day.completed ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                          Day {day.day}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-200 leading-tight">{day.topic}</h4>
                          <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{day.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Checklists for tasks */}
                    <div className="mt-5 pt-4 border-t border-white/5 space-y-2.5">
                      {day.tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => onToggleTask(activePlan.id, day.day, task.id, !task.completed)}
                          className="flex items-start w-full text-left gap-3 group transition"
                        >
                          <div className="mt-0.5 flex-shrink-0 text-zinc-600 transition group-hover:text-blue-400">
                            {task.completed ? (
                              <CheckSquare className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Square className="h-4 w-4 text-zinc-700" />
                            )}
                          </div>
                          <span className={`text-xs leading-relaxed ${task.completed ? "line-through text-zinc-500" : "text-zinc-300"}`}>
                            {task.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/10 p-12 text-center h-[500px]">
              <Brain className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-sm font-bold text-zinc-300">No Learning Path Active</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                Define your target technological role on the left panel to generate a custom 4-day curriculum.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
