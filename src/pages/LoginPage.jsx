import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { Spinner } from '../components/ui';
import AnimatedKanbanDemo from '../components/auth/AnimatedKanbanDemo';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.email || !form.password) {
      return toast.error('Please fill in all fields.');
    }
    
    clearError();
    setLoading(true);
    
    try {
      // Call login - this sets user and token in Zustand state
      await login(form.email, form.password);
      toast.success('Welcome back!');
      
      // Navigate to dashboard - user is already authenticated
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel with animated Kanban demo */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3eff 0%, #6b21a8 100%)' }}>
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '48px 48px' }}
          animate={{ backgroundPosition: ['0px 0px', '48px 48px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating blur orbs */}
        <motion.div
          className="absolute top-10 right-20 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-purple-400/10 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -60, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        {/* Header */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <motion.div
              className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Zap size={20} color="white" fill="white" />
            </motion.div>
            <motion.span
              className="text-white font-700 text-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              FeedbackFlow AI
            </motion.span>
          </div>
          <motion.h1
            className="text-5xl font-800 text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Turn messy<br />
            <motion.span
              className="text-white/70 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              feedback into tasks.
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-white/70 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Paste client feedback, drop a Loom link, or upload notes — get structured tasks in seconds.
          </motion.p>
        </motion.div>

        {/* Animated Kanban Demo - Main Feature */}
        <motion.div
          className="relative z-10 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          whileHover={{ boxShadow: '0 0 30px rgba(255,255,255,0.1)' }}
        >
          <AnimatedKanbanDemo />
        </motion.div>

        {/* Features list */}
        <motion.div
          className="relative space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {['AI-powered task generation', 'Kanban & list views', 'Priority categorization', 'CSV & JSON export'].map((f, i) => (
            <motion.div
              key={f}
              className="flex items-center gap-3 text-white/80 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.2, rotate: 360 }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              {f}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right panel - Sign in form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(circle at center, #1e3eff, transparent)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center gap-2 mb-8 lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-8 h-8 rounded-xl flex items-center justify-center" 
              style={{ background: 'var(--brand)' }}
              whileHover={{ rotate: 20 }}
            >
              <Zap size={16} color="white" fill="white" />
            </motion.div>
            <span className="font-700 text-lg" style={{ color: 'var(--text)' }}>FeedbackFlow AI</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-3xl font-700 mb-2" style={{ color: 'var(--text)' }}>Sign in</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>
              Don't have an account? <Link to="/signup" className="font-semibold hover:underline transition-all" style={{ color: 'var(--brand)' }}>Sign up free</Link>
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="label">Email address</label>
              <motion.input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input"
                placeholder="you@company.com"
                autoComplete="email"
                initial={{ boxShadow: '0 0 0 0px var(--text)' }}
                whileFocus={{
                  boxShadow: '0 0 0 2px var(--brand)',
                  scale: 1.01
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="label">Password</label>
              <div className="relative">
                <motion.input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  whileFocus={{
                    boxShadow: '0 0 0 2px var(--brand)',
                    scale: 1.01
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-3)' }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="pt-2"
            >
              <div className="text-right mb-3">
                <Link to="/forgot-password" className="text-sm font-semibold hover:underline" style={{ color: 'var(--brand)' }}>Forgot password?</Link>
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full justify-center"
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {loading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Spinner size={16} /> Signing in...
                  </motion.div>
                ) : (
                  <>Sign in <ArrowRight size={16} /></>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.p
            className="text-xs text-center mt-6"
            style={{ color: 'var(--text-3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
