const PRIORITY_WEIGHTS = {
  Critical: 10,
  High: 9,
  Medium: 6,
  Low: 3
};

const IMPACT_KEYWORDS = [
  'signup',
  'sign up',
  'onboarding',
  'checkout',
  'payment',
  'billing',
  'conversion',
  'revenue',
  'login',
  'activation',
  'trial',
  'upgrade',
  'subscribe'
];

const EFFORT_KEYWORDS = {
  high: ['architecture', 'migration', 'refactor', 'integration', 'database', 'backend', 'api', 'security'],
  low: ['copy', 'label', 'spacing', 'color', 'button', 'tooltip', 'empty state', 'placeholder']
};

const ROLE_BY_CATEGORY = {
  Bug: 'Full-stack engineer',
  UX: 'Product designer',
  UI: 'Product designer',
  Feature: 'Product engineer',
  Performance: 'Frontend engineer',
  Content: 'Content designer',
  Other: 'Product owner'
};

const ROLE_PREFERENCE_BY_CATEGORY = {
  Bug: ['Developer', 'Manager', 'Admin'],
  UX: ['Designer', 'Manager', 'Admin'],
  UI: ['Designer', 'Developer', 'Manager'],
  Feature: ['Developer', 'Manager', 'Admin'],
  Performance: ['Developer', 'Manager', 'Admin'],
  Content: ['Designer', 'Manager', 'Admin'],
  Other: ['Manager', 'Developer', 'Admin']
};

const CATEGORY_MAP = {
  UI: 'UX',
  UX: 'UX',
  Bug: 'Bug',
  Performance: 'Performance',
  Feature: 'Feature',
  Content: 'Content',
  Other: 'Content'
};

const clamp = (value, min = 1, max = 10) => Math.min(max, Math.max(min, value));

const normalize = (value = '') => value.toString().toLowerCase();

const getRepeatedFeedbackCount = (task, allTasks) => {
  if (typeof task.feedbackCount === 'number') return task.feedbackCount;
  if (typeof task.repeatedFeedbackCount === 'number') return task.repeatedFeedbackCount;
  if (typeof task.count === 'number') return task.count;
  if (task.taskGroup) {
    return allTasks.filter(t => t.taskGroup && t.taskGroup === task.taskGroup).length;
  }

  const title = normalize(task.title).replace(/[^\w\s]/g, '');
  const words = title.split(/\s+/).filter(word => word.length > 4);
  if (words.length === 0) return 1;

  return allTasks.filter(other => {
    if (other._id === task._id || other.id === task.id) return false;
    const otherText = normalize(`${other.title} ${other.description}`);
    return words.slice(0, 4).some(word => otherText.includes(word));
  }).length + 1;
};

const getImpactScore = (task, repeatedCount) => {
  const text = normalize(`${task.title} ${task.description} ${task.suggestion || ''}`);
  const priorityScore = PRIORITY_WEIGHTS[task.priority] || 5;
  const keywordBoost = IMPACT_KEYWORDS.some(keyword => text.includes(keyword)) ? 2 : 0;
  const categoryBoost = ['Bug', 'UX', 'Performance'].includes(task.category) ? 1 : 0;
  const repeatedBoost = Math.min(2, Math.max(0, repeatedCount - 1));

  return clamp(priorityScore + keywordBoost + categoryBoost + repeatedBoost);
};

const getEffortScore = (task) => {
  const text = normalize(`${task.title} ${task.description} ${task.suggestion || ''}`);
  const hasHighEffortSignal = EFFORT_KEYWORDS.high.some(keyword => text.includes(keyword));
  const hasLowEffortSignal = EFFORT_KEYWORDS.low.some(keyword => text.includes(keyword));

  if (hasLowEffortSignal && !hasHighEffortSignal) return task.priority === 'High' ? 4 : 3;
  if (hasHighEffortSignal) return task.category === 'Performance' ? 8 : 7;
  if (task.category === 'Feature') return 6;
  if (task.category === 'Bug') return task.priority === 'High' ? 5 : 4;
  if (task.category === 'Performance') return 6;
  return 4;
};

const getEstimatedHours = (effortScore, task) => {
  const priorityBoost = task.priority === 'High' ? 1 : 0;
  return Math.max(1, Math.round(effortScore * 1.5 + priorityBoost));
};

const buildReason = (task, impactScore, effortScore, repeatedCount) => {
  const reasons = [];
  if (task.priority === 'High') reasons.push('high priority');
  if (impactScore >= 8) reasons.push('strong user or revenue impact');
  if (effortScore <= 4) reasons.push('low implementation effort');
  if (repeatedCount > 1) reasons.push(`appears in ${repeatedCount} related feedback items`);
  if (['UX', 'Bug', 'Performance'].includes(task.category)) reasons.push(`${task.category.toLowerCase()} risk`);

  return `Selected because it combines ${reasons.slice(0, 3).join(', ') || 'useful product impact'} with a clear path to completion.`;
};

const getSuggestedAssignee = (task, category, members = []) => {
  if (task.assignedTo) {
    if (typeof task.assignedTo === 'string') {
      const assignedMember = members.find(member => member.id === task.assignedTo);
      if (assignedMember) {
        return {
          id: assignedMember.id,
          name: assignedMember.name || assignedMember.email,
          email: assignedMember.email,
          role: assignedMember.role,
          source: 'assigned'
        };
      }
    }

    return {
      id: task.assignedTo._id || task.assignedTo.id,
      name: task.assignedTo.name || task.assignedTo.email,
      email: task.assignedTo.email,
      role: task.assignedTo.role,
      source: 'assigned'
    };
  }

  const preferredRoles = ROLE_PREFERENCE_BY_CATEGORY[category] || ROLE_PREFERENCE_BY_CATEGORY.Other;
  const member = preferredRoles
    .map(role => members.find(candidate => candidate.status !== 'pending' && candidate.role === role))
    .find(Boolean);

  if (!member) return null;

  return {
    id: member.id,
    name: member.name || member.email,
    email: member.email,
    role: member.role,
    source: 'suggested'
  };
};

export const createSprintPlan = (tasks = [], members = []) => {
  const openTasks = tasks.filter(task => task.status !== 'Done');

  const scoredTasks = openTasks.map(task => {
    const repeatedCount = getRepeatedFeedbackCount(task, openTasks);
    const impactScore = getImpactScore(task, repeatedCount);
    const effortScore = getEffortScore(task);
    const estimatedHours = getEstimatedHours(effortScore, task);
    const category = CATEGORY_MAP[task.category] || 'Content';
    const suggestedAssignee = getSuggestedAssignee(task, category, members);
    const score = (impactScore * 2.2) + ((11 - effortScore) * 1.15) + ((PRIORITY_WEIGHTS[task.priority] || 5) * 1.4) + repeatedCount;

    return {
      id: task._id || task.id,
      sourceTaskId: task._id || task.id,
      assignedToId: task.assignedToId || task.assignedTo?._id || task.assignedTo?.id || task.assignedTo || null,
      title: task.title,
      description: task.description,
      priority: task.priority || 'Medium',
      category,
      impactScore,
      effortScore,
      estimatedHours,
      selectedReason: buildReason(task, impactScore, effortScore, repeatedCount),
      suggestedRole: suggestedAssignee
        ? `${suggestedAssignee.name} · ${suggestedAssignee.role}`
        : ROLE_BY_CATEGORY[category] || 'Product owner',
      suggestedAssignee,
      repeatedCount,
      score
    };
  });

  const highImpactTasks = scoredTasks
    .filter(task => task.priority === 'High' || task.impactScore >= 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const highImpactIds = new Set(highImpactTasks.map(task => task.id));
  const quickWins = scoredTasks
    .filter(task => !highImpactIds.has(task.id) && task.effortScore <= 4 && task.impactScore >= 6)
    .sort((a, b) => (b.impactScore - a.impactScore) || (a.effortScore - b.effortScore))
    .slice(0, 2);

  const selectedIds = new Set([...highImpactTasks, ...quickWins].map(task => task.id));
  const fallbackTasks = scoredTasks
    .filter(task => !selectedIds.has(task.id))
    .sort((a, b) => b.score - a.score);

  const selectedHighImpact = [...highImpactTasks];
  while (selectedHighImpact.length < 3 && fallbackTasks.length > 0) {
    selectedHighImpact.push(fallbackTasks.shift());
  }

  const selectedQuickWins = [...quickWins];
  while (selectedQuickWins.length < 2 && fallbackTasks.length > 0) {
    selectedQuickWins.push(fallbackTasks.shift());
  }

  const selectedTasks = [...selectedHighImpact, ...selectedQuickWins];
  const estimatedSprintHours = selectedTasks.reduce((sum, task) => sum + task.estimatedHours, 0);

  return {
    totalTasksAnalyzed: openTasks.length,
    highImpactCount: scoredTasks.filter(task => task.impactScore >= 8).length,
    quickWinsCount: scoredTasks.filter(task => task.effortScore <= 4 && task.impactScore >= 6).length,
    estimatedSprintHours,
    highImpactTasks: selectedHighImpact,
    quickWins: selectedQuickWins,
    insight:
      'This sprint focuses on high-impact issues that affect user onboarding, conversion, and product reliability. Quick wins are included to improve product polish without blocking major fixes.'
  };
};
