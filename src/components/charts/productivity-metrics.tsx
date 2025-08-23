import * as React from 'react';
import { Text, View } from 'react-native';
import { TrendUp, TrendDown, Check, Clock, Chart, Lightbulb } from '@/components/ui/icons';
import type { TaskStats } from '@/types';

type Props = {
  stats: TaskStats;
  previousStats?: TaskStats;
};

export function ProductivityMetrics({ stats, previousStats }: Props) {
  const calculateTrend = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const completionTrend = calculateTrend(stats.completionRate, previousStats?.completionRate);
  const tasksTrend = calculateTrend(stats.completed, previousStats?.completed);

  const TrendIndicator = ({ trend }: { trend: number | null }) => {
    if (trend === null) return null;
    
    const isPositive = trend > 0;
    const color = isPositive ? 'text-green-500' : 'text-red-500';
    const ArrowComponent = isPositive ? TrendUp : TrendDown;
    
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ArrowComponent color={isPositive ? '#10b981' : '#ef4444'} size={12} />
        <Text style={{ 
          marginLeft: 4, 
          fontSize: 12, 
          color: isPositive ? '#10b981' : '#ef4444' 
        }}>
          {Math.abs(trend).toFixed(1)}%
        </Text>
      </View>
    );
  };

  return (
    <View style={{ gap: 10 }}>
      {/* 주요 지표 */}
      <View style={{
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: 'white',
          opacity: 0.9,
        }}>
          이번 주 생산성 지수
        </Text>
        <View style={{ 
          marginTop: 4, 
          flexDirection: 'row', 
          alignItems: 'flex-end' 
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
          }}>
            {Math.round(stats.completionRate)}
          </Text>
          <Text style={{
            marginLeft: 2,
            fontSize: 16,
            color: 'white',
            opacity: 0.75,
          }}>%</Text>
          <View style={{ marginLeft: 6 }}>
            <TrendIndicator trend={completionTrend} />
          </View>
        </View>
        <Text style={{
          marginTop: 2,
          fontSize: 12,
          color: 'white',
          opacity: 0.75,
        }}>
          완료율 기준
        </Text>
      </View>

      {/* 세부 지표들 */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View className="flex-1 bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
          <View style={{ alignItems: 'center' }}>
            <View style={{
              marginBottom: 6,
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              backgroundColor: '#DCFCE7',
            }}>
              <Check color="#16a34a" size={16} />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {stats.completed}
            </Text>
            <Text className="text-xs text-gray-600 dark:text-gray-400 text-center mb-1">
              완료된 할일
            </Text>
            <TrendIndicator trend={tasksTrend} />
          </View>
        </View>

        <View className="flex-1 bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
          <View style={{ alignItems: 'center' }}>
            <View style={{
              marginBottom: 6,
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              backgroundColor: '#FED7AA',
            }}>
              <Clock color="#ea580c" size={16} />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {stats.pending}
            </Text>
            <Text className="text-xs text-gray-600 dark:text-gray-400 text-center">
              진행 중
            </Text>
          </View>
        </View>

        <View className="flex-1 bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
          <View style={{ alignItems: 'center' }}>
            <View style={{
              marginBottom: 6,
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              backgroundColor: '#DBEAFE',
            }}>
              <Chart color="#2563eb" size={16} />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {stats.total}
            </Text>
            <Text className="text-xs text-gray-600 dark:text-gray-400 text-center">
              전체 할일
            </Text>
          </View>
        </View>
      </View>

      {/* 생산성 인사이트 */}
      <View className="bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <Lightbulb color="#eab308" size={16} />
          <Text className="text-base font-semibold text-gray-900 dark:text-white ml-2">
            생산성 인사이트
          </Text>
        </View>
        
        <View style={{ gap: 6 }}>
          {stats.byCategory.length > 0 && (
            <View className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-2">
              <Text className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                가장 활발한 카테고리
              </Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                {stats.byCategory.sort((a, b) => b.completed - a.completed)[0]?.categoryName} (
                {stats.byCategory.sort((a, b) => b.completed - a.completed)[0]?.completed}개 완료)
              </Text>
            </View>
          )}
          
          {stats.byPriority.length > 0 && (
            <View className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-2">
              <Text className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                우선순위별 완료율
              </Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                높음: {stats.byPriority.find(p => p.priority === 'high')?.completed || 0}개, 
                보통: {stats.byPriority.find(p => p.priority === 'medium')?.completed || 0}개, 
                낮음: {stats.byPriority.find(p => p.priority === 'low')?.completed || 0}개
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
