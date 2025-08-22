import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

import { TaskList } from '@/components/task/task-list';
import {
  Button,
  FloatingActionButton,
  FocusAwareStatusBar,
  QuickStats,
  Text,
  View,
} from '@/components/ui';
import {
  useSampleData,
  useTasks,
  useTaskStats,
  useTaskStore,
} from '@/lib/hooks';

export default function Home() {
  const router = useRouter();
  const { loadData, toggleTaskStatus } = useTaskStore();
  const { tasks } = useTasks({ status: ['pending'] }); // 진행 중인 할일만
  const stats = useTaskStats();
  const { createSampleData } = useSampleData();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const recentTasks = tasks.slice(0, 5); // 최근 5개만 표시

  return (
    <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />

      {/* Header */}
      <View className="bg-white px-4 pb-6 pt-12 dark:bg-neutral-800">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          안녕하세요! 👋
        </Text>
        <Text className="mt-1 text-gray-600 dark:text-gray-400">
          오늘도 생산적인 하루 보내세요
        </Text>
      </View>

      {/* Quick Stats */}
      <View className="mx-4 mt-4">
        <QuickStats stats={stats} variant="detailed" />
      </View>

      {/* Recent Tasks Section */}
      <View className="mt-6 flex-1">
        <View className="flex-row items-center justify-between px-4 pb-4">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white">
            최근 할일
          </Text>
          <Button
            label="전체 보기"
            variant="ghost"
            size="sm"
            onPress={() => router.push('/(app)/tasks')}
          />
        </View>

        {recentTasks.length > 0 ? (
          <TaskList tasks={recentTasks} onToggleTaskStatus={toggleTaskStatus} />
        ) : (
          <View className="flex-1 items-center justify-center p-8">
            <View className="mb-4 size-16 items-center justify-center rounded-2xl bg-blue-500">
              <Text className="text-2xl">📋</Text>
            </View>
            <Text className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              할일을 추가해보세요
            </Text>
            <View className="mt-4 space-y-2">
              <Button
                label="할일 추가"
                onPress={() => router.push('/add-task')}
              />
              <Button
                label="샘플 데이터 추가 (데모용)"
                variant="outline"
                size="sm"
                onPress={createSampleData}
              />
            </View>
          </View>
        )}
      </View>

      {/* Floating Action Button - only show when no tasks */}
      {recentTasks.length === 0 && (
        <FloatingActionButton onPress={() => router.push('/add-task')} />
      )}
    </View>
  );
}
