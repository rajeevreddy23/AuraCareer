import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuEoSbIOCvlSrgHktHQHol_I2ckU-z_Jk",
  authDomain: "aura-career-ai.firebaseapp.com",
  projectId: "aura-career-ai",
  storageBucket: "aura-career-ai.firebasestorage.app",
  messagingSenderId: "452855267352",
  appId: "1:452855267352:web:10f3e75898af1e3dd0036d",
  measurementId: "G-N9WFT884VC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
