import * as React from 'react';
import { Text, View } from 'react-native';
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
    const arrow = isPositive ? '↗️' : '↘️';
    
    return (
      <Text className={`text-xs ${color}`}>
        {arrow} {Math.abs(trend).toFixed(1)}%
      </Text>
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
        <View style={{ 
          flex: 1, 
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
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
              <Text style={{ fontSize: 16 }}>✅</Text>
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 2,
            }}>
              {stats.completed}
            </Text>
            <Text style={{
              fontSize: 10,
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: 2,
            }}>
              완료된 할일
            </Text>
            <TrendIndicator trend={tasksTrend} />
          </View>
        </View>

        <View style={{ 
          flex: 1, 
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
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
              <Text style={{ fontSize: 16 }}>⏳</Text>
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 2,
            }}>
              {stats.pending}
            </Text>
            <Text style={{
              fontSize: 10,
              color: '#6B7280',
              textAlign: 'center',
            }}>
              진행 중
            </Text>
          </View>
        </View>

        <View style={{ 
          flex: 1, 
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
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
              <Text style={{ fontSize: 16 }}>📊</Text>
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 2,
            }}>
              {stats.total}
            </Text>
            <Text style={{
              fontSize: 10,
              color: '#6B7280',
              textAlign: 'center',
            }}>
              전체 할일
            </Text>
          </View>
        </View>
      </View>

      {/* 생산성 인사이트 */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
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
          marginBottom: 8,
        }}>
          💡 생산성 인사이트
        </Text>
        
        <View style={{ gap: 6 }}>
          {stats.byCategory.length > 0 && (
            <View style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 8,
              padding: 8,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: '#111827',
                marginBottom: 2,
              }}>
                가장 활발한 카테고리
              </Text>
              <Text style={{
                fontSize: 10,
                color: '#6B7280',
              }}>
                {stats.byCategory.sort((a, b) => b.completed - a.completed)[0]?.categoryName} (
                {stats.byCategory.sort((a, b) => b.completed - a.completed)[0]?.completed}개 완료)
              </Text>
            </View>
          )}
          
          {stats.byPriority.length > 0 && (
            <View style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 8,
              padding: 8,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: '#111827',
                marginBottom: 2,
              }}>
                우선순위별 완료율
              </Text>
              <Text style={{
                fontSize: 10,
                color: '#6B7280',
              }}>
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
