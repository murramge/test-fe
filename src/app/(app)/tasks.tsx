import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

import { TaskList } from '@/components/task/task-list';
import { Button, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useTasks, useTaskStore } from '@/lib/hooks';

export default function Tasks() {
  const router = useRouter();
  const { loadData, toggleTaskStatus } = useTaskStore();
  const { tasks, isLoading } = useTasks();

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
          <Button label="추가" onPress={handleAddTask} className="px-4 py-2" />
        </View>
      </View>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onToggleTaskStatus={toggleTaskStatus}
      />
    </View>
  );
}
