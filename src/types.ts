/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Profile {
  userId: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  experience: {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    year: string;
  }[];
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  fileName: string;
  analyzedAt: string;
  overallScore: number;
  atsScore: number;
  recruiterScore: number;
  technicalScore: number;
  summary: string;
  skillsExtracted: string[];
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  bulletPointsImprovements: {
    before: string;
    after: string;
    reason: string;
  }[];
  industryComparison: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  languages: string[];
}

export interface GitHubAnalysis {
  userId: string;
  username: string;
  analyzedAt: string;
  totalRepos: number;
  commitQualityScore: number;
  readmeQualityScore: number;
  languages: { name: string; percentage: number }[];
  devScore: {
    frontend: number;
    backend: number;
    ai: number;
  };
  keyRepositories: GitHubRepo[];
  suggestions: string[];
}

export interface JobMatchResult {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  matchPercentage: number;
  strongMatches: string[];
  missingSkills: string[];
  actionPlan: string[];
  isPredefined?: boolean;
}

export interface InterviewSession {
  id: string;
  userId: string;
  mode: 'technical' | 'hr' | 'system_design' | 'coding';
  jobTitle: string;
  startedAt: string;
  status: 'ongoing' | 'completed';
  questions: string[];
  currentQuestionIndex: number;
  userAnswers: { question: string; answer: string; feedback?: string }[];
  feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
  overallScore: number;
  communicationScore: number;
  accuracyScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  detailedAnalysis: string;
  recommendations: string[];
}

export interface LearningPlanDay {
  day: number;
  topic: string;
  description: string;
  tasks: { id: string; text: string; completed: boolean }[];
  completed: boolean;
}

export interface LearningPlan {
  id: string;
  userId: string;
  targetJob: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: string; // e.g. "4 weeks" or "30 mins / day"
  createdAt: string;
  days: LearningPlanDay[];
  progress: number; // e.g. 0 to 100
}

export interface ProjectSuggestion {
  id: string;
  userId: string;
  goal: 'frontend' | 'backend' | 'ai_engineer';
  title: string;
  description: string;
  architecture: string;
  techStack: string[];
  databaseDesign: string;
  developmentPlan: { phase: string; tasks: string[] }[];
  readmeMarkdown: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  agentId?: 'router' | 'resume' | 'strategy' | 'interview' | 'skill' | 'match' | 'learning' | 'portfolio';
  text: string;
  timestamp: string;
}

export interface CareerScore {
  overallScore: number;
  resumeScore: number;
  interviewScore: number;
  skillsScore: number;
  portfolioScore: number;
  updatedAt?: string;
}
