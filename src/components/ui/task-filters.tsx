import * as React from 'react';

import { Button, Text, View } from '@/components/ui';
import { PriorityHigh, PriorityMedium, PriorityLow, Folder, Briefcase, Home, Target, Book, DollarSign, Activity, Palette, Lightning, Fire, Rocket, Lightbulb, Star, Trophy, Chart, Person } from '@/components/ui/icons';
import type { TaskFilters, TaskPriority, TaskStatus } from '@/types';

type Props = {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  categories: { id: string; name: string; icon?: string; color?: string }[];
};

export function TaskFiltersComponent({
  filters,
  onFiltersChange,
  categories,
}: Props) {
  const statusOptions: { value: TaskStatus; label: string; color: string }[] = [

    { value: 'pending', label: '진행중', color: 'bg-orange-500' },
    { value: 'completed', label: '완료', color: 'bg-green-500' },
    { value: 'cancelled', label: '취소', color: 'bg-gray-500' },
  ];

  const priorityOptions: {
    value: TaskPriority;
    label: string;
    component: React.ComponentType<{ size?: number }>;
  }[] = [
    { value: 'high', label: '높음', component: PriorityHigh },
    { value: 'medium', label: '보통', component: PriorityMedium },
    { value: 'low', label: '낮음', component: PriorityLow },
  ];

  const toggleStatus = (status: TaskStatus) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter((s) => s !== status)
      : [...currentStatus, status];

    onFiltersChange({ ...filters, status: newStatus });
  };

  const togglePriority = (priority: TaskPriority) => {
    const currentPriority = filters.priority || [];
    const newPriority = currentPriority.includes(priority)
      ? currentPriority.filter((p) => p !== priority)
      : [...currentPriority, priority];

    onFiltersChange({ ...filters, priority: newPriority });
  };

  const selectCategory = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.status?.length || filters.priority?.length || filters.categoryId;

  // 카테고리 아이콘 매핑
  const getIconComponent = (iconKey?: string) => {
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
    };
    
    return iconMap[iconKey || 'folder'] || Folder;
  };

  return (
    <View style={{ gap: 12 }} className="rounded-lg bg-white p-3 dark:bg-neutral-800">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">
          필터
        </Text>
        {hasActiveFilters && (
          <Button
            label="초기화"
            variant="ghost"
            size="sm"
            onPress={clearFilters}
          />
        )}
      </View>

      {/* Status Filter */}
      <View style={{ gap: 6 }}>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
          상태
        </Text>
        <View className="flex-row flex-wrap" style={{ gap: 6 }}>
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={
                filters.status?.includes(option.value) ? 'default' : 'outline'
              }
              onPress={() => toggleStatus(option.value)}
            >
              <Text className={`text-sm ${filters.status?.includes(option.value) ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {option.label}
              </Text>
            </Button>
          ))}
        </View>
      </View>

      {/* Priority Filter */}
      <View style={{ gap: 6 }}>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
          우선순위
        </Text>
        <View className="flex-row flex-wrap" style={{ gap: 6 }}>
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={
                filters.priority?.includes(option.value) ? 'default' : 'outline'
              }
              onPress={() => togglePriority(option.value)}
            >
              <View className="flex-row items-center space-x-1">
                <option.component size={12} />
                <Text className={`text-sm ml-2 ${filters.priority?.includes(option.value) ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {option.label}
                </Text>
              </View>
            </Button>
          ))}
        </View>
      </View>

      {/* Category Filter */}
      {categories.length > 0 && (
        <View style={{ gap: 6 }}>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            카테고리
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 6 }}>
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <Button
                  key={category.id}
                  size="sm"
                  variant={
                    filters.categoryId === category.id ? 'default' : 'outline'
                  }
                  onPress={() => selectCategory(category.id)}
                >
                  <View className="flex-row items-center">
                    <IconComponent 
                      size={14} 
                      color={filters.categoryId === category.id ? '#ffffff' : (category.color || '#6b7280')} 
                    />
                    <Text className={`ml-2 text-sm ${filters.categoryId === category.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {category.name}
                    </Text>
                  </View>
                </Button>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
