import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { TaskList } from '@/components/task/task-list';
import {
  Button,
  FloatingActionButton,
  FocusAwareStatusBar,
  QuickStats,
  TaskFiltersComponent,
  Text,
  View,
} from '@/components/ui';
import {
  useCategories,
  useTasks,
  useTaskStats,
  useTaskStore,
} from '@/lib/hooks';
import type { TaskFilters } from '@/types';

export default function Tasks() {
  const router = useRouter();
  const { loadData, toggleTaskStatus } = useTaskStore();
  const { categories } = useCategories();
  const stats = useTaskStats();
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const { tasks, isLoading } = useTasks(filters);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTask = () => {
    router.push('/add-task');
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />

      {/* Header */}
      <View className="bg-white px-4 pb-4 pt-12 dark:bg-neutral-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              할일 관리
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              {tasks.length}개의 할일
            </Text>
          </View>
          <Button
            label="필터"
            variant="outline"
            size="sm"
            onPress={() => setShowFilters(!showFilters)}
          />
        </View>

        {/* Quick Stats */}
        <View className="mt-4">
          <QuickStats stats={stats} variant="compact" />
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View className="px-4 pb-4">
          <TaskFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
        </View>
      )}

      {/* Task List */}
      <View className="flex-1">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onToggleTaskStatus={toggleTaskStatus}
        />
      </View>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleAddTask} />
    </View>
  );
}
