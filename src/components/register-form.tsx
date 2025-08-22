import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Pressable, Text, View } from '@/components/ui';

const schema = z.object({
  name: z.string().min(2, '이름은 2자 이상 입력해주세요'),
  email: z
    .string({
      required_error: '이메일을 입력해주세요',
    })
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string({
      required_error: '비밀번호를 입력해주세요',
    })
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

export type RegisterFormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  onSubmit?: SubmitHandler<RegisterFormType>;
};

export const RegisterForm = ({ onSubmit = () => {} }: RegisterFormProps) => {
  const { handleSubmit, control } = useForm<RegisterFormType>({
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <View className="mb-4 size-20 items-center justify-center rounded-2xl bg-blue-500">
            <Text className="text-3xl">📋</Text>
          </View>
          <Text
            testID="form-title"
            className="pb-2 text-center text-4xl font-bold text-gray-900 dark:text-white"
          >
            TaskFlow
          </Text>
          <Text className="pb-6 text-center text-lg font-medium text-blue-600 dark:text-blue-400">
            회원가입
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
