import * as React from 'react';
import { Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Text, View } from '@/components/ui';
import { Edit, Trash, Check, Folder, Briefcase, Home, Target, Book, DollarSign, Activity, Palette, Lightning, Fire, Rocket, Lightbulb, Star, Trophy, Chart, ChartLine, Person } from '@/components/ui/icons';
import { useTaskStore } from '@/lib/hooks';
import type { TaskWithCategory } from '@/types';

// 전역 상태로 사용자가 스와이프를 사용했는지 추적
let hasUserSwiped = false;

type Props = {
  task: TaskWithCategory;
  onPress?: () => void;
  onToggleStatus?: () => void;
};

export function TaskItem({
  task,
  onPress,
  onToggleStatus,
}: Props) {
  const router = useRouter();

  // 카테고리 아이콘 컴포넌트 가져오기
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
  const { deleteTask } = useTaskStore();
  const isCompleted = task.status === 'completed';
  const translateX = useSharedValue(0);
  const [isSwipeActionsVisible, setIsSwipeActionsVisible] = React.useState(false);
  
  // 스와이프 힌트 애니메이션
  const swipeHintOpacity = useSharedValue(0.7);
  
  React.useEffect(() => {
    if (!hasUserSwiped) {
      swipeHintOpacity.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [swipeHintOpacity]);


  const handleEdit = () => {
    router.push(`/edit-task?taskId=${task.id}`);
    // 스와이프 액션 닫기
    translateX.value = withSpring(0);
    setIsSwipeActionsVisible(false);

  };

  const handleDelete = () => {
    Alert.alert(
      '할일 삭제',
      '정말로 이 할일을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
          onPress: () => {
            // 스와이프 액션 닫기
            translateX.value = withSpring(0);
            setIsSwipeActionsVisible(false);
        
          },
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            translateX.value = withSpring(0);
            setIsSwipeActionsVisible(false);
        
          },
        },
      ]
    );
  };



  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // 모든 태스크에서 스와이프 허용
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const threshold = 80;

      if (event.translationX < -threshold) {
        // 왼쪽으로 스와이프 - 액션 버튼 표시 (완료된 태스크도 포함)
        hasUserSwiped = true; // 사용자가 스와이프를 사용했음을 기록
        translateX.value = withSpring(-140);
        runOnJS(setIsSwipeActionsVisible)(true);
      } else if (event.translationX > threshold && task.status !== 'completed') {
        // 오른쪽으로 스와이프 - 완료 토글 (미완료 태스크만)
        hasUserSwiped = true; // 사용자가 스와이프를 사용했음을 기록
        if (onToggleStatus) {
          runOnJS(onToggleStatus)();
        }
        translateX.value = withSpring(0);
      } else {
        // 다시 중앙으로
        translateX.value = withSpring(0);
        runOnJS(setIsSwipeActionsVisible)(false);
      }
    })
    .simultaneousWithExternalGesture();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  // 애니메이션 스타일들
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // 스와이프 힌트 애니메이션 스타일
  const swipeHintAnimatedStyle = useAnimatedStyle(() => ({
    opacity: swipeHintOpacity.value,
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -40 ? 1 : 0,
  }));

  return (
    <View className="relative mb-3">
      {/* 액션 버튼들 (배경) - 모든 태스크에서 표시 */}
      <Animated.View 
        style={[actionsStyle]}
        className="absolute right-0 top-0 h-full flex-row"
      >
        {/* 편집 버튼 */}
        <Pressable
          onPress={handleEdit}
          className="w-16 items-center justify-center bg-blue-500"
        >
          <Edit color="white" size={16} />
          <Text className="text-xs font-medium text-white">편집</Text>
        </Pressable>
        
        {/* 삭제 버튼 */}
        <Pressable
          onPress={handleDelete}
          className="w-16 items-center justify-center bg-red-500"
        >
          <Trash color="white" size={16} />
          <Text className="text-xs font-medium text-white">삭제</Text>
        </Pressable>
      </Animated.View>

      {/* 메인 태스크 아이템 */}
      <View className="relative">
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[animatedStyle]}>
            <Pressable onPress={onPress}>
              <View className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
                <View className="flex-row items-start justify-between">
                  {/* Task content */}
                  <View className="flex-1 pr-3">
                    {/* Title and status */}
                    <View className="flex-row items-center">
                      <Pressable
                        onPress={onToggleStatus}
                        className={`mr-3 size-5 rounded-full border-2 ${
                          isCompleted
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isCompleted && (
                          <View className="items-center justify-center flex-1">
                            <Check color="white" size={12} />
                          </View>
                        )}
                      </Pressable>

                      <Text
                        className={`flex-1 text-base font-medium ${
                          isCompleted
                            ? 'text-gray-500 line-through dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </Text>
                    </View>

                    {/* Description */}
                    {task.description && (
                      <Text
                        className={`ml-8 mt-1 text-sm ${
                          isCompleted
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {task.description}
                      </Text>
                    )}

                    {/* Meta info */}
                    <View className="ml-8 mt-2 flex-row items-center">
                      {/* Priority indicator */}
                      <View
                        className={`mr-2 size-2 rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      />

                      {/* Category */}
                      {task.category && (
                        <View className="mr-3 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700 flex-row items-center">
                          {(() => {
                            const IconComponent = getCategoryIcon(task.category.icon);
                            return <IconComponent size={10} color={task.category.color || '#6b7280'} />;
                          })()}
                          <Text className="ml-1 text-xs text-gray-600 dark:text-gray-300">
                            {task.category.name}
                          </Text>
                        </View>
                      )}

                      {/* Due date */}
                      {task.dueDate && (
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(task.dueDate)}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* 빈 공간 - 액션 버튼을 위한 자리 */}
                  <View className="w-10" />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>

        {/* 스와이프 힌트 아이콘 */}
        {!hasUserSwiped && (
          <Animated.View 
            style={[
              animatedStyle,
              swipeHintAnimatedStyle,
              {
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: [{ translateY: -12 }],
              }
            ]}
          >
            <View className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">
              <Text className="text-gray-400 dark:text-gray-500" style={{ fontSize: 12 }}>
                ››
              </Text>
            </View>
          </Animated.View>
        )}
      </View>


    </View>
  );
}
