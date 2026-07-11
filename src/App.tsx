/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  FileText,
  Github,
  Brain,
  Award,
  Play,
  Terminal,
  MessageSquare,
  Sparkles,
  Command,
  Menu,
  X,
  TrendingUp,
  Activity,
  Loader
} from 'lucide-react';

import {
  Profile,
  CareerScore,
  ResumeAnalysis,
  GitHubAnalysis,
  JobMatchResult,
  InterviewSession,
  LearningPlan,
  ProjectSuggestion,
  ChatMessage
} from './types.js';

// Modular components
import Dashboard from './components/Dashboard.js';
import ResumeIntel from './components/ResumeIntel.js';
import PortfolioAnalyzer from './components/PortfolioAnalyzer.js';
import JobMatch from './components/JobMatch.js';
import InterviewCoach from './components/InterviewCoach.js';
import LearningPlanner from './components/LearningPlanner.js';
import ProjectBuilder from './components/ProjectBuilder.js';
import AuraChat from './components/AuraChat.js';
import CommandPalette from './components/CommandPalette.js';
import AuthScreen from './components/AuthScreen.js';

// Firebase imports
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase.js';
import {
  loadUserData,
  saveProfile,
  addResumeAnalysis,
  setGitHubAnalysis,
  addJobMatch,
  saveInterviewSession,
  updateScores,
  saveLearningPlan,
  saveProject,
  saveChatMessage,
  clearChatHistory,
  resetUserData
} from './lib/firestoreService.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Core career state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [careerScore, setCareerScore] = useState<CareerScore>({
    overallScore: 68,
    resumeScore: 70,
    interviewScore: 60,
    skillsScore: 75,
    portfolioScore: 65,
    updatedAt: new Date().toISOString()
  });

  const [resumeAnalyses, setResumeAnalyses] = useState<ResumeAnalysis[]>([]);
  const [githubAnalyses, setGitHubAnalyses] = useState<GitHubAnalysis[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatchResult[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
  const [projects, setProjects] = useState<ProjectSuggestion[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Monitor Auth state and bind Firestore sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadFirebaseData(currentUser.uid, currentUser.displayName || 'Alex Rivera', currentUser.email || '');
      } else {
        setUser(null);
        // Clear all state
        setProfile(null);
        setResumeAnalyses([]);
        setGitHubAnalyses([]);
        setJobMatches([]);
        setInterviews([]);
        setLearningPlans([]);
        setProjects([]);
        setChatHistory([]);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadFirebaseData = async (uid: string, name: string, email: string) => {
    try {
      const data = await loadUserData(uid, name, email);
      if (data) {
        setProfile(data.profile);
        setCareerScore(data.scores);
        setResumeAnalyses(data.resumes || []);
        setGitHubAnalyses(data.github || []);
        setJobMatches(data.matches || []);
        setInterviews(data.interviews || []);
        setLearningPlans(data.learning || []);
        setProjects(data.projects || []);
        setChatHistory(data.chat || []);
      }
    } catch (err) {
      console.error("Failed to fetch Firebase user data", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  // API Callbacks adapted for user-specific Firestore sync
  const handleUpdateProfile = async (updated: Profile) => {
    if (!user) return;
    try {
      // Keep career score updated
      const updatedScores = {
        ...careerScore,
        updatedAt: new Date().toISOString()
      };
      await saveProfile(user.uid, updated, updatedScores);
      setProfile(updated);
      setCareerScore(updatedScores);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyzeResume = async (text: string) => {
    if (!user) return;
    const res = await fetch('/api/resume/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: text })
    });
    if (res.ok) {
      const analysis = await res.json();
      analysis.id = "res-anal-" + Math.random().toString(36).substring(2, 9);
      analysis.userId = user.uid;
      analysis.analyzedAt = new Date().toISOString();

      await addResumeAnalysis(user.uid, analysis);

      // Increment resume score on successful analysis
      const updatedScores = {
        ...careerScore,
        resumeScore: Math.min(100, Math.max(75, analysis.overallScore)),
        overallScore: Math.round((Math.min(100, Math.max(75, analysis.overallScore)) + careerScore.interviewScore + careerScore.skillsScore + careerScore.portfolioScore) / 4),
        updatedAt: new Date().toISOString()
      };
      await updateScores(user.uid, updatedScores);
      await loadFirebaseData(user.uid, user.displayName || '', user.email || '');
    } else {
      throw new Error("Failed resume evaluation");
    }
  };

  const handleAnalyzeGitHub = async (username: string) => {
    if (!user) return;
    const res = await fetch('/api/github/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (res.ok) {
      const analysis = await res.json();
      analysis.userId = user.uid;
      analysis.analyzedAt = new Date().toISOString();

      await setGitHubAnalysis(user.uid, analysis);

      // Boost portfolio score
      const updatedScores = {
        ...careerScore,
        portfolioScore: Math.min(100, Math.max(70, analysis.commitQualityScore)),
        overallScore: Math.round((careerScore.resumeScore + careerScore.interviewScore + careerScore.skillsScore + Math.min(100, Math.max(70, analysis.commitQualityScore))) / 4),
        updatedAt: new Date().toISOString()
      };
      await updateScores(user.uid, updatedScores);
      await loadFirebaseData(user.uid, user.displayName || '', user.email || '');
    } else {
      throw new Error("Failed github scan");
    }
  };

  const handleAnalyzeMatch = async (title: string, desc: string) => {
    if (!user) return;
    const res = await fetch('/api/match/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        jobTitle: title, 
        jobDescription: desc,
        profile: profile
      })
    });
    if (res.ok) {
      const matchResult = await res.json();
      matchResult.id = "match-" + Math.random().toString(36).substring(2, 9);
      matchResult.userId = user.uid;

      await addJobMatch(user.uid, matchResult);
      await loadFirebaseData(user.uid, user.displayName || '', user.email || '');
    } else {
      throw new Error("Failed compatibility check");
    }
  };

  const handleStartInterview = async (mode: string, jobTitle: string) => {
    if (!user) return null;
    const res = await fetch('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, jobTitle })
    });
    if (res.ok) {
      const sess = await res.json();
      sess.userId = user.uid;

      await saveInterviewSession(user.uid, sess);
      setInterviews(prev => [sess, ...prev]);
      return sess;
    }
    return null;
  };

  const handleSubmitAnswer = async (sessionId: string, answer: string) => {
    if (!user) return null;
    // Find the current active session state to send to backend to ensure robust processing
    const activeSession = interviews.find(s => s.id === sessionId);

    const res = await fetch('/api/interview/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        sessionId, 
        answer,
        session: activeSession
      })
    });
    if (res.ok) {
      const sess = await res.json();
      sess.userId = user.uid;

      await saveInterviewSession(user.uid, sess);
      setInterviews(prev => prev.map(item => item.id === sessionId ? sess : item));

      if (sess.status === 'completed') {
        const interviewRating = sess.feedback?.overallScore || 85;
        const updatedScores = {
          ...careerScore,
          interviewScore: Math.round(interviewRating),
          overallScore: Math.round((careerScore.resumeScore + Math.round(interviewRating) + careerScore.skillsScore + careerScore.portfolioScore) / 4),
          updatedAt: new Date().toISOString()
        };
        await updateScores(user.uid, updatedScores);
        await loadFirebaseData(user.uid, user.displayName || '', user.email || '');
      }
      return sess;
    }
    return null;
  };

  const handleGeneratePlan = async (targetJob: string, level: string, time: string) => {
    if (!user) return;
    const res = await fetch('/api/learning/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetJob, level, timeCommitment: time })
    });
    if (res.ok) {
      const plan = await res.json();
      plan.id = "learn-plan-" + Math.random().toString(36).substring(2, 9);
      plan.userId = user.uid;
      plan.createdAt = new Date().toISOString();

      await saveLearningPlan(user.uid, plan);
      await loadFirebaseData(user.uid, user.displayName || '', user.email || '');
    } else {
      throw new Error("Failed custom schedule compilation");
    }
  };

  const handleToggleTask = async (planId: string, dayNum: number, taskId: string, completed: boolean) => {
    if (!user) return;
    const activePlan = learningPlans.find(p => p.id === planId);
    if (!activePlan) return;

    const res = await fetch('/api/learning/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        planId, 
        dayNum, 
        taskId, 
        completed,
        plan: activePlan
      })
    });
    if (res.ok) {
      const updated = await res.json();
      await saveLearningPlan(user.uid, updated);
      setLearningPlans(prev => prev.map(p => p.id === planId ? updated : p));

      // Calculate state changes to update profile metrics
      const completedCount = learningPlans.reduce((sum, p) => 
        sum + p.days.reduce((dSum, d) => dSum + d.tasks.filter(t => t.completed).length, 0), 0
      );
      const skillsScoreBoost = Math.min(100, 75 + Math.round(completedCount * 1.5));
      const updatedScores = {
        ...careerScore,
        skillsScore: skillsScoreBoost,
        overallScore: Math.round((careerScore.resumeScore + careerScore.interviewScore + skillsScoreBoost + careerScore.portfolioScore) / 4),
        updatedAt: new Date().toISOString()
      };
      await updateScores(user.uid, updatedScores);
      await loadFirebaseData(user.uid, user.displayName || '', user.email || '');
    }
  };

  const handleGenerateProject = async (goal: string) => {
    if (!user) return;
    const res = await fetch('/api/projects/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, profile })
    });
    if (res.ok) {
      const project = await res.json();
      project.id = "proj-" + Math.random().toString(36).substring(2, 9);
      project.userId = user.uid;
      project.createdAt = new Date().toISOString();

      await saveProject(user.uid, project);
      await loadFirebaseData(user.uid, user.displayName || '', user.email || '');
    } else {
      throw new Error("Failed project design creation");
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!user) return;
    const userMsg: ChatMessage = {
      id: "msg-" + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    // Optimistic local and firestore save
    setChatHistory(prev => [...prev, userMsg]);
    await saveChatMessage(user.uid, userMsg);

    // Call AI helper statelessly passing chat history context
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text,
        profile,
        history: chatHistory
      })
    });
    if (res.ok) {
      const assistantMsg = await res.json();
      await saveChatMessage(user.uid, assistantMsg);
      setChatHistory(prev => prev.filter(m => m.id !== userMsg.id).concat(userMsg, assistantMsg));
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    await clearChatHistory(user.uid);
    setChatHistory([]);
  };

  const handleResetAll = async () => {
    if (!user) return;
    const data = await resetUserData(user.uid, user.displayName || 'Alex Rivera', user.email || '');
    if (data) {
      setProfile(data.profile);
      setCareerScore(data.scores);
      setResumeAnalyses(data.resumes || []);
      setGitHubAnalyses(data.github || []);
      setJobMatches(data.matches || []);
      setInterviews(data.interviews || []);
      setLearningPlans(data.learning || []);
      setProjects(data.projects || []);
      setChatHistory(data.chat || []);
    }
  };

  // Sidebar navigations
  const navigationItems = [
    { id: 'dashboard', label: 'Executive Center', icon: Briefcase },
    { id: 'resume', label: 'Resume Intelligence', icon: FileText },
    { id: 'portfolio', label: 'GitHub Auditor', icon: Github },
    { id: 'match', label: 'Job Matcher', icon: Award },
    { id: 'interview', label: 'Interview Coach', icon: Play },
    { id: 'learning', label: 'Learning Planner', icon: Brain },
    { id: 'projects', label: 'Portfolio Designer', icon: Terminal },
    { id: 'chat', label: 'Agent Workspace', icon: MessageSquare }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050506] flex flex-col items-center justify-center text-zinc-400">
        <Loader className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <span className="font-mono text-xs tracking-widest text-zinc-500">AUTHENTICATING SECURE SESSION...</span>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#050506] text-zinc-100 font-sans flex flex-col md:flex-row antialiased select-none">
      
      {/* 1. CMD+K Palette Dialog */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      {/* 2. Desktop Left Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-[260px] border-r border-white/5 bg-[#08080a] h-screen sticky top-0 p-5 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Logo brand */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
              A
            </div>
            <div>
              <span className="text-md font-semibold tracking-tight text-white block">AURA <span className="text-blue-500">CAREER AI</span></span>
              <span className="text-[10px] text-zinc-500 font-bold block -mt-0.5 font-mono tracking-wider">ORCHESTRATOR OS</span>
            </div>
          </div>

          {/* Quick search button */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center justify-between w-full rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-500 hover:border-white/20 transition"
          >
            <span className="flex items-center gap-2">
              <Command className="h-3.5 w-3.5" /> Quick search...
            </span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono border border-white/5 text-zinc-400">
              ⌘K
            </span>
          </button>

          {/* Nav links */}
          <nav className="space-y-1">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-xs font-semibold text-left transition-all ${
                    isActive
                      ? "agent-active text-zinc-100"
                      : "bg-transparent border-l-2 border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-500" : "text-zinc-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User status box */}
        <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-600/20 text-blue-400 h-8 w-8 flex items-center justify-center border border-blue-500/10 font-bold text-xs font-mono">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "US"}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-zinc-200 truncate">{profile?.name || "User"}</div>
              <div className="text-[10px] text-zinc-500 truncate">{profile?.title || "Career Architect"}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left py-1.5 px-2 hover:bg-red-500/10 text-[10px] text-red-400 font-semibold font-mono rounded border border-transparent hover:border-red-500/10 transition mt-1"
          >
            → SIGN OUT SECURITY SESSION
          </button>
        </div>
      </aside>

      {/* 3. Mobile Navigation Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#050506] border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            A
          </div>
          <span className="font-sans font-bold text-sm tracking-tight text-white">AURA <span className="text-blue-500">CAREER AI</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5"
          >
            <Command className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-x-0 top-[52px] bg-[#050506] border-b border-white/5 z-30 p-4 space-y-2 flex flex-col"
          >
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-xs font-semibold text-left ${
                    isActive ? "agent-active text-zinc-100" : "text-zinc-400 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-500" : "text-zinc-400"}`} />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleSignOut();
              }}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-xs font-semibold text-left text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition mt-2"
            >
              <X className="h-4 w-4 text-red-400" />
              Sign Out Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Main Work Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard
                  profile={profile}
                  careerScore={careerScore}
                  onUpdateProfile={handleUpdateProfile}
                  onSelectTab={(tabId) => setActiveTab(tabId)}
                  onResetAll={handleResetAll}
                />
              )}

              {activeTab === 'resume' && (
                <ResumeIntel
                  resumeAnalyses={resumeAnalyses}
                  onAnalyzeResume={handleAnalyzeResume}
                />
              )}

              {activeTab === 'portfolio' && (
                <PortfolioAnalyzer
                  githubAnalyses={githubAnalyses}
                  onAnalyzeGitHub={handleAnalyzeGitHub}
                />
              )}

              {activeTab === 'match' && (
                <JobMatch
                  jobMatches={jobMatches}
                  onAnalyzeMatch={handleAnalyzeMatch}
                />
              )}

              {activeTab === 'interview' && (
                <InterviewCoach
                  interviews={interviews}
                  onStartInterview={handleStartInterview}
                  onSubmitAnswer={handleSubmitAnswer}
                />
              )}

              {activeTab === 'learning' && (
                <LearningPlanner
                  learningPlans={learningPlans}
                  onGeneratePlan={handleGeneratePlan}
                  onToggleTask={handleToggleTask}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectBuilder
                  projects={projects}
                  onGenerateProject={handleGenerateProject}
                />
              )}

              {activeTab === 'chat' && (
                <AuraChat
                  chatHistory={chatHistory}
                  onSendMessage={handleSendMessage}
                  onClearHistory={handleClearHistory}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
