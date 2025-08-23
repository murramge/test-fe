import * as React from 'react';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { Calendar } from '@/components/ui/icons';
import type { Task } from '@/types';

type Props = {
  tasks: Task[];
  dateRange: '7days' | '30days';
};

export function ActivityHeatmap({ tasks, dateRange }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const activityData = useMemo(() => {
    const days = dateRange === '7days' ? 7 : 30;
    const today = new Date();
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayTasks = tasks.filter(task => {
        if (task.completedAt) {
          const completedDate = new Date(task.completedAt).toISOString().split('T')[0];
          return completedDate === dateStr;
        }
        return false;
      });

      data.push({
        date: dateStr,
        day: date.getDate(),
        weekday: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        completedCount: dayTasks.length,
        isToday: dateStr === today.toISOString().split('T')[0],
      });
    }

    return data;
  }, [tasks, dateRange]);

  const maxCompleted = Math.max(...activityData.map(d => d.completedCount), 1);

  const getIntensityColor = (count: number, isDark = false) => {
    const intensity = count / maxCompleted;
    if (count === 0) return isDark ? '#374151' : '#F3F4F6'; // gray-700 : gray-100
    if (intensity <= 0.25) return isDark ? '#1e3a8a' : '#DBEAFE'; // blue-900 : blue-200
    if (intensity <= 0.5) return isDark ? '#1d4ed8' : '#93C5FD'; // blue-700 : blue-400
    if (intensity <= 0.75) return isDark ? '#2563eb' : '#60A5FA'; // blue-600 : blue-500
    return isDark ? '#3b82f6' : '#3B82F6'; // blue-500 : blue-600
  };

  return (
    <View className="bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Calendar color="#6366f1" size={16} />
        <Text className="text-base font-semibold text-gray-900 dark:text-white ml-2">
          활동 히트맵
        </Text>
      </View>
      
      <Text className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        지난 {dateRange === '7days' ? '7일' : '30일'}간 완료한 할일 수
      </Text>

      <View style={{ 
        gap: 4, 
        flexDirection: 'row',
        flexWrap: dateRange === '30days' ? 'wrap' : 'nowrap'
      }}>
        {activityData.map((day, index) => (
          <View key={day.date} style={{ alignItems: 'center' }}>
            <View style={{
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              backgroundColor: getIntensityColor(day.completedCount, isDark),
              borderWidth: day.isToday ? 1 : 0,
              borderColor: day.isToday ? '#3B82F6' : 'transparent',
            }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '500',
                color: day.completedCount === 0 ? (isDark ? '#9CA3AF' : '#6B7280') : 'white',
              }}>
                {day.day}
              </Text>
            </View>
            {dateRange === '7days' && (
              <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {day.weekday}
              </Text>
            )}
            {day.completedCount > 0 && (
              <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {day.completedCount}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* 범례 */}
      <View style={{
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          적음
        </Text>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: getIntensityColor(0, isDark) }} />
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: getIntensityColor(0.2 * maxCompleted, isDark) }} />
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: getIntensityColor(0.4 * maxCompleted, isDark) }} />
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: getIntensityColor(0.7 * maxCompleted, isDark) }} />
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: getIntensityColor(maxCompleted, isDark) }} />
        </View>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          많음
        </Text>
      </View>
    </View>
  );
}
