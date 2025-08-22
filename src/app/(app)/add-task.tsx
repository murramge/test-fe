import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import {
  Button,
  ControlledInput,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { useCategories, useTaskStore } from '@/lib/hooks';
import type { TaskPriority } from '@/types';

const schema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  categoryId: z.string().optional(),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddTask() {
  const router = useRouter();
  const { addTask } = useTaskStore();
  const { categories } = useCategories();

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const selectedPriority = watch('priority');
  const selectedCategoryId = watch('categoryId');

  const onSubmit = (data: FormData) => {
    addTask({
      title: data.title,
      description: data.description,
      priority: data.priority,
      categoryId: data.categoryId,
      dueDate: data.dueDate,
      status: 'pending',
    });

    showMessage({
      message: '할일이 추가되었습니다',
      type: 'success',
    });

    router.back();
  };

  const priorities: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: '낮음', color: 'bg-green-500' },
    { value: 'medium', label: '보통', color: 'bg-yellow-500' },
    { value: 'high', label: '높음', color: 'bg-red-500' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: '할일 추가',
          headerShown: true,
          headerBackTitle: '뒤로',
        }}
      />
      <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
        <FocusAwareStatusBar />

        <View className="p-4">
          {/* Title Input */}
          <ControlledInput
            name="title"
            label="제목"
            control={control}
            placeholder="할일을 입력하세요"
            testID="task-title"
          />

          {/* Description Input */}
          <ControlledInput
            name="description"
            label="설명 (선택사항)"
            control={control}
            placeholder="상세 설명을 입력하세요"
            multiline
            numberOfLines={4}
            testID="task-description"
          />

          {/* Priority Selection */}
          <View className="mb-6">
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

          {/* Category Selection */}
          <View className="mb-6">
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

          {/* Due Date Input */}
          <ControlledInput
            name="dueDate"
            label="마감일 (선택사항)"
            control={control}
            placeholder="YYYY-MM-DD"
            testID="task-due-date"
          />

          {/* Submit Button */}
          <Button
            label="할일 추가"
            onPress={handleSubmit(onSubmit)}
            className="mt-6"
            testID="add-task-button"
          />
        </View>
      </ScrollView>
    </>
  );
}
