import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { TaskForm } from '@/components/task/task-form';
import { Button, FocusAwareStatusBar, ScrollView, View } from '@/components/ui';
import { useCategories, useTaskStore } from '@/lib/hooks';

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
