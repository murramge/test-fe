import { FlashList } from '@shopify/flash-list';
import * as React from 'react';

import { EmptyList, Text, View } from '@/components/ui';
import { Document } from '@/components/ui/icons';
import type { TaskFilters, TaskWithCategory } from '@/types';

import { TaskItem } from './task-item';

type Props = {
  tasks: TaskWithCategory[];
  isLoading?: boolean;
  filters?: TaskFilters;
  onTaskPress?: (task: TaskWithCategory) => void;
  onToggleTaskStatus?: (taskId: string) => void;
};

export function TaskList({
  tasks,
  isLoading = false,
  onTaskPress,
  onToggleTaskStatus,
}: Props) {
  const renderItem = React.useCallback(
    ({ item }: { item: TaskWithCategory }) => (
      <TaskItem
        task={item}
        onPress={() => onTaskPress?.(item)}
        onToggleStatus={() => onToggleTaskStatus?.(item.id)}
      />
    ),
    [onTaskPress, onToggleTaskStatus]
  );

  const EmptyComponent = React.useCallback(() => {
    if (isLoading) {
      return <EmptyList isLoading={true} />;
    }

    return (
      <View className="flex-1 items-center justify-center p-8">
        <Document color="#9CA3AF" size={72} />
        <Text className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          할일이 없습니다
        </Text>
        <Text className="mt-2 text-center text-gray-600 dark:text-gray-400">
          새로운 할일을 추가해보세요
        </Text>
      </View>
    );
  }, [isLoading]);

  return (
    <FlashList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={EmptyComponent}
      estimatedItemSize={140}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      className="flex-1"
    />
  );
}
