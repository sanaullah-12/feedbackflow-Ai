import React from 'react';
import { Clock3, UserPlus, UserRoundCheck, Edit3 } from 'lucide-react';
import { formatRelative } from '../../utils/helpers';
import { Skeleton } from '../ui';

const iconByType = {
  'member.invited': UserPlus,
  'task.assigned': UserRoundCheck,
  'task.unassigned': UserRoundCheck,
  'task.updated': Edit3,
  'task.created': Edit3
};

export default function ActivityFeed({ activities, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, index) => <Skeleton key={index} className="h-14" />)}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-8">
        <Clock3 size={28} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
        <p className="text-sm font-700" style={{ color: 'var(--text)' }}>No activity yet</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>Invites, assignments, and task updates will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map(activity => {
        const Icon = iconByType[activity.type] || Clock3;
        return (
          <div key={activity.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--surface-2)', color: 'var(--brand)' }}>
              <Icon size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-5" style={{ color: 'var(--text)' }}>{activity.message}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>{formatRelative(activity.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
