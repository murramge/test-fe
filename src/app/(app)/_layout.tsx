import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';

import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Stats as StatsIcon,
  Tasks as TasksIcon,
  Plus as PlusIcon,
} from '@/components/ui/icons';
import { View } from '@/components/ui';
import { useAuth, useIsFirstTime } from '@/lib';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  // 로딩 중이거나 상태가 확정되지 않았을 때는 아무것도 렌더링하지 않음
  if (status === 'idle') {
    return null;
  }

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          tabBarButtonTestID: 'home-tab',
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: '할일',
          tabBarIcon: ({ color }) => <TasksIcon color={color} />,
          tabBarButtonTestID: 'tasks-tab',
        }}
      />

      <Tabs.Screen
        name="add-task"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center h-12 w-12 bg-blue-500 rounded-full">
              <PlusIcon color="white" size={24} />
            </View>
          ),
          tabBarButtonTestID: 'add-task-tab',
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: '통계',
          tabBarIcon: ({ color }) => <StatsIcon color={color} />,
          tabBarButtonTestID: 'stats-tab',
        }}
      />



      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
