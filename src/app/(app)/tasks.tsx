import { Link, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { TaskList } from '@/components/task/task-list';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  TaskFiltersComponent,
  Text,
  View,
} from '@/components/ui';
import {
  useCategories,
  useTasks,
  useTaskStats,
  useTaskStore,
} from '@/lib/hooks';
import { Filter, FileText, Plus, Repeat, Folder, Briefcase, Home, Target, Book, DollarSign, Activity, Palette, Lightning, Fire, Rocket, Lightbulb, Star, Trophy, Chart, ChartLine, Person } from '@/components/ui/icons';
import type { TaskFilters } from '@/types';

function TasksContent() {
  const { loadData, toggleTaskStatus } = useTaskStore();
  const { categories } = useCategories();
  const stats = useTaskStats();
  const { categoryId } = useLocalSearchParams();
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showFilters, setShowFilters] = useState(true);
  

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

  const { tasks, isLoading } = useTasks(filters);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 화면 포커스 시 필터 초기화 (URL 파라미터가 없는 경우만)
  useFocusEffect(
    useCallback(() => {
      // URL에 categoryId가 없으면 필터 초기화
      if (!categoryId) {
        setFilters({});
        setShowFilters(true);
      }
    }, [categoryId])
  );

  // URL에서 카테고리 ID가 전달된 경우 초기 필터 설정
  useEffect(() => {
    if (categoryId && typeof categoryId === 'string') {
      setFilters({ categoryId: categoryId });
      setShowFilters(true); // 필터가 적용된 경우 필터 섹션을 보여줌
    }
  }, [categoryId]);



  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />

      {/* 고정 헤더 */}
      <View className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
        {/* 상단 헤더 */}
        <View className="px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View>
              {filters.categoryId ? (
                <View>
                  <View className="flex-row items-center">
                    {(() => {
                      const selectedCategory = categories.find(cat => cat.id === filters.categoryId);
                      if (selectedCategory) {
                        const IconComponent = getCategoryIcon(selectedCategory.icon);
                        return <IconComponent color={selectedCategory.color} size={20} />;
                      }
                      return null;
                    })()}
                    <Text className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                      {categories.find(cat => cat.id === filters.categoryId)?.name || '할일 관리'}
                    </Text>
                  </View>
                  <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    이 카테고리의 할일 • 총 {tasks.length}개
                  </Text>
                </View>
              ) : (
                <View>
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    할일 관리
                  </Text>
                  <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    총 {stats?.total || 0}개 • 완료 {stats?.completed || 0}개 • 진행 중 {stats?.pending || 0}개
                  </Text>
                </View>
              )}
            </View>
            
            <View className="flex-row" style={{ gap: 6 }}>
              {filters.categoryId && (
                <Pressable
                  onPress={() => setFilters({})}
                  className="rounded-full bg-green-100 px-2 py-1 dark:bg-green-900/30"
                >
                  <View className="flex-row items-center">
                    <Repeat color="#15803d" size={12} />
                    <Text className="ml-1 text-xs font-medium text-green-700 dark:text-green-300">
                      전체보기
                    </Text>
                  </View>
                </Pressable>
              )}
              <Pressable
                onPress={() => setShowFilters(!showFilters)}
                className={`rounded-full px-2 py-1 ${
                  showFilters 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <View className="flex-row items-center">
                  <Filter size={14} color={showFilters ? '#1d4ed8' : '#374151'} />
                  <Text className={`ml-1 text-xs font-medium ${
                    showFilters 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    필터
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
          
          {/* 통계 탭 */}
          <View className="mt-3 flex-row rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <Pressable className="flex-1 items-center rounded-md py-2" onPress={() => setFilters({})}>
              <Text className="text-base font-bold text-blue-500 dark:text-blue-500">
                {stats?.total || 0}
              </Text>
              <Text className="text-xs font-medium">
                전체
              </Text>
            </Pressable>
            
            <Pressable className="flex-1 items-center rounded-md py-2" onPress={() => setFilters({status: ['pending']})}>
              <Text className="text-base font-bold text-orange-500 dark:text-orange-500">
                {stats?.pending || 0}
              </Text>
              <Text className="text-xs font-medium">
                진행중
              </Text>
            </Pressable>

            <Pressable className="flex-1 items-center rounded-md py-2" onPress={() => setFilters({status: ['completed']})}>
              <Text className="text-base font-bold text-green-500 dark:text-green-500">
                {stats?.completed || 0}
              </Text>
              <Text className="text-xs font-medium">
                완료
              </Text>
            </Pressable>
          </View>
        </View>



        {/* 필터 섹션 */}
        {showFilters && (
          <View className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
            <TaskFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
            />
          </View>
        )}
      </View>

      {/* 할일 목록 */}
      <View className="flex-1 pt-2">
        {tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onToggleTaskStatus={toggleTaskStatus}
          />
        ) : (
          <View className="flex-1 items-center justify-center p-8">
            <View className="items-center">
              <View className="mb-4 size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FileText color="#3b82f6" size={48} />
              </View>
              <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                할일이 없습니다
              </Text>
              <Text className="text-center text-gray-600 dark:text-gray-400 mb-6">
                새로운 할일을 추가하여 시작해보세요
              </Text>
              
              <Link href="/add-task" asChild>
                <Pressable className="flex-row items-center rounded-xl bg-blue-500 px-6 py-3">
                  <Plus color="white" size={20} />
                  <Text className="ml-2 font-medium text-white">첫 할일 추가하기</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        )}
      </View>

      {/* Floating Action Button */}
      <Link href="/add-task" asChild>
        <Pressable
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Plus color="white" size={24} />
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

export default function Tasks() {
  return <TasksContent />;
}
