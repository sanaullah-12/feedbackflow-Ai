import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  KanbanSquare,
  Pause,
  Play,
  Plus,
  Sparkles,
  Square,
  TimerReset,
  UploadCloud,
  Wand2,
  X,
} from 'lucide-react';

const demoSteps = [
  {
    key: 'input',
    label: 'Step 1',
    title: 'Paste feedback or upload a source',
    copy: 'FeedbackFlow accepts raw text, PDFs, and Loom links so every complaint starts in one place.',
    icon: UploadCloud,
  },
  {
    key: 'analyze',
    label: 'Step 2',
    title: 'AI analyzes the feedback',
    copy: 'The model extracts sentiment, urgency, duplicates, and the product issue hiding underneath the noise.',
    icon: BrainCircuit,
  },
  {
    key: 'tasks',
    label: 'Step 3',
    title: 'AI creates task cards automatically',
    copy: 'The app turns a vague complaint into clear, prioritized tasks your team can scan and act on.',
    icon: Wand2,
  },
  {
    key: 'kanban',
    label: 'Step 4',
    title: 'Tasks land in Kanban',
    copy: 'Generated work appears in Todo, In Progress, and Done so the team can see execution at a glance.',
    icon: KanbanSquare,
  },
  {
    key: 'drag',
    label: 'Step 5',
    title: 'Drag tasks between columns',
    copy: 'Move work as it changes state and keep the board aligned with real progress.',
    icon: ArrowRight,
  },
  {
    key: 'modal',
    label: 'Step 6',
    title: 'Open full task details',
    copy: 'Click a task to see the AI reasoning, suggested fix, effort estimate, and source feedback.',
    icon: FileText,
  },
  {
    key: 'sprint',
    label: 'Step 7',
    title: 'AI Sprint Planner selects the right work',
    copy: 'The planner highlights high-impact tasks, quick wins, and realistic time estimates.',
    icon: Sparkles,
  },
  {
    key: 'timer',
    label: 'Step 8',
    title: 'Start a task timer',
    copy: 'A global timer stays visible across the app so focus time survives navigation and refresh.',
    icon: TimerReset,
  },
  {
    key: 'dashboard',
    label: 'Step 9',
    title: 'Track insights from the dashboard',
    copy: 'See AI insights, task summaries, sprint status, and productivity signals in one place.',
    icon: BarChart3,
  },
  {
    key: 'final',
    label: 'Step 10',
    title: 'Turn messy feedback into execution',
    copy: 'FeedbackFlow helps teams move from scattered input to clear product action with less manual work.',
    icon: CheckCircle2,
  },
];

const sampleFeedback = 'The signup form feels confusing on mobile. The submit button is hard to see, and the loading state is missing.';

const generatedTasks = [
  { title: 'Improve mobile signup layout', priority: 'High', eta: '15 min' },
  { title: 'Increase submit button visibility', priority: 'High', eta: '30 min' },
  { title: 'Add loading state after submit', priority: 'Medium', eta: '20 min' },
];

function PriorityPill({ priority }) {
  const classes = {
    High: 'bg-red-500/14 text-red-200 border-red-400/20',
    Medium: 'bg-amber-400/14 text-amber-200 border-amber-300/20',
    Low: 'bg-cyan-400/14 text-cyan-200 border-cyan-300/20',
  }[priority] || 'bg-white/10 text-white/80 border-white/10';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-800 ${classes}`}>
      {priority}
    </span>
  );
}

function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-indigo-200/10 bg-white/[0.045] shadow-xl shadow-black/25 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function DemoVisual({ step, onRestart }) {
  switch (step.key) {
    case 'input':
      return (
        <Panel className="overflow-hidden p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-800 text-white">Feedback input</div>
            <span className="rounded-full bg-indigo-500/14 px-2.5 py-1 text-[11px] font-800 text-indigo-100">Ready</span>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-indigo-200/10 bg-slate-950/65 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-800 uppercase tracking-[0.14em] text-white/55">
                <FileText size={13} /> Sample feedback
              </div>
              <p className="text-base leading-7 text-white">{sampleFeedback}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['PDF', 'Client notes.pdf'],
                ['Text', 'Paste customer feedback'],
                ['Loom', 'Product review link'],
              ].map(([type, label]) => (
                <div key={label} className="rounded-2xl border border-indigo-200/10 bg-slate-950/55 p-3">
                  <div className="mb-2 inline-flex rounded-full bg-indigo-500/12 px-2.5 py-1 text-[11px] font-800 text-indigo-100">{type}</div>
                  <div className="text-sm text-white/90">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      );
    case 'analyze':
      return (
        <Panel className="relative overflow-hidden p-4 sm:p-5">
          <motion.div
            className="absolute inset-x-8 top-8 h-32 rounded-full bg-indigo-500/12 blur-3xl"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
          <div className="relative mb-4 flex items-center justify-between">
            <div className="text-sm font-800 text-white">AI analysis</div>
            <BrainCircuit className="text-indigo-200" size={18} />
          </div>
          <div className="relative grid gap-3">
            {[
              ['Sentiment', 'Confused', 'bg-violet-500/14 text-violet-100'],
              ['Urgency', 'High', 'bg-red-500/14 text-red-100'],
              ['Signals', 'Mobile, button, loading', 'bg-white/8 text-white'],
            ].map(([label, value, tone]) => (
              <motion.div
                key={label}
                className="rounded-2xl border border-indigo-200/10 bg-slate-950/55 p-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-1 text-[11px] font-800 uppercase tracking-[0.14em] text-white/50">{label}</div>
                <span className={`inline-flex rounded-full border border-white/5 px-2.5 py-1 text-xs font-800 ${tone}`}>{value}</span>
              </motion.div>
            ))}
          </div>
        </Panel>
      );
    case 'tasks':
      return (
        <Panel className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-800 text-white">Generated tasks</div>
            <Wand2 size={17} className="text-indigo-200" />
          </div>
          <div className="space-y-3">
            {generatedTasks.map((task, index) => (
              <motion.div
                key={task.title}
                className="rounded-2xl border border-indigo-200/10 bg-slate-950/55 p-3.5"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-800 leading-snug text-white">{task.title}</div>
                    <div className="mt-1 text-xs text-white/55">Estimated effort {task.eta}</div>
                  </div>
                  <PriorityPill priority={task.priority} />
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      );
    case 'kanban':
      return (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['Todo', [generatedTasks[0]], 'bg-indigo-500/10'],
            ['In Progress', [generatedTasks[1]], 'bg-violet-500/10'],
            ['Done', [generatedTasks[2]], 'bg-emerald-500/10'],
          ].map(([column, items, tone]) => (
            <Panel key={column} className={`p-3 ${tone}`}>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-900 uppercase tracking-[0.14em] text-white/75">{column}</div>
                <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-800 text-white/70">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((task) => (
                  <motion.div
                    key={task.title}
                    className="rounded-xl border border-indigo-200/10 bg-slate-950/65 p-3 shadow-lg shadow-black/15"
                    animate={column === 'In Progress' ? { y: [0, -3, 0] } : {}}
                    transition={{ duration: 2.8, repeat: Infinity }}
                  >
                    <div className="text-sm font-800 text-white">{task.title}</div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <PriorityPill priority={task.priority} />
                      <span className="text-[11px] text-white/55">{task.eta}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      );
    case 'drag':
      return (
        <Panel className="relative overflow-hidden p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-800 text-white">Drag and drop</div>
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-800 text-white/70">Move task cards</span>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="space-y-2 rounded-2xl border border-indigo-200/10 bg-slate-950/55 p-3">
              <div className="text-xs font-900 uppercase tracking-[0.14em] text-white/50">Todo</div>
              <div className="rounded-xl border border-red-400/20 bg-red-500/12 p-3">
                <div className="text-sm font-800 text-white">{generatedTasks[0].title}</div>
                <div className="mt-2 flex items-center justify-between"><PriorityPill priority="High" /><span className="text-[11px] text-white/55">Drag to progress</span></div>
              </div>
            </div>
            <motion.div
              className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-indigo-200/10 bg-indigo-500/12 text-indigo-100"
              animate={{ scale: [1, 1.08, 1], rotate: [0, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              <ArrowRight size={18} />
            </motion.div>
            <div className="space-y-2 rounded-2xl border border-indigo-200/10 bg-slate-950/55 p-3">
              <div className="text-xs font-900 uppercase tracking-[0.14em] text-white/50">In Progress</div>
              <motion.div
                className="rounded-xl border border-indigo-400/20 bg-indigo-500/12 p-3"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 3.2, repeat: Infinity }}
              >
                <div className="text-sm font-800 text-white">{generatedTasks[1].title}</div>
                <div className="mt-2 flex items-center justify-between"><PriorityPill priority="High" /><span className="text-[11px] text-white/55">Drop here</span></div>
              </motion.div>
            </div>
          </div>
        </Panel>
      );
    case 'modal':
      return (
        <div className="relative overflow-hidden rounded-[26px] border border-indigo-200/10 bg-slate-950/55 p-4 sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(99,102,241,0.16),transparent_38%)]" />
          <div className="relative grid gap-3 lg:grid-cols-[1fr_1.05fr]">
            <Panel className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-900 uppercase tracking-[0.14em] text-white/50">Kanban board</div>
                <KanbanSquare size={16} className="text-indigo-200" />
              </div>
              <div className="space-y-2">
                {generatedTasks.map((task) => (
                  <div key={task.title} className="rounded-xl border border-indigo-200/10 bg-slate-950/65 p-3">
                    <div className="text-sm font-800 text-white">{task.title}</div>
                    <div className="mt-2 flex items-center justify-between"><PriorityPill priority={task.priority} /><span className="text-[11px] text-white/55">Click for details</span></div>
                  </div>
                ))}
              </div>
            </Panel>
            <motion.div
              className="relative rounded-[24px] border border-indigo-200/10 bg-[#101625]/92 p-4 shadow-2xl shadow-black/35"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-900 uppercase tracking-[0.14em] text-white/50">Task details modal</div>
                  <div className="mt-1 text-lg font-900 text-white">{generatedTasks[0].title}</div>
                </div>
                <span className="rounded-full bg-red-500/14 px-2.5 py-1 text-[11px] font-800 text-red-100">High priority</span>
              </div>
              <div className="space-y-3">
                {[
                  ['Description', 'Users are struggling to complete signup on mobile.'],
                  ['AI reasoning', 'High user friction with a quick implementation path.'],
                  ['Suggested fix', 'Increase spacing, surface the CTA, and add loading feedback.'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/[0.045] p-3">
                    <div className="mb-1 text-[11px] font-900 uppercase tracking-[0.14em] text-white/45">{label}</div>
                    <div className="text-sm leading-6 text-white/90">{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      );
    case 'sprint':
      return (
        <Panel className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-800 text-white">AI Sprint Planner</div>
              <div className="mt-1 text-xs text-white/55">High impact tasks, quick wins, and estimated time</div>
            </div>
            <Sparkles size={18} className="text-indigo-200" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-indigo-200/10 bg-slate-950/60 p-3">
              <div className="text-xs font-900 uppercase tracking-[0.14em] text-white/50">High impact</div>
              <div className="space-y-2">
                {generatedTasks.slice(0, 2).map((task) => (
                  <div key={task.title} className="rounded-xl border border-indigo-200/10 bg-white/[0.04] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-800 text-white">{task.title}</div>
                      <span className="rounded-full bg-red-500/14 px-2 py-0.5 text-[11px] font-800 text-red-100">{task.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2 rounded-2xl border border-indigo-200/10 bg-slate-950/60 p-3">
              <div className="text-xs font-900 uppercase tracking-[0.14em] text-white/50">Quick wins</div>
              <div className="space-y-2">
                <div className="rounded-xl border border-indigo-200/10 bg-white/[0.04] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-800 text-white">{generatedTasks[2].title}</div>
                    <span className="rounded-full bg-violet-500/14 px-2 py-0.5 text-[11px] font-800 text-violet-100">{generatedTasks[2].eta}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-indigo-500/12 p-3 text-sm text-white/90">
                  AI selected these tasks because they improve onboarding and conversion without blocking bigger product work.
                </div>
              </div>
            </div>
          </div>
        </Panel>
      );
    case 'timer':
      return (
        <div className="relative overflow-hidden rounded-[26px] border border-indigo-200/10 bg-slate-950/55 p-4 sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.18),transparent_28%)]" />
          <div className="relative grid gap-4 lg:grid-cols-[1fr_auto]">
            <Panel className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-900 uppercase tracking-[0.14em] text-white/50">Task timer</div>
                <TimerReset size={16} className="text-indigo-200" />
              </div>
              <div className="text-sm font-800 text-white">{generatedTasks[0].title}</div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/55">
                <span>18 min estimated</span>
                <span>06:40 remaining</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/8">
                <motion.div className="h-2 rounded-full bg-gradient-to-r from-indigo-300 to-violet-300" animate={{ width: ['42%', '64%', '42%'] }} transition={{ duration: 3, repeat: Infinity }} />
              </div>
            </Panel>
            <div className="relative w-full max-w-[250px] rounded-[24px] border border-indigo-200/10 bg-[#101625] p-4 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-900 uppercase tracking-[0.14em] text-white/50">Global timer</span>
                <span className="rounded-full bg-emerald-500/14 px-2 py-0.5 text-[11px] font-800 text-emerald-100">Running</span>
              </div>
              <div className="mt-3 text-lg font-900 text-white">02:18</div>
              <div className="mt-1 text-xs text-white/55">Improve mobile signup layout</div>
              <div className="mt-3 flex gap-2">
                <button className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-white"><Pause size={14} /></button>
                <button className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-white"><Square size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      );
    case 'dashboard':
      return (
        <Panel className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-800 text-white">Dashboard insights</div>
            <BarChart3 size={18} className="text-indigo-200" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Active Sprint', '3 tasks in progress'],
                ['AI Insights', '12 feedback items analyzed'],
                ['Critical Issues', '2 blockers need review'],
                ['Productivity', '82% sprint health'],
              ].map(([title, value]) => (
                <div key={title} className="rounded-2xl border border-indigo-200/10 bg-slate-950/55 p-3">
                  <div className="text-[11px] font-900 uppercase tracking-[0.14em] text-white/50">{title}</div>
                  <div className="mt-2 text-sm font-800 text-white">{value}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-indigo-200/10 bg-indigo-500/12 p-4">
              <div className="mb-2 text-[11px] font-900 uppercase tracking-[0.14em] text-indigo-100">AI insight panel</div>
              <div className="space-y-2 text-sm text-white/90">
                <div>12 users reported onboarding issues</div>
                <div>Checkout flow has the highest business impact</div>
                <div>3 quick wins can be completed in under 2 hours</div>
                <div>AI recommends prioritizing signup issues</div>
              </div>
            </div>
          </div>
        </Panel>
      );
    default:
      return (
        <Panel className="flex min-h-[380px] flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-500/12 text-indigo-100">
            <CheckCircle2 size={28} />
          </div>
          <h3 className="text-2xl font-900 text-white">FeedbackFlow turns messy feedback into clear execution.</h3>
          <p className="mt-3 max-w-lg text-sm leading-7 text-white/70">
            The product helps teams move from raw feedback to AI-generated tasks, sprint plans, and measurable progress.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white">
              Get Started <ArrowRight size={14} />
            </Link>
            <button type="button" onClick={onRestart} className="inline-flex items-center gap-2 rounded-full border border-indigo-200/10 bg-white/[0.08] px-5 py-3 text-sm font-bold text-white">
              Watch again <Plus size={14} />
            </button>
          </div>
        </Panel>
      );
  }
}

export default function ProductDemoModal({ open, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  const step = demoSteps[stepIndex];

  useEffect(() => {
    if (!open) return undefined;
    setStepIndex(0);
    setPlaying(true);
    setAutoPlay(true);
  }, [open]);

  useEffect(() => {
    if (!open || !playing || !autoPlay) return undefined;
    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % demoSteps.length);
    }, 11000);
    return () => window.clearInterval(timer);
  }, [open, playing, autoPlay]);

  useEffect(() => {
    if (!open) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const progress = useMemo(() => ((stepIndex + 1) / demoSteps.length) * 100, [stepIndex]);

  const close = () => onClose?.();
  const previous = () => setStepIndex((current) => (current - 1 + demoSteps.length) % demoSteps.length);
  const next = () => setStepIndex((current) => (current + 1) % demoSteps.length);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[30px] bg-[linear-gradient(145deg,rgba(16,22,37,0.985),rgba(8,13,25,0.985))] shadow-[0_32px_120px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.035)]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_12%,rgba(99,102,241,0.14),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%)]" />
        <div className="relative flex max-h-[92vh] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-4 sm:px-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/10 bg-white/[0.05] px-3 py-1 text-[11px] font-900 uppercase tracking-[0.16em] text-indigo-100">
                <Sparkles size={12} /> Product demo
              </div>
              <h2 className="mt-2 text-xl font-900 text-white sm:text-2xl">FeedbackFlow product tour</h2>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={previous} className="grid h-10 w-10 place-items-center rounded-full border border-white/8 bg-white/[0.06] text-white transition hover:bg-white/[0.1]" aria-label="Previous step">
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.06] px-4 py-2 text-sm font-800 text-white transition hover:bg-white/[0.1]"
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
                {playing ? 'Pause' : 'Play'}
              </button>
              <button type="button" onClick={next} className="grid h-10 w-10 place-items-center rounded-full border border-white/8 bg-white/[0.06] text-white transition hover:bg-white/[0.1]" aria-label="Next step">
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setAutoPlay((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-800 transition ${autoPlay ? 'bg-indigo-500/16 text-indigo-100' : 'border border-white/8 bg-white/[0.06] text-white'}`}
              >
                Auto-play
              </button>
              <button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-full border border-white/8 bg-white/[0.06] text-white transition hover:bg-white/[0.1]" aria-label="Close demo">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="grid flex-1 gap-0 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="border-b border-white/8 p-4 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200/10 bg-white/[0.05] px-3 py-1 text-[11px] font-900 uppercase tracking-[0.16em] text-white/70">
                {step.label}
              </div>
              <h3 className="text-2xl font-900 leading-tight text-white sm:text-3xl">{step.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">{step.copy}</p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-800 uppercase tracking-[0.14em] text-white/45">
                  <span>Demo progress</span>
                  <span>{stepIndex + 1} / {demoSteps.length}</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {demoSteps.map((entry, index) => (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => setStepIndex(index)}
                    className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${
                      index === stepIndex
                        ? 'border-indigo-300/25 bg-indigo-500/12 text-white'
                        : 'border-white/8 bg-white/[0.04] text-white/70 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className={`grid h-8 w-8 place-items-center rounded-xl ${index === stepIndex ? 'bg-indigo-500/16 text-indigo-100' : 'bg-white/8 text-white/70'}`}>
                      <entry.icon size={14} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-900 uppercase tracking-[0.14em] opacity-60">{entry.label}</span>
                      <span className="block truncate text-sm font-800">{entry.title}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: 18, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -18, filter: 'blur(8px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-900 uppercase tracking-[0.16em] text-white/45">
                      <step.icon size={14} className="text-indigo-200" />
                      {step.label}
                    </div>
                    <span className="rounded-full border border-white/8 bg-white/[0.05] px-3 py-1 text-xs font-800 text-white/70">
                      2-3 minute guided demo
                    </span>
                  </div>

                  <DemoVisual step={step} onRestart={() => setStepIndex(0)} />
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
                <div className="text-sm text-white/55">
                  {stepIndex === demoSteps.length - 1 ? 'End of demo' : 'Use the arrows to move through the walkthrough.'}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={previous} className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.06] px-4 py-2 text-sm font-800 text-white transition hover:bg-white/[0.1]">
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-800 text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
