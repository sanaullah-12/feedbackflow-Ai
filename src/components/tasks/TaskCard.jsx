import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Bot, CalendarClock, ChevronDown, ChevronUp, Code2, Clock3, FileText, Lightbulb, Pause, Play, Sparkles, Square, Tag, UserRound } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useTaskStore from '../../store/taskStore';
import useAuthStore from '../../store/authStore';
import { CATEGORY_CONFIG, formatRelative } from '../../utils/helpers';
import { Modal, Select, Spinner } from '../ui';

const STATUS_OPTIONS = [
  { value: 'Todo', label: '📋 Todo' },
  { value: 'In Progress', label: '🔄 In Progress' },
  { value: 'Done', label: '✅ Done' },
];

export function TaskCard({ task, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [timerBusy, setTimerBusy] = useState(false);
  const [timeHistory, setTimeHistory] = useState(null);
  const { user } = useAuthStore();
  const { updateTask, deleteTask, runningTimer, startTimer, pauseTimer, resumeTimer, stopTimer, fetchTimerHistory } = useTaskStore();
  const assignedMember = task.assignedTo || null;
  const assignedMemberId = assignedMember?._id || assignedMember?.id || '';
  const [editForm, setEditForm] = useState({
    title: task.title, description: task.description,
    priority: task.priority, category: task.category,
    status: task.status, suggestion: task.suggestion || ''
  });

  const cc = CATEGORY_CONFIG[task.category];
  const priorityTone = {
    High: 'bg-red-500/14 text-red-300',
    Medium: 'bg-amber-400/14 text-amber-300',
    Low: 'bg-cyan-400/14 text-cyan-300',
  }[task.priority] || 'bg-slate-500/14 text-slate-300';
  const categoryTone = {
    UI: 'bg-violet-500/18 text-violet-300',
    UX: 'bg-blue-500/18 text-blue-300',
    Bug: 'bg-red-500/14 text-red-300',
    Performance: 'bg-orange-500/16 text-orange-300',
    Feature: 'bg-indigo-500/18 text-indigo-300',
    Other: 'bg-slate-500/18 text-slate-300',
  }[task.category] || 'bg-slate-500/18 text-slate-300';
  const iconTone = {
    UI: 'bg-violet-500/22 text-violet-200',
    UX: 'bg-blue-500/22 text-blue-200',
    Bug: 'bg-red-500/22 text-red-200',
    Performance: 'bg-orange-500/22 text-orange-200',
    Feature: 'bg-indigo-500/22 text-indigo-200',
    Other: 'bg-slate-500/22 text-slate-200',
  }[task.category] || 'bg-slate-500/22 text-slate-200';
  const progress = Math.round(task.progress ?? task.completion ?? ((task.title || '').length % 45) + 40);
  const isHighPriority = task.priority === 'High';
  const permissions = user?.workspace?.permissions || {};
  const currentMemberId = user?.workspace?.memberId;
  const taskAssigneeId = assignedMemberId || task.assignedToId;
  const canEditCard = permissions.canEditTasks;
  const canUseTimer = canEditCard;
  const isTimerRunning = runningTimer?.taskId?._id === task._id || runningTimer?.taskId === task._id;
  const isTimerPaused = isTimerRunning && runningTimer?.status === 'paused';
  const isAiGenerated = task.aiGenerated || task.suggestion || task.source || task.feedbackSource || task.taskGroup;
  const estimatedMinutes = task.timeStats?.estimatedMinutes || task.estimatedMinutes || 30;
  const effort = estimatedMinutes < 60 ? `${estimatedMinutes} min` : `${Math.round((estimatedMinutes / 60) * 10) / 10}h`;
  const feedbackSource = task.feedbackSource || task.sourceType || task.source || task.inputType || 'Feedback';
  const sprintInfo = task.sprintTitle || task.sprintName || task.sprint || null;

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await deleteTask(task._id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
      setDeleting(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateTask(task._id, editForm);
      setEditing(false);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleTimerClick = async (event) => {
    event.stopPropagation();
    if (!canUseTimer || timerBusy) return;

    setTimerBusy(true);
    try {
      if (isTimerRunning) {
        if (isTimerPaused) {
          await resumeTimer(task._id);
          toast.success('Timer resumed');
        } else {
          await pauseTimer(task._id);
          toast.success('Timer paused');
        }
      } else {
        const activeTaskId = runningTimer?.taskId?._id || runningTimer?.taskId;
        if (activeTaskId && activeTaskId !== task._id) {
          const shouldSwitch = window.confirm('You already have a running task.\nWould you like to stop it and start this one?');
          if (!shouldSwitch) return;
        }
        await startTimer(task._id);
        toast.success('Timer started');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Timer action failed');
    } finally {
      setTimerBusy(false);
    }
  };

  React.useEffect(() => {
    if (!detailsOpen) return;
    fetchTimerHistory(task._id)
      .then(setTimeHistory)
      .catch(() => setTimeHistory(null));
  }, [detailsOpen, fetchTimerHistory, task._id]);

  return (
    <>
      <motion.div
        layout
        whileHover={{ y: -2, scale: 1.006 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#101625]/82 p-3.5 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-indigo-300/35 hover:bg-[#151c2f]/88 hover:shadow-indigo-950/25 ${isHighPriority ? 'high-priority-card' : ''}`}
        onClick={() => !compact && setDetailsOpen(true)}>
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 flex-1 text-sm font-800 leading-snug text-white line-clamp-2" title={task.title}>
            {task.title}
          </p>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-900 leading-5 text-white/70">{effort}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-900 leading-5 ${priorityTone}`}>
              {task.priority}
            </span>
            {canUseTimer && (
              <button
                onClick={handleTimerClick}
                disabled={timerBusy}
                className="grid h-6 w-6 place-items-center rounded-full bg-indigo-500/16 text-indigo-200 transition hover:bg-indigo-500/25"
                title={isTimerRunning ? (isTimerPaused ? 'Resume timer' : 'Pause timer') : 'Start timer'}
              >
                {timerBusy ? <Spinner size={11} /> : isTimerRunning && !isTimerPaused ? <Pause size={11} /> : <Play size={11} />}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Task Details" size="lg">
        <div className="space-y-5">
          <div className="rounded-2xl bg-white/[0.035] p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-800 ${priorityTone}`}>{task.priority}</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-800 ${categoryTone}`}>{task.category}</span>
              {isAiGenerated && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/16 px-2.5 py-1 text-[11px] font-800 text-indigo-200">
                  <Sparkles size={11} /> AI generated
                </span>
              )}
            </div>
            <h2 className="text-xl font-900 leading-snug text-white">{task.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{task.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/[0.035] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-800 uppercase tracking-[0.12em] text-slate-500">
                <Bot size={14} /> AI reasoning
              </div>
              <p className="text-sm leading-6 text-slate-300">{task.aiReasoning || task.selectedReason || task.reason || task.suggestion || 'No AI reasoning saved for this task.'}</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-800 uppercase tracking-[0.12em] text-slate-500">
                <Lightbulb size={14} /> Suggested fix
              </div>
              <p className="text-sm leading-6 text-slate-300">{task.suggestion || task.tailwindFix || 'No suggested fix available.'}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 flex items-center gap-2 text-[11px] font-800 text-slate-500"><Clock3 size={12} /> Effort</p>
              <p className="text-sm font-800 text-white">{effort}</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 flex items-center gap-2 text-[11px] font-800 text-slate-500"><FileText size={12} /> Source</p>
              <p className="text-sm font-800 text-white">{feedbackSource}</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 flex items-center gap-2 text-[11px] font-800 text-slate-500"><CalendarClock size={12} /> Created</p>
              <p className="text-sm font-800 text-white">{formatRelative(task.createdAt)}</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 flex items-center gap-2 text-[11px] font-800 text-slate-500"><Tag size={12} /> Sprint</p>
              <p className="text-sm font-800 text-white">{sprintInfo || 'Not in sprint'}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">AI Estimate</p>
              <p className="text-sm font-800 text-white">{estimatedMinutes} min</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">Actual Time</p>
              <p className="text-sm font-800 text-white">{timeHistory?.actualMinutes ?? task.timeStats?.actualMinutes ?? 0} min</p>
            </div>
            <div className="rounded-xl bg-white/[0.035] p-3">
              <p className="mb-1 text-[11px] font-800 text-slate-500">Difference</p>
              <p className="text-sm font-800 text-white">{(timeHistory?.differenceMinutes ?? task.timeStats?.differenceMinutes ?? 0) >= 0 ? '+' : ''}{timeHistory?.differenceMinutes ?? task.timeStats?.differenceMinutes ?? 0} min</p>
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
              <div className="flex justify-between"><span>Total Time Spent</span><span>{timeHistory?.actualMinutes || task.timeStats?.actualMinutes || 0} min</span></div>
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

      {/* Edit modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Task" size="lg">
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={editForm.title}
              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-24 resize-y" value={editForm.description}
              onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Priority</label>
              <Select value={editForm.priority}
                onChange={v => setEditForm(f => ({ ...f, priority: v }))}
                options={[{ value: 'High', label: '🔴 High' }, { value: 'Medium', label: '🟡 Medium' }, { value: 'Low', label: '🟢 Low' }]} />
            </div>
            <div>
              <label className="label">Category</label>
              <Select value={editForm.category}
                onChange={v => setEditForm(f => ({ ...f, category: v }))}
                options={['UI', 'UX', 'Bug', 'Performance', 'Feature', 'Other'].map(c => ({ value: c, label: c }))} />
            </div>
            <div>
              <label className="label">Status</label>
              <Select value={editForm.status}
                onChange={v => setEditForm(f => ({ ...f, status: v }))}
                options={STATUS_OPTIONS.map(o => ({ value: o.value, label: o.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Suggestion <span className="font-normal text-[var(--text-3)]">(optional)</span></label>
            <textarea className="input min-h-16 resize-y" value={editForm.suggestion}
              onChange={e => setEditForm(f => ({ ...f, suggestion: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSaveEdit} className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
