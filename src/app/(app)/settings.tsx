/* eslint-disable react/react-in-jsx-scope */
import { useColorScheme } from 'nativewind';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { ThemeItem } from '@/components/settings/theme-item';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { Github } from '@/components/ui/icons';
import { useAuth } from '@/lib';
import { Linking } from 'react-native';

export default function Settings() {
  const signOut = useAuth.use.signOut();
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            설정
          </Text>
          
          <ItemsContainer title="일반">
            <ThemeItem />
          </ItemsContainer>

          <ItemsContainer title="앱 정보">
            <Item text="앱 이름" value="TaskFlow" />
          </ItemsContainer>

          <ItemsContainer title="링크">
            <Item
              text="GitHub"
              icon={<Github color={iconColor} />}
              onPress={() => Linking.openURL('https://github.com/murramge/test-fe')}
            />
          </ItemsContainer>

          <View className="mt-6 mb-4">
            <ItemsContainer>
              <Item text="로그아웃" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
