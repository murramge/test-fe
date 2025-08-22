import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function Tasks() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <FocusAwareStatusBar />
      <Text className="mb-4 text-center text-2xl font-bold">할일 관리</Text>
      <Text className="text-center text-neutral-600">
        할일을 추가하고 관리해보세요
      </Text>
    </View>
  );
}
