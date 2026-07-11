import { db } from './firebase.js';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
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
} from '../types.js';

// Default initial user profile & scores matching the high-fidelity experience
const DEFAULT_PROFILE = (name: string, email: string): Profile => ({
  userId: "",
  name: name || "Alex Rivera",
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
});

const DEFAULT_SCORES: CareerScore = {
  overallScore: 81,
  resumeScore: 78,
  interviewScore: 86,
  skillsScore: 75,
  portfolioScore: 85,
  updatedAt: new Date().toISOString()
};

const DEFAULT_RESUMES: ResumeAnalysis[] = [
  {
    id: "res-anal-1",
    userId: "",
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
];

const DEFAULT_GITHUB: GitHubAnalysis[] = [
  {
    userId: "",
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
];

const DEFAULT_MATCHES: JobMatchResult[] = [
  {
    id: "match-1",
    userId: "",
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
    userId: "",
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
];

const DEFAULT_INTERVIEWS: InterviewSession[] = [
  {
    id: "int-session-1",
    userId: "",
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
];

const DEFAULT_LEARNING_PLANS: LearningPlan[] = [
  {
    id: "learn-plan-1",
    userId: "",
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
];

const DEFAULT_PROJECTS: ProjectSuggestion[] = [
  {
    id: "proj-1",
    userId: "",
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
];

const DEFAULT_CHAT: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "assistant",
    agentId: "router",
    text: "Hello! I am AURA, your career operating system. Together with my team of specialized agents, we can perfect your resume, run mock interviews, audit your GitHub, analyze skill gaps, and coordinate targeted learning plans. What are we optimizing today?",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

/**
 * Loads or seeds user career-development data from Firebase Firestore
 */
export async function loadUserData(userId: string, userName: string, userEmail: string) {
  const profileRef = doc(db, 'users', userId, 'config', 'profile');
  const scoresRef = doc(db, 'users', userId, 'config', 'scores');

  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    // SEED Firestore database for this brand new user!
    console.log("Seeding Firestore for user:", userId);
    
    const initialProfile = DEFAULT_PROFILE(userName, userEmail);
    initialProfile.userId = userId;
    await setDoc(profileRef, initialProfile);
    await setDoc(scoresRef, DEFAULT_SCORES);

    // Seed lists in subcollections using a batch
    const batch = writeBatch(db);

    DEFAULT_RESUMES.forEach((res) => {
      const docRef = doc(db, 'users', userId, 'resumes', res.id);
      batch.set(docRef, { ...res, userId });
    });

    DEFAULT_GITHUB.forEach((git, idx) => {
      const docRef = doc(db, 'users', userId, 'github', `git-anal-${idx}`);
      batch.set(docRef, { ...git, userId });
    });

    DEFAULT_MATCHES.forEach((m) => {
      const docRef = doc(db, 'users', userId, 'matches', m.id);
      batch.set(docRef, { ...m, userId });
    });

    DEFAULT_INTERVIEWS.forEach((i) => {
      const docRef = doc(db, 'users', userId, 'interviews', i.id);
      batch.set(docRef, { ...i, userId });
    });

    DEFAULT_LEARNING_PLANS.forEach((lp) => {
      const docRef = doc(db, 'users', userId, 'learningPlans', lp.id);
      batch.set(docRef, { ...lp, userId });
    });

    DEFAULT_PROJECTS.forEach((p) => {
      const docRef = doc(db, 'users', userId, 'projects', p.id);
      batch.set(docRef, { ...p, userId });
    });

    DEFAULT_CHAT.forEach((c) => {
      const docRef = doc(db, 'users', userId, 'chat', c.id);
      batch.set(docRef, c);
    });

    await batch.commit();
  }

  // Fetch everything from Firestore
  const [
    pSnap,
    sSnap,
    rSnap,
    gSnap,
    mSnap,
    iSnap,
    lSnap,
    prSnap,
    chSnap
  ] = await Promise.all([
    getDoc(profileRef),
    getDoc(scoresRef),
    getDocs(collection(db, 'users', userId, 'resumes')),
    getDocs(collection(db, 'users', userId, 'github')),
    getDocs(collection(db, 'users', userId, 'matches')),
    getDocs(collection(db, 'users', userId, 'interviews')),
    getDocs(collection(db, 'users', userId, 'learningPlans')),
    getDocs(collection(db, 'users', userId, 'projects')),
    getDocs(collection(db, 'users', userId, 'chat'))
  ]);

  const profile = pSnap.data() as Profile;
  const scores = sSnap.data() as CareerScore;

  const resumes = rSnap.docs.map(d => d.data() as ResumeAnalysis)
    .sort((a, b) => new Date(b.analyzedAt || 0).getTime() - new Date(a.analyzedAt || 0).getTime());
  
  const github = gSnap.docs.map(d => d.data() as GitHubAnalysis)
    .sort((a, b) => new Date(b.analyzedAt || 0).getTime() - new Date(a.analyzedAt || 0).getTime());

  const matches = mSnap.docs.map(d => d.data() as JobMatchResult);
  
  const interviews = iSnap.docs.map(d => d.data() as InterviewSession)
    .sort((a, b) => new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime());

  const learning = lSnap.docs.map(d => d.data() as LearningPlan)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const projects = prSnap.docs.map(d => d.data() as ProjectSuggestion)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const chat = chSnap.docs.map(d => d.data() as ChatMessage)
    .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());

  return {
    profile,
    scores,
    resumes,
    github,
    matches,
    interviews,
    learning,
    projects,
    chat
  };
}

// Write updates to Firestore
export async function saveProfile(userId: string, profile: Profile, score: CareerScore) {
  await setDoc(doc(db, 'users', userId, 'config', 'profile'), profile);
  await setDoc(doc(db, 'users', userId, 'config', 'scores'), score);
}

export async function addResumeAnalysis(userId: string, analysis: ResumeAnalysis) {
  await setDoc(doc(db, 'users', userId, 'resumes', analysis.id), analysis);
}

export async function setGitHubAnalysis(userId: string, analysis: GitHubAnalysis) {
  const coll = collection(db, 'users', userId, 'github');
  const snap = await getDocs(coll);
  const batch = writeBatch(db);
  // Delete old analyses
  snap.docs.forEach(d => batch.delete(d.ref));
  // Write new one
  const newRef = doc(db, 'users', userId, 'github', `git-anal-${Date.now()}`);
  batch.set(newRef, analysis);
  await batch.commit();
}

export async function addJobMatch(userId: string, match: JobMatchResult) {
  await setDoc(doc(db, 'users', userId, 'matches', match.id), match);
}

export async function saveInterviewSession(userId: string, session: InterviewSession) {
  await setDoc(doc(db, 'users', userId, 'interviews', session.id), session);
}

export async function updateScores(userId: string, score: CareerScore) {
  await setDoc(doc(db, 'users', userId, 'config', 'scores'), score);
}

export async function saveLearningPlan(userId: string, plan: LearningPlan) {
  await setDoc(doc(db, 'users', userId, 'learningPlans', plan.id), plan);
}

export async function saveProject(userId: string, project: ProjectSuggestion) {
  await setDoc(doc(db, 'users', userId, 'projects', project.id), project);
}

export async function saveChatMessage(userId: string, message: ChatMessage) {
  await setDoc(doc(db, 'users', userId, 'chat', message.id), message);
}

export async function clearChatHistory(userId: string) {
  const coll = collection(db, 'users', userId, 'chat');
  const snap = await getDocs(coll);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

export async function resetUserData(userId: string, userName: string, userEmail: string) {
  // Clear all subcollections for this user and rewrite defaults
  const batch = writeBatch(db);

  const collectionsToDelete = ['resumes', 'github', 'matches', 'interviews', 'learningPlans', 'projects', 'chat'];
  for (const c of collectionsToDelete) {
    const snap = await getDocs(collection(db, 'users', userId, c));
    snap.docs.forEach(d => batch.delete(d.ref));
  }
  await batch.commit();

  // Re-seed by deleting profile and scores configuration first, then reloading
  await deleteDoc(doc(db, 'users', userId, 'config', 'profile'));
  await deleteDoc(doc(db, 'users', userId, 'config', 'scores'));

  return loadUserData(userId, userName, userEmail);
}
