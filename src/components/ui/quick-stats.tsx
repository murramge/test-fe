import * as React from 'react';

import { Text, View } from '@/components/ui';
import type { TaskStats } from '@/types';

type Props = {
  stats: TaskStats;
  variant?: 'compact' | 'detailed';
};

export function QuickStats({ stats, variant = 'compact' }: Props) {
  if (variant === 'compact') {
    return (
      <View className="flex-row space-x-3">
        <View className="flex-1 rounded-lg bg-blue-500/10 p-3">
          <Text className="text-lg font-bold text-blue-600">{stats.total}</Text>
          <Text className="text-xs text-blue-600/70">전체</Text>
        </View>
        <View className="flex-1 rounded-lg bg-green-500/10 p-3">
          <Text className="text-lg font-bold text-green-600">
            {stats.completed}
          </Text>
          <Text className="text-xs text-green-600/70">완료</Text>
        </View>
        <View className="flex-1 rounded-lg bg-orange-500/10 p-3">
          <Text className="text-lg font-bold text-orange-600">
            {stats.pending}
          </Text>
          <Text className="text-xs text-orange-600/70">진행중</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="space-y-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          오늘의 진행 상황
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(stats.completionRate)}% 완료
        </Text>
      </View>

      {/* Progress bar */}
      <View className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <View
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
          style={{ width: `${stats.completionRate}%` }}
        />
      </View>

      <View className="flex-row justify-between text-sm">
        <Text className="text-gray-600 dark:text-gray-400">
          완료: {stats.completed}개
        </Text>
        <Text className="text-gray-600 dark:text-gray-400">
          남은 할일: {stats.pending}개
        </Text>
      </View>
    </View>
  );
}
