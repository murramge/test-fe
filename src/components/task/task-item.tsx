import * as React from 'react';
import { Pressable } from 'react-native';

import { SwipeActions, Text, View } from '@/components/ui';
import type { TaskWithCategory } from '@/types';

type Props = {
  task: TaskWithCategory;
  onPress?: () => void;
  onToggleStatus?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function TaskItem({
  task,
  onPress,
  onToggleStatus,
  onEdit,
  onDelete,
}: Props) {
  const isCompleted = task.status === 'completed';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const swipeActions = {
    left: [
      {
        label: '완료',
        onPress: () => onToggleStatus?.(),
        backgroundColor: '#10B981',
        icon: '✓',
      },
    ],
    right: [
      ...(onEdit
        ? [
            {
              label: '편집',
              onPress: () => onEdit(),
              backgroundColor: '#3B82F6',
              icon: '✏️',
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              label: '삭제',
              onPress: () => onDelete(),
              backgroundColor: '#EF4444',
              icon: '🗑️',
            },
          ]
        : []),
    ],
  };

  return (
    <SwipeActions
      leftActions={task.status !== 'completed' ? swipeActions.left : []}
      rightActions={swipeActions.right}
    >
      <Pressable onPress={onPress}>
        <View className="mb-3 rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
          <View className="flex-row items-start justify-between">
            {/* Task content */}
            <View className="flex-1 pr-3">
              {/* Title and status */}
              <View className="flex-row items-center">
                <Pressable
                  onPress={onToggleStatus}
                  className={`mr-3 size-5 rounded-full border-2 ${
                    isCompleted
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isCompleted && (
                    <Text className="text-center text-xs text-white">✓</Text>
                  )}
                </Pressable>

                <Text
                  className={`flex-1 text-base font-medium ${
                    isCompleted
                      ? 'text-gray-500 line-through dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </Text>
              </View>

              {/* Description */}
              {task.description && (
                <Text
                  className={`ml-8 mt-1 text-sm ${
                    isCompleted
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {task.description}
                </Text>
              )}

              {/* Meta info */}
              <View className="ml-8 mt-2 flex-row items-center">
                {/* Priority indicator */}
                <View
                  className={`mr-2 size-2 rounded-full ${getPriorityColor(
                    task.priority
                  )}`}
                />

                {/* Category */}
                {task.category && (
                  <View className="mr-3 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700">
                    <Text className="text-xs text-gray-600 dark:text-gray-300">
                      {task.category.icon} {task.category.name}
                    </Text>
                  </View>
                )}

                {/* Due date */}
                {task.dueDate && (
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(task.dueDate)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </SwipeActions>
  );
}
