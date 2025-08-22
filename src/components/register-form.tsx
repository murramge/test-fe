import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import TeamSkyIcon from "/assets/teamsky-icon.png"

import { Button, ControlledInput, Image, Pressable, Text, View } from '@/components/ui';
import { registerSchema, type RegisterFormType } from '@/lib/validation/auth-schemas';

export type RegisterFormProps = {
  onSubmit?: SubmitHandler<RegisterFormType>;
};

export const RegisterForm = ({ onSubmit = () => {} }: RegisterFormProps) => {
  const { handleSubmit, control } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
      <Image source={TeamSkyIcon} className="w-32 h-32" />
          <Text
            testID="form-title"
            className="p-5  text-center text-4xl font-bold text-gray-900 dark:text-white"
          >
            TaskFlow
          </Text>


          <Text className="mb-6 max-w-sm text-center text-gray-600 dark:text-gray-400">
            TaskFlow와 함께 생산적인 하루를 시작하세요! 🚀
            {'\n'}간단한 정보 입력으로 가입할 수 있습니다.
          </Text>
        </View>

        <ControlledInput
          testID="name"
          control={control}
          name="name"
          label="이름"
          placeholder="김민수"
        />

        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="이메일"
          placeholder="minsu@example.com"
          keyboardType="email-address"
        />

        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          secureTextEntry={true}
        />

        <ControlledInput
          testID="confirm-password-input"
          control={control}
          name="confirmPassword"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          secureTextEntry={true}
        />

        <Button
          testID="register-button"
          label="회원가입"
          onPress={handleSubmit(onSubmit)}
          className="mt-4"
        />

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
          </Text>
          <Link href="/login" asChild>
            <Pressable>
              <Text className="font-medium text-blue-600 dark:text-blue-400">
                로그인
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
