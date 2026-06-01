import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Mail, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Spinner } from '../components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message || 'If that email exists, a reset link has been sent.');
      // For dev: show resetUrl in toast if returned
      if (data.resetUrl) {
        console.log('Reset URL:', data.resetUrl);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between overflow-hidden p-12 relative"
        style={{ background: 'linear-gradient(135deg, #16245f 0%, #3656f5 52%, #25a4b8 100%)' }}
      >
        <motion.div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
            backgroundSize: '44px 44px'
          }}
          animate={{ backgroundPosition: ['0px 0px', '44px 44px'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Zap size={20} color="white" fill="white" />
            </div>
            <span className="text-white font-700 text-xl">FeedbackFlow AI</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-8">
              <KeyRound size={26} color="white" />
            </div>
            <h1 className="text-5xl font-800 text-white leading-tight mb-5">
              Recover access<br />
              <span className="text-white/70">without losing flow.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              Send a secure reset link to the email connected with your workspace and get back to organizing feedback.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="relative z-10 grid gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {['Protected account recovery', 'Single-use reset links', 'Works with light and dark themes'].map(item => (
            <div key={item} className="flex items-center gap-3 text-white/80 text-sm">
              <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </span>
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(circle at 22% 18%, color-mix(in srgb, var(--brand) 14%, transparent), transparent 28%), radial-gradient(circle at 82% 78%, color-mix(in srgb, var(--success) 10%, transparent), transparent 30%)'
          }}
        />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand)' }}>
              <Zap size={16} color="white" fill="white" />
            </div>
            <span className="font-700 text-lg" style={{ color: 'var(--text)' }}>FeedbackFlow AI</span>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-7 hover:underline"
            style={{ color: 'var(--text-2)' }}
          >
            <ArrowLeft size={16} /> Back to sign in
          </Link>

          <div className="mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border"
              style={{ background: 'var(--brand-light)', borderColor: 'var(--border)', color: 'var(--brand)' }}
            >
              <Mail size={22} />
            </div>
            <h2 className="text-3xl font-700 mb-3" style={{ color: 'var(--text)' }}>Forgot password?</h2>
            <p className="text-sm leading-6" style={{ color: 'var(--text-2)' }}>
              Enter your account email and we will send a password reset link if it matches an existing account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={17} style={{ color: 'var(--text-3)' }} />
                <input
                  type="email"
                  className="input pl-10"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full justify-center" disabled={loading}>
              {loading ? <><Spinner size={16} /> Sending link...</> : <>Send reset link <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-sm mt-6 text-center" style={{ color: 'var(--text-2)' }}>
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--brand)' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
