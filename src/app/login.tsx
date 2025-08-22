import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log('로그인 데이터:', data);
    
    // 데모용 로그인 - 사용자 존재 여부 확인
    const { userStorage } = require('@/lib/storage/user-storage');
    const user = userStorage.authenticateUser(data.email, data.password || '');
    
    if (user) {
      userStorage.setCurrentUser(user);
      signIn({
        access: `taskflow-${user.id}-token`,
        refresh: `taskflow-${user.id}-refresh`,
      });
      
      Alert.alert(
        '로그인 성공! ✅',
        `안녕하세요, ${user.name}님!\n오늘도 화이팅하세요! 💪`,
        [
          {
            text: '확인',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } else {
      // 가입되지 않은 사용자 알림
      Alert.alert(
        '로그인 실패',
        '가입되지 않은 계정입니다.\n회원가입을 진행하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '회원가입',
            onPress: () => router.push('/register'),
            style: 'default',
          },
        ]
      );
    }
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
