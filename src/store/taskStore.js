import { create } from 'zustand';
import api from '../services/api';

const normalizeTaskId = (taskId) => {
  if (!taskId) return null;
  if (typeof taskId === 'object') return taskId._id || taskId.id || null;
  return taskId;
};

const useTaskStore = create((set, get) => ({
  tasks: [],
  runningTimer: null,
  loading: false,
  filters: { status: 'all', priority: 'all', category: 'all', taskGroup: 'all', search: '' },
  view: localStorage.getItem('ff_view') || 'kanban',
  pagination: { page: 1, limit: 100, total: 0, pages: 1 },

  setView: (view) => {
    localStorage.setItem('ff_view', view);
    set({ view });
  },

  setFilter: (key, value) => {
    set(state => ({ filters: { ...state.filters, [key]: value } }));
  },

  resetFilters: () => {
    set({ filters: { status: 'all', priority: 'all', category: 'all', taskGroup: 'all', search: '' } });
  },

  fetchTasks: async (params = {}) => {
    set({ loading: true });
    try {
      const { filters } = get();
      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.set('status', filters.status);
      if (filters.priority !== 'all') queryParams.set('priority', filters.priority);
      if (filters.category !== 'all') queryParams.set('category', filters.category);
      if (filters.taskGroup !== 'all') queryParams.set('taskGroup', filters.taskGroup);
      if (filters.search) queryParams.set('search', filters.search);
      queryParams.set('limit', '200');
      Object.entries(params).forEach(([k, v]) => queryParams.set(k, v));

      const { data } = await api.get(`/tasks?${queryParams}`);
      set({ tasks: data.tasks, pagination: data.pagination, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  createTask: async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    set(state => ({ tasks: [data.task, ...state.tasks] }));
    return data.task;
  },

  updateTask: async (id, updates) => {
    const { data } = await api.patch(`/tasks/${id}`, updates);
    set(state => ({
      tasks: state.tasks.map(t => t._id === id ? data.task : t)
    }));
    return data.task;
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set(state => ({ tasks: state.tasks.filter(t => t._id !== id) }));
  },

  fetchRunningTimer: async () => {
    const { data } = await api.get('/timers/running');
    set({ runningTimer: data.timer || null });
    return data.timer || null;
  },

  startTimer: async (taskId, { force = false } = {}) => {
    const safeTaskId = normalizeTaskId(taskId);
    if (!safeTaskId) throw new Error('Task id is missing.');
    const { data } = await api.post(`/timers/tasks/${safeTaskId}/start`, { force });
    set({ runningTimer: data.timer || null });
    return data.timer;
  },

  stopTimer: async (taskId) => {
    const safeTaskId = normalizeTaskId(taskId);
    if (!safeTaskId) throw new Error('Task id is missing.');
    const { data } = await api.post(`/timers/tasks/${safeTaskId}/stop`);
    set({ runningTimer: null });
    return data.timer;
  },

  pauseTimer: async (taskId) => {
    const safeTaskId = normalizeTaskId(taskId);
    if (!safeTaskId) throw new Error('Task id is missing.');
    const { data } = await api.post(`/timers/tasks/${safeTaskId}/pause`);
    set({ runningTimer: data.timer || null });
    return data.timer;
  },

  resumeTimer: async (taskId) => {
    const safeTaskId = normalizeTaskId(taskId);
    if (!safeTaskId) throw new Error('Task id is missing.');
    const { data } = await api.post(`/timers/tasks/${safeTaskId}/resume`);
    set({ runningTimer: data.timer || null });
    return data.timer;
  },

  extendTimer: async (taskId, addedMinutes) => {
    const safeTaskId = normalizeTaskId(taskId);
    if (!safeTaskId) throw new Error('Task id is missing.');
    const { data } = await api.post(`/timers/tasks/${safeTaskId}/extend`, { addedMinutes });
    set({ runningTimer: data.timer || null });
    return data.timer;
  },

  completeTimedTask: async (taskId) => {
    const safeTaskId = normalizeTaskId(taskId);
    if (!safeTaskId) throw new Error('Task id is missing.');
    const { data } = await api.post(`/timers/tasks/${safeTaskId}/complete`);
    set(state => ({
      runningTimer: null,
      tasks: state.tasks.map(task => task._id === safeTaskId ? data.task : task)
    }));
    return data;
  },

  fetchTimerHistory: async (taskId) => {
    const safeTaskId = normalizeTaskId(taskId);
    if (!safeTaskId) throw new Error('Task id is missing.');
    const { data } = await api.get(`/timers/tasks/${safeTaskId}/history`);
    return data;
  },

  fetchActiveSprint: async () => {
    const { data } = await api.get('/sprints/active');
    return data.sprint || null;
  },

  saveSprintPlan: async (plan, { replaceExisting = false } = {}) => {
    const { data } = await api.post('/sprints', { plan, replaceExisting });
    return data.sprint;
  },

  deleteSprint: async (sprintId) => {
    await api.delete(`/sprints/${sprintId}`);
  },

  assignTaskFromSprint: async (sprintId, taskId, assignedToId) => {
    const safeTaskId = normalizeTaskId(taskId);
    if (!safeTaskId) throw new Error('Task id is missing.');
    const { data } = await api.patch(`/sprints/${sprintId}/tasks/${safeTaskId}/assign`, { assignedToId });
    set(state => ({
      tasks: state.tasks.map(task => task._id === safeTaskId ? data.task : task)
    }));
    return data;
  },

  addTasksFromFeedback: (newTasks) => {
    set(state => ({ tasks: [...newTasks, ...state.tasks] }));
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.category !== 'all' && task.category !== filters.category) return false;
      if (filters.taskGroup !== 'all' && task.taskGroup !== filters.taskGroup) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  },

  getTasksByStatus: () => {
    const filtered = get().getFilteredTasks();
    return {
      'Todo': filtered.filter(t => t.status === 'Todo'),
      'In Progress': filtered.filter(t => t.status === 'In Progress'),
      'Done': filtered.filter(t => t.status === 'Done'),
    };
  }
}));

export default useTaskStore;
