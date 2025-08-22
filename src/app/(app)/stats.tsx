import React, { useEffect } from 'react';

import { CategoryChart } from '@/components/charts/category-chart';
import { PriorityChart } from '@/components/charts/priority-chart';
import { ProgressRing } from '@/components/charts/progress-ring';
import { StatsCard } from '@/components/charts/stats-card';
import { FocusAwareStatusBar, ScrollView, Text, View } from '@/components/ui';
import { useTaskStats, useTaskStore } from '@/lib/hooks';

export default function Stats() {
  const { loadData } = useTaskStore();
  const stats = useTaskStats();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getMotivationalMessage = () => {
    if (stats.total === 0) {
      return '첫 할일을 추가해보세요! 💪';
    }

    if (stats.completionRate >= 80) {
      return '훌륭한 성과입니다! 🎉';
    } else if (stats.completionRate >= 60) {
      return '좋은 진전이에요! 👍';
    } else if (stats.completionRate >= 30) {
      return '계속 화이팅하세요! 🔥';
    } else {
      return '조금씩 시작해보세요! 🌟';
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />

      {/* Header */}
      <View className="bg-white px-4 pb-6 pt-12 dark:bg-neutral-800">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          생산성 통계 📊
        </Text>
        <Text className="mt-1 text-gray-600 dark:text-gray-400">
          {getMotivationalMessage()}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="space-y-6 p-4">
          {/* Overview Stats */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <StatsCard
                title="완료율"
                value={`${Math.round(stats.completionRate)}%`}
                color="bg-green-500"
                icon="✅"
              />
            </View>
            <View className="flex-1">
              <StatsCard
                title="전체 할일"
                value={stats.total}
                subtitle={`완료: ${stats.completed}개`}
                color="bg-blue-500"
                icon="📝"
              />
            </View>
          </View>

          {/* Progress Ring */}
          <View className="rounded-lg bg-white p-6 dark:bg-neutral-800">
            <Text className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              전체 진행률
            </Text>
            <View className="items-center">
              <ProgressRing
                percentage={stats.completionRate}
                color="#10B981"
                value={`${stats.completed}/${stats.total}`}
                label="완료된 할일"
              />
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <StatsCard
                title="진행 중"
                value={stats.pending}
                color="bg-orange-500"
                icon="⏳"
              />
            </View>
            <View className="flex-1">
              <StatsCard
                title="취소됨"
                value={stats.cancelled}
                color="bg-gray-500"
                icon="❌"
              />
            </View>
          </View>

          {/* Category Chart */}
          {stats.byCategory.length > 0 && (
            <View className="rounded-lg bg-white p-4 dark:bg-neutral-800">
              <CategoryChart stats={stats} />
            </View>
          )}

          {/* Priority Chart */}
          {stats.byPriority.some((p) => p.total > 0) && (
            <View className="rounded-lg bg-white p-4 dark:bg-neutral-800">
              <PriorityChart stats={stats} />
            </View>
          )}

          {/* Empty State */}
          {stats.total === 0 && (
            <View className="items-center rounded-lg bg-white p-8 dark:bg-neutral-800">
              <View className="mb-4 size-16 items-center justify-center rounded-2xl bg-blue-500">
                <Text className="text-2xl">📈</Text>
              </View>
              <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                통계를 보려면 할일을 추가하세요
              </Text>
              <Text className="text-center text-gray-600 dark:text-gray-400">
                할일을 완료할 때마다 여기서 진행 상황을 확인할 수 있습니다
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
