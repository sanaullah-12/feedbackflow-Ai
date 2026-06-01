import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  ClipboardList,
  Clock3,
  FileText,
  Flag,
  KanbanSquare,
  Layers3,
  Lightbulb,
  MessageSquareText,
  PlayCircle,
  Rocket,
  Sparkles,
  Target,
  TimerReset,
  UploadCloud,
  Wand2,
  Workflow,
} from 'lucide-react';
import ProductDemoModal from '../components/marketing/ProductDemoModal';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const problems = [
  {
    icon: FileText,
    title: 'Scattered feedback',
    text: 'Client feedback lives across PDFs, chats, notes, calls, and videos.',
  },
  {
    icon: TimerReset,
    title: 'Manual sorting',
    text: 'Teams spend hours reading, grouping, and rewriting the same complaints.',
  },
  {
    icon: Target,
    title: 'Unclear priority',
    text: 'Founders and teams lose time deciding which issue should be fixed first.',
  },
];

const steps = [
  {
    label: 'Step 1',
    title: 'Upload feedback',
    text: 'Drop in PDF notes, paste raw customer feedback, or add Loom and video links.',
    icon: UploadCloud,
    chips: ['PDF', 'Text', 'Loom link'],
  },
  {
    label: 'Step 2',
    title: 'AI analyzes everything',
    text: 'FeedbackFlow detects bugs, UX issues, feature requests, sentiment, urgency, and repeated complaints.',
    icon: BrainCircuit,
    chips: ['Urgency', 'Sentiment', 'Duplicates'],
  },
  {
    label: 'Step 3',
    title: 'Get ready-to-use tasks',
    text: 'Receive priority task cards, suggestions, estimated effort, and sprint recommendations.',
    icon: ClipboardList,
    chips: ['Priority', 'Effort', 'Sprint plan'],
  },
];

const features = [
  ['AI Feedback Analysis', 'Analyze PDFs, text, and links without manually reading every detail.', Bot],
  ['Auto Task Generation', 'Turn raw feedback into clear, actionable product tasks.', Wand2],
  ['Priority Detection', 'Surface urgent bugs, blockers, and high-impact improvements first.', Flag],
  ['Kanban Workflow', 'Move generated tasks through a focused execution pipeline.', KanbanSquare],
  ['AI Sprint Planner', 'Build a realistic sprint from impact, effort, and urgency signals.', Rocket],
  ['Smart Suggestions', 'Get concise fixes, next steps, and product recommendations.', Lightbulb],
  ['Duplicate Detection', 'Group repeated complaints so noisy feedback becomes evidence.', Layers3],
  ['Export Ready', 'Structure work for reports, client handoff, and future integrations.', Workflow],
  ['Export Ready', 'Structure work for future reports, clients, and integrations.', Workflow],
];

const benefits = [
  'Save hours of manual feedback reading',
  'Prioritize what actually matters',
  'Reduce confusion in product teams',
  'Improve user experience faster',
  'Turn client feedback into execution',
  'Make product decisions with AI support',
];

const useCases = [
  ['Startup founders', Rocket],
  ['SaaS teams', BarChart3],
  ['UI/UX agencies', Sparkles],
  ['Product managers', Target],
  ['Developers', Workflow],
  ['Client feedback teams', MessageSquareText],
];

const workflow = ['PDF/Text/Loom', 'AI Analysis', 'Task Cards', 'Kanban', 'Sprint Plan', 'Export'];

const plans = [
  {
    name: 'Free',
    price: '$0',
    items: ['Limited feedback analysis', 'Basic task generation'],
  },
  {
    name: 'Pro',
    price: '$8',
    highlighted: true,
    items: ['Unlimited AI analysis', 'Kanban workflow', 'AI Sprint Planner', 'Smart suggestions'],
  },
  {
    name: 'Agency',
    price: '$20',
    items: ['Multiple workspaces', 'Client-ready reports', 'Advanced exports', 'Priority support'],
  },
];

function SectionHeader({ eyebrow, title, text }) {
  return (
    <motion.div
      className="mx-auto mb-12 max-w-3xl text-center"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55 }}
    >
      {eyebrow && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/10 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-semibold tracking-normal text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {text && <p className="mt-5 text-base leading-8 text-white sm:text-lg">{text}</p>}
    </motion.div>
  );
}

function GlassCard({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-indigo-200/10 bg-white/[0.045] shadow-2xl shadow-black/24 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function HeroMockup() {
  const taskCards = [
    { title: 'Fix confusing onboarding step', badge: 'High', color: 'bg-rose-400/15 text-rose-100 border-indigo-200/10' },
    { title: 'Add billing export option', badge: 'Medium', color: 'bg-violet-400/15 text-violet-100 border-indigo-200/10' },
    { title: 'Improve mobile filter UX', badge: 'Quick win', color: 'bg-indigo-400/15 text-indigo-100 border-indigo-200/10' },
  ];

  return (
    <motion.div
      className="relative mx-auto w-full max-w-5xl"
      initial={{ opacity: 0, y: 34, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.15 }}
    >
      <div className="absolute inset-x-8 top-8 h-40 rounded-full bg-indigo-500/18 blur-3xl" />
      <GlassCard className="relative overflow-hidden rounded-[28px] p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-indigo-200/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-violet-300" />
          </div>
          <div className="rounded-full border border-indigo-200/10 bg-white/[0.04] px-3 py-1 text-xs text-white">
            FeedbackFlow AI workspace
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr_1.25fr]">
          <motion.div
            className="space-y-3 rounded-2xl border border-indigo-200/10 bg-slate-950/60 p-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Feedback input</div>
              <UploadCloud className="h-4 w-4 text-indigo-200" />
            </div>
            {[
              ['PDF', 'Client QA notes.pdf'],
              ['Text', 'Users keep missing filters'],
              ['Loom', 'Checkout review recording'],
            ].map(([type, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-indigo-200/10 bg-white/[0.04] p-3">
                <span className="rounded-lg bg-indigo-500/12 px-2 py-1 text-xs font-semibold text-indigo-100">{type}</span>
                <span className="min-w-0 truncate text-sm text-white">{label}</span>
              </div>
            ))}
          </motion.div>

          <div className="relative flex min-h-48 items-center justify-center">
            <motion.div
              className="absolute h-px w-full bg-gradient-to-r from-indigo-300/0 via-indigo-200 to-violet-300/0"
              animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <motion.div
              className="relative grid h-32 w-32 place-items-center rounded-full border border-indigo-200/10 bg-indigo-500/10 shadow-2xl shadow-indigo-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              <div className="grid h-20 w-20 place-items-center rounded-full border border-indigo-200/10 bg-slate-950">
                <BrainCircuit className="h-9 w-9 text-indigo-100" />
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-2 rounded-full border border-indigo-200/10 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-100"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              analyzing feedback
            </motion.div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {taskCards.map((task, index) => (
              <motion.div
                key={task.title}
                className="rounded-2xl border border-indigo-200/10 bg-white/[0.055] p-4"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + index * 0.16, duration: 0.45 }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${task.color}`}>{task.badge}</span>
                  <Clock3 className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm font-semibold leading-6 text-white">{task.title}</div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-300 to-violet-300"
                    initial={{ width: '20%' }}
                    animate={{ width: `${72 - index * 12}%` }}
                    transition={{ delay: 0.85 + index * 0.1, duration: 0.7 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {['Backlog', 'In progress', 'Sprint ready'].map((column, index) => (
            <div key={column} className="rounded-2xl border border-indigo-200/10 bg-slate-950/45 p-3">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {column}
                <span>{index + 2}</span>
              </div>
              <div className="space-y-2">
                <div className="h-14 rounded-xl border border-indigo-200/10 bg-white/[0.05]" />
                <div className="h-10 rounded-xl border border-indigo-200/10 bg-white/[0.035]" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function SprintMockup() {
  const backlog = ['Checkout bug from PDF', 'Repeated mobile complaint', 'Missing export request', 'Confusing empty state'];
  const sprint = ['Fix onboarding blocker', 'Improve filters', 'Add CSV export'];

  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <ClipboardList className="h-4 w-4 text-indigo-200" />
            Backlog tasks
          </div>
          <div className="space-y-3">
            {backlog.map((item, index) => (
              <motion.div
                key={item}
                className="rounded-xl border border-indigo-200/10 bg-slate-950/50 p-3 text-sm text-white"
                animate={{ x: [0, index % 2 ? -4 : 4, 0] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-indigo-200/10 bg-indigo-500/[0.075] p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-indigo-50">
            <Sparkles className="h-4 w-4" />
            Recommended sprint plan
          </div>
          <div className="space-y-3">
            {sprint.map((item, index) => (
              <motion.div
                key={item}
                className="rounded-xl border border-indigo-200/10 bg-slate-950/60 p-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{item}</span>
                  <span className="rounded-full bg-violet-500/14 px-2 py-1 text-xs text-violet-100">{index === 0 ? 'High impact' : 'Quick win'}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white">
                  <span>2-4h</span>
                  <span>Product + Dev</span>
                  <span>Reason: repeated complaint</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_80%_16%,rgba(139,92,246,0.18),transparent_32%),linear-gradient(180deg,#070b14_0%,#0f1424_48%,#070b14_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

      <header className="relative z-20 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-300 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
            <Workflow className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-normal">FeedbackFlow</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#ai-sprint-planner" className="hover:text-white">AI Sprint Planner</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full border border-indigo-200/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            Login
          </Link>
          <Link to="/signup" className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 text-center lg:px-8 lg:pb-28 lg:pt-24">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/10 bg-white/[0.05] px-4 py-2 text-sm text-white">
              <Sparkles className="h-4 w-4 text-indigo-200" />
              AI feedback analysis for product execution
            </motion.div>
            <motion.h1 variants={fadeUp} className="mx-auto max-w-5xl text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
              Turn messy feedback into clear product tasks with AI
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white sm:text-xl">
              FeedbackFlow analyzes PDFs, text, and Loom links, then converts them into prioritized tasks, Kanban cards, smart suggestions, and AI sprint plans.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-sm font-bold text-white shadow-2xl shadow-indigo-500/25 transition hover:-translate-y-0.5 sm:w-auto">
                Start Analyzing Feedback
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button type="button" onClick={() => setDemoOpen(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-indigo-200/10 bg-white/[0.08] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/12 sm:w-auto">
                <PlayCircle className="h-4 w-4" />
                View Demo
              </button>
            </motion.div>
          </motion.div>
          <div className="mt-16">
            <HeroMockup />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeader title="Feedback is everywhere. Action is missing." />
          <motion.div className="grid gap-5 md:grid-cols-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            {problems.map(({ icon: Icon, title, text }) => (
              <motion.div key={title} variants={fadeUp}>
                <GlassCard className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/25">
                  <Icon className="mb-5 h-9 w-9 text-indigo-200" />
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 leading-7 text-white">{text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeader
            eyebrow="The FeedbackFlow method"
            title="FeedbackFlow turns every feedback source into a clear action plan."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map(({ label, title, text, icon: Icon, chips }, index) => (
              <motion.div key={title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <GlassCard className="relative h-full overflow-hidden p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">{label}</span>
                    <Icon className="h-8 w-8 text-indigo-200" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{title}</h3>
                  <p className="mt-4 min-h-24 leading-7 text-white">{text}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {chips.map((chip) => (
                      <span key={chip} className="rounded-full border border-indigo-200/10 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-100">{chip}</span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeader title="Everything your product team needs to act faster" />
          <motion.div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            {features.map(([title, text, Icon]) => (
              <motion.div key={title} variants={fadeUp}>
                <GlassCard className="group h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/25 hover:bg-white/[0.08]">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-indigo-200/10 bg-white/[0.08] transition group-hover:border-indigo-500/25">
                    <Icon className="h-6 w-6 text-indigo-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 leading-7 text-white">{text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="ai-sprint-planner" className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/10 bg-white/[0.05] px-4 py-2 text-sm text-indigo-100">
              <Rocket className="h-4 w-4" />
              AI Sprint Planner
            </div>
            <h2 className="text-3xl font-semibold tracking-normal text-white sm:text-5xl">Know exactly what to fix next</h2>
            <p className="mt-5 leading-8 text-white">
              AI Sprint Planner recommends 3 high-impact tasks, 2 quick wins, estimated completion time, suggested role or assignee, and the reason why each task matters.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-white sm:grid-cols-2">
              {['3 high-impact tasks', '2 quick wins', 'Estimated completion time', 'Suggested role or assignee'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-indigo-300" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
          <SprintMockup />
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeader title="Built for focused execution" text="Move from messy feedback to clear tasks, priorities, sprint recommendations, and client-ready exports without extra workflow overhead." />
          <GlassCard className="mx-auto max-w-4xl p-6">
            <div className="grid gap-3 md:grid-cols-3">
              {['Prioritized backlog', 'Sprint-ready task plan', 'Client-ready report'].map((item, index) => (
                <motion.div
                  key={item}
                  className="rounded-2xl border border-indigo-200/10 bg-slate-950/50 p-4 text-sm font-medium text-white"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.4, delay: index * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold text-white sm:text-5xl">Why teams use FeedbackFlow</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-indigo-200/10 bg-white/[0.045] p-4 text-white">
                <BadgeCheck className="h-5 w-5 shrink-0 text-indigo-300" />
                {benefit}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeader title="Perfect for modern product teams" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map(([label, Icon]) => (
              <GlassCard key={label} className="flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:border-indigo-500/25">
                <Icon className="h-6 w-6 text-indigo-200" />
                <span className="font-semibold text-white">{label}</span>
              </GlassCard>
            ))}
          </div>
        </section>

        <section id="demo" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeader
            eyebrow="Watch the demo"
            title="See FeedbackFlow in motion."
            text="A short guided tour shows feedback input, AI analysis, task generation, Kanban, sprint planning, timers, and dashboard insights."
          />
          <GlassCard className="mb-6 overflow-hidden p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/10 bg-white/[0.05] px-4 py-2 text-sm text-white">
                  <PlayCircle className="h-4 w-4 text-indigo-200" />
                  Interactive product tour
                </div>
                <h3 className="text-2xl font-semibold text-white sm:text-3xl">A 2-3 minute walkthrough of the full workflow</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white sm:text-base">
                  Open the demo modal to follow the same journey your users take: feedback in, AI analysis, task generation, Kanban, sprint planning, timer tracking, and product insights.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Input', 'AI analysis', 'Tasks', 'Kanban', 'Sprint', 'Timer', 'Dashboard'].map((item) => (
                    <span key={item} className="rounded-full border border-indigo-200/10 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-100">{item}</span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                >
                  Watch Demo
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Feedback', 'PDF / Text / Loom', UploadCloud],
                  ['AI output', 'Tasks + sprint plan', BrainCircuit],
                  ['Execution', 'Board + timer + dashboard', BarChart3],
                ].map(([title, text, Icon]) => (
                  <div key={title} className="rounded-2xl border border-indigo-200/10 bg-slate-950/70 p-4">
                    <Icon className="h-5 w-5 text-indigo-200" />
                    <div className="mt-3 text-sm font-semibold text-white">{title}</div>
                    <div className="mt-2 text-xs leading-6 text-white/70">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
          <GlassCard className="overflow-hidden p-5 sm:p-8">
            <div id="workflow" className="grid gap-4 md:grid-cols-6">
              {workflow.map((item, index) => (
                <div key={item} className="relative">
                  {index < workflow.length - 1 && (
                    <motion.div
                      className="absolute left-1/2 top-7 hidden h-px w-full bg-gradient-to-r from-indigo-300 to-violet-300 md:block"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 2.2, delay: index * 0.15, repeat: Infinity }}
                    />
                  )}
                  <div className="relative z-10 rounded-2xl border border-indigo-200/10 bg-slate-950/70 p-4 text-center">
                    <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-sm font-bold text-white">{index + 1}</div>
                    <div className="text-sm font-semibold text-white">{item}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeader title="Pricing that scales with your feedback volume" />
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <GlassCard key={plan.name} className={`p-6 ${plan.highlighted ? 'border-indigo-500/25 bg-indigo-500/[0.08]' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                    <p className="mt-2 text-white">For growing feedback workflows</p>
                  </div>
                  <div className="text-3xl font-semibold text-white">{plan.price}</div>
                </div>
                <div className="mt-6 space-y-3">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-white">
                      <Check className="h-4 w-4 text-indigo-300" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link to="/signup" className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition ${plan.highlighted ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5' : 'border border-indigo-200/10 bg-white/[0.08] text-white hover:bg-white/12'}`}>
                  Start Free
                </Link>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
          <GlassCard className="p-8 sm:p-12">
            <h2 className="text-3xl font-semibold tracking-normal text-white sm:text-5xl">Stop reading feedback manually. Let AI turn it into action.</h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button type="button" onClick={() => setDemoOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200/10 bg-white/[0.08] px-6 py-4 text-sm font-bold text-white transition hover:bg-white/12">
                Try Demo
              </button>
            </div>
          </GlassCard>
        </section>
      </main>

      <ProductDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <footer className="relative z-10 border-t border-indigo-200/10 px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-white md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-300 to-violet-500 text-white">
              <Workflow className="h-4 w-4" />
            </span>
            <span className="font-semibold">FeedbackFlow</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href="#workflow" className="hover:text-white">Product</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="mailto:hello@feedbackflow.ai" className="hover:text-white">Contact</a>
          </div>
          <div>Copyright 2026 FeedbackFlow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}


