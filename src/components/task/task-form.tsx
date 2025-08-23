import React, { useState } from 'react';
import type { Control } from 'react-hook-form';
import { Alert, TextInput, Pressable, useColorScheme } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { Button, CategoryManagementModal, ControlledInput, DatePicker, Modal, Text, View, useModal } from '@/components/ui';
import { Lightbulb, Lightning, Fire, Rocket, Star, Trophy, Chart, Folder, Briefcase, Home, Target, Book, DollarSign, Activity, Palette, ChartLine, Person } from '@/components/ui/icons';
import { useCategories } from '@/lib/hooks';
import type { TaskPriority } from '@/types';

import type { TaskFormType } from '@/lib/validation/task-schemas';

type FormData = TaskFormType;

type Props = {
  control: Control<FormData>;
  setValue: (field: keyof FormData, value: any) => void;
  watch?: (field: keyof FormData) => any;
  selectedPriority: TaskPriority;
  selectedCategoryId?: string;
  categories: { id: string; name: string; icon?: string; color?: string }[];
};

export function TaskForm({
  control,
  setValue,
  watch,
  selectedPriority,
  selectedCategoryId,
  categories,
}: Props) {
  const { addCategory } = useCategories();
  const addCategoryModal = useModal();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const colorScheme = useColorScheme();

  // 카테고리 아이콘 매핑
  const getCategoryIcon = (iconKey?: string) => {
    const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
      'folder': Folder,
      'briefcase': Briefcase,
      'home': Home,
      'person': Person,
      'target': Target,
      'book': Book,
      'dollar-sign': DollarSign,
      'activity': Activity,
      'palette': Palette,
      'lightning': Lightning,
      'fire': Fire,
      'rocket': Rocket,
      'lightbulb': Lightbulb,
      'star': Star,
      'trophy': Trophy,
      'chart': Chart,
      'chart-line': ChartLine,
    };
    
    return iconMap[iconKey || 'folder'] || Folder;
  };

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

    addCategory({
      name: newCategoryName.trim(),
      icon: selectedIcon,
      color: selectedColor,
    });

    setNewCategoryName('');
    setSelectedIcon('folder');
    setSelectedColor('#3B82F6');
    addCategoryModal.dismiss();

    showMessage({
      message: `카테고리 "${newCategoryName.trim()}"이 추가되었습니다 ✓`,
      type: 'success',
      duration: 2000,
    });
  };

  // 아이콘 옵션들
  const iconOptions = [
    { key: 'folder', component: Folder },
    { key: 'briefcase', component: Briefcase },
    { key: 'home', component: Home },
    { key: 'person', component: Person },
    { key: 'target', component: Target },
    { key: 'book', component: Book },
    { key: 'dollar-sign', component: DollarSign },
    { key: 'activity', component: Activity },
    { key: 'palette', component: Palette },
    { key: 'lightning', component: Lightning },
    { key: 'fire', component: Fire },
    { key: 'rocket', component: Rocket },
    { key: 'lightbulb', component: Lightbulb },
    { key: 'star', component: Star },
    { key: 'trophy', component: Trophy },
    { key: 'chart', component: Chart },
  ];

  // 색상 옵션들
  const colorOptions = [
    '#3B82F6', // blue
    '#EF4444', // red
    '#10B981', // green
    '#F59E0B', // yellow
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F97316', // orange
    '#06B6D4', // cyan
  ];

  return (
    <View className="space-y-8">
      {/* 할 일 입력 */}
      <View>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          할 일 *
        </Text>
        <ControlledInput
          name="title"
          control={control}
          placeholder="할일을 입력하세요"
          testID="task-title"
          className="text-base py-2 text-gray-900 dark:text-white"
        />
      </View>

      {/* 설명 입력 */}
      <View>
        <Text className=" text-lg font-semibold text-gray-900 dark:text-white">
          설명
        </Text>
        <ControlledInput
          name="description"
          control={control}
          placeholder="상세 설명을 입력하세요 (선택사항)"
          multiline
          numberOfLines={4}
          testID="task-description"
          className="text-base py-2 text-gray-900 dark:text-white"
        />
      </View>

      {/* 우선순위 선택 */}
      <View>
        <Text className="my-1 text-lg font-semibold text-gray-900 dark:text-white">
          우선순위
        </Text>
        <View className="flex-row gap-2">
          {priorities.map((priority) => (
            <Button
              key={priority.value}
              label={priority.label}
              onPress={() => setValue('priority', priority.value)}
              variant={
                selectedPriority === priority.value ? 'default' : 'outline'
              }
              size="sm"
            />
          ))}
        </View>
      </View>

      {/* 카테고리 선택 */}
      <View>
        <View className="my-3 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
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
        <View className="flex-row flex-wrap gap-1">
          <Button
            label="없음"
            onPress={() => setValue('categoryId', undefined)}
            variant={!selectedCategoryId ? 'default' : 'outline'}
            size="sm"
          
          />
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.icon);
            return (
              <Button
                key={category.id}
                onPress={() => setValue('categoryId', category.id)}
                variant={
                  selectedCategoryId === category.id ? 'default' : 'outline'
                }
                size="sm"
              
              >
                <View className="flex-row items-center">
                  <IconComponent size={16} color={category.color} />
                  <Text className={`ml-1 text-sm ${selectedCategoryId === category.id ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white'}`}>
                    {category.name}
                  </Text>
                </View>
              </Button>
            );
          })}
          <Button
            label="+ 새 카테고리"
            onPress={addCategoryModal.present}
            variant="outline"
            size="sm"
            className="border-dashed border-blue-300 bg-blue-50  dark:border-blue-700 dark:bg-blue-900/20"
          />
        </View>
      </View>

      {/* 마감일 선택 */}
      <View>
        <Text className="my-3 text-lg font-semibold text-gray-900 dark:text-white">
          마감일
        </Text>
        <DatePicker
          value={watch ? watch('dueDate') || '' : ''}
          onDateChange={(date) => setValue('dueDate', date)}
          placeholder="마감일을 선택하세요 (선택사항)"
          testID="task-due-date"
         
        />
      </View>

      {/* 카테고리 추가 모달 */}
      <Modal
        ref={addCategoryModal.ref}
        title="새 카테고리 추가"
        snapPoints={['73%']}
      >
        <View className="flex-1 bg-white p-4 dark:bg-gray-900">
          <View className="space-y-6">
            {/* 카테고리 이름 */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                카테고리 이름
              </Text>
              <TextInput
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="카테고리 이름 (예: 중요 프로젝트, 개인 개발)"
                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                className="rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </View>

            {/* 아이콘 선택 */}
            <View>
              <Text className="my-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                아이콘 선택
              </Text>
              <View className="flex-row flex-wrap gap-2 ">
                {iconOptions.map((option) => {
                  const IconComponent = option.component;
                  const isSelected = selectedIcon === option.key;
                  return (
                    <Pressable
                      key={option.key}
                      onPress={() => setSelectedIcon(option.key)}
                      className={`items-center justify-center rounded-lg p-3 ${
                        isSelected 
                          ? 'bg-blue-100 border-2 border-blue-500 dark:bg-blue-900/50 dark:border-blue-400'
                          : 'bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                      }`}
                    >
                      <IconComponent 
                        size={18} 
                        color={isSelected ? selectedColor : (colorScheme === 'dark' ? '#9CA3AF' : '#6b7280')} 
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 색상 선택 */}
            <View>
              <Text className="my-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                색상 선택
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full ${
                      selectedColor === color 
                        ? 'border-4 border-gray-500 dark:border-gray-200'
                        : 'border-2 border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
            </View>

            {/* 미리보기 */}
            <View>
              <Text className="my-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                미리보기
              </Text>
              <View className="flex-row items-center rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                {(() => {
                  const IconComponent = getCategoryIcon(selectedIcon);
                  return <IconComponent size={20} color={selectedColor} />;
                })()}
                <Text className="ml-3 text-gray-900 dark:text-white">
                  {newCategoryName || '카테고리 이름'}
                </Text>
              </View>
            </View>

            {/* 팁 */}
            <View className="flex-row items-start gap-2 my-3">
              <Lightbulb color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} size={16} />
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                팁: 업무별, 프로젝트별, 우선순위별로 카테고리를 만들어보세요
              </Text>
            </View>
          </View>

          {/* 하단 버튼들 */}
          <View className="mt-6 flex-row gap-3">
            <Button
              label="추가하기"
              onPress={handleAddCategory}
              className="flex-1"  
              size="default"
            />
            <Button
              label="취소"
              variant="outline"
              onPress={() => {
                addCategoryModal.dismiss();
                setNewCategoryName('');
                setSelectedIcon('folder');
                setSelectedColor('#3B82F6');
              }}
              className="flex-1"
              size="default"
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
