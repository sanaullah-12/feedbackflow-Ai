import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { Spinner } from '../components/ui';
import AnimatedKanbanDemo from '../components/auth/AnimatedKanbanDemo';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.email || !form.password) {
      return toast.error('Please fill in all fields.');
    }
    
    if (form.password.length < 8) {
      return toast.error('Password must be at least 8 characters.');
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      return toast.error('Password must contain uppercase, lowercase, and a number.');
    }
    
    clearError();
    setLoading(true);
    
    try {
      // Call signup - this sets user and token in Zustand state
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome to FeedbackFlow 🎉');
      
      // Navigate to dashboard - user is already authenticated
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Signup failed. Please try again.';
      toast.error(errorMsg);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel with animated Kanban demo */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6b21a8 0%, #1e3eff 100%)' }}>
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
          animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating blur orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 16, repeat: Infinity }}
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
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Sparkles size={20} color="white" fill="white" />
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
            Welcome to the<br />
            <motion.span
              className="text-white/70 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              future of tasks.
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-white/70 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of teams converting feedback into actionable tasks instantly.
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

        {/* Stats */}
        <motion.div
          className="relative grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { number: '10K+', label: 'Active users' },
            { number: '2M+', label: 'Tasks created' },
            { number: '99.9%', label: 'Uptime' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="backdrop-blur-sm bg-white/5 rounded-lg border border-white/10 p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              whileHover={{ bg: 'rgba(255,255,255,0.1)' }}
            >
              <div className="text-white font-800 text-lg">{stat.number}</div>
              <div className="text-white/60 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Right panel - Sign up form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(circle at center, #6b21a8, transparent)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
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
              <Sparkles size={16} color="white" fill="white" />
            </motion.div>
            <span className="font-700 text-lg" style={{ color: 'var(--text)' }}>FeedbackFlow AI</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-3xl font-700 mb-2" style={{ color: 'var(--text)' }}>Create your account</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>
              Already have an account? <Link to="/login" className="font-semibold hover:underline transition-all" style={{ color: 'var(--brand)' }}>Sign in here</Link>
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
              <label className="label">Full name</label>
              <motion.input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input"
                placeholder="Jane Doe"
                autoComplete="name"
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
              <label className="label">Email address</label>
              <motion.input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input"
                placeholder="you@company.com"
                autoComplete="email"
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
              transition={{ delay: 0.35 }}
            >
              <label className="label">Password</label>
              <div className="relative">
                <motion.input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input pr-10"
                  placeholder="Min. 8 chars, 1 uppercase, 1 lowercase, 1 number"
                  autoComplete="new-password"
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
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
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
                    <Spinner size={16} /> Creating account...
                  </motion.div>
                ) : (
                  <>Create free account <ArrowRight size={16} /></>
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
            Free plan includes 2 AI-processed feedbacks per month. No credit card required.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
