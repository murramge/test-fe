import React from 'react';
import type { Control } from 'react-hook-form';

import { Button, ControlledInput, Text, View } from '@/components/ui';
import type { TaskPriority } from '@/types';

type FormData = {
  title: string;
  description?: string;
  priority: TaskPriority;
  categoryId?: string;
  dueDate?: string;
};

type Props = {
  control: Control<FormData>;
  setValue: (field: keyof FormData, value: any) => void;
  selectedPriority: TaskPriority;
  selectedCategoryId?: string;
  categories: { id: string; name: string; icon?: string }[];
};

export function TaskForm({
  control,
  setValue,
  selectedPriority,
  selectedCategoryId,
  categories,
}: Props) {
  const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: '낮음' },
    { value: 'medium', label: '보통' },
    { value: 'high', label: '높음' },
  ];

  return (
    <View className="space-y-6">
      <ControlledInput
        name="title"
        label="제목"
        control={control}
        placeholder="할일을 입력하세요"
        testID="task-title"
      />

      <ControlledInput
        name="description"
        label="설명 (선택사항)"
        control={control}
        placeholder="상세 설명을 입력하세요"
        multiline
        numberOfLines={4}
        testID="task-description"
      />

      <View>
        <Text className="mb-3 text-base font-medium text-gray-900 dark:text-white">
          우선순위
        </Text>
        <View className="flex-row space-x-3">
          {priorities.map((priority) => (
            <Button
              key={priority.value}
              label={priority.label}
              onPress={() => setValue('priority', priority.value)}
              variant={
                selectedPriority === priority.value ? 'default' : 'outline'
              }
              className="flex-1"
            />
          ))}
        </View>
      </View>

      <View>
        <Text className="mb-3 text-base font-medium text-gray-900 dark:text-white">
          카테고리
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <Button
            label="없음"
            onPress={() => setValue('categoryId', undefined)}
            variant={!selectedCategoryId ? 'default' : 'outline'}
            size="sm"
          />
          {categories.map((category) => (
            <Button
              key={category.id}
              label={`${category.icon} ${category.name}`}
              onPress={() => setValue('categoryId', category.id)}
              variant={
                selectedCategoryId === category.id ? 'default' : 'outline'
              }
              size="sm"
            />
          ))}
        </View>
      </View>

      <ControlledInput
        name="dueDate"
        label="마감일 (선택사항)"
        control={control}
        placeholder="YYYY-MM-DD"
        testID="task-due-date"
      />
    </View>
  );
}
