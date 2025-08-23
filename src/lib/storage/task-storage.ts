import { MMKV } from 'react-native-mmkv';

import type { Category, Task } from '@/types';
import { userStorage } from './user-storage';

const storage = new MMKV({
  id: 'taskflow-storage',
});

// Storage keys with user isolation
const getUserTasksKey = (userId: string) => `tasks_${userId}`;
const getUserCategoriesKey = (userId: string) => `categories_${userId}`;

// Get current user ID or return null
const getCurrentUserId = (): string | null => {
  const user = userStorage.getCurrentUser();
  return user ? user.id : null;
};

// Task storage functions with user isolation
export const taskStorage = {
  // Tasks
  getTasks: (): Task[] => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    const tasksJson = storage.getString(getUserTasksKey(userId));
    return tasksJson ? JSON.parse(tasksJson) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    storage.set(getUserTasksKey(userId), JSON.stringify(tasks));
  },

  addTask: (task: Task): void => {
    const tasks = taskStorage.getTasks();
    tasks.push(task);
    taskStorage.saveTasks(tasks);
  },

  updateTask: (taskId: string, updates: Partial<Task>): Task | null => {
    const tasks = taskStorage.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) return null;

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    taskStorage.saveTasks(tasks);
    return updatedTask;
  },

  deleteTask: (taskId: string): boolean => {
    const tasks = taskStorage.getTasks();
    const filteredTasks = tasks.filter((task) => task.id !== taskId);

    if (filteredTasks.length === tasks.length) return false;

    taskStorage.saveTasks(filteredTasks);
    return true;
  },

  getTaskById: (taskId: string): Task | null => {
    const tasks = taskStorage.getTasks();
    return tasks.find((task) => task.id === taskId) || null;
  },

  // Categories
  getCategories: (): Category[] => {
    const userId = getCurrentUserId();
    if (!userId) return getDefaultCategories();
    
    const categoriesJson = storage.getString(getUserCategoriesKey(userId));
    return categoriesJson ? JSON.parse(categoriesJson) : getDefaultCategories();
  },

  saveCategories: (categories: Category[]): void => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    storage.set(getUserCategoriesKey(userId), JSON.stringify(categories));
  },

  addCategory: (category: Category): void => {
    const categories = taskStorage.getCategories();
    categories.push(category);
    taskStorage.saveCategories(categories);
  },

  updateCategory: (
    categoryId: string,
    updates: Partial<Category>
  ): Category | null => {
    const categories = taskStorage.getCategories();
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);

    if (categoryIndex === -1) return null;

    const updatedCategory = { ...categories[categoryIndex], ...updates };
    categories[categoryIndex] = updatedCategory;
    taskStorage.saveCategories(categories);
    return updatedCategory;
  },

  deleteCategory: (categoryId: string): boolean => {
    const categories = taskStorage.getCategories();
    const filteredCategories = categories.filter(
      (cat) => cat.id !== categoryId
    );

    if (filteredCategories.length === categories.length) return false;

    // Also update tasks to remove deleted category
    const tasks = taskStorage.getTasks();
    const updatedTasks = tasks.map((task) =>
      task.categoryId === categoryId ? { ...task, categoryId: undefined } : task
    );

    taskStorage.saveCategories(filteredCategories);
    taskStorage.saveTasks(updatedTasks);
    return true;
  },

  getCategoryById: (categoryId: string): Category | null => {
    const categories = taskStorage.getCategories();
    return categories.find((cat) => cat.id === categoryId) || null;
  },

  // Clear current user's data
  clearUserData: (): void => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    storage.delete(getUserTasksKey(userId));
    storage.delete(getUserCategoriesKey(userId));
  },

  // Clear all data (admin function)
  clearAll: (): void => {
    // This would clear all users' data - use with caution
    const keys = storage.getAllKeys();
    keys.forEach(key => {
      if (key.startsWith('tasks_') || key.startsWith('categories_')) {
        storage.delete(key);
      }
    });
  },
};

// Default categories
function getDefaultCategories(): Category[] {
  return [
    {
      id: 'work',
      name: '업무',
      color: '#3B82F6',
      icon: 'briefcase',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'personal',
      name: '개인',
      color: '#10B981',
      icon: 'person',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'health',
      name: '건강',
      color: '#F59E0B',
      icon: 'activity',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'learning',
      name: '학습',
      color: '#8B5CF6',
      icon: 'book',
      createdAt: new Date().toISOString(),
    },
  ];
}
