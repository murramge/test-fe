import React, { useEffect, useState } from 'react';

import { ActivityHeatmap } from '@/components/charts/activity-heatmap';
import { CategoryChart } from '@/components/charts/category-chart';
import { DateFilter, type DateRange } from '@/components/charts/date-filter';
import { PriorityChart } from '@/components/charts/priority-chart';
import { ProductivityMetrics } from '@/components/charts/productivity-metrics';
import { ProductivityPattern } from '@/components/charts/productivity-pattern';
import { ProgressRing } from '@/components/charts/progress-ring';
import { FocusAwareStatusBar, ScrollView, Text, View } from '@/components/ui';
import { ChartBar, ChartLine, Sparkles, Fire, Party, ThumbsUp } from '@/components/ui/icons';
import { SafeAreaView } from 'react-native';
import { useFilteredStats, useTaskStore } from '@/lib/hooks';

export default function Stats() {
  const { loadData } = useTaskStore();
  const [selectedRange, setSelectedRange] = useState<DateRange>('30days');
  const { stats, previousStats, filteredTasks } = useFilteredStats(selectedRange);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2563EB' }}>
      <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
        <FocusAwareStatusBar />

        {/* Header */}
        <View className="bg-blue-600 px-6 pb-8 pt-4">
          <Text className="text-3xl font-bold text-white">
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-white mr-3">
                생산성 대시보드
              </Text>
              <ChartBar color="white" size={28} />
            </View>
          </Text>
          <Text className="mt-2 text-blue-100">
            {getMotivationalMessage()}
          </Text>
        </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: 10,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <ChartLine color="#111827" size={18} />
                    <Text style={{ marginLeft: 6, fontSize: 16, fontWeight: '600', color: '#111827' }}>
                      전체 진행률
                    </Text>
                  </View>
                </Text>
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
                <View style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}>
                  <CategoryChart stats={stats} />
                </View>
              )}

              {/* 우선순위별 분석 */}
              {stats.byPriority.some((p) => p.total > 0) && (
                <View style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 0, // 마지막 요소는 하단 여백 없음
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}>
                  <PriorityChart stats={stats} />
                </View>
              )}
            </>
          ) : (
            /* Empty State */
            <View style={{
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View style={{
                marginBottom: 8,
                width: 60,
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
                backgroundColor: '#3B82F6',
              }}>
                <ChartLine color="white" size={32} />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: 4,
                textAlign: 'center',
              }}>
                {selectedRange === 'all' ? '통계를 보려면 할일을 추가하세요' : '이 기간에는 데이터가 없어요'}
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#6B7280',
                textAlign: 'center',
                lineHeight: 16,
              }}>
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
    </SafeAreaView>
  );
}
