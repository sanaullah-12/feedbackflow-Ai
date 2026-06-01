import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquarePlus, ListTodo, CalendarClock, Settings, Zap, Menu, Columns3, ChevronDown, CreditCard } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getInitials, cn } from '../../utils/helpers';
import { PricingModal } from '../ui';
import GlobalTaskTimer from '../tasks/GlobalTaskTimer';

const navItems = [
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/kanban', icon: Columns3, label: 'Kanban' },
  { to: '/feedback', icon: MessageSquarePlus, label: 'Feedback', badge: '12' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sprint-planner', icon: CalendarClock, label: 'AI Sprint Planner' },
  { action: 'pricing', icon: CreditCard, label: 'Pricing' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="mx-6 flex items-center gap-3 border-b border-white/10 py-8">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-300 to-violet-500 shadow-lg shadow-violet-500/20">
          <Zap size={16} color="white" fill="white" />
        </div>
        <div className="min-w-0">
          <span className="block text-lg font-800 leading-tight text-white">FeedbackFlow</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 p-3 pt-8">
        {navItems.map(({ to, action, icon: Icon, label, badge }) => (
          action === 'pricing' ? (
            <button
              key={label}
              onClick={() => {
                setShowPricing(true);
                setMobileOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-5 py-3 text-left text-sm font-600 text-slate-300 transition-all hover:bg-white/8 hover:text-white"
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
            </button>
          ) : (
            <NavLink key={`${to}-${label}`} to={to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                'flex w-full items-center gap-3 rounded-xl px-5 py-3 text-sm font-600 text-slate-300 transition-all hover:bg-white/8 hover:text-white',
                isActive && 'bg-gradient-to-r from-indigo-500/70 to-violet-500/60 text-white shadow-lg shadow-indigo-950/30'
              )}>
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="rounded-lg bg-violet-500 px-2 py-0.5 text-xs font-800 text-white shadow-lg shadow-violet-500/25">{badge}</span>
              )}
            </NavLink>
          )
        ))}
      </nav>

      <div className="mx-3 mb-3 rounded-xl border border-white/6 bg-white/[0.04] p-4">
        <p className="mb-5 text-xs font-500 text-slate-400">Workspace</p>
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-800 text-white">Acme Labs</span>
          <ChevronDown size={16} className="text-slate-300" />
        </div>
      </div>

      {/* User */}
      <div className="mx-3 mb-4 flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.07] p-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-indigo-500 text-sm font-bold text-white">
          {getInitials(user?.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-700 text-white">{user?.name || 'Sanaullah'}</p>
          <p className="truncate text-xs text-slate-400">Admin</p>
        </div>
        <button onClick={handleLogout} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" title="Logout">
          <ChevronDown size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#070b14] text-white">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/8 bg-gradient-to-b from-[#0f1424] to-[#080d19] lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute bottom-0 left-0 top-0 flex w-72 flex-col border-r border-white/8 bg-[#0f1424]">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center gap-3 border-b border-white/8 bg-[#0f1424] px-4 py-3 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="btn btn-secondary btn-sm !px-2 !py-2">
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand)' }}>
              <Zap size={12} color="white" fill="white" />
            </div>
            <span className="font-700 text-sm" style={{ color: 'var(--text)' }}>FeedbackFlow</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_35%_0%,rgba(79,114,255,0.12),transparent_28%),linear-gradient(180deg,#090d18_0%,#070b14_100%)]">
          <Outlet />
        </main>
      </div>

      {/* Pricing Modal */}
      <GlobalTaskTimer />
      <PricingModal 
        open={showPricing} 
        onClose={() => setShowPricing(false)}
        onSelectPlan={(planId, billingPeriod) => {
          // TODO: Integrate with Stripe payment
          console.log('Selected plan:', planId, 'Billing period:', billingPeriod);
          setShowPricing(false);
        }}
      />
    </div>
  );
}
