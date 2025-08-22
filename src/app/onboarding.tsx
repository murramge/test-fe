import { useRouter } from 'expo-router';
import React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1"></View>
      <View className="justify-end ">
        <Text className="my-3 text-center text-5xl font-bold">TaskFlow</Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          개인 할일 관리 및 팀 협업을 위한 모바일 앱
        </Text>

        <Text className="my-1 pt-6 text-left text-lg">
          📝 빠른 할일 추가와 관리
        </Text>
        <Text className="my-1 text-left text-lg">📊 생산성 시각화와 통계</Text>
        <Text className="my-1 text-left text-lg">🏷️ 카테고리별 할일 분류</Text>
        <Text className="my-1 text-left text-lg">🌙 다크모드 지원</Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="시작하기"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
