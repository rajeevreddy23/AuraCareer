/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  TrendingUp,
  Award,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  User,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { Profile, CareerScore } from '../types.js';

interface DashboardProps {
  profile: Profile | null;
  careerScore: CareerScore;
  onUpdateProfile: (updated: Profile) => Promise<void>;
  onSelectTab: (tabId: string) => void;
  onResetAll: () => Promise<void>;
}

export default function Dashboard({
  profile,
  careerScore,
  onUpdateProfile,
  onSelectTab,
  onResetAll
}: DashboardProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedTitle, setEditedTitle] = useState(profile?.title || '');
  const [editedBio, setEditedBio] = useState(profile?.bio || '');
  const [newSkill, setNewSkill] = useState('');
  const [tempSkills, setTempSkills] = useState<string[]>(profile?.skills || []);
  const [isResetting, setIsResetting] = useState(false);

  // Toggle edit profile mode
  const handleStartEdit = () => {
    setEditedTitle(profile?.title || '');
    setEditedBio(profile?.bio || '');
    setTempSkills(profile?.skills || []);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    const updated: Profile = {
      ...profile,
      title: editedTitle,
      bio: editedBio,
      skills: tempSkills
    };
    await onUpdateProfile(updated);
    setIsEditingProfile(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !tempSkills.includes(newSkill.trim())) {
      setTempSkills([...tempSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setTempSkills(tempSkills.filter(s => s !== skill));
  };

  const handleResetClick = async () => {
    setIsResetting(true);
    await onResetAll();
    setIsResetting(false);
  };

  // Mock application statistics
  const appStats = [
    { name: "Applied", count: 4, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { name: "Technical Screen", count: 2, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    { name: "Interviewing", count: 1, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
    { name: "Offer Extended", count: 1, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Grid */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-white">
            Executive Control Center
          </h1>
          <p className="text-sm text-zinc-400">
            Welcome back, <span className="font-semibold text-zinc-200">{profile?.name || 'Candidate'}</span>. Optimize your career trajectory with specialized agent workflows.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleResetClick}
            disabled={isResetting}
            className="rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50"
          >
            {isResetting ? "Resetting Core..." : "Restore Demo Seeds"}
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Overall Score */}
        <div className="relative overflow-hidden rounded-2xl glass p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">AURA Career Score</span>
            <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-4xl font-bold tracking-tight text-white">
              {careerScore.overallScore}
            </span>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> Excellent
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${careerScore.overallScore}%` }}
            />
          </div>
        </div>

        {/* Sub Scores */}
        {[
          { label: "Resume Intelligence", score: careerScore.resumeScore, tab: 'resume', desc: "ATS compliance", barColor: "bg-blue-500" },
          { label: "Interview Confidence", score: careerScore.interviewScore, tab: 'interview', desc: "Coaching index", barColor: "bg-emerald-500" },
          { label: "Skill Density", score: careerScore.skillsScore, tab: 'dashboard', desc: "Targeted stack", barColor: "bg-indigo-500" },
          { label: "GitHub Portfolio", score: careerScore.portfolioScore, tab: 'portfolio', desc: "Commit & README code", barColor: "bg-purple-500" }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectTab(item.tab)}
            className="group relative overflow-hidden rounded-2xl glass p-5 text-left transition hover:bg-white/5 hover:border-white/15"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">{item.label}</span>
              <ArrowUpRight className="h-3 w-3 text-zinc-600 transition group-hover:text-blue-500" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold text-zinc-200">
                {item.score}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">{item.desc}</p>
            <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.barColor} rounded-full transition-all duration-500 group-hover:brightness-110`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Main Structural split */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 columns: Profile details & interactive study routes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Executive Career Profile Card */}
          <div className="rounded-2xl glass p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400 border border-blue-500/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-200">Personal Career Profile</h2>
                  <p className="text-[11px] text-zinc-500">Defines your background context for AURA agents</p>
                </div>
              </div>
              {!isEditingProfile ? (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <Edit2 className="h-3 w-3" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs text-white transition hover:bg-blue-500"
                  >
                    <Check className="h-3 w-3" /> Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Profile Content / Editing Forms */}
            <div className="mt-5 space-y-4">
              {!isEditingProfile ? (
                <>
                  <div>
                    <h3 className="text-xs font-medium text-zinc-500">Current Role & Goal</h3>
                    <p className="mt-1 text-sm font-medium text-zinc-300">{profile?.title}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-zinc-500">Professional Bio</h3>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{profile?.bio}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-zinc-500">Skills Stack</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {profile?.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-md bg-zinc-900/60 border border-white/5 px-2.5 py-1 text-xs font-mono text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-medium text-zinc-500">Title / Goal</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500"
                      placeholder="e.g. AI Applications Developer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-zinc-500">Bio</label>
                    <textarea
                      rows={4}
                      value={editedBio}
                      onChange={e => setEditedBio(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500 leading-relaxed"
                      placeholder="Describe your goals and expertise..."
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-zinc-500">Add / Remove Skills</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                        className="w-full rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-blue-500"
                        placeholder="Type a skill and press enter"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="rounded-lg bg-zinc-800 border border-white/10 px-3 text-xs text-zinc-200 hover:bg-zinc-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-1 bg-zinc-950/40 rounded-lg border border-white/5">
                      {tempSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-white/10 pl-2 pr-1 py-0.5 text-xs font-mono text-zinc-300"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="rounded-sm p-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Start Workflows */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">AI Agent Actions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Resume Optimizer",
                  desc: "Review resume drafts & improve bullets",
                  tab: 'resume',
                  icon: Briefcase,
                  color: "text-blue-400"
                },
                {
                  title: "GitHub Portfolio Auditor",
                  desc: "Analyze repository stars & index metrics",
                  tab: 'portfolio',
                  icon: Award,
                  color: "text-indigo-400"
                },
                {
                  title: "Interactive Interview Practice",
                  desc: "Train in technical or HR modules",
                  tab: 'interview',
                  icon: Activity,
                  color: "text-emerald-400"
                },
                {
                  title: "AI Project Architect",
                  desc: "Design full-scale portfolios from scratch",
                  tab: 'projects',
                  icon: TrendingUp,
                  color: "text-violet-400"
                }
              ].map((act, index) => {
                const Icon = act.icon;
                return (
                  <button
                    key={index}
                    onClick={() => onSelectTab(act.tab)}
                    className="flex items-start rounded-2xl glass p-4 text-left transition hover:bg-white/5 hover:border-white/15"
                  >
                    <div className={`mr-3 rounded-lg bg-zinc-950 p-2 border border-white/10 ${act.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">{act.title}</div>
                      <div className="mt-1 text-[11px] text-zinc-400">{act.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Target statistics & Live Progress Track */}
        <div className="space-y-6">
          {/* Application Funnel Status */}
          <div className="rounded-2xl glass p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center justify-between">
              Application Tracker
              <span className="font-mono text-[10px] text-zinc-500">Live Stage Status</span>
            </h2>
            <div className="space-y-3">
              {appStats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${stat.color}`}>
                      {stat.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-300">
                    {stat.count} company
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active study milestones */}
          <div className="rounded-2xl glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Current Study Roadmaps</h2>
              <button
                onClick={() => onSelectTab('learning')}
                className="text-[10px] text-blue-400 font-medium hover:underline flex items-center"
              >
                Go to plan <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl bg-[#0d0d12] p-3.5 border border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                      In Progress
                    </span>
                    <h3 className="mt-1 text-xs font-bold text-zinc-200">AI Applications Engineer Track</h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-400">35%</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '35%' }} />
                </div>
                <div className="mt-3 text-[10px] text-zinc-500 space-y-1">
                  <p>✓ Week 1: Core Vector Databases Completed</p>
                  <p className="text-blue-400 font-medium">→ Week 2: RAG Architectures & Pipelines (Current)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
