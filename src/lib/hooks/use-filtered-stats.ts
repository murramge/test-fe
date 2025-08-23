import { useMemo } from 'react';

import type { Task, TaskStats } from '@/types';

import { useTasks } from './use-tasks';

export type DateRange = '7days' | '30days' | '90days' | 'all';

export function useFilteredStats(dateRange: DateRange = 'all') {
  const { tasks } = useTasks();

  const filteredTasks = useMemo(() => {
    if (dateRange === 'all') return tasks;

    const daysMap = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
    };

    const days = daysMap[dateRange];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= cutoffDate;
    });
  }, [tasks, dateRange]);

  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.status === 'completed').length;
    const pending = filteredTasks.filter(task => task.status === 'pending').length;
    const cancelled = filteredTasks.filter(task => task.status === 'cancelled').length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // 카테고리별 통계
    const categoryMap = new Map<string, { total: number; completed: number; name: string }>();
    
    filteredTasks.forEach(task => {
      const categoryId = task.categoryId || 'uncategorized';
      const categoryName = task.category?.name || '미분류';
      
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, { total: 0, completed: 0, name: categoryName });
      }
      
      const category = categoryMap.get(categoryId)!;
      category.total++;
      if (task.status === 'completed') {
        category.completed++;
      }
    });

    const byCategory = Array.from(categoryMap.entries()).map(([categoryId, stats]) => ({
      categoryId,
      categoryName: stats.name,
      total: stats.total,
      completed: stats.completed,
    }));

    // 우선순위별 통계
    const priorityMap = new Map<string, { total: number; completed: number }>();
    
    filteredTasks.forEach(task => {
      if (!priorityMap.has(task.priority)) {
        priorityMap.set(task.priority, { total: 0, completed: 0 });
      }
      
      const priority = priorityMap.get(task.priority)!;
      priority.total++;
      if (task.status === 'completed') {
        priority.completed++;
      }
    });

    const byPriority = Array.from(priorityMap.entries()).map(([priority, stats]) => ({
      priority: priority as 'low' | 'medium' | 'high',
      total: stats.total,
      completed: stats.completed,
    }));

    const taskStats: TaskStats = {
      total,
      completed,
      pending,
      cancelled,
      completionRate,
      byCategory,
      byPriority,
    };

    return taskStats;
  }, [filteredTasks]);

  // 이전 기간 통계 (비교용)
  const previousStats = useMemo(() => {
    if (dateRange === 'all') return undefined;

    const daysMap = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
    };

    const days = daysMap[dateRange];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days * 2);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - days);

    const previousTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate && taskDate < endDate;
    });

    const total = previousTasks.length;
    const completed = previousTasks.filter(task => task.status === 'completed').length;
    const pending = previousTasks.filter(task => task.status === 'pending').length;
    const cancelled = previousTasks.filter(task => task.status === 'cancelled').length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      pending,
      cancelled,
      completionRate,
      byCategory: [],
      byPriority: [],
    };
  }, [tasks, dateRange]);

  return {
    stats,
    previousStats,
    filteredTasks,
    dateRange,
  };
}
