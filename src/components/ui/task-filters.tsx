import * as React from 'react';

import { Button, Text, View } from '@/components/ui';
import type { TaskFilters, TaskPriority, TaskStatus } from '@/types';

type Props = {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  categories: { id: string; name: string; icon?: string }[];
};

export function TaskFiltersComponent({
  filters,
  onFiltersChange,
  categories,
}: Props) {
  const statusOptions: { value: TaskStatus; label: string; color: string }[] = [

    { value: 'pending', label: '진행중', color: 'bg-orange-500' },
    { value: 'completed', label: '완료', color: 'bg-green-500' },
    { value: 'cancelled', label: '취소', color: 'bg-gray-500' },
  ];

  const priorityOptions: {
    value: TaskPriority;
    label: string;
    emoji: string;
  }[] = [
    { value: 'high', label: '높음', emoji: '🔴' },
    { value: 'medium', label: '보통', emoji: '🟡' },
    { value: 'low', label: '낮음', emoji: '🟢' },
  ];

  const toggleStatus = (status: TaskStatus) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter((s) => s !== status)
      : [...currentStatus, status];

    onFiltersChange({ ...filters, status: newStatus });
  };

  const togglePriority = (priority: TaskPriority) => {
    const currentPriority = filters.priority || [];
    const newPriority = currentPriority.includes(priority)
      ? currentPriority.filter((p) => p !== priority)
      : [...currentPriority, priority];

    onFiltersChange({ ...filters, priority: newPriority });
  };

  const selectCategory = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.status?.length || filters.priority?.length || filters.categoryId;

  return (
    <View className="space-y-4 rounded-lg bg-white p-4 dark:bg-neutral-800">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          필터
        </Text>
        {hasActiveFilters && (
          <Button
            label="초기화"
            variant="ghost"
            size="sm"
            onPress={clearFilters}
          />
        )}
      </View>

      {/* Status Filter */}
      <View className="space-y-2">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
          상태
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              label={option.label}
              size="sm"
              variant={
                filters.status?.includes(option.value) ? 'default' : 'outline'
              }
              onPress={() => toggleStatus(option.value)}
            />
          ))}
        </View>
      </View>

      {/* Priority Filter */}
      <View className="space-y-2">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
          우선순위
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              label={`${option.emoji} ${option.label}`}
              size="sm"
              variant={
                filters.priority?.includes(option.value) ? 'default' : 'outline'
              }
              onPress={() => togglePriority(option.value)}
            />
          ))}
        </View>
      </View>

      {/* Category Filter */}
      {categories.length > 0 && (
        <View className="space-y-2">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            카테고리
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                label={`${category.icon || '📁'} ${category.name}`}
                size="sm"
                variant={
                  filters.categoryId === category.id ? 'default' : 'outline'
                }
                onPress={() => selectCategory(category.id)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
