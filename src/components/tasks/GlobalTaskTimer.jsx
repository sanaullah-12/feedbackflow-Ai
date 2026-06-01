import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3, Pause, Play, Square, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useTaskStore from '../../store/taskStore';

const formatDuration = (seconds = 0) => {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export default function GlobalTaskTimer() {
  const { runningTimer, fetchRunningTimer, pauseTimer, resumeTimer, stopTimer, extendTimer, completeTimedTask } = useTaskStore();
  const [now, setNow] = useState(Date.now());
  const warnedRef = useRef(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    fetchRunningTimer().catch(() => {});
  }, [fetchRunningTimer]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    warnedRef.current = false;
    finishedRef.current = false;
  }, [runningTimer?._id]);

  const timing = useMemo(() => {
    if (!runningTimer) return null;
    const started = new Date(runningTimer.startTime).getTime();
    const pausedAt = runningTimer.status === 'paused' && runningTimer.pausedAt
      ? new Date(runningTimer.pausedAt).getTime()
      : now;
    const elapsed = Math.max(0, Math.floor((pausedAt - started) / 1000) - (runningTimer.totalPausedSeconds || 0));
    const allowed = runningTimer.totalAllowedSeconds || ((runningTimer.estimatedMinutesAtStart || 30) + (runningTimer.extraMinutesAdded || 0)) * 60;
    const remaining = Math.max(0, allowed - elapsed);
    return { elapsed, allowed, remaining, progress: allowed ? Math.min(100, (elapsed / allowed) * 100) : 0 };
  }, [runningTimer, now]);

  useEffect(() => {
    if (!runningTimer || !timing || runningTimer.status !== 'running') return;
    if (timing.progress >= 80 && !warnedRef.current && timing.remaining > 0) {
      warnedRef.current = true;
      toast('Only a little time left. Try to wrap this task up.');
    }
    if (timing.remaining === 0 && !finishedRef.current) {
      finishedRef.current = true;
      toast('Estimated time finished. Do you need more time?');
    }
  }, [runningTimer, timing]);

  if (!runningTimer || !timing) return null;

  const taskId = runningTimer.taskId?._id || runningTimer.taskId;
  const title = runningTimer.taskId?.title || 'Running task';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-5 right-5 z-[9000] w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-[#0f1424]/90 p-4 text-white shadow-2xl shadow-black/45 backdrop-blur-xl"
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/18 text-indigo-200">
          <Clock3 size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-900">{title}</p>
          <p className="mt-1 text-xs text-white/55">
            {runningTimer.status === 'paused' ? 'Paused' : `${formatDuration(timing.remaining)} remaining`}
          </p>
        </div>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" style={{ width: `${timing.progress}%` }} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {runningTimer.status === 'paused' ? (
          <button onClick={() => resumeTimer(taskId)} className="btn btn-secondary btn-sm !px-3">
            <Play size={13} /> Resume
          </button>
        ) : (
          <button onClick={() => pauseTimer(taskId)} className="btn btn-secondary btn-sm !px-3">
            <Pause size={13} /> Pause
          </button>
        )}
        <button onClick={() => stopTimer(taskId)} className="btn btn-secondary btn-sm !px-3">
          <Square size={13} /> Stop
        </button>
        <button onClick={() => completeTimedTask(taskId)} className="btn btn-primary btn-sm !px-3">
          <CheckCircle2 size={13} /> Complete
        </button>
      </div>

      {timing.remaining === 0 && (
        <div className="mt-3 flex gap-2">
          {[10, 30, 60].map(minutes => (
            <button key={minutes} onClick={() => extendTimer(taskId, minutes)} className="rounded-lg bg-white/[0.07] px-2.5 py-1.5 text-xs font-800 text-white transition hover:bg-white/[0.12]">
              +{minutes === 60 ? '1 hr' : `${minutes} min`}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
