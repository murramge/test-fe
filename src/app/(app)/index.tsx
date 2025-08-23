import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { TaskList } from '@/components/task/task-list';
import {
  Button,
  FloatingActionButton,
  FocusAwareStatusBar,
  QuickStats,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import {
  useCategories,
  useSampleData,
  useTasks,
  useTaskStats,
  useTaskStore,
} from '@/lib/hooks';
import { userStorage } from '@/lib/storage/user-storage';

export default function Home() {
  const router = useRouter();
  const { loadData, toggleTaskStatus, addTask, addCategory } = useTaskStore();
  const { tasks } = useTasks();
  const { categories } = useCategories();
  const stats = useTaskStats();
  const { createSampleData } = useSampleData();
  
  // 빠른 할일 추가 상태
  const [quickTitle, setQuickTitle] = useState('');
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(false);
  const [currentUser] = useState(() => userStorage.getCurrentUser());
  
  // 카테고리 추가 상태
  const [showCategoryAdd, setShowCategoryAdd] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    loadData();
  }, [loadData]);

  // stats가 로드되지 않았으면 로딩 화면
  if (!stats) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-900">
        <FocusAwareStatusBar />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            TaskFlow 로딩 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // 마감일 임박 할일 (오늘~3일 내)
  const urgentTasks = tasks.filter((task) => {
    if (task.status === 'completed' || task.status === 'cancelled' || !task.dueDate) return false;
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 3;
  });

  // 카테고리별 할일 그룹핑 (진행 중인 것만)
  const tasksByCategory = categories.map(category => ({
    category,
    tasks: tasks.filter(task => 
      task.categoryId === category.id && 
      task.status !== 'completed' && 
      task.status !== 'cancelled'
    ).slice(0, 3) // 각 카테고리당 최대 3개만 표시
  })).filter(group => group.tasks.length > 0);

  // 카테고리 없는 할일
  const uncategorizedTasks = tasks.filter(task => 
    !task.categoryId && 
    task.status !== 'completed' && 
    task.status !== 'cancelled'
  ).slice(0, 3);

  // 인사말 함수
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후에요';
    return '수고하셨어요';
  };

  // 마감일까지 남은 일수 계산
  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘 마감';
    if (diffDays === 1) return '내일 마감';
    return `${diffDays}일 후 마감`;
  };

  // 빠른 할일 추가 핸들러
  const handleQuickAdd = () => {
    if (!quickTitle.trim()) {
      Alert.alert('알림', '할일 제목을 입력해주세요');
      return;
    }

    addTask({
      title: quickTitle.trim(),
      description: '',
      priority: 'medium',
      categoryId: undefined,
      status: 'pending',
      dueDate: undefined,
    });

    setQuickTitle('');
    setIsQuickAddExpanded(false);

    showMessage({
      message: '할일이 추가되었습니다 ✅',
      type: 'success',
      duration: 2000,
    });
  };

  // 샘플 데이터 추가
  const handleAddSampleData = () => {
    createSampleData();
  };

  // 카테고리 추가 핸들러
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('알림', '카테고리 이름을 입력해주세요');
      return;
    }

    // 카테고리 아이콘과 색상 랜덤 선택 (직장인 친화적)
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
    setShowCategoryAdd(false);

    showMessage({
      message: `카테고리 "${newCategoryName.trim()}"이 추가되었습니다 ✅`,
      type: 'success',
      duration: 2000,
    });
  };

  // 생산성 분석 함수
  const getProductivityInsight = () => {
    if (stats.total === 0) return null;
    
    const completionRate = stats.completionRate;
    const todayCompleted = stats.completed;
    
    if (completionRate >= 80) {
      return {
        level: 'excellent',
        message: `🏆 훌륭해요! 완료율 ${Math.round(completionRate)}%`,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
      };
    } else if (completionRate >= 60) {
      return {
        level: 'good',
        message: `🎯 잘하고 있어요! 완료율 ${Math.round(completionRate)}%`,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      };
    } else if (completionRate >= 40) {
      return {
        level: 'average',
        message: `⚡ 조금만 더 힘내요! 완료율 ${Math.round(completionRate)}%`,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      };
    } else {
      return {
        level: 'needsWork',
        message: `🚀 새로운 시작! 오늘 목표를 세워보세요`,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      };
    }
  };

  const productivityInsight = getProductivityInsight();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* 개인화된 헤더 & 생산성 인사이트 */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {currentUser?.name || '사용자'}님! 👋
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              오늘 완료: {stats.completed}개 | 진행 중: {stats.pending}개 | 전체: {stats.total}개
            </Text>
            
            {/* 생산성 인사이트 */}
            {productivityInsight && (
              <View className={`mt-3 rounded-lg p-3 ${productivityInsight.bgColor}`}>
                <Text className={`text-sm font-medium ${productivityInsight.color}`}>
                  {productivityInsight.message}
                </Text>
                {stats.total > 0 && (
                  <View className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <View
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
                    />
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 빠른 할일 추가 */}
          <View className="mb-6">
            {!isQuickAddExpanded ? (
              <Pressable 
                onPress={() => setIsQuickAddExpanded(true)}
                className="rounded-xl border border-dashed border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20"
              >
                <View className="flex-row items-center">
                  <View className="mr-3 size-10 items-center justify-center rounded-full bg-blue-600">
                    <Text className="text-lg text-white">+</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-blue-900 dark:text-blue-100">
                      빠른 할일 추가
                    </Text>
                    <Text className="text-sm text-blue-600 dark:text-blue-300">
                      회의 중이나 이동 중에도 빠르게 기록하세요
                    </Text>
                  </View>
                </View>
              </Pressable>
            ) : (
              <View className="rounded-xl bg-white p-4 shadow-sm dark:bg-neutral-800">
                <View className="mb-4 flex-row items-center">
                  <View className="mr-3 size-10 items-center justify-center rounded-full bg-blue-600">
                    <Text className="text-lg text-white">+</Text>
                  </View>
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    빠른 할일 추가
                  </Text>
                </View>

                <TextInput
                  value={quickTitle}
                  onChangeText={setQuickTitle}
                  placeholder="무엇을 해야 하나요? (예: 회의 자료 준비)"
                  placeholderTextColor="#9CA3AF"
                  className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  multiline
                  autoFocus
                />

                <View className="flex-row space-x-3">
                  <Button
                    label="빠르게 추가"
                    onPress={handleQuickAdd}
                    className="flex-1"
                    size="sm"
                  />
                  <Button
                    label="상세 설정"
                    variant="outline"
                    onPress={() => router.push('/add-task')}
                    className="flex-1"
                    size="sm"
                  />
                  <Button
                    label="취소"
                    variant="ghost"
                    onPress={() => {
                      setIsQuickAddExpanded(false);
                      setQuickTitle('');
                    }}
                    size="sm"
                  />
                </View>
              </View>
            )}
          </View>

          {/* 긴급/마감임박 할일 */}
          {urgentTasks.length > 0 && (
            <View className="mb-6 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
              <View className="mb-3 flex-row items-center">
                <View className="mr-2 size-6 items-center justify-center rounded-full bg-red-600">
                  <Text className="text-xs font-bold text-white">!</Text>
                </View>
                <Text className="text-lg font-bold text-red-900 dark:text-red-100">
                  긴급 할일
                </Text>
                <View className="ml-2 rounded-full bg-red-600 px-2 py-1">
                  <Text className="text-xs font-medium text-white">
                    {urgentTasks.length}개
                  </Text>
                </View>
              </View>
              
              <Text className="mb-4 text-sm text-red-700 dark:text-red-300">
                마감일이 임박한 할일들입니다. 우선적으로 처리하세요!
              </Text>

              <View className="space-y-2">
                {urgentTasks.map((task) => (
                  <View
                    key={task.id}
                    className="rounded-lg border border-red-200 bg-white p-3 dark:border-red-800 dark:bg-red-900/30"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </Text>
                        {task.dueDate && (
                          <Text className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
                            🚨 {getDaysLeft(task.dueDate)}
                          </Text>
                        )}
                      </View>
                      <View className="ml-3">
                        <View
                          className={`rounded-full px-2 py-1 ${
                            task.priority === 'high'
                              ? 'bg-red-100 dark:bg-red-900/50'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 dark:bg-yellow-900/50'
                              : 'bg-green-100 dark:bg-green-900/50'
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              task.priority === 'high'
                                ? 'text-red-700 dark:text-red-300'
                                : task.priority === 'medium'
                                ? 'text-yellow-700 dark:text-yellow-300'
                                : 'text-green-700 dark:text-green-300'
                            }`}
                          >
                            {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 카테고리별 할일 섹션 */}
          {(tasksByCategory.length > 0 || uncategorizedTasks.length > 0) && (
            <View className="mb-6">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  카테고리별 할일
                </Text>
                <Pressable onPress={() => router.push('/tasks')}>
                  <Text className="text-blue-600 dark:text-blue-400">
                    전체보기
                  </Text>
                </Pressable>
              </View>
              
              {/* 각 카테고리별 할일 표시 */}
              {tasksByCategory.map(({ category, tasks: categoryTasks }) => (
                <View key={category.id} className="mb-4 rounded-xl bg-white p-4 shadow-sm dark:bg-neutral-800">
                  {/* 카테고리 헤더 */}
                  <View className="mb-3 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View
                        className="mr-3 size-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Text className="text-lg">{category.icon}</Text>
                      </View>
                      <View>
                        <Text className="font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                          {categoryTasks.length}개 진행 중
                        </Text>
                      </View>
                    </View>
                    
                    <Pressable 
                      onPress={() => router.push(`/tasks?categoryId=${category.id}`)}
                      className="rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700"
                    >
                      <Text className="text-sm text-gray-600 dark:text-gray-300">
                        더보기
                      </Text>
                    </Pressable>
                  </View>

                  {/* 할일 목록 */}
                  <View className="space-y-2">
                    {categoryTasks.map((task) => (
                      <View
                        key={task.id}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50"
                      >
                        <View className="flex-row items-center">
                          <Pressable
                            onPress={() => toggleTaskStatus(task.id)}
                            className="mr-3 size-5 items-center justify-center rounded border-2 border-gray-300 dark:border-gray-600"
                          >
                            {task.status === 'completed' && (
                              <Text className="text-green-600 dark:text-green-400">✓</Text>
                            )}
                          </Pressable>
                          
                          <View className="flex-1">
                            <Text 
                              className={`font-medium ${
                                task.status === 'completed'
                                  ? 'text-gray-500 line-through dark:text-gray-400'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </Text>
                            
                            {task.dueDate && (
                              <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                📅 {new Date(task.dueDate).toLocaleDateString()}
                              </Text>
                            )}
                          </View>

                          <View className="ml-2 flex-row space-x-1">
                            <View
                              className={`rounded px-2 py-1 ${
                                task.priority === 'high'
                                  ? 'bg-red-100 dark:bg-red-900/50'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/50'
                                  : 'bg-green-100 dark:bg-green-900/50'
                              }`}
                            >
                              <Text
                                className={`text-xs ${
                                  task.priority === 'high'
                                    ? 'text-red-700 dark:text-red-300'
                                    : task.priority === 'medium'
                                    ? 'text-yellow-700 dark:text-yellow-300'
                                    : 'text-green-700 dark:text-green-300'
                                }`}
                              >
                                {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* 카테고리에 할일 추가 버튼 */}
                  <Pressable 
                    onPress={() => router.push(`/add-task?categoryId=${category.id}`)}
                    className="mt-3 items-center rounded-lg border border-dashed border-gray-300 py-2 dark:border-gray-600"
                  >
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      + {category.name}에 할일 추가
                    </Text>
                  </Pressable>
                </View>
              ))}
              
              {/* 카테고리 없는 할일 */}
              {uncategorizedTasks.length > 0 && (
                <View className="mb-4 rounded-xl bg-white p-4 shadow-sm dark:bg-neutral-800">
                  <View className="mb-3 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="mr-3 size-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                        <Text className="text-lg">📝</Text>
                      </View>
                      <View>
                        <Text className="font-semibold text-gray-900 dark:text-white">
                          기타
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                          {uncategorizedTasks.length}개 진행 중
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="space-y-2">
                    {uncategorizedTasks.map((task) => (
                      <View
                        key={task.id}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50"
                      >
                        <View className="flex-row items-center">
                          <Pressable
                            onPress={() => toggleTaskStatus(task.id)}
                            className="mr-3 size-5 items-center justify-center rounded border-2 border-gray-300 dark:border-gray-600"
                          >
                            {task.status === 'completed' && (
                              <Text className="text-green-600 dark:text-green-400">✓</Text>
                            )}
                          </Pressable>
                          
                          <View className="flex-1">
                            <Text 
                              className={`font-medium ${
                                task.status === 'completed'
                                  ? 'text-gray-500 line-through dark:text-gray-400'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </Text>
                            
                            {task.dueDate && (
                              <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                📅 {new Date(task.dueDate).toLocaleDateString()}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* 빈 상태 */}
          {tasks.length === 0 && (
            <View className="items-center justify-center rounded-xl bg-white p-8 shadow-sm dark:bg-neutral-800">
              <View className="mb-4 size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Text className="text-2xl">📋</Text>
              </View>
              <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                TaskFlow에 오신 것을 환영합니다!
              </Text>
              <Text className="mb-6 text-center text-gray-600 dark:text-gray-400">
                첫 번째 할일을 추가하고{'\n'}생산적인 하루를 시작해보세요
              </Text>
              
              {/* 개발용 샘플 데이터 버튼 */}
              <Pressable onPress={handleAddSampleData}>
                <View className="rounded-lg bg-blue-50 px-6 py-3 dark:bg-blue-900/20">
                  <Text className="text-center font-medium text-blue-600 dark:text-blue-400">
                    📝 샘플 할일 추가하기
                  </Text>
                  <Text className="mt-1 text-center text-xs text-blue-500 dark:text-blue-300">
                    앱 체험을 위한 예시 데이터
                  </Text>
                </View>
              </Pressable>
            </View>
          )}

          {/* 하단 여백 */}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
