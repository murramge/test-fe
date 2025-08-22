import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function Stats() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <FocusAwareStatusBar />
      <Text className="mb-4 text-center text-2xl font-bold">생산성 통계</Text>
      <Text className="text-center text-neutral-600">
        나의 생산성을 확인해보세요
      </Text>
    </View>
  );
}
