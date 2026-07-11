/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import {
  User,
  Profile,
  ResumeAnalysis,
  GitHubAnalysis,
  JobMatchResult,
  InterviewSession,
  LearningPlan,
  ProjectSuggestion,
  ChatMessage,
  CareerScore
} from '../types.js';

// Setup file-based DB persistence in the server
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

interface DatabaseSchema {
  users: User[];
  profile: Profile | null;
  resumeAnalyses: ResumeAnalysis[];
  githubAnalyses: GitHubAnalysis[];
  jobMatches: JobMatchResult[];
  interviews: InterviewSession[];
  learningPlans: LearningPlan[];
  projects: ProjectSuggestion[];
  chatHistory: ChatMessage[];
  careerScore: CareerScore;
}

// Ensure database directory exists
function ensureDbDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initial seed data to make the app feel like a premium, fully-populated enterprise application
const SEED_DATA: DatabaseSchema = {
  users: [
    {
      id: "user-1",
      email: "alex.rivera@example.com",
      name: "Alex Rivera",
      createdAt: new Date().toISOString()
    }
  ],
  profile: {
    userId: "user-1",
    name: "Alex Rivera",
    title: "Full-Stack Software Engineer & Aspiring AI Engineer",
    bio: "Passionate engineer with 4+ years of experience in React, Node.js, and TypeScript. Currently expanding expertise into Large Language Models (LLMs), LangChain, and advanced model fine-tuning to build next-generation intelligent applications.",
    skills: ["React", "TypeScript", "Node.js", "Python", "Next.js", "Express", "Tailwind CSS", "PostgreSQL", "Git", "Docker"],
    experience: [
      {
        id: "exp-1",
        company: "Stripe",
        role: "Software Engineer II",
        duration: "2023 - Present",
        description: "Engineered scalable merchant billing flows using React and Node.js. Optimized frontend payment elements, improving conversion rates by 4.2% globally. Spearheaded transition from legacy CSS to Tailwind, boosting team velocity."
      },
      {
        id: "exp-2",
        company: "Vercel",
        role: "Frontend Engineer",
        duration: "2021 - 2023",
        description: "Contributed to core Next.js router features and developer onboarding dashboards. Implemented smooth animation guidelines using Framer Motion. Collaborated with DevRel to create interactive tutorial sandboxes."
      }
    ],
    education: [
      {
        id: "edu-1",
        school: "University of California, Berkeley",
        degree: "B.S. in Computer Science",
        year: "2021"
      }
    ]
  },
  resumeAnalyses: [
    {
      id: "res-anal-1",
      userId: "user-1",
      fileName: "Alex_Rivera_Resume_2026.pdf",
      analyzedAt: new Date().toISOString(),
      overallScore: 78,
      atsScore: 82,
      recruiterScore: 74,
      technicalScore: 80,
      summary: "Highly structured resume with modern design and clear tech stack definitions. While professional experience at Stripe and Vercel is extremely strong, the transition towards AI engineering is not sufficiently articulated. Technical bullet points are sometimes descriptive rather than impact-driven.",
      skillsExtracted: ["React", "TypeScript", "Node.js", "Next.js", "Python", "Tailwind CSS", "Docker", "Git"],
      strengths: [
        "Strong brand names (Stripe, Vercel) which instantly attract recruiters.",
        "Clear and logical structure that is easy for ATS parsers to crawl.",
        "Excellent technical breadth in modern web technology."
      ],
      weaknesses: [
        "Lack of quantified business impact in the Vercel bullet points.",
        "AI projects are buried under generic headings and lack deep architectural descriptions.",
        "Weak action verbs in several junior experience bullet points."
      ],
      missingKeywords: ["RAG (Retrieval-Augmented Generation)", "Vector Databases", "Prompt Engineering", "LLM APIs", "System Design", "CI/CD Pipelines"],
      bulletPointsImprovements: [
        {
          before: "Worked on merchant billing flows using React and Node.js.",
          after: "Engineered high-performance React payment components, boosting globally optimized Stripe merchant billing conversions by 4.2%.",
          reason: "Adds concrete business metrics and active, result-oriented verbs."
        },
        {
          before: "Created a side project using Python and AI to search files.",
          after: "Architected a custom Retrieval-Augmented Generation (RAG) agent in Python utilizing Pinecone vector indexes, reducing semantic search latency by 45%.",
          reason: "Replaces descriptive phrasing with industry-standard terminology and quantifies engineering achievement."
        }
      ],
      industryComparison: "Your resume ranks in the top 15% of web developers but drops to the top 45% when compared to AI and Machine Learning engineering profiles due to low density of ML/AI-specific concepts."
    }
  ],
  githubAnalyses: [
    {
      userId: "user-1",
      username: "alexrivera-dev",
      analyzedAt: new Date().toISOString(),
      totalRepos: 18,
      commitQualityScore: 88,
      readmeQualityScore: 75,
      languages: [
        { name: "TypeScript", percentage: 55 },
        { name: "JavaScript", percentage: 25 },
        { name: "Python", percentage: 15 },
        { name: "HTML/CSS", percentage: 5 }
      ],
      devScore: {
        frontend: 92,
        backend: 78,
        ai: 45
      },
      keyRepositories: [
        {
          name: "nextjs-stripe-billing",
          description: "Full-stack merchant dashboard reference template showcasing advanced custom billing elements.",
          stars: 124,
          languages: ["TypeScript", "CSS"]
        },
        {
          name: "semantic-docs-rag",
          description: "A lightweight local document Q&A application powered by LangChain and ChromaDB.",
          stars: 42,
          languages: ["Python", "HTML"]
        }
      ],
      suggestions: [
        "Add comprehensive Jest/PyTest suites to show commitment to engineering testing standards.",
        "Write full-fledged README files with setup guides, architecture diagrams, and API tables for your AI experiments.",
        "Contribute to open-source libraries or create a more complex pipeline showing multi-agent AI execution flow."
      ]
    }
  ],
  jobMatches: [
    {
      id: "match-1",
      userId: "user-1",
      companyName: "Google",
      jobTitle: "Senior Frontend Engineer (Google Cloud)",
      matchPercentage: 91,
      strongMatches: ["React", "TypeScript", "Next.js", "Scale engineering", "Performance optimization"],
      missingSkills: ["Monorepos (Bazel)", "Google Cloud Platform Console"],
      actionPlan: [
        "Read Google's engineering blogs on monorepo structures.",
        "Complete the free Google Cloud Platform Essentials training."
      ]
    },
    {
      id: "match-2",
      userId: "user-1",
      companyName: "OpenAI",
      jobTitle: "AI Applications Engineer",
      matchPercentage: 68,
      strongMatches: ["TypeScript", "Node.js", "Python", "Full-Stack engineering API integrations"],
      missingSkills: ["Vector databases", "Prompt optimization", "Evaluations & LLM benchmarks", "RAG architectures"],
      actionPlan: [
        "Build a complex portfolio project utilizing vector databases and advanced prompting.",
        "Explore LLM observability engines like LangSmith or Phoenix."
      ]
    }
  ],
  interviews: [
    {
      id: "int-session-1",
      userId: "user-1",
      mode: "technical",
      jobTitle: "AI Applications Engineer (OpenAI)",
      startedAt: new Date().toISOString(),
      status: "completed",
      questions: [
        "Explain the core concept of Retrieval-Augmented Generation (RAG) and why it's used in modern applications.",
        "How would you address the issue of context window exhaustion in long conversations using LLMs?",
        "What strategies do you use to evaluate and handle hallucination in LLM-driven structured JSON extractions?"
      ],
      currentQuestionIndex: 2,
      userAnswers: [
        {
          question: "Explain the core concept of Retrieval-Augmented Generation (RAG) and why it's used in modern applications.",
          answer: "RAG combines search retrieval with generative LLMs. Instead of relying solely on the trained model parameters, we first query a database (like a vector store) for relevant document chunks, inject them into the system prompt as context, and then ask the model to synthesize the answer. It's crucial for fresh information and domain-specific knowledge.",
          feedback: "Strong response! You correctly identified the separation of retrieval and generation, the usage of vector databases, and the core benefits (fresh info, proprietary context)."
        },
        {
          question: "How would you address the issue of context window exhaustion in long conversations using LLMs?",
          answer: "We can use sliding windows, summary memory, or selective pruning. Summary memory involves running a background task to summarize old chunks of conversation and append it, keeping active items clear.",
          feedback: "Excellent technical explanation. Highlighting background summarization pipelines shows production-grade software engineering understanding."
        },
        {
          question: "What strategies do you use to evaluate and handle hallucination in LLM-driven structured JSON extractions?",
          answer: "I use schema validation like Zod or Pydantic, set temperature to 0, use system instructions to be strict, and write self-correction loops where if validation fails, we feed the error back to the model.",
          feedback: "Very good. Emphasizing schema validation libraries, temperature management, and self-correcting routing demonstrates highly mature software engineering experience."
        }
      ],
      feedback: {
        overallScore: 86,
        communicationScore: 90,
        accuracyScore: 85,
        confidenceScore: 88,
        problemSolvingScore: 82,
        detailedAnalysis: "Superb interview performance! The candidate demonstrated high technical maturity, excellent structured logic, and outstanding engineering fluency. Explanations were clear and bridged web-dev practices perfectly with modern LLM orchestration.",
        recommendations: [
          "Incorporate deeper discussions about vector indexing options (e.g. HNSW vs IVF-Flat) when explaining RAG systems.",
          "Talk about latency-performance trade-offs when introducing self-correction loops."
        ]
      }
    }
  ],
  learningPlans: [
    {
      id: "learn-plan-1",
      userId: "user-1",
      targetJob: "AI Applications Engineer",
      level: "intermediate",
      timeCommitment: "4 weeks (5-10 hours/week)",
      createdAt: new Date().toISOString(),
      progress: 35,
      days: [
        {
          day: 1,
          topic: "Modern Vector Databases",
          description: "Understand semantic search, embeddings, and vector indexing standards.",
          completed: true,
          tasks: [
            { id: "t-1", text: "Read about cosine similarity vs dot product", completed: true },
            { id: "t-2", text: "Spin up a local Pinecone database instance", completed: true },
            { id: "t-3", text: "Insert and query text embedding vectors", completed: true }
          ]
        },
        {
          day: 2,
          topic: "RAG Architectures",
          description: "Build an end-to-end Retrieval-Augmented Generation pipeline.",
          completed: true,
          tasks: [
            { id: "t-4", text: "Set up LangChain/LlamaIndex on Express/Node", completed: true },
            { id: "t-5", text: "Create a simple document parser & chunking engine", completed: true },
            { id: "t-6", text: "Inject vector results into LLM prompts", completed: false }
          ]
        },
        {
          day: 3,
          topic: "Structured AI Outputs",
          description: "Leverage function calling and structured schemas to get strict JSON responses.",
          completed: false,
          tasks: [
            { id: "t-7", text: "Review Gemini responseSchema configurations", completed: false },
            { id: "t-8", text: "Implement self-correcting schema validator middleware", completed: false }
          ]
        },
        {
          day: 4,
          topic: "Multi-Agent Systems",
          description: "Coordinate multiple specialized agents with a dynamic routing controller.",
          completed: false,
          tasks: [
            { id: "t-9", text: "Design agent message history context buffers", completed: false },
            { id: "t-10", text: "Implement a router controller in TypeScript", completed: false }
          ]
        }
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      userId: "user-1",
      goal: "ai_engineer",
      title: "ClarityAI: Self-Correcting Medical Documentation Agent",
      description: "An advanced transcription, indexing, and medical summary agent utilizing audio stream processing, Vector databases, and strict schema compliance to summarize patient doctor interactions safely.",
      architecture: "Audio Upload Stream -> Google speech-to-text -> Gemini 3.5 Flash extractor with JSON responseSchema matching FHIR standards -> Validation controller -> DB persist.",
      techStack: ["React", "TypeScript", "Node.js", "Python", "Gemini Live API", "ChromaDB", "FastAPI"],
      databaseDesign: "Collections:\n- UserSession (id, patientId, doctorId, createdAt)\n- TranscriptNode (id, sessionId, speaker, text, timestamp)\n- ClinicalExtraction (id, sessionId, structuredFHIRData, validationSuccess)",
      developmentPlan: [
        {
          phase: "Phase 1: Basic Transcription",
          tasks: ["Configure Node.js mic stream receiver.", "Establish speech extraction pipeline."]
        },
        {
          phase: "Phase 2: RAG & FHIR Parsing",
          tasks: ["Feed transcription to Gemini API with medical schema constraints.", "Validate output format with Zod validator."]
        }
      ],
      readmeMarkdown: `# ClarityAI\nAn autonomous clinical documentation operating system.\n\n## Setup\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
      createdAt: new Date().toISOString()
    }
  ],
  chatHistory: [
    {
      id: "msg-1",
      sender: "assistant",
      agentId: "router",
      text: "Hello Alex! I am AURA, your career operating system. Together with my team of specialized agents, we can perfect your resume, run mock interviews, audit your GitHub, analyze skill gaps, and coordinate targeted learning plans. What are we optimizing today?",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  careerScore: {
    overallScore: 81,
    resumeScore: 78,
    interviewScore: 86,
    skillsScore: 75,
    portfolioScore: 85
  }
};

class DBManager {
  private data: DatabaseSchema = SEED_DATA;

  constructor() {
    this.load();
  }

  // Load database from file
  private load() {
    try {
      ensureDbDir();
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Failed to load local DB, using in-memory seed data", e);
      this.data = SEED_DATA;
    }
  }

  // Save database to file
  public save() {
    try {
      ensureDbDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to write to local DB file", e);
    }
  }

  // Clear data
  public reset() {
    this.data = JSON.parse(JSON.stringify(SEED_DATA));
    this.save();
  }

  // User Actions
  public getUsers(): User[] {
    return this.data.users;
  }

  public getProfile(): Profile | null {
    return this.data.profile;
  }

  public updateProfile(profile: Profile): Profile {
    this.data.profile = profile;
    this.recalculateScores();
    this.save();
    return this.data.profile;
  }

  // Resume Analyses Actions
  public getResumeAnalyses(): ResumeAnalysis[] {
    return this.data.resumeAnalyses;
  }

  public addResumeAnalysis(analysis: ResumeAnalysis): ResumeAnalysis {
    this.data.resumeAnalyses.unshift(analysis);
    this.recalculateScores();
    this.save();
    return analysis;
  }

  // GitHub Analysis
  public getGitHubAnalyses(): GitHubAnalysis[] {
    return this.data.githubAnalyses;
  }

  public setGitHubAnalysis(analysis: GitHubAnalysis): GitHubAnalysis {
    this.data.githubAnalyses = [analysis];
    this.recalculateScores();
    this.save();
    return analysis;
  }

  // Job Matches
  public getJobMatches(): JobMatchResult[] {
    return this.data.jobMatches;
  }

  public addJobMatch(match: JobMatchResult): JobMatchResult {
    this.data.jobMatches.unshift(match);
    this.save();
    return match;
  }

  // Interviews
  public getInterviews(): InterviewSession[] {
    return this.data.interviews;
  }

  public createInterview(interview: InterviewSession): InterviewSession {
    this.data.interviews.unshift(interview);
    this.save();
    return interview;
  }

  public updateInterview(updated: InterviewSession): InterviewSession {
    this.data.interviews = this.data.interviews.map(i => i.id === updated.id ? updated : i);
    this.recalculateScores();
    this.save();
    return updated;
  }

  // Learning Plans
  public getLearningPlans(): LearningPlan[] {
    return this.data.learningPlans;
  }

  public addLearningPlan(plan: LearningPlan): LearningPlan {
    this.data.learningPlans.unshift(plan);
    this.save();
    return plan;
  }

  public updateLearningPlanProgress(planId: string, dayNum: number, taskId: string, completed: boolean): LearningPlan | null {
    const plan = this.data.learningPlans.find(p => p.id === planId);
    if (!plan) return null;

    plan.days = plan.days.map(day => {
      if (day.day === dayNum) {
        day.tasks = day.tasks.map(task => task.id === taskId ? { ...task, completed } : task);
        day.completed = day.tasks.every(t => t.completed);
      }
      return day;
    });

    // Calculate overall progress based on percentage of completed tasks
    const totalTasks = plan.days.reduce((acc, d) => acc + d.tasks.length, 0);
    const completedTasks = plan.days.reduce((acc, d) => acc + d.tasks.filter(t => t.completed).length, 0);
    plan.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    this.recalculateScores();
    this.save();
    return plan;
  }

  // Projects
  public getProjects(): ProjectSuggestion[] {
    return this.data.projects;
  }

  public addProject(project: ProjectSuggestion): ProjectSuggestion {
    this.data.projects.unshift(project);
    this.save();
    return project;
  }

  // Chat History
  public getChatHistory(): ChatMessage[] {
    return this.data.chatHistory;
  }

  public addChatMessage(message: ChatMessage): ChatMessage {
    this.data.chatHistory.push(message);
    this.save();
    return message;
  }

  public clearChatHistory() {
    this.data.chatHistory = [
      {
        id: "msg-init",
        sender: "assistant",
        agentId: "router",
        text: "Chat memory cleared. How can my specialized agent team assist you now?",
        timestamp: new Date().toISOString()
      }
    ];
    this.save();
  }

  // Career score calculator
  public getCareerScore(): CareerScore {
    return this.data.careerScore;
  }

  private recalculateScores() {
    // Dynamically align career scores to user actions
    const resume = this.data.resumeAnalyses[0];
    const portfolio = this.data.githubAnalyses[0];
    const interview = this.data.interviews.find(i => i.status === 'completed');
    const plan = this.data.learningPlans[0];

    const resumeScore = resume ? resume.overallScore : 65;
    const portfolioScore = portfolio ? Math.round((portfolio.commitQualityScore + portfolio.readmeQualityScore + (portfolio.devScore.frontend + portfolio.devScore.backend + portfolio.devScore.ai) / 3) / 3) : 60;
    const interviewScore = interview && interview.feedback ? interview.feedback.overallScore : 70;
    
    // Skill score correlates with profile skills count + learning plan progress
    const skillsBase = Math.min(60 + (this.data.profile?.skills.length || 0) * 3, 95);
    const learningInfluence = plan ? plan.progress * 0.15 : 0;
    const skillsScore = Math.min(Math.round(skillsBase + learningInfluence), 100);

    const overallScore = Math.round((resumeScore + portfolioScore + interviewScore + skillsScore) / 4);

    this.data.careerScore = {
      overallScore,
      resumeScore,
      interviewScore,
      skillsScore,
      portfolioScore
    };
  }
}

export const dbManager = new DBManager();
