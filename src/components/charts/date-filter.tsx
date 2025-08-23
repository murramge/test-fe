import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

export type DateRange = '7days' | '30days' | '90days' | 'all';

type Props = {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
};

export function DateFilter({ selectedRange, onRangeChange }: Props) {
  const filterOptions: { value: DateRange; label: string; emoji: string }[] = [
    { value: '7days', label: '7일', emoji: '📅' },
    { value: '30days', label: '30일', emoji: '📊' },
    { value: '90days', label: '90일', emoji: '📈' },
    { value: 'all', label: '전체', emoji: '🗓️' },
  ];

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 10,
      marginHorizontal: 0,
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
            style={{
              flex: 1,
              alignItems: 'center',
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 10,
              backgroundColor: selectedRange === option.value ? '#3B82F6' : '#F8FAFC',
              borderWidth: selectedRange === option.value ? 0 : 1,
              borderColor: '#E2E8F0',
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 2 }}>{option.emoji}</Text>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: selectedRange === option.value ? 'white' : '#475569',
            }}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
