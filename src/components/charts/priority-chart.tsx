import * as React from 'react';

import { Text, View } from '@/components/ui';
import { PriorityHigh, PriorityMedium, PriorityLow } from '@/components/ui/icons';
import type { TaskStats } from '@/types';

type Props = {
  stats: TaskStats;
};

const priorityConfig = {
  high: { label: '높음', color: 'bg-red-500', component: PriorityHigh },
  medium: { label: '보통', color: 'bg-yellow-500', component: PriorityMedium },
  low: { label: '낮음', color: 'bg-green-500', component: PriorityLow },
};

export function PriorityChart({ stats }: Props) {
  const totalTasks = stats.byPriority.reduce((sum, p) => sum + p.total, 0);

  return (
    <View className="space-y-3">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
        우선순위별 현황
      </Text>

      {totalTasks === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-500 dark:text-gray-400">
            아직 우선순위별 데이터가 없습니다
          </Text>
        </View>
      ) : (
        <View className="space-y-3">
          {stats.byPriority.map((priority) => {
            const completionRate =
              priority.total > 0
                ? (priority.completed / priority.total) * 100
                : 0;
            const config = priorityConfig[priority.priority];

            return (
              <View key={priority.priority} className="space-y-2">
                {/* Priority header */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-2">
                    <config.component size={16} />
                    <Text className="text-md text-gray-900 dark:text-white py-3">
                      {config.label}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {priority.completed}/{priority.total}
                  </Text>
                </View>

                {/* Progress bar */}
                <View className="relative">
                  <View className="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                    <View
                      className={`h-full rounded-full ${config.color}`}
                      style={{ width: `${completionRate}%` }}
                    />
                  </View>
                  <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    완료율 {Math.round(completionRate)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
