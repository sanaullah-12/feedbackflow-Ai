import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Ticket,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Spinner } from '../components/ui';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get('token');
    const e = searchParams.get('email');
    if (t) setToken(t);
    if (e) setEmail(e);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !token) return toast.error('Missing token or email');
    if (!newPassword || newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (newPassword !== confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, token, newPassword });
      toast.success('Password reset successful — you are now signed in');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'Passwords match', met: newPassword.length > 0 && newPassword === confirm },
    { label: 'Token and email present', met: Boolean(email && token) }
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <div
        className="hidden lg:flex w-[44%] flex-col justify-between overflow-hidden p-12 relative"
        style={{ background: 'linear-gradient(135deg, #0f766e 0%, #1e3eff 58%, #5b21b6 100%)' }}
      >
        <motion.div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 28%, rgba(255,255,255,0.75) 1px, transparent 1px), radial-gradient(circle at 72% 62%, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize: '46px 46px'
          }}
          animate={{ backgroundPosition: ['0px 0px', '46px 46px'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
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
              <ShieldCheck size={27} color="white" />
            </div>
            <h1 className="text-5xl font-800 text-white leading-tight mb-5">
              Create a new<br />
              <span className="text-white/70">secure password.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              Confirm your reset token, choose a fresh password, and continue directly into your dashboard.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="relative z-10 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className="flex items-center gap-3 text-white font-700 mb-4">
            <KeyRound size={18} /> Reset checklist
          </div>
          <div className="grid gap-3">
            {passwordChecks.map(item => (
              <div key={item.label} className="flex items-center gap-3 text-sm text-white/80">
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <CheckCircle2 size={15} className={item.met ? 'text-white' : 'text-white/40'} />
                </span>
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(circle at 20% 16%, color-mix(in srgb, var(--brand) 13%, transparent), transparent 28%), radial-gradient(circle at 84% 82%, color-mix(in srgb, var(--warning) 10%, transparent), transparent 30%)'
          }}
        />

        <motion.div
          className="w-full max-w-[520px] relative z-10"
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
              <Lock size={22} />
            </div>
            <h2 className="text-3xl font-700 mb-3" style={{ color: 'var(--text)' }}>Reset password</h2>
            <p className="text-sm leading-6" style={{ color: 'var(--text-2)' }}>
              Use the reset token from your email and set a password with at least 8 characters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
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

              <div>
                <label className="label">Reset token</label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={17} style={{ color: 'var(--text-3)' }} />
                  <input
                    type="text"
                    className="input pl-10 font-mono text-[13px]"
                    value={token}
                    onChange={e => setToken(e.target.value.trim())}
                    placeholder="Paste token"
                    autoComplete="one-time-code"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={17} style={{ color: 'var(--text-3)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-3)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={17} style={{ color: 'var(--text-3)' }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-3)' }}
                    aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl border p-4 grid gap-3 sm:grid-cols-3"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              {passwordChecks.map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs font-semibold" style={{ color: item.met ? 'var(--success)' : 'var(--text-3)' }}>
                  <CheckCircle2 size={15} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full justify-center" disabled={loading}>
              {loading ? <><Spinner size={16} /> Resetting password...</> : <>Reset password <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-sm mt-6 text-center" style={{ color: 'var(--text-2)' }}>
            Need a new link?{' '}
            <Link to="/forgot-password" className="font-semibold hover:underline" style={{ color: 'var(--brand)' }}>Request another reset</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
