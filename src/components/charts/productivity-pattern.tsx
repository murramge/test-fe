import * as React from 'react';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { ChartBar, Clock } from '@/components/ui/icons';
import type { Task } from '@/types';

type Props = {
  tasks: Task[];
};

export function ProductivityPattern({ tasks }: Props) {
  const patternData = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completedAt);
    
    // 요일별 분석
    const weekdayStats = {
      일: 0, 월: 0, 화: 0, 수: 0, 목: 0, 금: 0, 토: 0
    };
    
    // 시간대별 분석 (4시간 간격)
    const timeSlots = {
      '새벽 (00-06)': 0,
      '오전 (06-12)': 0,
      '오후 (12-18)': 0,
      '저녁 (18-24)': 0,
    };

    completedTasks.forEach(task => {
      if (task.completedAt) {
        const date = new Date(task.completedAt);
        const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
        const hour = date.getHours();
        
        // 요일별 집계
        if (weekday in weekdayStats) {
          weekdayStats[weekday as keyof typeof weekdayStats]++;
        }
        
        // 시간대별 집계
        if (hour >= 0 && hour < 6) timeSlots['새벽 (00-06)']++;
        else if (hour >= 6 && hour < 12) timeSlots['오전 (06-12)']++;
        else if (hour >= 12 && hour < 18) timeSlots['오후 (12-18)']++;
        else timeSlots['저녁 (18-24)']++;
      }
    });

    const maxWeekday = Math.max(...Object.values(weekdayStats));
    const maxTimeSlot = Math.max(...Object.values(timeSlots));

    return {
      weekdays: Object.entries(weekdayStats).map(([day, count]) => ({
        day,
        count,
        percentage: maxWeekday > 0 ? (count / maxWeekday) * 100 : 0,
      })),
      timeSlots: Object.entries(timeSlots).map(([slot, count]) => ({
        slot,
        count,
        percentage: maxTimeSlot > 0 ? (count / maxTimeSlot) * 100 : 0,
      })),
    };
  }, [tasks]);

  const getMostProductiveDay = () => {
    const sorted = [...patternData.weekdays].sort((a, b) => b.count - a.count);
    return sorted[0]?.day || '데이터 없음';
  };

  const getMostProductiveTime = () => {
    const sorted = [...patternData.timeSlots].sort((a, b) => b.count - a.count);
    return sorted[0]?.slot || '데이터 없음';
  };

  return (
    <View style={{ gap: 10 }}>
      {/* 생산성 패턴 요약 */}
      <View style={{
        backgroundColor: '#10B981',
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <ChartBar color="white" size={18} />
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: 'white',
            marginLeft: 6,
          }}>
            나의 생산성 패턴
          </Text>
        </View>
        <View style={{ marginTop: 6, gap: 2 }}>
          <Text style={{
            fontSize: 12,
            color: 'white',
            opacity: 0.9,
          }}>
            가장 생산적인 요일: <Text style={{ fontWeight: '600' }}>{getMostProductiveDay()}</Text>
          </Text>
          <Text style={{
            fontSize: 12,
            color: 'white',
            opacity: 0.9,
          }}>
            가장 생산적인 시간: <Text style={{ fontWeight: '600' }}>{getMostProductiveTime()}</Text>
          </Text>
        </View>
      </View>

      {/* 요일별 분석 */}
      <View className="bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <ChartBar color="#111827" size={18} />
          <Text className="ml-2 text-base font-semibold text-gray-900 dark:text-white">
            요일별 완료 패턴
          </Text>
        </View>
        
        <View style={{ gap: 6 }}>
          {patternData.weekdays.map((item) => (
            <View key={item.day} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text className="w-6 text-xs font-medium text-gray-700 dark:text-gray-300">
                {item.day}
              </Text>
              <View style={{ flex: 1, marginHorizontal: 8 }}>
                <View className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <View 
                    className="h-1.5 bg-blue-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </View>
              </View>
              <Text className="w-6 text-xs text-gray-600 dark:text-gray-400 text-right">
                {item.count}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 시간대별 분석 */}
      <View className="bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <Clock color="#6366f1" size={16} />
          <Text className="text-base font-semibold text-gray-900 dark:text-white ml-2">
            시간대별 완료 패턴
          </Text>
        </View>
        
        <View style={{ gap: 6 }}>
          {patternData.timeSlots.map((item) => (
            <View key={item.slot} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text className="w-15 text-xs font-medium text-gray-700 dark:text-gray-300">
                {item.slot}
              </Text>
              <View style={{ flex: 1, marginHorizontal: 8 }}>
                <View className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <View 
                    className="h-1.5 bg-green-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </View>
              </View>
              <Text className="w-6 text-xs text-gray-600 dark:text-gray-400 text-right">
                {item.count}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
