import React, { useState } from 'react';
import type { Control } from 'react-hook-form';
import { Alert, TextInput } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { Button, CategoryManagementModal, ControlledInput, Modal, Text, View, useModal } from '@/components/ui';
import { useCategories } from '@/lib/hooks';
import type { TaskPriority } from '@/types';

import type { TaskFormType } from '@/lib/validation/task-schemas';

type FormData = TaskFormType;

type Props = {
  control: Control<FormData>;
  setValue: (field: keyof FormData, value: any) => void;
  selectedPriority: TaskPriority;
  selectedCategoryId?: string;
  categories: { id: string; name: string; icon?: string; color?: string }[];
};

export function TaskForm({
  control,
  setValue,
  selectedPriority,
  selectedCategoryId,
  categories,
}: Props) {
  const { addCategory } = useCategories();
  const addCategoryModal = useModal();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: '낮음' },
    { value: 'medium', label: '보통' },
    { value: 'high', label: '높음' },
  ];

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('알림', '카테고리 이름을 입력해주세요');
      return;
    }

    // 카테고리 아이콘과 색상 랜덤 선택
    const businessIcons = ['💼', '📊', '🎯', '⚡', '🔥', '📈', '🚀', '💡', '⭐', '🏆'];
    const businessColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    
    const randomIcon = businessIcons[Math.floor(Math.random() * businessIcons.length)];
    const randomColor = businessColors[Math.floor(Math.random() * businessColors.length)];

    addCategory({
      name: newCategoryName.trim(),
      icon: randomIcon,
      color: randomColor,
    });

    setNewCategoryName('');
    addCategoryModal.dismiss();

    showMessage({
      message: `카테고리 "${newCategoryName.trim()}"이 추가되었습니다 ✅`,
      type: 'success',
      duration: 2000,
    });
  };

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
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-base font-medium text-gray-900 dark:text-white">
            카테고리
          </Text>
          {categories.length > 0 && (
            <Button
              label="관리"
              variant="ghost"
              size="sm"
              onPress={() => setShowCategoryManagement(true)}
            />
          )}
        </View>
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
          <Button
            label="+ 새 카테고리"
            onPress={addCategoryModal.present}
            variant="outline"
            size="sm"
            className="border-dashed border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
          />
        </View>
      </View>

      <ControlledInput
        name="dueDate"
        label="마감일 (선택사항)"
        control={control}
        placeholder="YYYY-MM-DD"
        testID="task-due-date"
      />

      {/* 카테고리 추가 모달 */}
      <Modal
        ref={addCategoryModal.ref}
        title="새 카테고리 추가"
        snapPoints={['40%']}
      >
        <View className="space-y-4 p-4">
          <TextInput
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholder="카테고리 이름 (예: 중요 프로젝트, 개인 개발)"
            placeholderTextColor="#9CA3AF"
            className="rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            autoFocus
          />

          <Text className="text-sm text-gray-500 dark:text-gray-400">
            💡 팁: 업무별, 프로젝트별, 우선순위별로 카테고리를 만들어보세요
          </Text>

          <View className="flex-row space-x-3">
            <Button
              label="추가하기"
              onPress={handleAddCategory}
              className="flex-1"
              size="sm"
            />
            <Button
              label="취소"
              variant="outline"
              onPress={() => {
                addCategoryModal.dismiss();
                setNewCategoryName('');
              }}
              className="flex-1"
              size="sm"
            />
          </View>
        </View>
      </Modal>

      {/* 카테고리 관리 모달 */}
      <CategoryManagementModal
        isVisible={showCategoryManagement}
        onClose={() => setShowCategoryManagement(false)}
      />
    </View>
  );
}
