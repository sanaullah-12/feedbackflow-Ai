import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Bot, CheckCircle2, Clock3, Lightbulb, Pause, Play, RefreshCw, Sparkles, Square, Target, Trash2, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useTaskStore from '../store/taskStore';
import { createSprintPlan } from '../utils/sprintPlanner';
import { CATEGORY_CONFIG } from '../utils/helpers';
import { Empty, Modal, Skeleton, Spinner } from '../components/ui';

const truncate = (value = '', max = 110) => (
  value.length > max ? `${value.slice(0, max).trim()}...` : value
);

function SprintTaskCard({ task, rank }) {
  const category = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.Other;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [timerBusy, setTimerBusy] = useState(false);
  const [timeHistory, setTimeHistory] = useState(null);
  const { runningTimer, startTimer, pauseTimer, resumeTimer, stopTimer, completeTimedTask, fetchTimerHistory } = useTaskStore();
  const taskId = task.sourceTaskId || task.taskId || task.id || task._id || null;
  const priorityTone = {
    High: 'bg-red-500/14 text-red-300',
    Medium: 'bg-amber-400/14 text-amber-300',
    Low: 'bg-cyan-400/14 text-cyan-300',
  }[task.priority] || 'bg-slate-500/14 text-slate-300';
  const isHighPriority = task.priority === 'High';
  const estimatedMinutes = task.estimatedMinutes || Math.round((task.estimatedHours || 0) * 60) || 30;
  const effortLabel = estimatedMinutes < 60 ? `${estimatedMinutes} min` : `${Math.round((estimatedMinutes / 60) * 10) / 10}h`;
  const runningTaskId = runningTimer?.taskId?._id || runningTimer?.taskId;
  const isTimerRunning = runningTaskId && taskId && runningTaskId.toString() === taskId.toString();
  const isTimerPaused = isTimerRunning && runningTimer?.status === 'paused';
  const actualMinutes = timeHistory?.actualMinutes ?? task.timeStats?.actualMinutes ?? 0;
  const differenceMinutes = timeHistory?.differenceMinutes ?? task.timeStats?.differenceMinutes ?? 0;

  useEffect(() => {
    if (!detailsOpen || !taskId) return;
    fetchTimerHistory(taskId)
      .then(setTimeHistory)
      .catch(() => setTimeHistory(null));
  }, [detailsOpen, fetchTimerHistory, taskId]);

  const handleTimerAction = async (event) => {
    event.stopPropagation();
    if (!taskId) {
      toast.error('This sprint task is missing its linked task id.');
      return;
    }
    if (timerBusy) return;

    setTimerBusy(true);
    try {
      if (isTimerRunning) {
        if (isTimerPaused) {
          await resumeTimer(taskId);
          toast.success('Timer resumed');
        } else {
          await pauseTimer(taskId);
          toast.success('Timer paused');
        }
      } else {
        const activeTaskId = runningTimer?.taskId?._id || runningTimer?.taskId;
        if (activeTaskId && taskId && activeTaskId.toString() !== taskId.toString()) {
          const shouldSwitch = window.confirm('You already have a running task.\nWould you like to stop it and start this one?');
          if (!shouldSwitch) return;
        }
        await startTimer(taskId);
        toast.success('Timer started');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Timer action failed');
    } finally {
      setTimerBusy(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, scale: 1.006 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={() => setDetailsOpen(true)}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#101625]/82 p-3.5 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-indigo-300/35 hover:bg-[#151c2f]/88 hover:shadow-indigo-950/25 ${isHighPriority ? 'high-priority-card' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 gap-3">
            <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-lg bg-indigo-500/15 text-[10px] font-900 text-indigo-200">
              {rank}
            </span>
            <p className="min-w-0 flex-1 text-sm font-800 leading-snug text-white line-clamp-2" title={task.title}>
              {task.title}
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-900 leading-5 text-white/70">{effortLabel}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-900 leading-5 ${priorityTone}`}>
              {task.priority}
            </span>
            <button
              onClick={handleTimerAction}
              disabled={!taskId || timerBusy}
              className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06] text-white/70 transition hover:bg-indigo-500/18 hover:text-white"
              title={!taskId ? 'Task link missing' : isTimerRunning ? (isTimerPaused ? 'Resume timer' : 'Pause timer') : 'Start timer'}
            >
              {timerBusy ? <Spinner size={11} /> : !taskId ? <AlertTriangle size={11} /> : isTimerRunning ? (isTimerPaused ? <Play size={11} /> : <Pause size={11} />) : <Play size={11} />}
            </button>
          </div>
        </div>
      </motion.div>

      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Sprint Task Details" size="lg">
        <div className="space-y-5">
          <div className="rounded-2xl bg-white/[0.035] p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-800 ${priorityTone}`}>{task.priority}</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-800 ${category.bg} ${category.color}`}>{task.category}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/16 px-2.5 py-1 text-[11px] font-800 text-indigo-200">
                <Sparkles size={11} /> AI sprint pick
              </span>
            </div>
            <h2 className="text-xl font-900 leading-snug text-white">{task.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{task.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/[0.035] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-800 uppercase tracking-[0.12em] text-slate-500">
                <Sparkles size={14} /> AI reason
              </div>
              <p className="text-sm leading-6 text-slate-300">{task.selectedReason || 'No AI reason saved for this sprint task.'}</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-800 uppercase tracking-[0.12em] text-slate-500">
                <Target size={14} /> Sprint fit
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Impact {task.impactScore}/10 · Effort {task.effortScore}/10 · {task.repeatedCount} signal{task.repeatedCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 flex items-center gap-2 text-[11px] font-800 text-slate-500"><Clock3 size={12} /> Effort</p>
              <p className="text-sm font-800 text-white">{effortLabel}</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">Category</p>
              <p className="text-sm font-800 text-white">{task.category}</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">Impact</p>
              <p className="text-sm font-800 text-white">{task.impactScore}/10</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">Signals</p>
              <p className="text-sm font-800 text-white">{task.repeatedCount || 1}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">AI Estimate</p>
              <p className="text-sm font-800 text-white">{estimatedMinutes} min</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">Actual Time</p>
              <p className="text-sm font-800 text-white">{actualMinutes} min</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">Difference</p>
              <p className="text-sm font-800 text-white">{differenceMinutes >= 0 ? '+' : ''}{differenceMinutes} min</p>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.035] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-900 text-white">Timer Controls</h3>
              <span className="text-xs font-800 text-white/50">{isTimerRunning ? (isTimerPaused ? 'Paused' : 'Running') : 'Idle'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isTimerRunning ? (
                isTimerPaused ? (
                  <button onClick={() => resumeTimer(taskId)} className="btn btn-secondary btn-sm" disabled={!taskId}>
                    <Play size={13} /> Resume
                  </button>
                ) : (
                  <button onClick={() => pauseTimer(taskId)} className="btn btn-secondary btn-sm" disabled={!taskId}>
                    <Pause size={13} /> Pause
                  </button>
                )
              ) : (
                <button onClick={handleTimerAction} className="btn btn-secondary btn-sm" disabled={!taskId}>
                  <Play size={13} /> Start
                </button>
              )}
              <button onClick={() => stopTimer(taskId)} className="btn btn-secondary btn-sm" disabled={!taskId}>
                <Square size={13} /> Stop
              </button>
              <button onClick={() => completeTimedTask(taskId)} className="btn btn-primary btn-sm" disabled={!taskId}>
                <CheckCircle2 size={13} /> Complete Task
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.035] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-900 text-white">Time History</h3>
              <span className="text-xs font-800 text-white/50">{timeHistory?.sessionCount || 0} sessions</span>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between"><span>AI Estimate</span><span>{estimatedMinutes} min</span></div>
              <div className="flex justify-between"><span>Extra Time</span><span>+{timeHistory?.extraMinutesAdded || task.timeStats?.extraMinutesAdded || 0} min</span></div>
              <div className="flex justify-between"><span>Total Time Spent</span><span>{actualMinutes} min</span></div>
              {(timeHistory?.sessions || []).map((session, index) => (
                <div key={session._id || index} className="flex justify-between border-t border-white/6 pt-2 text-xs text-white/60">
                  <span>Session {index + 1}: {new Date(session.startTime).toLocaleString()}</span>
                  <span>{Math.round((session.durationSeconds || session.elapsedSeconds || 0) / 60)} min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function LoadingPlan() {
  return (
    <div className="grid gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
          <Skeleton className="mb-3 h-5 w-2/3" />
          <Skeleton className="mb-3 h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SprintOverviewHero({ plan, loading }) {
  const totalTasks = (plan?.highImpactTasks?.length || 0) + (plan?.quickWins?.length || 0);
  const score = totalTasks
    ? Math.min(98, Math.round(((plan.highImpactCount || 0) * 18 + (plan.quickWinsCount || 0) * 12 + 58)))
    : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="premium-card mb-8 p-5 lg:p-6"
    >
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-800 text-indigo-200">
            <Sparkles size={14} /> AI Sprint Overview
          </div>
          <h2 className="text-xl font-900 text-white">Next sprint, simplified</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            {plan ? 'AI picked the highest-value work for this sprint.' : 'Generate a focused sprint from open tasks.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ['Sprint Score', score ? `${score}` : '—'],
            ['Hours', loading ? '—' : `${plan?.estimatedSprintHours || 0}`],
            ['Tasks', loading ? '—' : totalTasks],
            ['High Impact', loading ? '—' : plan?.highImpactCount || 0],
            ['Quick Wins', loading ? '—' : plan?.quickWinsCount || 0]
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/8 bg-white/[0.045] p-3">
              {loading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <p className="text-lg font-900 text-white">{value}</p>
              )}
              <p className="mt-1 text-[11px] font-700 text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function SprintPlannerPage() {
  const {
    tasks,
    fetchTasks,
    fetchActiveSprint,
    saveSprintPlan,
    deleteSprint
  } = useTaskStore();
  const [plan, setPlan] = useState(null);
  const [plannerLoading, setPlannerLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const canManageSprint = true;

  useEffect(() => {
    let mounted = true;
    let loadFinished = false;

    const failSafe = window.setTimeout(() => {
      if (!mounted || loadFinished) return;
      setPlannerLoading(false);
      setError('Sprint Planner is taking longer than expected. Showing the current workspace state.');
    }, 3500);

    const withTimeout = (promise, label) => new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        reject(new Error(`${label} request timed out`));
      }, 8000);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => window.clearTimeout(timeout));
    });

    const loadPlanner = async () => {
      setPlannerLoading(true);
      setError('');

      const [sprintResult, taskResult] = await Promise.allSettled([
        withTimeout(fetchActiveSprint(), 'Sprint'),
        withTimeout(fetchTasks({ limit: 200 }), 'Tasks')
      ]);

      if (!mounted) return;

      if (sprintResult.status === 'fulfilled') {
        setPlan(sprintResult.value);
      }

      if (sprintResult.status === 'rejected' || taskResult.status === 'rejected') {
        setError('Unable to load all sprint planner data. Showing available workspace state.');
      }

      loadFinished = true;
      window.clearTimeout(failSafe);
      setPlannerLoading(false);
    };

    loadPlanner().catch(() => {
      if (!mounted) return;
      loadFinished = true;
      window.clearTimeout(failSafe);
      setError('Unable to load saved sprint plan. Showing available workspace state.');
      setPlannerLoading(false);
    });

    return () => {
      mounted = false;
      window.clearTimeout(failSafe);
    };
  }, []);

  const openTaskCount = useMemo(() => tasks.filter(task => task.status !== 'Done').length, [tasks]);
  const analysisSummary = useMemo(() => createSprintPlan(tasks, []), [tasks]);

  const handleGenerate = async () => {
    if (openTaskCount === 0) {
      setPlan(null);
      return toast.error('No tasks found. Generate tasks from feedback first.');
    }

    if (plan && !window.confirm('Replace the current active sprint with a new AI sprint plan? The original tasks will remain.')) {
      return;
    }

    setGenerating(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const generated = createSprintPlan(tasks, []);
      const saved = await saveSprintPlan(generated, { replaceExisting: !!plan });
      setPlan(saved);
      toast.success(plan ? 'Sprint plan regenerated and saved' : 'Sprint plan generated and saved');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to generate sprint plan. Please try again.');
      toast.error(err.response?.data?.error || 'Unable to generate sprint plan');
    } finally {
      setGenerating(false);
    }
  };

  const displayedPlan = plan;
  const hasTasks = openTaskCount > 0;
  const summaryPlan = displayedPlan || analysisSummary;

  const hasVisibleSprintTasks = !!displayedPlan
    && ((displayedPlan.highImpactTasks?.length || 0) + (displayedPlan.quickWins?.length || 0)) > 0;

  const handleDeleteSprint = async () => {
    if (!plan?.id || !canManageSprint) return;

    setDeleting(true);
    try {
      await deleteSprint(plan.id);
      setPlan(null);
      setDeleteOpen(false);
      toast.success('Sprint deleted. Original tasks remain.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete sprint');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-700"
            style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
            <Bot size={14} /> AI planning engine
          </div>
          <h1 className="mb-2 text-2xl font-900 lg:text-3xl" style={{ color: 'var(--text)' }}>AI Sprint Planner</h1>
          <p className="text-sm leading-6" style={{ color: 'var(--text-2)' }}>Prioritized sprint work from your product feedback.</p>
        </div>
        {canManageSprint && (
          <div className="flex flex-col gap-2 sm:flex-row">
            {plan && (
              <button onClick={() => setDeleteOpen(true)} disabled={deleting} className="btn btn-secondary justify-center text-[var(--danger)]">
                <Trash2 size={16} /> Delete Sprint
              </button>
            )}
            <button onClick={handleGenerate} disabled={generating || !hasTasks} className="btn btn-primary justify-center">
              {generating ? <><Spinner size={16} /> Generating...</> : plan ? <><RefreshCw size={17} /> Regenerate Sprint</> : <><Sparkles size={17} /> Generate Sprint Plan</>}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border p-4 flex items-center gap-3"
          style={{ background: 'var(--danger-light)', borderColor: 'var(--border)', color: 'var(--danger)' }}>
          <AlertTriangle size={18} />
          <p className="text-sm font-600">{error}</p>
        </div>
      )}

      <SprintOverviewHero plan={summaryPlan} loading={plannerLoading} />

      {plannerLoading ? (
        <LoadingPlan />
      ) : !hasTasks ? (
        <div className="card">
          <Empty
            icon={<Bot size={34} style={{ color: 'var(--brand)' }} />}
            title="No tasks found"
            description="Generate tasks from feedback first to create an AI sprint plan."
            action={<Link to="/feedback" className="btn btn-primary">Generate tasks from feedback <ArrowRight size={15} /></Link>}
          />
        </div>
      ) : (
        <>
          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-900" style={{ color: 'var(--text)' }}>Recommended Sprint</h2>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-3)' }}>
                  {displayedPlan ? `Saved ${new Date(displayedPlan.generatedAt).toLocaleDateString()}` : 'No active sprint yet'}
                </p>
              </div>
              {displayedPlan?.insight && (
                <div className="max-w-xl rounded-full border border-white/8 bg-white/[0.035] px-3 py-2 text-xs text-slate-400">
                  <span className="font-800 text-indigo-300">AI:</span> {truncate(displayedPlan.insight, 96)}
                </div>
              )}
            </div>

            {generating ? (
              <LoadingPlan />
            ) : !displayedPlan ? (
              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-10 text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-200">
                  <Sparkles size={23} />
                </div>
                <h3 className="mb-2 text-lg font-900 text-white">No sprint yet</h3>
                <p className="mx-auto mb-5 max-w-md text-sm leading-6 text-slate-400">Generate a focused plan from open workspace tasks.</p>
                {canManageSprint && (
                  <button onClick={handleGenerate} className="btn btn-primary justify-center mx-auto">
                    <Sparkles size={16} /> Generate Sprint
                  </button>
                )}
              </div>
            ) : !hasVisibleSprintTasks ? (
              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-10 text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.055] text-slate-400">
                  <Users size={23} />
                </div>
                <h3 className="mb-2 text-lg font-900 text-white">No visible sprint tasks</h3>
                <p className="text-sm text-slate-400">Tasks appear here when available for this workspace.</p>
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-indigo-300" />
                      <h3 className="text-sm font-900 text-white">High Impact</h3>
                    </div>
                    <span className="rounded-full bg-indigo-500/14 px-2.5 py-1 text-xs font-800 text-indigo-200">
                      {displayedPlan.highImpactTasks.length}
                    </span>
                  </div>
                  {displayedPlan.highImpactTasks.map((task, index) => (
                    <SprintTaskCard key={task.id} task={task} rank={index + 1} />
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb size={16} className="text-violet-300" />
                      <h3 className="text-sm font-900 text-white">Quick Wins</h3>
                    </div>
                    <span className="rounded-full bg-violet-500/14 px-2.5 py-1 text-xs font-800 text-violet-200">
                      {displayedPlan.quickWins.length}
                    </span>
                  </div>
                  {displayedPlan.quickWins.map((task, index) => (
                    <SprintTaskCard key={task.id} task={task} rank={index + 1} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Sprint Plan" size="sm">
        <div className="space-y-4">
          <p className="text-sm leading-6" style={{ color: 'var(--text-2)' }}>
            Are you sure? This will remove the sprint plan but tasks will remain.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleDeleteSprint} disabled={deleting} className="btn btn-danger">
              {deleting ? <><Spinner size={15} /> Deleting...</> : 'Delete Sprint'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
