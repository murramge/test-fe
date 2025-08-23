import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';

import { TaskForm } from '@/components/task/task-form';
import { Button, FocusAwareStatusBar, ScrollView, Text, View } from '@/components/ui';
import { useCategories, useTaskStore } from '@/lib/hooks';
import { taskFormSchema, type TaskFormType } from '@/lib/validation/task-schemas';

export default function EditTask() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  const { tasks, updateTask } = useTaskStore();
  const { categories } = useCategories();

  // 수정할 태스크 찾기
  const taskToEdit = tasks.find(task => task.id === taskId);

  const { control, handleSubmit, setValue, watch, reset } = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      categoryId: undefined,
      dueDate: '',
    },
  });

  // 태스크 데이터로 폼 초기화
  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        categoryId: taskToEdit.categoryId,
        dueDate: taskToEdit.dueDate || '',
      });
    }
  }, [taskToEdit, reset]);

  const selectedPriority = watch('priority');
  const selectedCategoryId = watch('categoryId');

  const onSubmit = (data: TaskFormType) => {
    if (!taskToEdit) {
      showMessage({
        message: '수정할 할일을 찾을 수 없습니다',
        type: 'danger',
      });
      return;
    }

    updateTask(taskToEdit.id, {
      title: data.title,
      description: data.description,
      priority: data.priority,
      categoryId: data.categoryId,
      dueDate: data.dueDate,
      updatedAt: new Date().toISOString(),
    });

    showMessage({
      message: '할일이 수정되었습니다! ✅',
      type: 'success',
    });

    router.back();
  };

  // 태스크를 찾을 수 없는 경우
  if (!taskToEdit) {
    return (
      <>
        <Stack.Screen
          options={{
            title: '할일 수정',
            headerShown: true,
            headerBackTitle: '뒤로',
          }}
        />
        <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            수정할 할일을 찾을 수 없습니다.
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '할일 수정',
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
            categories={categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon,
              color: cat.color
            }))}
          />

          <Button
            label="할일 수정"
            onPress={handleSubmit(onSubmit)}
            className="mt-6"
            testID="edit-task-button"
          />
        </View>
      </ScrollView>
    </>
  );
}
