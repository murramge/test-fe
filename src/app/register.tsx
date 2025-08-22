import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

import type { RegisterFormProps } from '@/components/register-form';
import { RegisterForm } from '@/components/register-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Register() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  const onSubmit: RegisterFormProps['onSubmit'] = (data) => {
    console.log('회원가입 데이터:', data);
    
    const { userStorage } = require('@/lib/storage/user-storage');
    
    // 이미 존재하는 사용자인지 확인
    const existingUser = userStorage.findUserByEmail(data.email);
    if (existingUser) {
      Alert.alert(
        '회원가입 실패',
        '이미 등록된 이메일입니다.\n로그인 화면으로 이동하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '로그인',
            onPress: () => router.push('/login'),
            style: 'default',
          },
        ]
      );
      return;
    }
    
    // 새 사용자 생성
    const newUser = userStorage.addUser({
      name: data.name,
      email: data.email,
    });
    
    // 회원가입 성공 알림 후 로그인 화면으로 이동
    Alert.alert(
      '회원가입 완료! 🎉',
      `환영합니다, ${newUser.name}님!\n이제 로그인을 통해 TaskFlow를 시작하세요.`,
      [
        {
          text: '로그인하러 가기',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  return (
    <>
      <FocusAwareStatusBar />
      <RegisterForm onSubmit={onSubmit} />
    </>
  );
}
