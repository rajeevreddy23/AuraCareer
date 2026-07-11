/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { dbManager } from './src/server/db.js';
import {
  routeAndDiscuss,
  analyzeResume,
  analyzeGitHub,
  generateLearningPlan,
  analyzeJobMatch,
  generateInterviewQuestion,
  evaluateInterview,
  generateProjectIdea,
  ai,
  MODEL_NAME
} from './src/server/gemini.js';

dotenv.config();

export const app = express();
app.use(express.json());

  // API ROUTES - REGISTER FIRST

  // 1. User & Profile Endpoints
  app.get('/api/user', (req, res) => {
    const users = dbManager.getUsers();
    res.json(users[0] || null);
  });

  app.get('/api/profile', (req, res) => {
    const profile = dbManager.getProfile();
    res.json(profile);
  });

  app.post('/api/profile', (req, res) => {
    try {
      const updated = dbManager.updateProfile(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/scores', (req, res) => {
    res.json(dbManager.getCareerScore());
  });

  // 2. Resume Intel Endpoints
  app.get('/api/resume', (req, res) => {
    res.json(dbManager.getResumeAnalyses());
  });

  app.post('/api/resume/analyze', async (req, res) => {
    const { resumeText } = req.body;
    if (!resumeText || typeof resumeText !== 'string') {
      res.status(400).json({ error: "Missing resumeText string payload" });
      return;
    }
    try {
      const analysis = await analyzeResume(resumeText);
      dbManager.addResumeAnalysis(analysis);
      res.json(analysis);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to analyze resume via Gemini API" });
    }
  });

  // 3. GitHub Analysis Endpoints
  app.get('/api/github', (req, res) => {
    res.json(dbManager.getGitHubAnalyses());
  });

  app.post('/api/github/analyze', async (req, res) => {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ error: "Missing github username" });
      return;
    }
    try {
      const analysis = await analyzeGitHub(username);
      dbManager.setGitHubAnalysis(analysis);
      res.json(analysis);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to parse GitHub profile" });
    }
  });

  // 4. Job Matching Endpoints
  app.get('/api/match', (req, res) => {
    res.json(dbManager.getJobMatches());
  });

  app.post('/api/match/analyze', async (req, res) => {
    const { jobTitle, jobDescription } = req.body;
    if (!jobTitle || !jobDescription) {
      res.status(400).json({ error: "Missing jobTitle or jobDescription" });
      return;
    }
    try {
      const profile = req.body.profile || dbManager.getProfile();
      if (!profile) {
        res.status(400).json({ error: "Please create a career profile first" });
        return;
      }
      const matchResult = await analyzeJobMatch(jobTitle, jobDescription, profile);
      dbManager.addJobMatch(matchResult);
      res.json(matchResult);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to evaluate job description fit" });
    }
  });

  // 5. Interview Coach Endpoints
  app.get('/api/interview', (req, res) => {
    res.json(dbManager.getInterviews());
  });

  app.post('/api/interview/start', async (req, res) => {
    const { mode, jobTitle } = req.body;
    if (!mode || !jobTitle) {
      res.status(400).json({ error: "Missing mode or jobTitle" });
      return;
    }
    try {
      // Generate very first question
      const firstQuestion = await generateInterviewQuestion(mode, jobTitle, []);
      const session = {
        id: "int-session-" + Math.random().toString(36).substring(2, 9),
        userId: "user-1",
        mode,
        jobTitle,
        startedAt: new Date().toISOString(),
        status: "ongoing" as const,
        questions: [firstQuestion],
        currentQuestionIndex: 0,
        userAnswers: []
      };
      dbManager.createInterview(session);
      res.json(session);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to initiate practice interview session" });
    }
  });

  app.post('/api/interview/answer', async (req, res) => {
    const { sessionId, answer, session: clientSession } = req.body;
    if (!sessionId || !answer) {
      res.status(400).json({ error: "Missing sessionId or answer" });
      return;
    }
    try {
      const interviews = dbManager.getInterviews();
      let session = interviews.find(s => s.id === sessionId);
      if (!session && clientSession) {
        dbManager.createInterview(clientSession);
        session = clientSession;
      }
      if (!session) {
        res.status(404).json({ error: "Interview session not found" });
        return;
      }
      if (session.status === 'completed') {
        res.status(400).json({ error: "This interview session has already completed" });
        return;
      }

      const activeQuestion = session.questions[session.currentQuestionIndex];
      
      // Get feedback on this single answer to provide a real-time responsive dialogue
      const feedbackPrompt = `You are an elite interviewer. The candidate was asked: "${activeQuestion}".
Their answer was: "${answer}".
Provide a concise, highly insightful, single-sentence feedback critique (maximum 35 words). Focus on what was strong or where accuracy fell short.`;
      
      let singleAnswerFeedback = "Interesting point, though a deeper dive into the specific metrics would enhance the value of this example.";
      try {
        const feedbackRes = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: feedbackPrompt
        });
        singleAnswerFeedback = feedbackRes.text?.trim() || singleAnswerFeedback;
      } catch (e) {
        console.error("Single answer feedback failed, using generic", e);
      }

      // Add to session list
      session.userAnswers.push({
        question: activeQuestion,
        answer: answer,
        feedback: singleAnswerFeedback
      });

      // Check if we reached 3 questions limit (typical interview cycle)
      if (session.userAnswers.length >= 3) {
        // Complete interview and compile summary report
        const report = await evaluateInterview(session.userAnswers);
        session.status = 'completed';
        session.feedback = report;
        dbManager.updateInterview(session);
        res.json(session);
      } else {
        // Generate next question
        const nextQuestion = await generateInterviewQuestion(session.mode, session.jobTitle, session.userAnswers);
        session.questions.push(nextQuestion);
        session.currentQuestionIndex += 1;
        dbManager.updateInterview(session);
        res.json(session);
      }
    } catch (err: any) {
      res.status(500).json({ error: "Failed to process interview answer" });
    }
  });

  // 6. Learning Plans
  app.get('/api/learning', (req, res) => {
    res.json(dbManager.getLearningPlans());
  });

  app.post('/api/learning/generate', async (req, res) => {
    const { targetJob, level, timeCommitment } = req.body;
    if (!targetJob || !level || !timeCommitment) {
      res.status(400).json({ error: "Missing fields to generate plan" });
      return;
    }
    try {
      const plan = await generateLearningPlan(targetJob, level, timeCommitment);
      dbManager.addLearningPlan(plan);
      res.json(plan);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate learning roadmap" });
    }
  });

  app.post('/api/learning/toggle', (req, res) => {
    const { planId, dayNum, taskId, completed } = req.body;
    if (!planId || dayNum === undefined || !taskId || completed === undefined) {
      res.status(400).json({ error: "Missing parameters to toggle task" });
      return;
    }
    const updated = dbManager.updateLearningPlanProgress(planId, dayNum, taskId, completed);
    if (!updated) {
      res.status(404).json({ error: "Learning plan not found" });
      return;
    }
    res.json(updated);
  });

  // 7. Portfolio Project Suggestions
  app.get('/api/projects', (req, res) => {
    res.json(dbManager.getProjects());
  });

  app.post('/api/projects/generate', async (req, res) => {
    const { goal } = req.body;
    if (!goal || !['frontend', 'backend', 'ai_engineer'].includes(goal)) {
      res.status(400).json({ error: "Invalid or missing goal" });
      return;
    }
    try {
      const profile = req.body.profile || dbManager.getProfile();
      if (!profile) {
        res.status(400).json({ error: "Please build a career profile first" });
        return;
      }
      const project = await generateProjectIdea(goal, profile);
      dbManager.addProject(project);
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate portfolio blueprint" });
    }
  });

  // 8. Dynamic General Agent Chat
  app.get('/api/chat', (req, res) => {
    res.json(dbManager.getChatHistory());
  });

  app.post('/api/chat', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: "Missing text payload string" });
      return;
    }
    try {
      const history = req.body.history || dbManager.getChatHistory();
      const profile = req.body.profile || dbManager.getProfile();

      // Save user message (if utilizing server db.json)
      const userMessage = {
        id: "msg-" + Math.random().toString(36).substring(2, 9),
        sender: "user" as const,
        text,
        timestamp: new Date().toISOString()
      };
      dbManager.addChatMessage(userMessage);

      // Invoke Gemini Router + Specialized agent response
      const agentResponse = await routeAndDiscuss(history, text, profile);

      // Save and return agent response
      const assistantMessage = {
        id: "msg-" + Math.random().toString(36).substring(2, 9),
        sender: "assistant" as const,
        agentId: agentResponse.agentId as any,
        text: agentResponse.text,
        timestamp: new Date().toISOString()
      };
      dbManager.addChatMessage(assistantMessage);

      res.json(assistantMessage);
    } catch (err: any) {
      res.status(500).json({ error: "Agent routing conversation failed" });
    }
  });

  app.post('/api/chat/clear', (req, res) => {
    dbManager.clearChatHistory();
    res.json({ success: true });
  });

  // Global reset back to baseline seed data
  app.post('/api/reset', (req, res) => {
    dbManager.reset();
    res.json({ success: true });
  });

  // VITE OR STATIC SERVING MIDDLEWARE - REGISTER AFTER API ROUTES

  async function startListener() {
    if (process.env.VERCEL === '1') {
      console.log("Running in Vercel Serverless environment, skipping local port binding.");
      return;
    }

    const PORT = 3000;
    if (process.env.NODE_ENV !== "production") {
      console.log("Starting server in development mode with Vite middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      console.log("Starting server in production mode with static distribution...");
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`AURA server listening on http://localhost:${PORT}`);
    });
  }

  startListener();

export default app;
