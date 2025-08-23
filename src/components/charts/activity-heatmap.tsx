import * as React from 'react';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import type { Task } from '@/types';

type Props = {
  tasks: Task[];
  dateRange: '7days' | '30days';
};

export function ActivityHeatmap({ tasks, dateRange }: Props) {
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

  const getIntensityColor = (count: number) => {
    const intensity = count / maxCompleted;
    if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (intensity <= 0.25) return 'bg-blue-200 dark:bg-blue-900';
    if (intensity <= 0.5) return 'bg-blue-400 dark:bg-blue-700';
    if (intensity <= 0.75) return 'bg-blue-500 dark:bg-blue-600';
    return 'bg-blue-600 dark:bg-blue-500';
  };

  return (
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
        📅 활동 히트맵
      </Text>
      
      <Text style={{
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
      }}>
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
              backgroundColor: getIntensityColor(day.completedCount).includes('gray') ? '#F3F4F6' : 
                             getIntensityColor(day.completedCount).includes('blue-200') ? '#DBEAFE' :
                             getIntensityColor(day.completedCount).includes('blue-400') ? '#93C5FD' :
                             getIntensityColor(day.completedCount).includes('blue-500') ? '#60A5FA' : '#3B82F6',
              borderWidth: day.isToday ? 1 : 0,
              borderColor: day.isToday ? '#3B82F6' : 'transparent',
            }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '500',
                color: day.completedCount === 0 ? '#9CA3AF' : 'white',
              }}>
                {day.day}
              </Text>
            </View>
            {dateRange === '7days' && (
              <Text style={{
                marginTop: 2,
                fontSize: 8,
                color: '#6B7280',
              }}>
                {day.weekday}
              </Text>
            )}
            {day.completedCount > 0 && (
              <Text style={{
                marginTop: 1,
                fontSize: 8,
                color: '#6B7280',
              }}>
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
        <Text style={{
          fontSize: 10,
          color: '#6B7280',
        }}>
          적음
        </Text>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#F3F4F6' }} />
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#DBEAFE' }} />
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#93C5FD' }} />
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#60A5FA' }} />
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#3B82F6' }} />
        </View>
        <Text style={{
          fontSize: 10,
          color: '#6B7280',
        }}>
          많음
        </Text>
      </View>
    </View>
  );
}
