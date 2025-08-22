import * as React from 'react';

import { Text, View } from '@/components/ui';
import type { TaskStats } from '@/types';

type Props = {
  stats: TaskStats;
};

export function CategoryChart({ stats }: Props) {
  const maxTotal = Math.max(...stats.byCategory.map((cat) => cat.total), 1);

  return (
    <View className="space-y-3">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
        카테고리별 현황
      </Text>

      {stats.byCategory.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-500 dark:text-gray-400">
            아직 카테고리별 데이터가 없습니다
          </Text>
        </View>
      ) : (
        <View className="space-y-3">
          {stats.byCategory.map((category) => {
            const completionRate =
              category.total > 0
                ? (category.completed / category.total) * 100
                : 0;
            const widthPercentage = (category.total / maxTotal) * 100;

            return (
              <View key={category.categoryId} className="space-y-2">
                {/* Category header */}
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-900 dark:text-white">
                    {category.categoryName}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {category.completed}/{category.total}
                  </Text>
                </View>

                {/* Progress bar */}
                <View className="relative">
                  <View
                    className="h-3 rounded-full bg-gray-200 dark:bg-gray-700"
                    style={{ width: `${Math.max(widthPercentage, 20)}%` }}
                  >
                    <View
                      className="h-full rounded-full bg-blue-500"
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
