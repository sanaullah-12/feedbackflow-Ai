import { clsx } from 'clsx';

export const cn = (...args) => clsx(args);

export const PRIORITY_CONFIG = {
  High: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40', dot: 'bg-red-500', border: 'border-red-200 dark:border-red-900' },
  Medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', dot: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-900' },
  Low: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', dot: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-900' },
};

export const CATEGORY_CONFIG = {
  UI: { color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40', icon: '🎨' },
  UX: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', icon: '🧭' },
  Bug: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40', icon: '🐛' },
  Performance: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40', icon: '⚡' },
  Feature: { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40', icon: '✨' },
  Other: { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900', icon: '📌' },
};

export const STATUS_CONFIG = {
  'Todo': { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', dot: 'bg-gray-400' },
  'In Progress': { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', dot: 'bg-blue-500' },
  'Done': { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', dot: 'bg-emerald-500' },
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatRelative = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const exportToCSV = (tasks) => {
  const headers = ['Title', 'Description', 'Priority', 'Category', 'Status', 'Created At'];
  const rows = tasks.map(t => [
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.priority, t.category, t.status,
    new Date(t.createdAt).toISOString()
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  downloadFile(csv, 'feedbackflow-tasks.csv', 'text/csv');
};

export const exportToJSON = (tasks) => {
  const json = JSON.stringify(tasks.map(t => ({
    title: t.title, description: t.description,
    priority: t.priority, category: t.category,
    status: t.status, suggestion: t.suggestion,
    createdAt: t.createdAt
  })), null, 2);
  downloadFile(json, 'feedbackflow-tasks.json', 'application/json');
};

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};
