import React, { useState, useEffect } from 'react';
import { User, Key, Palette, Shield, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import { Spinner, Progress, PricingModal } from '../components/ui';

function Section({ icon: Icon, title, description, children }) {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4 mb-5 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--brand-light)' }}>
          <Icon size={18} style={{ color: 'var(--brand)' }} />
        </div>
        <div>
          <h3 className="font-700 text-base" style={{ color: 'var(--text)' }}>{title}</h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateUser, refreshUser } = useAuthStore();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Profile state
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false });
  const [savingPw, setSavingPw] = useState(false);

  // API key state
  const [geminiKey, setGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyPreview, setKeyPreview] = useState(null);
  const [savingKey, setSavingKey] = useState(false);

  // Pricing modal state
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => {
      setKeyPreview(r.data.settings.geminiKeyPreview);
    }).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) return toast.error('Name is required.');
    setSavingProfile(true);
    try {
      const { data } = await api.patch('/auth/update-profile', profile);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) return toast.error('Fill in both password fields.');
    if (passwords.newPassword.length < 8) return toast.error('New password must be at least 8 characters.');
    setSavingPw(true);
    try {
      await api.patch('/auth/change-password', passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setSavingPw(false);
    }
  };

  const handleSaveApiKey = async () => {
    setSavingKey(true);
    try {
      await api.patch('/settings/gemini-key', { apiKey: geminiKey || null });
      const r = await api.get('/settings');
      setKeyPreview(r.data.settings.geminiKeyPreview);
      setGeminiKey('');
      toast.success(geminiKey ? 'API key saved!' : 'API key removed.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save API key.');
    } finally {
      setSavingKey(false);
    }
  };

  const themes = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-700" style={{ color: 'var(--text)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Manage your account, preferences, and integrations.</p>
      </div>

      <div className="space-y-5">
        {/* Profile */}
        <Section icon={User} title="Profile" description="Your display name and email address.">
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            </div>
            <button onClick={handleSaveProfile} disabled={savingProfile} className="btn btn-primary">
              {savingProfile ? <><Spinner size={15} /> Saving...</> : 'Save Profile'}
            </button>
          </div>
        </Section>

        {/* Plan & Usage */}
        <Section icon={Shield} title="Plan & Usage" description="Your current subscription and monthly usage.">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
              <div>
                <p className="font-700 text-sm capitalize" style={{ color: 'var(--text)' }}>{user?.plan} Plan</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                  {user?.plan === 'free' ? '10 feedbacks / month' : '500 feedbacks / month'}
                </p>
              </div>
              {user?.plan === 'free' && (
                <button onClick={() => setShowPricing(true)} className="btn btn-primary btn-sm">Upgrade to Pro ✨</button>
              )}
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: 'var(--text-2)' }}>Monthly feedback usage</span>
                <span className="text-sm font-700" style={{ color: 'var(--text)' }}>
                  {user?.usage?.feedbackCount || 0} / {user?.usage?.limit || 2}
                </span>
              </div>
              <Progress value={user?.usage?.feedbackCount || 0} max={user?.usage?.limit || 2} />
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-3)' }}>
                Resets on {user?.usage?.resetDate ? new Date(user.usage.resetDate).toLocaleDateString() : '—'}
              </p>
            </div>
            {user?.plan === 'free' && (
              <div className="p-4 rounded-xl border" style={{ background: 'var(--brand-light)', borderColor: 'rgba(58,95,255,0.2)' }}>
                <p className="font-700 text-sm mb-1" style={{ color: 'var(--brand)' }}>🚀 Upgrade to Pro</p>
                <ul className="space-y-1 mb-3">
                  {['500 feedbacks/month', 'Priority AI processing', 'Advanced analytics', 'API access'].map(f => (
                    <li key={f} className="text-xs flex items-center gap-2" style={{ color: 'var(--text-2)' }}>
                      <Check size={12} style={{ color: 'var(--brand)' }} /> {f}
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary btn-sm w-full justify-center">
                  Upgrade — $29/month
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* Theme */}
        <Section icon={Palette} title="Appearance" description="Choose your preferred theme.">
          <div className="flex gap-3">
            {themes.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === t.id ? 'border-[var(--brand)]' : 'border-[var(--border)] hover:border-[var(--text-3)]'
                }`}
                style={{ background: theme === t.id ? 'var(--brand-light)' : 'var(--surface-2)' }}>
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs font-600" style={{ color: theme === t.id ? 'var(--brand)' : 'var(--text-2)' }}>
                  {t.label}
                </span>
                {theme === t.id && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--brand)' }}>
                  <Check size={10} color="white" />
                </div>}
              </button>
            ))}
          </div>
        </Section>

        {/* Gemini API Key */}
        <Section icon={Key} title="Gemini API Key" description="Use your own Gemini API key for unlimited processing.">
          <div className="space-y-4">
            {keyPreview && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--success-light)' }}>
                <Check size={14} style={{ color: 'var(--success)' }} />
                <span className="text-sm font-600" style={{ color: 'var(--success)' }}>
                  Active key: {keyPreview}
                </span>
              </div>
            )}
            <div>
              <label className="label">API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  className="input pr-10"
                  value={geminiKey}
                  onChange={e => setGeminiKey(e.target.value)}
                  placeholder={keyPreview ? 'Enter new key to replace...' : 'AIza...'}
                />
                <button type="button" onClick={() => setShowKey(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-3)' }}>
                Get your free API key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer"
                  className="underline" style={{ color: 'var(--brand)' }}>aistudio.google.com</a>.
                Leave blank to use our shared key (subject to rate limits).
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSaveApiKey} disabled={savingKey} className="btn btn-primary">
                {savingKey ? <><Spinner size={15} /> Saving...</> : 'Save API Key'}
              </button>
              {keyPreview && (
                <button onClick={() => { setGeminiKey(''); handleSaveApiKey(); }} className="btn btn-danger btn-sm">
                  Remove Key
                </button>
              )}
            </div>
          </div>
        </Section>

        {/* Change Password */}
        <Section icon={Shield} title="Security" description="Change your account password.">
          <div className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <input type={showPw.current ? 'text' : 'password'} className="input pr-10"
                  value={passwords.currentPassword}
                  onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} />
                <button type="button" onClick={() => setShowPw(s => ({ ...s, current: !s.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>
                  {showPw.current ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <input type={showPw.new ? 'text' : 'password'} className="input pr-10"
                  value={passwords.newPassword}
                  onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min. 8 chars with upper, lower & number" />
                <button type="button" onClick={() => setShowPw(s => ({ ...s, new: !s.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>
                  {showPw.new ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button onClick={handleChangePassword} disabled={savingPw} className="btn btn-primary">
              {savingPw ? <><Spinner size={15} /> Updating...</> : 'Change Password'}
            </button>
          </div>
        </Section>
      </div>

      {/* Pricing Modal */}
      <PricingModal 
        open={showPricing} 
        onClose={() => setShowPricing(false)}
        onSelectPlan={(planId, billingPeriod) => {
          console.log('Selected plan:', planId, 'Billing period:', billingPeriod);
          setShowPricing(false);
        }}
      />
    </div>
  );
}
