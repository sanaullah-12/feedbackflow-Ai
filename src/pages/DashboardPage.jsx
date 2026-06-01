import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2, Clock, Gauge, Lightbulb, ListTodo, MessageSquare, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { Skeleton, Empty, Badge, PricingModal } from '../components/ui';
import { formatRelative, PRIORITY_CONFIG, STATUS_CONFIG, CATEGORY_CONFIG } from '../utils/helpers';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#7c8cff', '#a78bfa', '#4f46e5', '#c4b5fd'];

function StatCard({ icon: Icon, label, value, sub, color = 'var(--brand)', loading }) {
  if (loading) return (
    <div className="card p-5">
      <Skeleton className="w-8 h-8 mb-3" />
      <Skeleton className="w-16 h-7 mb-2" />
      <Skeleton className="w-24 h-4" />
    </div>
  );
  return (
    <div className="card p-5 hover:scale-[1.01] transition-transform">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ background: color + '20' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-2xl font-800 mb-0.5" style={{ color: 'var(--text)' }}>{value}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>{sub}</div>}
    </div>
  );
}

const cardMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

function PremiumOverviewCard({ icon: Icon, title, value, meta, detail, accent, loading, delay = 0 }) {
  if (loading) {
    return (
      <div className="premium-card p-5">
        <Skeleton className="h-9 w-9 mb-5" />
        <Skeleton className="h-4 w-28 mb-3" />
        <Skeleton className="h-8 w-20 mb-3" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      variants={cardMotion}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
      whileHover={{ y: -3 }}
      className="premium-card premium-card-glow group p-5"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10"
          style={{ background: `${accent}22`, color: accent }}>
          <Icon size={18} />
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-800 text-slate-300">
          {meta}
        </span>
      </div>
      <p className="mb-2 text-xs font-800 uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <p className="mb-3 text-2xl font-900 text-white">{value}</p>
      <p className="text-sm leading-6 text-slate-400">{detail}</p>
    </motion.div>
  );
}

function AIInsightsPanel({ data, loading }) {
  const stats = data?.stats || {};
  const high = data?.tasksByPriority?.High || 0;
  const totalTasks = stats.totalTasks || 0;
  const feedback = stats.totalFeedback || 0;
  const quickWins = Math.max(0, (data?.tasksByPriority?.Low || 0) + (data?.tasksByPriority?.Medium || 0));
  const topCategory = data?.tasksByCategory
    ? Object.entries(data.tasksByCategory).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;

  const insights = [
    {
      icon: MessageSquare,
      text: `${feedback || 0} feedback item${feedback === 1 ? '' : 's'} analyzed across this workspace.`
    },
    {
      icon: Target,
      text: topCategory ? `${topCategory} has the strongest task signal right now.` : 'AI will surface repeated themes after more feedback is processed.'
    },
    {
      icon: Lightbulb,
      text: `${quickWins} potential quick win${quickWins === 1 ? '' : 's'} can help reduce delivery friction.`
    },
    {
      icon: AlertTriangle,
      text: high > 0 ? `${high} high priority issue${high === 1 ? '' : 's'} should be reviewed before the next sprint.` : 'No high priority issues are currently blocking the sprint.'
    }
  ];

  return (
    <div className="premium-card p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/20 text-indigo-200">
          <BrainCircuit size={19} />
        </div>
        <div>
          <h2 className="text-sm font-900 text-white">AI Insights</h2>
          <p className="text-xs text-slate-500">Product manager style recommendations</p>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => <Skeleton key={index} className="h-12 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="rounded-xl border border-white/8 bg-white/[0.035] p-3 transition hover:border-indigo-400/25 hover:bg-white/[0.055]"
              >
                <div className="flex gap-3">
                  <Icon size={15} className="mt-0.5 flex-shrink-0 text-indigo-300" />
                  <p className="text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categoryData = data ? Object.entries(data.tasksByCategory).map(([name, value]) => ({ name, value })) : [];
  const priorityData = data ? [
    { name: 'High', value: data.tasksByPriority.High || 0 },
    { name: 'Medium', value: data.tasksByPriority.Medium || 0 },
    { name: 'Low', value: data.tasksByPriority.Low || 0 },
  ] : [];
  const stats = data?.stats || {};
  const completionRate = stats.completionRate || 0;
  const pendingTasks = (stats.todoTasks || 0) + (stats.inProgressTasks || 0);
  const highPriority = data?.tasksByPriority?.High || 0;
  const sprintHealth = Math.max(0, Math.min(100, completionRate + (highPriority > 0 ? -8 : 8)));

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-700" style={{ color: 'var(--text)' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
            Here's what's happening with your projects today.
          </p>
        </div>
        <Link to="/feedback" className="btn btn-primary hidden sm:flex">
          <Zap size={15} /> New Feedback
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PremiumOverviewCard
          icon={Sparkles}
          title="Active Sprint"
          value={`${completionRate}% progress`}
          meta={`${pendingTasks} remaining`}
          detail={`${pendingTasks} open tasks with an estimated ${Math.max(1, Math.ceil(pendingTasks * 1.5))}h of focused work.`}
          accent="#7c8cff"
          loading={loading}
          delay={0}
        />
        <PremiumOverviewCard
          icon={BrainCircuit}
          title="AI Insights"
          value={`${stats.totalFeedback || 0} analyzed`}
          meta={`${stats.totalTasks || 0} tasks`}
          detail={`${Math.max(0, data?.tasksByPriority?.Low || 0)} quick wins and ${highPriority} high impact issues detected.`}
          accent="#8b5cf6"
          loading={loading}
          delay={0.04}
        />
        <PremiumOverviewCard
          icon={AlertTriangle}
          title="Critical Issues"
          value={highPriority}
          meta={highPriority > 0 ? 'Review now' : 'Stable'}
          detail={highPriority > 0 ? 'High priority tasks need product review before the next release.' : 'No critical blockers detected from current feedback.'}
          accent="#a78bfa"
          loading={loading}
          delay={0.08}
        />
        <PremiumOverviewCard
          icon={Gauge}
          title="Productivity"
          value={`${sprintHealth}% health`}
          meta={`${stats.completedTasks || 0} done`}
          detail={`${stats.todoTasks || 0} pending, ${stats.inProgressTasks || 0} in progress, ${stats.completedTasks || 0} completed.`}
          accent="#6366f1"
          loading={loading}
          delay={0.12}
        />
      </div>

      <AIInsightsPanel data={data} loading={loading} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MessageSquare} label="Feedback Processed" value={loading ? '—' : data?.stats.totalFeedback ?? 0}
          sub="All time" color="#6366f1" loading={loading} />
        <StatCard icon={ListTodo} label="Total Tasks" value={loading ? '—' : data?.stats.totalTasks ?? 0}
          sub={`${data?.stats.todoTasks ?? 0} to-do`} color="#8b5cf6" loading={loading} />
        <StatCard icon={Clock} label="In Progress" value={loading ? '—' : data?.stats.inProgressTasks ?? 0}
          sub="Being worked on" color="#a78bfa" loading={loading} />
        <StatCard icon={CheckCircle2} label="Completed" value={loading ? '—' : data?.stats.completedTasks ?? 0}
          sub={`${data?.stats.completionRate ?? 0}% completion rate`} color="#7c8cff" loading={loading} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly activity */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-600 text-sm" style={{ color: 'var(--text)' }}>Tasks Created</h3>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>Last 7 days</p>
            </div>
            <TrendingUp size={16} style={{ color: 'var(--text-3)' }} />
          </div>
          {loading ? <Skeleton className="h-40 w-full" /> : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={data?.weeklyCreation || []} barSize={24}>
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-3)', fontFamily: 'Sora' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} allowDecimals={false} width={25} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', fontFamily: 'Sora' }}
                  labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--brand)' }}
                  cursor={{ fill: 'var(--surface-2)' }}
                />
                <Bar dataKey="count" fill="var(--brand)" radius={[6, 6, 0, 0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category breakdown */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-600 text-sm" style={{ color: 'var(--text)' }}>By Category</h3>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>Task breakdown</p>
            </div>
          </div>
          {loading ? <Skeleton className="h-40 w-full" /> : categoryData.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>No tasks yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={30} outerRadius={55}
                    paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.slice(0, 4).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span style={{ color: 'var(--text-2)' }}>{CATEGORY_CONFIG[item.name]?.icon} {item.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent activity + Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent tasks */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-sm" style={{ color: 'var(--text)' }}>Recent Activity</h3>
            <Link to="/tasks" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--brand)' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !data?.recentActivity?.length ? (
            <Empty icon="📋" title="No tasks yet" description="Process your first feedback to create tasks." />
          ) : (
            <div className="space-y-2">
              {data.recentActivity.map(task => {
                const sc = STATUS_CONFIG[task.status];
                const pc = PRIORITY_CONFIG[task.priority];
                return (
                  <div key={task._id} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--surface-2)]">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{task.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-3)' }}>{formatRelative(task.updatedAt)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`badge text-xs ${pc.bg} ${pc.color}`}>{task.priority}</span>
                      <span className="hidden sm:inline-flex badge text-xs" style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}>{task.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Usage + plan */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-600 text-sm mb-4" style={{ color: 'var(--text)' }}>Plan & Usage</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--text-2)' }}>Monthly feedbacks</span>
              <span className="font-700 text-sm" style={{ color: 'var(--text)' }}>
                {user?.usage?.feedbackCount || 0} / {user?.usage?.limit || 10}
              </span>
            </div>
            <div className="w-full h-2 rounded-full mb-3" style={{ background: 'var(--surface-2)' }}>
              <div className="h-2 rounded-full transition-all" style={{
                width: `${Math.min(100, ((user?.usage?.feedbackCount || 0) / (user?.usage?.limit || 2)) * 100)}%`,
                background: 'var(--brand)'
              }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded-full font-semibold capitalize"
                style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
                {user?.plan} plan
              </span>
              {user?.plan === 'free' && (
                <button onClick={() => setShowPricing(true)} className="btn btn-primary btn-sm">Upgrade ✨</button>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h3 className="font-600 text-sm mb-3" style={{ color: 'var(--text)' }}>Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/feedback" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors w-full text-left">
                <span className="text-lg">✍️</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Paste feedback</p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>Convert text to tasks</p>
                </div>
                <ArrowRight size={14} className="ml-auto" style={{ color: 'var(--text-3)' }} />
              </Link>
              <Link to="/feedback?tab=url" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors w-full text-left">
                <span className="text-lg">🎥</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Loom video</p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>Import from Loom</p>
                </div>
                <ArrowRight size={14} className="ml-auto" style={{ color: 'var(--text-3)' }} />
              </Link>
            </div>
          </div>
        </div>
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
