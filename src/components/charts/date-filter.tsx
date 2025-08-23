import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar, ChartBar, ChartLine } from '@/components/ui/icons';

export type DateRange = '7days' | '30days' | '90days' | 'all';

type Props = {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
};

export function DateFilter({ selectedRange, onRangeChange }: Props) {
  const filterOptions: { value: DateRange; label: string; icon: React.ComponentType<{color?: string; size?: number}> }[] = [
    { value: '7days', label: '7일', icon: Calendar },
    { value: '30days', label: '30일', icon: ChartBar },
    { value: '90days', label: '90일', icon: ChartLine },
    { value: 'all', label: '전체', icon: Calendar },
  ];

  return (
    <View className="bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm">
      <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
        기간 선택
      </Text>
      
      <View style={{ 
        flexDirection: 'row', 
        gap: 6,
      }}>
        {filterOptions.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onRangeChange(option.value)}
            className={`flex-1 items-center rounded-lg px-2 py-2.5 ${
              selectedRange === option.value 
                ? 'bg-blue-500' 
                : 'bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600'
            }`}
          >
            <option.icon 
              color={selectedRange === option.value ? 'white' : '#6B7280'} 
              size={18} 
            />
            <Text className={`text-xs font-semibold mt-1 ${
              selectedRange === option.value 
                ? 'text-white' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
