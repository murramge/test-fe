import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';

import { TaskForm } from '@/components/task/task-form';
import { Button, FocusAwareStatusBar, ScrollView, Text, View } from '@/components/ui';
import { useCategories, useTaskStore } from '@/lib/hooks';
import { taskFormSchema, type TaskFormType } from '@/lib/validation/task-schemas';

export default function AddTask() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const { addTask } = useTaskStore();
  const { categories } = useCategories();

  const { control, handleSubmit, setValue, watch } = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      priority: 'medium',
      status: 'pending',
      categoryId: undefined, // 기본적으로는 카테고리 선택 안함
    },
  });

  // URL 파라미터로 카테고리가 전달된 경우 자동 선택
  useEffect(() => {
    if (categoryId && typeof categoryId === 'string') {
      setValue('categoryId', categoryId);
    }
  }, [categoryId, setValue]);

  const selectedPriority = watch('priority');
  const selectedCategoryId = watch('categoryId');
  
  // 선택된 카테고리 정보
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

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

    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: (selectedCategory && categoryId) ? `${selectedCategory.name}에 할일 추가` : '할일 추가',
          headerShown: true,
          headerBackTitle: '뒤로',
        }}
      />
      <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
        <FocusAwareStatusBar />

        <View className="p-4">
          {/* 카테고리 미리 선택 알림 - 메인에서 온 경우에만 */}
          {selectedCategory && categoryId && (
            <View className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <View className="flex-row items-center">
                <Text className="text-lg">{selectedCategory.icon}</Text>
                <Text className="ml-2 font-medium text-blue-800 dark:text-blue-200">
                  "{selectedCategory.name}" 카테고리에 할일을 추가합니다
                </Text>
              </View>
              <Text className="mt-1 text-sm text-blue-600 dark:text-blue-300">
                필요시 아래에서 다른 카테고리로 변경할 수 있습니다.
              </Text>
            </View>
          )}

          <TaskForm
            control={control}
            setValue={setValue}
            selectedPriority={selectedPriority}
            selectedCategoryId={selectedCategoryId}
            categories={categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon,
              color: cat.color
            }))}
          />

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
