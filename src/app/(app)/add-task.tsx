import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';

import { TaskForm } from '@/components/task/task-form';
import { Button, FocusAwareStatusBar, ScrollView, View } from '@/components/ui';
import { useCategories, useTaskStore } from '@/lib/hooks';
import { taskFormSchema, type TaskFormType } from '@/lib/validation/task-schemas';

export default function AddTask() {
  const router = useRouter();
  const { addTask } = useTaskStore();
  const { categories } = useCategories();

  const { control, handleSubmit, setValue, watch } = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      priority: 'medium',
      status: 'todo',
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
      status: data.status,
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
          title: '할일 추가',
          headerShown: true,
          headerBackTitle: '뒤로',
        }}
      />
      <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
        <FocusAwareStatusBar />

        <View className="p-4">
          <TaskForm
            control={control}
            setValue={setValue}
            selectedPriority={selectedPriority}
            selectedCategoryId={selectedCategoryId}
            categories={categories}
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
