import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, List, Search, Filter, Download, Copy, Plus, X, RefreshCw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useTaskStore from '../store/taskStore';
import KanbanBoard from '../components/tasks/KanbanBoard';
import ListView from '../components/tasks/ListView';
import { TaskCard } from '../components/tasks/TaskCard';
import { Skeleton, Select, Modal, Empty, Spinner } from '../components/ui';
import { exportToCSV, exportToJSON, copyToClipboard } from '../utils/helpers';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const STATUS_OPTS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Todo', label: '📋 Todo' },
  { value: 'In Progress', label: '🔄 In Progress' },
  { value: 'Done', label: '✅ Done' },
];
const PRIORITY_OPTS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'High', label: '🔴 High' },
  { value: 'Medium', label: '🟡 Medium' },
  { value: 'Low', label: '🟢 Low' },
];
const CATEGORY_OPTS = [
  { value: 'all', label: 'All Categories' },
  ...['UI', 'UX', 'Bug', 'Performance', 'Feature', 'Other'].map(c => ({ value: c, label: c }))
];

export default function TasksPage() {
  const location = useLocation();
  const { user } = useAuthStore();
  const permissions = user?.workspace?.permissions || {};
  const canEditTasks = permissions.canEditTasks;
  const {
    tasks, loading, filters, view,
    setView, setFilter, resetFilters,
    fetchTasks, createTask, updateTask, getFilteredTasks, getTasksByStatus, fetchRunningTimer
  } = useTaskStore();

  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [creating, setCreating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'Medium', category: 'Other', status: 'Todo'
  });

  const taskGroupOptions = [
    { value: 'all', label: 'All Task Names' },
    ...Array.from(new Set(tasks.map(t => t.taskGroup).filter(Boolean))).map(name => ({ value: name, label: name }))
  ];

  const hasFilters =
    filters.status !== 'all'
    || filters.priority !== 'all'
    || filters.category !== 'all'
    || filters.taskGroup !== 'all'
    || filters.search;

  useEffect(() => {
    fetchTasks();
    fetchRunningTimer().catch(() => {});
  }, [filters]);

  useEffect(() => {
    if (location.pathname === '/kanban') {
      setView('kanban');
    }
  }, [location.pathname, setView]);

  const filteredTasks = getFilteredTasks();
  const tasksByStatus = getTasksByStatus();

  const handleCreate = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      return toast.error('Title and description are required.');
    }
    setCreating(true);
    try {
      await createTask(newTask);
      setShowCreate(false);
      setNewTask({ title: '', description: '', priority: 'Medium', category: 'Other', status: 'Todo' });
      toast.success('Task created!');
    } catch {
      toast.error('Failed to create task.');
    } finally {
      setCreating(false);
    }
  };

  const handleExportCSV = () => { exportToCSV(filteredTasks); toast.success('Exported to CSV!'); };
  const handleExportJSON = () => { exportToJSON(filteredTasks); toast.success('Exported to JSON!'); };
  const handleCopy = async () => {
    const text = filteredTasks.map(t => `[${t.priority}][${t.category}] ${t.title}\n${t.description}`).join('\n\n');
    const ok = await copyToClipboard(text);
    toast[ok ? 'success' : 'error'](ok ? 'Copied to clipboard!' : 'Failed to copy.');
  };

  return (
    <div className="min-h-full animate-fade-in p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-800 tracking-tight text-white">
            {view === 'kanban' ? 'Kanban Board' : 'Tasks'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {view === 'kanban' ? 'Organize tasks and ship faster 🚀' : `${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''}${hasFilters ? ' matching filters' : ' total'}`}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className="h-12 w-full rounded-xl border border-white/8 bg-[#0d1322]/80 pl-11 pr-11 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Search tasks..."
            />
            <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/8 px-1.5 py-0.5 text-xs text-slate-500 sm:block">⌘K</span>
          </div>
          <button onClick={() => setShowFilters(v => !v)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.06] px-5 text-sm font-700 text-slate-300 transition hover:bg-white/10 hover:text-white">
            <SlidersHorizontal size={16} /> Filter
          </button>
          <button onClick={() => fetchTasks()} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.06] px-5 text-sm font-700 text-slate-300 transition hover:bg-white/10 hover:text-white">
            <ArrowUpDown size={16} /> Sort
          </button>
          {canEditTasks && (
            <button onClick={() => setShowCreate(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-800 text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
              <Plus size={17} /> New Task
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className={`mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3 ${showFilters || view !== 'kanban' ? '' : 'hidden'}`}>
        {/* Search */}
        <div className="relative min-w-48 flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            className="input !pl-9 !py-2 text-sm"
            placeholder="Search tasks..."
          />
          {filters.search && (
            <button onClick={() => setFilter('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={13} style={{ color: 'var(--text-3)' }} />
            </button>
          )}
        </div>

        {/* Filters */}
        <Select value={filters.status} onChange={v => setFilter('status', v)} options={STATUS_OPTS} className="!w-auto text-sm !py-2" />
        <Select value={filters.priority} onChange={v => setFilter('priority', v)} options={PRIORITY_OPTS} className="!w-auto text-sm !py-2" />
        <Select value={filters.category} onChange={v => setFilter('category', v)} options={CATEGORY_OPTS} className="!w-auto text-sm !py-2" />
        <Select value={filters.taskGroup} onChange={v => setFilter('taskGroup', v)} options={taskGroupOptions} className="!w-auto text-sm !py-2 max-w-56" />

        {hasFilters && (
          <button onClick={resetFilters} className="btn btn-secondary btn-sm !text-xs">
            <X size={12} /> Clear
          </button>
        )}

        {/* View toggle */}
        <div className="ml-auto flex overflow-hidden rounded-xl border border-white/8">
          <button onClick={() => setView('kanban')}
            className={`px-3 py-2 flex items-center gap-1.5 text-xs font-600 transition-colors ${view === 'kanban' ? 'bg-[var(--brand)] text-white' : 'hover:bg-[var(--surface-2)]'}`}
            style={{ color: view === 'kanban' ? 'white' : 'var(--text-2)' }}>
            <LayoutGrid size={14} /> Kanban
          </button>
          <button onClick={() => setView('list')}
            className={`px-3 py-2 flex items-center gap-1.5 text-xs font-600 transition-colors ${view === 'list' ? 'bg-[var(--brand)] text-white' : 'hover:bg-[var(--surface-2)]'}`}
            style={{ color: view === 'list' ? 'white' : 'var(--text-2)' }}>
            <List size={14} /> List
          </button>
        </div>

        {/* Export */}
        <div className="relative group">
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Export
          </button>
          <div className="absolute right-0 top-full mt-1 w-44 card p-1 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button onClick={handleExportCSV} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text)' }}>📊 Export CSV</button>
            <button onClick={handleExportJSON} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text)' }}>📋 Export JSON</button>
            <button onClick={handleCopy} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text)' }}>📎 Copy to Clipboard</button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={view === 'kanban' ? 'flex gap-4' : 'space-y-3'}>
          {view === 'kanban' ? [...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 space-y-3">
              <Skeleton className="h-6 w-32" />
              {[...Array(3)].map((_, j) => <Skeleton key={j} className="h-28 w-full" />)}
            </div>
          )) : [...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-700 mb-2" style={{ color: 'var(--text)' }}>No tasks yet</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>Process some feedback to generate your first AI tasks.</p>
          <Link to="/feedback" className="btn btn-primary">Process Feedback</Link>
        </div>
      ) : view === 'kanban' ? (
        <KanbanBoard tasksByStatus={tasksByStatus} onTaskUpdate={updateTask} onAddTask={canEditTasks ? () => setShowCreate(true) : undefined} />
      ) : (
        <ListView tasks={filteredTasks} />
      )}

      {/* Create task modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Task Manually" size="lg">
        <div className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input" value={newTask.title}
              onChange={e => setNewTask(f => ({ ...f, title: e.target.value }))}
              placeholder="Short, action-oriented task title" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea className="input min-h-24 resize-y" value={newTask.description}
              onChange={e => setNewTask(f => ({ ...f, description: e.target.value }))}
              placeholder="What needs to be done and why..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Priority</label>
              <Select value={newTask.priority} onChange={v => setNewTask(f => ({ ...f, priority: v }))}
                options={[{ value: 'High', label: 'High' }, { value: 'Medium', label: 'Medium' }, { value: 'Low', label: 'Low' }]} />
            </div>
            <div>
              <label className="label">Category</label>
              <Select value={newTask.category} onChange={v => setNewTask(f => ({ ...f, category: v }))}
                options={['UI', 'UX', 'Bug', 'Performance', 'Feature', 'Other'].map(c => ({ value: c, label: c }))} />
            </div>
            <div>
              <label className="label">Status</label>
              <Select value={newTask.status} onChange={v => setNewTask(f => ({ ...f, status: v }))}
                options={[{ value: 'Todo', label: 'Todo' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Done', label: 'Done' }]} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowCreate(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleCreate} disabled={creating} className="btn btn-primary">
              {creating ? <><Spinner size={15} /> Creating...</> : 'Create Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
