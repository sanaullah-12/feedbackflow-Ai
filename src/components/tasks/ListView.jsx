import React, { useState } from 'react';
import { Trash2, Edit2, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useTaskStore from '../../store/taskStore';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, STATUS_CONFIG, formatRelative } from '../../utils/helpers';
import { Empty, Spinner } from '../ui';
import { TaskCard } from './TaskCard';

export default function ListView({ tasks }) {
  const [selectedTask, setSelectedTask] = useState(null);

  if (!tasks.length) {
    return (
      <Empty icon="📋" title="No tasks found"
        description="Adjust your filters or process some feedback to create tasks." />
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Task', 'Priority', 'Category', 'Status', 'Created', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-700 uppercase tracking-wide"
                  style={{ color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => {
              const pc = PRIORITY_CONFIG[task.priority];
              const cc = CATEGORY_CONFIG[task.category];
              const sc = STATUS_CONFIG[task.status];
              return (
                <React.Fragment key={task._id}>
                  <tr
                    className="group cursor-pointer transition-colors hover:bg-[var(--surface-2)]"
                    style={{ borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onClick={() => setSelectedTask(selectedTask?._id === task._id ? null : task)}>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base flex-shrink-0">{cc?.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-500 truncate" style={{ color: 'var(--text)' }}>{task.title}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{task.description.slice(0, 60)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${pc.bg} ${pc.color}`}>{task.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${cc?.bg} ${cc?.color}`}>{task.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className="text-xs font-500" style={{ color: 'var(--text-2)' }}>{task.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-3)' }}>
                      {formatRelative(task.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronDown size={14} style={{
                        color: 'var(--text-3)',
                        transform: selectedTask?._id === task._id ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s'
                      }} />
                    </td>
                  </tr>
                  {selectedTask?._id === task._id && (
                    <tr>
                      <td colSpan={6} className="px-4 pb-4 pt-0">
                        <div className="p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                          <p className="text-sm mb-2" style={{ color: 'var(--text-2)' }}>{task.description}</p>
                          {task.suggestion && (
                            <p className="text-xs italic" style={{ color: 'var(--text-3)' }}>💡 {task.suggestion}</p>
                          )}
                          {task.tailwindFix && (
                            <pre className="text-xs mt-2 p-2 rounded-lg font-mono overflow-x-auto"
                              style={{ background: 'var(--surface)', color: 'var(--brand)' }}>{task.tailwindFix}</pre>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
