# AURA Career AI 🚀

AURA Career AI is an autonomous, full-stack career development operating system. It provides personalized AI-powered agents designed to supercharge your career path, optimize resumes, conduct interactive interview simulations, map out curriculum pathways, and perform automated portfolio reviews.

---

## ✨ Features

- **💼 Dashboard**: A centralized hub tracking metrics, active streaks, personalized goals, and quick-access widgets.
- **📝 Resume Intelligence**: Dynamic resume uploading, semantic parsing, improvement suggestions, and industry-targeted optimization suggestions.
- **💬 AURA Career Chat**: A real-time intelligent chat agent for interactive career consulting and guidance.
- **🎤 Mock Interview Coach**: Interactive oral/written simulation scenarios with performance scoring, category metrics, and smart answers critique.
- **🗺️ Learning Planner**: Auto-generated curriculum roadmaps with structured chapters, bookmarks, and direct checklist progress trackers.
- **🔍 Portfolio Analyzer**: Real-time evaluation of GitHub repositories and portfolio links with optimization scoring and gaps identification.
- **💡 Project Builder**: Personal interest keyword parser that crafts robust project scopes, architecture plans, and step-by-step instructions.
- **🎯 Job Match Analyzer**: Direct comparison of resume assets against job descriptions using gap-scoring models.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, and Motion animations.
- **Backend**: Express.js server running in-app proxies to handle secure communications.
- **AI Integration**: Google Gemini API powered by the official `@google/genai` SDK (keys kept entirely server-side).
- **Database & Authentication**: Firebase Auth (for secure sign-in) and Cloud Firestore (for multi-session user persistence).
- **Hosting / Serverless Integration**: Customized multi-runtime adapter designed to compile and run seamlessly as a standalone container or on Vercel Serverless Functions.

---

## 🔑 Environment Setup

Create a `.env` file in the root directory:

```env
# Google Gemini API Key (Server-side Only)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Web Config (Passed client-side securely via Vite)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
Starts the full-stack server running Express as a proxy, mounting Vite's HMR middleware for the frontend:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Run in Production
Compiles the static client assets to `/dist` and bundles the TypeScript backend server into a single CommonJS file:
```bash
npm run build
npm start
```

---

## 🌍 Deploying to Vercel

The project has been fully configured for Vercel Serverless Functions out of the box!

### Architecture Elements:
- **`vercel.json`**: Configures rewrites to forward all backend API endpoints (`/api/*`) to `/api/index.ts` and routes all static client-side views to `index.html`.
- **`/api/index.ts`**: The serverless wrapper that exports the Express `app` directly to Vercel's routing layer.
- **Serverless Adapter (`server.ts`)**: Automatically detects the serverless context (`process.env.VERCEL === '1'`) and skips direct, blocking TCP port listening, allowing Vercel to route traffic dynamically.

### Deployment Steps:
1. Push this repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **Add New** > **Project**.
3. Import your repository.
4. In the **Environment Variables** section, add your secret key:
   - `GEMINI_API_KEY` = `your_actual_gemini_api_key`
5. Click **Deploy**. Vercel will automatically run `npm run build` and route static SPA requests and Express APIs beautifully!

---

## 🔥 Firebase Setup Checklist

If you are setting up your own Firebase project from scratch:

1. **Authentication Configuration**:
   - Go to your **Firebase Console** > **Build** > **Authentication** > **Get Started**.
   - Enable **Email/Password** or **Google** providers in the **Sign-in method** tab. 
   - *Note: If you encounter an `auth/operation-not-allowed` error, it means you have not activated the sign-in provider in your Firebase project yet.*
2. **Firestore Database**:
   - Create a Firestore Database in Production or Test mode.
   - Put your client configuration credentials in `/src/lib/firebase.ts`.
3. **Deploy Security Rules**:
   - Apply secure attribute-based security rules (found in `firestore.rules`) to prevent unauthorized reading/writing.

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
