import { useMemo } from 'react';
import { create } from 'zustand';

import type {
  Category,
  Task,
  TaskFilters,
  TaskStats,
  TaskWithCategory,
} from '@/types';

import { taskStorage } from '../storage/task-storage';

type TaskStore = {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;

  // Actions
  loadData: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;

  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  categories: [],
  isLoading: false,

  loadData: () => {
    set({ isLoading: true });
    try {
      const tasks = taskStorage.getTasks();
      const categories = taskStorage.getCategories();
      set({ tasks, categories, isLoading: false });
    } catch (error) {
      console.error('Error loading data:', error);
      set({ isLoading: false });
    }
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    taskStorage.addTask(newTask);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: (taskId, updates) => {
    const updatedTask = taskStorage.updateTask(taskId, updates);
    if (updatedTask) {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ),
      }));
    }
  },

  deleteTask: (taskId) => {
    const success = taskStorage.deleteTask(taskId);
    if (success) {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      }));
    }
  },

  toggleTaskStatus: (taskId) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updates: Partial<Task> = {
      status: newStatus,
      completedAt:
        newStatus === 'completed' ? new Date().toISOString() : undefined,
    };

    get().updateTask(taskId, updates);
  },

  addCategory: (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    taskStorage.addCategory(newCategory);
    set((state) => ({ categories: [...state.categories, newCategory] }));
  },

  updateCategory: (categoryId, updates) => {
    const updatedCategory = taskStorage.updateCategory(categoryId, updates);
    if (updatedCategory) {
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === categoryId ? updatedCategory : cat
        ),
      }));
    }
  },

  deleteCategory: (categoryId) => {
    const success = taskStorage.deleteCategory(categoryId);
    if (success) {
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== categoryId),
        tasks: state.tasks.map((task) =>
          task.categoryId === categoryId
            ? { ...task, categoryId: undefined }
            : task
        ),
      }));
    }
  },
}));

// Custom hooks for easier usage
export function useTasks(filters?: TaskFilters) {
  const { tasks, categories, loadData, isLoading } = useTaskStore();

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filters?.status) {
      result = result.filter((task) => filters.status!.includes(task.status));
    }

    if (filters?.priority) {
      result = result.filter((task) =>
        filters.priority!.includes(task.priority)
      );
    }

    if (filters?.categoryId) {
      result = result.filter((task) => task.categoryId === filters.categoryId);
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, filters]);

  const tasksWithCategories: TaskWithCategory[] = useMemo(() => {
    return filteredTasks.map((task) => ({
      ...task,
      category: task.categoryId
        ? categories.find((cat) => cat.id === task.categoryId)
        : undefined,
    }));
  }, [filteredTasks, categories]);

  return {
    tasks: tasksWithCategories,
    isLoading,
    loadData,
  };
}

export function useTaskStats(): TaskStats {
  const { tasks, categories } = useTaskStore();

  return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const cancelled = tasks.filter((t) => t.status === 'cancelled').length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    const byCategory = categories.map((category) => {
      const categoryTasks = tasks.filter((t) => t.categoryId === category.id);
      return {
        categoryId: category.id,
        categoryName: category.name,
        total: categoryTasks.length,
        completed: categoryTasks.filter((t) => t.status === 'completed').length,
      };
    });

    const byPriority = (['low', 'medium', 'high'] as const).map((priority) => {
      const priorityTasks = tasks.filter((t) => t.priority === priority);
      return {
        priority,
        total: priorityTasks.length,
        completed: priorityTasks.filter((t) => t.status === 'completed').length,
      };
    });

    return {
      total,
      completed,
      pending,
      cancelled,
      completionRate,
      byCategory,
      byPriority,
    };
  }, [tasks, categories]);
}

export function useCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useTaskStore();

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}

// Utility function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
