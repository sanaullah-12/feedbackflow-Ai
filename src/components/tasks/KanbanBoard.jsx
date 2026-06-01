import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Spinner } from '../ui';
import { toast } from 'react-hot-toast';
import { MoreHorizontal, Plus } from 'lucide-react';

const COLUMNS = [
  { 
    id: 'Todo', 
    label: 'Todo', 
    accent: 'from-indigo-500 to-violet-500',
    dot: 'bg-indigo-400',
    button: 'text-slate-300'
  },
  { 
    id: 'In Progress', 
    label: 'In Progress', 
    accent: 'from-indigo-500 to-violet-400',
    dot: 'bg-violet-400',
    button: 'text-slate-300'
  },
  { 
    id: 'Done', 
    label: 'Done', 
    accent: 'from-indigo-400 to-violet-400',
    dot: 'bg-indigo-300',
    button: 'text-slate-300'
  },
];

const legend = [
  ['Bug', 'bg-rose-400'],
  ['Feature', 'bg-violet-500'],
  ['UX', 'bg-indigo-400'],
  ['UI', 'bg-indigo-500'],
  ['Other', 'bg-slate-500'],
];

const BOARD_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=80'
];

export default function KanbanBoard({ tasksByStatus, onTaskUpdate, onAddTask }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFromStatus, setDraggedFromStatus] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [recentlyMovedTaskId, setRecentlyMovedTaskId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [backgroundIndex, setBackgroundIndex] = useState(() => {
    const day = Math.floor(Date.now() / 86400000);
    return day % BOARD_BACKGROUNDS.length;
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBackgroundIndex(index => (index + 1) % BOARD_BACKGROUNDS.length);
    }, 90000);

    return () => window.clearInterval(timer);
  }, []);

  const boardBackground = useMemo(() => BOARD_BACKGROUNDS[backgroundIndex], [backgroundIndex]);

  const handleDragStart = (e, task, fromStatus) => {
    setDraggedTask(task);
    setDraggedFromStatus(fromStatus);
    setDraggedTaskId(task?._id || null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget === e.target) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, toStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask || !draggedFromStatus) {
      return;
    }

    // If dropped on same column, do nothing
    if (draggedFromStatus === toStatus) {
      setDraggedTask(null);
      setDraggedFromStatus(null);
      return;
    }

    // Update task status
    setUpdating(true);
    try {
      await onTaskUpdate(draggedTask._id, { status: toStatus });
      setRecentlyMovedTaskId(draggedTask._id);
      toast.success(`Moved to ${toStatus}`);
    } catch (err) {
      toast.error('Failed to move task');
      console.error(err);
    } finally {
      setUpdating(false);
      setDraggedTask(null);
      setDraggedFromStatus(null);
      setDraggedTaskId(null);
      window.setTimeout(() => setRecentlyMovedTaskId(null), 700);
    }
  };

  const totalTasks = COLUMNS.reduce((sum, col) => sum + (tasksByStatus[col.id] || []).length, 0);

  return (
    <div className="relative -mx-3 overflow-hidden rounded-[28px] border border-white/8 bg-[#070b14] p-3 shadow-2xl shadow-black/30 sm:-mx-2 sm:p-4">
      <motion.div
        key={boardBackground}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${boardBackground})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,20,0.72),rgba(7,11,20,0.9)),radial-gradient(circle_at_30%_0%,rgba(99,102,241,0.18),transparent_34%)]" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      <div className="relative z-10 space-y-7">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {COLUMNS.map((col) => {
          const tasks = tasksByStatus[col.id] || [];
          const isFromColumn = draggedFromStatus === col.id;
          const isDragOverThisColumn = dragOverColumn === col.id;

          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex min-h-[680px] flex-col rounded-2xl border border-white/10 bg-[#080d19]/68 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl transition-colors duration-200 hover:border-indigo-300/20 hover:bg-[#0f1424]/72"
              style={{ opacity: isFromColumn && draggedTask ? 0.62 : 1 }}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`h-3 w-3 flex-shrink-0 rounded-full ${col.dot} shadow-lg`} />
                <span className="flex-1 text-lg font-800 text-white">{col.label}</span>
                <span className="rounded-xl bg-white/10 px-2.5 py-1 text-xs font-800 text-slate-300">{tasks.length}</span>
                {onAddTask && (
                  <button onClick={onAddTask} className={`grid h-8 w-8 place-items-center rounded-lg transition hover:bg-white/10 ${col.button}`}>
                    <Plus size={18} />
                  </button>
                )}
                <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white">
                  <MoreHorizontal size={19} />
                </button>
              </div>
              <div className="mb-5 h-1 rounded-full bg-white/10">
                <div className={`h-full w-1/5 rounded-full bg-gradient-to-r ${col.accent}`} />
              </div>

              <div
                className={`flex-1 space-y-3 overflow-y-auto rounded-xl pr-1 transition-all ${isDragOverThisColumn && draggedTask ? 'bg-white/[0.055] ring-1 ring-indigo-400/35' : ''}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {tasks.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10">
                    <div className="text-center">
                      <p className="text-sm font-600 text-slate-300">No tasks</p>
                      <p className="text-xs text-slate-500">Drag tasks here</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {tasks.map(task => {
                      const isDragged = draggedTaskId === task._id;
                      const isRecentlyMoved = recentlyMovedTaskId === task._id;

                      return (
                        <motion.div
                          key={task._id}
                          layout="position"
                          initial={isRecentlyMoved ? { opacity: 0, y: 12, scale: 0.985 } : { opacity: 0, y: 8 }}
                          animate={{
                            opacity: isDragged ? 0.4 : 1,
                            y: 0,
                            scale: isDragged ? 1.045 : 1,
                            rotate: isDragged ? 0.4 : 0,
                            boxShadow: isDragged
                              ? '0 22px 42px rgba(0,0,0,0.38), 0 0 0 1px rgba(129,140,248,0.18), 0 0 32px rgba(99,102,241,0.16)'
                              : 'none'
                          }}
                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                          transition={{
                            layout: {
                              type: 'spring',
                              stiffness: 220,
                              damping: 28,
                              mass: 1.05
                            },
                            opacity: { duration: 0.22, ease: 'easeOut' },
                            scale: { duration: 0.18, ease: 'easeOut' },
                            rotate: { duration: 0.18, ease: 'easeOut' }
                          }}
                          draggable={!updating}
                          onDragStart={(e) => handleDragStart(e, task, col.id)}
                          onDragEnd={() => {
                            setDraggedTask(null);
                            setDraggedFromStatus(null);
                            setDraggedTaskId(null);
                          }}
                          className="select-none transition duration-200 active:cursor-grabbing"
                          style={{
                            opacity: isDragged ? 0.45 : 1,
                            pointerEvents: updating ? 'none' : 'auto',
                            zIndex: isDragged ? 30 : 1,
                            transformOrigin: 'center center',
                            willChange: 'transform, opacity, box-shadow'
                          }}
                        >
                          <TaskCard task={task} />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                {updating && (
                  <div className="flex items-center justify-center py-4">
                    <Spinner size={20} />
                  </div>
                )}
              </div>

              {onAddTask && (
                <button onClick={onAddTask} className="mt-4 flex h-12 items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 text-sm font-700 text-slate-300 transition hover:border-indigo-400/40 hover:bg-white/[0.04] hover:text-white">
                  <Plus size={17} /> Add Task
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {legend.map(([label, dot]) => (
            <span key={label} className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-600 text-slate-300">
              <span className={`h-2 w-2 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center rounded-full bg-white/[0.06] px-4 py-2 text-xs font-700 text-slate-300">
          Total Tasks: <span className="ml-1 text-white">{totalTasks}</span>
        </span>
      </div>
      </div>
    </div>
  );
}
