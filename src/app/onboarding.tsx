import { useRouter } from 'expo-router';
import React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { Clipboard, Document, Chart, Tag, Moon } from '@/components/ui/icons';
import { useIsFirstTime } from '@/lib/hooks';
export default function Onboarding() {
  const [, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1"></View>
      <View className="flex-1 items-center justify-center">
        <View className=" items-center">
          <View className="mb-4 size-24 items-center justify-center rounded-3xl bg-blue-500">
            <Clipboard color="white" size={48} />
          </View>
        </View>
        <Text className="my-3 text-center text-5xl font-bold">TaskFlow</Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          개인 할일 관리 및 팀 협업을 위한 모바일 앱
        </Text>

        <View className="pt-6 space-y-3">
          <View className="flex-row items-center">
            <Document color="#6366f1" size={20} />
            <Text className="ml-3 text-left text-lg">빠른 할일 추가와 관리</Text>
          </View>
          <View className="flex-row items-center">
            <Chart color="#059669" size={20} />
            <Text className="ml-3 text-left text-lg">생산성 시각화와 통계</Text>
          </View>
          <View className="flex-row items-center">
            <Tag color="#dc2626" size={20} />
            <Text className="ml-3 text-left text-lg">카테고리별 할일 분류</Text>
          </View>
          <View className="flex-row items-center">
            <Moon color="#6366f1" size={20} />
            <Text className="ml-3 text-left text-lg">다크모드 지원</Text>
          </View>
        </View>
      </View>
      <SafeAreaView className="mb-10 mt-12">
        <Button
          label="시작하기"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
          className=" bg-blue-500 text-white "
          textClassName="w-1/2 text-center"
        />
      </SafeAreaView>
    </View>
  );
}
