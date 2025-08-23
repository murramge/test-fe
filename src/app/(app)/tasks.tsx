import { Link } from 'expo-router';
import {   useEffect, useState } from 'react';
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
import type { TaskFilters } from '@/types';

function TasksContent() {
  const { loadData, toggleTaskStatus } = useTaskStore();
  const { categories } = useCategories();
  const stats = useTaskStats();
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showFilters, setShowFilters] = useState(true);

  const { tasks, isLoading } = useTasks(filters);

  useEffect(() => {
    loadData();
  }, [loadData]);



  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />

      {/* 고정 헤더 */}
      <View className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
        {/* 상단 헤더 */}
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                할일 관리
              </Text>
              <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                총 {stats?.total || 0}개 • 완료 {stats?.completed || 0}개 • 진행 중 {stats?.pending || 0}개
              </Text>
            </View>
            
            <View className="flex-row space-x-2">
              <Pressable
                onPress={() => setShowFilters(!showFilters)}
                className={`rounded-full px-3 py-2 ${
                  showFilters 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  showFilters 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  🔍 필터
                </Text>
              </Pressable>
            </View>
          </View>
          
          {/* 통계 탭 */}
          
          <View className="mt-4 flex-row rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
         
          <Pressable className={`flex-1 items-center rounded-lg py-3  `} onPress={() => setFilters({})}>
            <Text className={`text-lg font-bold text-blue-500`}>
              {stats?.total || 0}
            </Text>
            <Text className={`text-xs font-medium `}>
              전체
            </Text>
          </Pressable>          
     
            <Pressable className={`flex-1 items-center rounded-lg py-3 mx-1 `} onPress={() => setFilters({status: ['pending']})}>
            <Text className={`text-lg font-bold text-orange-500`}>
              {stats?.pending || 0}
            </Text>
            <Text className={`text-xs font-medium `}>
              진행중
            </Text>
          </Pressable>      

  
            <Pressable className={`flex-1 items-center rounded-lg py-3 `} onPress={() => setFilters({status: ['completed']})}>
              <Text className={`text-lg font-bold text-green-500 `}>
                {stats?.completed || 0}
              </Text>
              <Text className={`text-xs font-medium `}>
                완료
              </Text>
            </Pressable>
  
          </View>
        </View>



        {/* 필터 섹션 */}
        {showFilters && (
          <View className="px-6  border-t border-gray-100 dark:border-gray-700">
            <View>
              <TaskFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
              />
            </View>
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
              <Text className="text-6xl mb-4">📝</Text>
              <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                할일이 없습니다
              </Text>
              <Text className="text-center text-gray-600 dark:text-gray-400 mb-6">
                새로운 할일을 추가하여 시작해보세요
              </Text>
              
              <Link href="/add-task" asChild>
                <Pressable className="flex-row items-center rounded-xl bg-blue-500 px-6 py-3">
                  <Text className="mr-2 text-lg">➕</Text>
                  <Text className="font-medium text-white">첫 할일 추가하기</Text>
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
          <Text className="text-2xl text-white">+</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

export default function Tasks() {
  return <TasksContent />;
}
