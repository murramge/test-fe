import * as React from 'react';
import { Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Text, View } from '@/components/ui';

type SwipeAction = {
  label: string;
  onPress: () => void;
  backgroundColor: string;
  icon?: string;
};

type Props = {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipe?: (direction: 'left' | 'right') => void;
};

export function SwipeActions({
  children,
  leftActions = [],
  rightActions = [],
  onSwipe,
}: Props) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const threshold = 60;

      if (event.translationX > threshold && leftActions.length > 0) {
        // Swiped right - show left actions
        translateX.value = withSpring(120);
        if (onSwipe) {
          runOnJS(onSwipe)('left');
        }
      } else if (event.translationX < -threshold && rightActions.length > 0) {
        // Swiped left - show right actions
        translateX.value = withSpring(-120);
        if (onSwipe) {
          runOnJS(onSwipe)('right');
        }
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? 1 : 0,
    transform: [{ translateX: translateX.value - 120 }],
  }));

  const rightActionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? 1 : 0,
    transform: [{ translateX: translateX.value + 120 }],
  }));

  return (
    <View className="relative">
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <Animated.View
          style={[leftActionsStyle]}
          className="w-30 absolute left-0 top-0 h-full flex-row"
        >
          {leftActions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => {
                action.onPress();
                translateX.value = withSpring(0);
              }}
              className="flex-1 items-center justify-center"
              style={{ backgroundColor: action.backgroundColor }}
            >
              {action.icon && (
                <Text className="text-lg text-white">{action.icon}</Text>
              )}
              <Text className="text-xs font-medium text-white">
                {action.label}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <Animated.View
          style={[rightActionsStyle]}
          className="w-30 absolute right-0 top-0 h-full flex-row"
        >
          {rightActions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => {
                action.onPress();
                translateX.value = withSpring(0);
              }}
              className="flex-1 items-center justify-center"
              style={{ backgroundColor: action.backgroundColor }}
            >
              {action.icon && (
                <Text className="text-lg text-white">{action.icon}</Text>
              )}
              <Text className="text-xs font-medium text-white">
                {action.label}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      )}

      {/* Main Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}
