export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high';

export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type TaskWithCategory = Task & {
  category?: Category;
};

export type TaskFilters = {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  categoryId?: string;
  searchQuery?: string;
};

export type TaskStats = {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  completionRate: number;
  byCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
    completed: number;
  }[];
  byPriority: {
    priority: TaskPriority;
    total: number;
    completed: number;
  }[];
};
