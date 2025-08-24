import React, { useEffect, useState } from 'react';

import { ActivityHeatmap } from '@/components/charts/activity-heatmap';
import { CategoryChart } from '@/components/charts/category-chart';
import { DateFilter, type DateRange } from '@/components/charts/date-filter';
import { PriorityChart } from '@/components/charts/priority-chart';
import { ProductivityMetrics } from '@/components/charts/productivity-metrics';
import { ProductivityPattern } from '@/components/charts/productivity-pattern';
import { ProgressRing } from '@/components/charts/progress-ring';
import { FocusAwareStatusBar, ScrollView, Text, View, SafeAreaView } from '@/components/ui';
import { ChartBar, ChartLine } from '@/components/ui/icons';
import { useColorScheme } from 'nativewind';
import { Platform, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFilteredStats, useTaskStore } from '@/lib/hooks';
import { colorScheme } from 'nativewind';

export default function Stats() {
  const { loadData } = useTaskStore();
  const [selectedRange, setSelectedRange] = useState<DateRange>('30days');
  const { stats, previousStats, filteredTasks } = useFilteredStats(selectedRange);
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getMotivationalMessage = () => {
    if (stats.total === 0) {
      return selectedRange === 'all' 
        ? '첫 할일을 추가해보세요!'
        : '이 기간에는 할일이 없어요. 새로운 할일을 추가해보세요!';
    }

    const rangeText = {
      '7days': '이번 주',
      '30days': '이번 달',
      '90days': '지난 3개월',
      'all': '전체 기간'
    }[selectedRange];

    if (stats.completionRate >= 80) {
      return `${rangeText} 훌륭한 성과입니다!`;
    } else if (stats.completionRate >= 60) {
      return `${rangeText} 좋은 진전이에요!`;
    } else if (stats.completionRate >= 30) {
      return `${rangeText} 계속 화이팅하세요!`;
    } else {
      return `${rangeText} 조금씩 시작해보세요!`;
    }
  };

  return (
    <SafeAreaView className="flex-1 ">
      <FocusAwareStatusBar />
      
      <View className="flex-1 ">
        {/* Fixed Header with proper SafeArea handling */}
     

        {/* Scrollable Content Area */}
        <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className=" px-6 " 
              style={{ 
                paddingTop: Platform.OS === 'ios' ? 0 : 20,
                minHeight: Platform.OS === 'ios' ? 80 : 100 
              }}>
          <View className="flex-row   mb-2">
          <ChartLine color={colorScheme === 'dark' ? '#ffffff' : '#111827'} size={18} />
          <Text className="text-2xl font-bold text-gray-900 dark:text-white ml-3">
              생산성 대시보드
            </Text>
          </View>
          <Text className=" text-gray-900 dark:text-blue-100 text-base">
            {getMotivationalMessage()}
          </Text>
        </View>
            <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 16 }}>
          {/* 날짜 필터 */}
          <View style={{ marginBottom: 12 }}>
            <DateFilter
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
            />
          </View>

          {stats.total > 0 ? (
            <>
              {/* 생산성 지표 */}
              <View style={{ marginBottom: 12 }}>
                <ProductivityMetrics stats={stats} previousStats={previousStats} />
              </View>

              {/* 활동 히트맵 */}
              {(selectedRange === '7days' || selectedRange === '30days') && (
                <View style={{ marginBottom: 12 }}>
                  <ActivityHeatmap tasks={filteredTasks} dateRange={selectedRange} />
                </View>
              )}

              {/* 전체 진행률 링 */}
              <View className="bg-white dark:bg-neutral-800 rounded-xl p-3 mb-3 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <ChartLine color="#111827" size={18} />
                  <Text className="ml-2 text-base font-semibold text-gray-900 dark:text-white">
                    전체 진행률
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <ProgressRing
                    percentage={stats.completionRate}
                    color="#3B82F6"
                    value={`${stats.completed}/${stats.total}`}
                    label="완료된 할일"
                  />
                </View>
              </View>

              {/* 생산성 패턴 분석 */}
              <View style={{ marginBottom: 12 }}>
                <ProductivityPattern tasks={filteredTasks} />
              </View>

              {/* 카테고리별 분석 */}
              {stats.byCategory.length > 0 && (
                <View className="bg-white dark:bg-neutral-800 rounded-xl p-3 mb-3 shadow-sm">
                  <CategoryChart stats={stats} />
                </View>
              )}

              {/* 우선순위별 분석 */}
              {stats.byPriority.some((p) => p.total > 0) && (
                <View className="bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
                  <PriorityChart stats={stats} />
                </View>
              )}
            </>
          ) : (
            /* Empty State */
            <View className="items-center bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
              <View className="mb-2 w-15 h-15 items-center justify-center rounded-full bg-blue-500">
                <ChartLine color="white" size={32} />
              </View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1 text-center">
                {selectedRange === 'all' ? '통계를 보려면 할일을 추가하세요' : '이 기간에는 데이터가 없어요'}
              </Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400 text-center leading-4">
                {selectedRange === 'all' 
                  ? '할일을 완료할 때마다 여기서 진행 상황을 확인할 수 있습니다'
                  : '다른 기간을 선택하거나 새로운 할일을 추가해보세요'
                }
              </Text>
              </View>
            )}
          </View>
        </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
