import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import { Sparkles, Key, Mail, Smartphone, Eye, EyeOff, Loader } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse email or phone number to register or login with Firebase Auth
  const getFirebaseEmail = (input: string): string => {
    const trimmed = input.trim();
    if (trimmed.includes('@')) {
      return trimmed.toLowerCase();
    }
    // Clean phone number (leave digits and leading '+')
    const cleanPhone = trimmed.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 5) {
      throw new Error('Please enter a valid email address or mobile number.');
    }
    return `phone_${cleanPhone}@auracareer.auth`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!identifier) {
        throw new Error('Please enter your email or mobile number.');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
      if (!isLogin && !name) {
        throw new Error('Please enter your full name to set up your profile.');
      }

      const email = getFirebaseEmail(identifier);

      if (isLogin) {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set displayName in Firebase Auth
        await updateProfile(userCredential.user, {
          displayName: name.trim()
        });
        onAuthSuccess(userCredential.user);
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      let friendlyMessage = err.message || 'An unexpected authentication error occurred.';
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No account found with this email or mobile number. Please register first!';
      } else if (err.code === 'auth/wrong-password') {
        friendlyMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email or mobile number is already registered. Please login instead!';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'The email or phone format is invalid.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password should be at least 6 characters.';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] flex items-center justify-center p-4 selection:bg-blue-600/20">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-zinc-950/40 border border-white/5 rounded-2xl p-8 backdrop-blur-md relative"
        id="auth-card"
      >
        {/* Decorative corner borders */}
        <div className="absolute -top-px -left-px w-6 h-6 border-t border-l border-blue-500/30 rounded-tl-2xl" />
        <div className="absolute -top-px -right-px w-6 h-6 border-t border-r border-blue-500/30 rounded-tr-2xl" />
        <div className="absolute -bottom-px -left-px w-6 h-6 border-b border-l border-blue-500/30 rounded-bl-2xl" />
        <div className="absolute -bottom-px -right-px w-6 h-6 border-b border-r border-blue-500/30 rounded-br-2xl" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-900/10 mb-4">
            <span className="font-bold text-lg text-white">A</span>
          </div>
          <h2 className="text-xl font-display font-semibold tracking-tight text-white">
            AURA CAREER OS
          </h2>
          <p className="text-xs text-zinc-500 font-mono tracking-wider mt-1">
            ENTERPRISE AI PORTAL SYSTEM
          </p>
        </div>

        {/* Tabs for Login / Register */}
        <div className="flex bg-zinc-900/60 p-1 rounded-lg border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              isLogin ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              !isLogin ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg p-3 text-xs mb-5 font-mono flex items-start gap-2.5"
            >
              <span className="text-sm">⚠</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name for signup only */}
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="block text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition font-mono"
                  />
                  <Sparkles className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email or Mobile Number Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex justify-between">
              <span>Email / Mobile Number</span>
              <span className="text-zinc-600 normal-case">Or Phone</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="email@example.com or +1234567890"
                className="w-full bg-zinc-900/40 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition font-mono"
              />
              {identifier.includes('@') || !identifier ? (
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
              ) : (
                <Smartphone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/40 border border-white/5 rounded-lg pl-9 pr-10 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition font-mono"
              />
              <Key className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white py-2 text-xs font-semibold cursor-pointer select-none transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-3.5 w-3.5" />
                Processing...
              </>
            ) : isLogin ? (
              'Access Orchestrator'
            ) : (
              'Initialize Profile'
            )}
          </button>
        </form>

        <p className="mt-6 text-[10px] text-zinc-600 text-center font-mono uppercase tracking-wider">
          {isLogin ? (
            <>
              First time here?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
                className="text-blue-500 hover:underline"
              >
                Register an Account
              </button>
            </>
          ) : (
            <>
              Have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
                className="text-blue-500 hover:underline"
              >
                Sign in now
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
