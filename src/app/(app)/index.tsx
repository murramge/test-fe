import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <FocusAwareStatusBar />
      <Text className="mb-4 text-center text-2xl font-bold">TaskFlow</Text>
      <Text className="text-center text-neutral-600">
        개인 할일 관리 및 팀 협업을 위한 모바일 앱
      </Text>
    </View>
  );
}
