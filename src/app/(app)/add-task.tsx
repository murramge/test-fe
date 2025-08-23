import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';

import { TaskForm } from '@/components/task/task-form';
import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { useCategories, useTaskStore } from '@/lib/hooks';
import { taskFormSchema, type TaskFormType } from '@/lib/validation/task-schemas';

export default function AddTask() {
  const router = useRouter();
  const { addTask } = useTaskStore();
  const { categories } = useCategories();

  const { control, handleSubmit, setValue, watch, reset } = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      priority: 'medium',
      status: 'pending',
      categoryId: undefined,
    },
  });

  const selectedPriority = watch('priority');
  const selectedCategoryId = watch('categoryId');

  const onSubmit = (data: TaskFormType) => {
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

    // 폼 리셋
    reset();
    
    // 홈 화면으로 이동
    router.push('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar />
      
      {/* 헤더 */}
      <View className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-neutral-900">
        <Text className="text-center text-lg font-bold text-gray-900 dark:text-white">
          할일 추가
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <TaskForm
            control={control}
            setValue={setValue}
            watch={watch}
            selectedPriority={selectedPriority}
            selectedCategoryId={selectedCategoryId}
            categories={categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon,
              color: cat.color
            }))}
          />

          <View className="mt-8 flex-row space-x-2 gap-2">
            <Button
              label="취소"
              variant="outline"
              onPress={() => router.push('/')}
              className="flex-1"
              testID="cancel-button"
            />
            <Button
              label="추가"
              onPress={handleSubmit(onSubmit)}
              className="flex-1"
              testID="add-task-button"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
