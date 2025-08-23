import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';

import { useCategories } from '@/lib/hooks';
import type { Category } from '@/types';

import { Button, Input, Modal, Text, View, useModal } from './';
import { Folder, Briefcase, Home, Target, Book, DollarSign, Activity, Palette, Lightning, Fire, Rocket, Lightbulb, Star, Trophy, Chart, Person } from './icons';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

type EditingCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
} | null;

export function CategoryManagementModal({ isVisible, onClose }: Props) {
  const { categories, updateCategory, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<EditingCategory>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editColor, setEditColor] = useState('');
  const modal = useModal();



  useEffect(() => {
    if (isVisible) {
      modal.present();
    } else {
      modal.dismiss();
    }
  }, [isVisible]);

  const handleEdit = (category: Category) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon || 'folder',
    });
    setEditName(category.name);
    setEditIcon(category.icon || 'folder');
    setEditColor(category.color);
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !editName.trim()) return;

    updateCategory(editingCategory.id, {
      name: editName.trim(),
      icon: editIcon,
      color: editColor,
    });

    setEditingCategory(null);
    setEditName('');
    setEditIcon('');
    setEditColor('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
    setEditIcon('');
    setEditColor('');
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      '카테고리 삭제',
      `"${category.name}" 카테고리를 삭제하시겠습니까?\n\n이 카테고리에 속한 모든 할일의 카테고리가 제거됩니다.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteCategory(category.id),
        },
      ]
    );
  };

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

  const iconOptions = [
    { emoji: '📁', key: 'folder', component: Folder },
    { emoji: '💼', key: 'briefcase', component: Briefcase },
    { emoji: '🏠', key: 'home', component: Home },
    { emoji: '👤', key: 'person', component: Person },
    { emoji: '🎯', key: 'target', component: Target },
    { emoji: '📚', key: 'book', component: Book },
    { emoji: '💰', key: 'dollar-sign', component: DollarSign },
    { emoji: '🏃‍♂️', key: 'activity', component: Activity },
    { emoji: '🎨', key: 'palette', component: Palette },
    { emoji: '⚡', key: 'lightning', component: Lightning },
    { emoji: '🔥', key: 'fire', component: Fire },
    { emoji: '🚀', key: 'rocket', component: Rocket },
    { emoji: '💡', key: 'lightbulb', component: Lightbulb },
    { emoji: '⭐', key: 'star', component: Star },
    { emoji: '🏆', key: 'trophy', component: Trophy },
    { emoji: '📊', key: 'chart', component: Chart },
  ];

  const handleClose = () => {
    modal.dismiss();
    onClose();
  };

  return (
    <Modal 
      ref={modal.ref} 
      title="카테고리 관리"
      snapPoints={['70%']}
      onDismiss={onClose}
    >
      <View className="flex-1 bg-white p-6 dark:bg-gray-900">
        {categories.length === 0 ? (
          <View className="py-8 text-center">
            <Text className="text-gray-500 dark:text-gray-400">
              등록된 카테고리가 없습니다.
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="space-y-3 pb-6">
              {categories.map((category) => (
              <View
                key={category.id}
                className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800"
              >
                {editingCategory?.id === category.id ? (
                  <View className="space-y-3">
                    <Input
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="카테고리 이름"
                      className="w-full text-gray-900 dark:text-white"
                    />
                    
                    {/* 아이콘 선택 */}
                    <View>
                      <Text className="my-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        아이콘
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {iconOptions.map((option) => (
                          <Pressable
                            key={option.key}
                            onPress={() => setEditIcon(option.key)}
                            className={`rounded-lg p-2 border ${
                              editIcon === option.key || editIcon === option.emoji
                                ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400'
                                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            <option.component 
                              color={editIcon === option.key || editIcon === option.emoji ? '#3b82f6' : '#6b7280'} 
                              size={20} 
                            />
                          </Pressable>
                        ))}
                      </View>
                    </View>

                    {/* 색상 선택 */}
                    <View>
                      <Text className="my-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        색상
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <Pressable
                            key={color}
                            onPress={() => setEditColor(color)}
                            className={`h-8 w-8 rounded-full border-2 ${
                              editColor === color
                                ? 'border-gray-800 dark:border-gray-200'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </View>
                    </View>

                    <View className="flex-row justify-end space-x-2">
                      <Button
                        label="취소"
                        variant="outline"
                        size="sm"
                        onPress={handleCancelEdit}
                      />
                      <Button
                        label="저장"
                        size="sm"
                        onPress={handleSaveEdit}
                        disabled={!editName.trim()}
                      />
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      
                      <View className="mr-2">
                        {(() => {
                          // 먼저 키 기반으로 찾기
                          const iconOptionByKey = iconOptions.find(opt => opt.key === category.icon);
                          if (iconOptionByKey) {
                            const IconComponent = iconOptionByKey.component;
                            return <IconComponent color={category.color} size={20} />;
                          }
                          // 이모지 기반으로 찾기 (하위 호환성)
                          const iconOptionByEmoji = iconOptions.find(opt => opt.emoji === category.icon);
                          if (iconOptionByEmoji) {
                            const IconComponent = iconOptionByEmoji.component;
                            return <IconComponent color={category.color} size={20} />;
                          }
                          // 기본 폴더 아이콘
                          return <Folder color="#6b7280" size={20} />;
                        })()}
                      </View>
                      <Text className="ml-2 flex-1 text-gray-900 dark:text-white">
                        {category.name}
                      </Text>
                    </View>

                    <View className="flex-row space-x-1">
                      <Button
                        label="수정"
                        variant="outline"
                        size="sm"
                        onPress={() => handleEdit(category)}
                      />
                      <Button
                        label="삭제"
                        variant="outline"
                        size="sm"
                        className="border-red-300 dark:border-red-600"
                        onPress={() => handleDelete(category)}
                      />
                    </View>
                  </View>
                )}
              </View>
              ))}
            </View>
          </ScrollView>
        )}

      </View>
    </Modal>
  );
}
