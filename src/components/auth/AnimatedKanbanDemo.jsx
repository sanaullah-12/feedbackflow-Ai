import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AnimatedKanbanDemo() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Fix login bug', status: 'todo', priority: 'high', animated: false },
    { id: 2, title: 'Update dashboard UI', status: 'todo', priority: 'medium', animated: false },
    { id: 3, title: 'API optimization', status: 'in-progress', priority: 'high', animated: false },
    { id: 4, title: 'Database cleanup', status: 'done', priority: 'low', animated: false },
  ]);

  const [draggedId, setDraggedId] = useState(null);
  const animationIntervalRef = React.useRef(null);

  // Auto-animate tasks to showcase functionality
  useEffect(() => {
    animationIntervalRef.current = setInterval(() => {
      setTasks(prevTasks => {
        const newTasks = [...prevTasks];
        const randomIndex = Math.floor(Math.random() * newTasks.length);
        const task = newTasks[randomIndex];
        
        const statuses = ['todo', 'in-progress', 'done'];
        const currentStatusIndex = statuses.indexOf(task.status);
        const nextStatus = statuses[(currentStatusIndex + 1) % statuses.length];
        
        newTasks[randomIndex] = {
          ...task,
          status: nextStatus,
          animated: true
        };

        // Reset animated flag after animation
        setTimeout(() => {
          setTasks(t => t.map(t2 => t2.id === task.id ? { ...t2, animated: false } : t2));
        }, 600);

        return newTasks;
      });
    }, 2500); // Move a task every 2.5 seconds

    return () => clearInterval(animationIntervalRef.current);
  }, []);

  const columns = {
    todo: { title: '📝 To Do', color: 'from-blue-500 to-blue-600', icon: AlertCircle },
    'in-progress': { title: '⚡ In Progress', color: 'from-yellow-500 to-orange-600', icon: GripVertical },
    done: { title: '✅ Done', color: 'from-green-500 to-emerald-600', icon: CheckCircle2 }
  };

  const handleDragStart = (e, taskId) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnColumn = (e, newStatus) => {
    e.preventDefault();
    if (draggedId) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggedId ? { ...task, status: newStatus } : task
        )
      );
      setDraggedId(null);
    }
  };

  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, white, transparent)' }}
          animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Title */}
      <div className="relative z-10">
        <motion.h2
          className="text-2xl font-800 text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Kanban Magic
        </motion.h2>
        <motion.p
          className="text-white/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Drag tasks to organize your workflow
        </motion.p>
      </div>

      {/* Kanban Board */}
      <div className="relative z-10 grid grid-cols-3 gap-3 flex-1 my-6 max-h-96">
        {Object.entries(columns).map(([status, { title, color, icon: Icon }]) => (
          <motion.div
            key={status}
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * Object.keys(columns).indexOf(status) }}
          >
            {/* Column Header */}
            <div className={`bg-gradient-to-r ${color} rounded-lg px-3 py-2 mb-3 flex items-center gap-2`}>
              <Icon size={16} className="text-white" />
              <span className="text-white font-600 text-xs">{title}</span>
              <span className="ml-auto bg-white/20 px-2 py-0.5 rounded text-white text-xs font-bold">
                {getTasksByStatus(status).length}
              </span>
            </div>

            {/* Tasks Container */}
            <motion.div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnColumn(e, status)}
              className="flex-1 bg-white/5 rounded-lg p-2 backdrop-blur-sm border border-white/10 min-h-[200px] flex flex-col gap-2 hover:bg-white/10 transition-colors"
              layout
            >
              {getTasksByStatus(status).map((task, idx) => (
                <motion.div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: task.animated ? [0, 5, -5, 0] : 0
                  }}
                  transition={{
                    duration: task.animated ? 0.6 : 0.3,
                    type: 'spring',
                    stiffness: 300
                  }}
                  className={`p-2 rounded-lg cursor-grab active:cursor-grabbing backdrop-blur-sm transition-all ${
                    draggedId === task.id ? 'opacity-50 scale-95' : ''
                  } ${
                    task.priority === 'high'
                      ? 'bg-red-500/20 border border-red-500/30'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500/20 border border-yellow-500/30'
                      : 'bg-blue-500/20 border border-blue-500/30'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileDrag={{ scale: 0.95 }}
                >
                  <div className="flex items-start gap-2">
                    <motion.div
                      className="mt-0.5 text-white/40"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: draggedId === task.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <GripVertical size={14} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <motion.p
                        className="text-white text-xs font-600 truncate leading-tight"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                      >
                        {task.title}
                      </motion.p>
                      <motion.div
                        className={`mt-1 inline-block text-xs px-1.5 py-0.5 rounded font-500 ${
                          task.priority === 'high'
                            ? 'bg-red-500/30 text-red-200'
                            : task.priority === 'medium'
                            ? 'bg-yellow-500/30 text-yellow-200'
                            : 'bg-blue-500/30 text-blue-200'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {task.priority}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Empty state */}
              {getTasksByStatus(status).length === 0 && (
                <motion.div
                  className="flex-1 flex items-center justify-center text-white/30 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Drop here
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Floating hint */}
      <motion.div
        className="relative z-10 text-white/60 text-xs text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💡 Drag tasks to move them
        </motion.span>
      </motion.div>
    </div>
  );
}
