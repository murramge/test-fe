import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  name: z.string().optional(),
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
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
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
          <Text className="mb-2 text-center text-6xl">📝</Text>
          <Text
            testID="form-title"
            className="pb-2 text-center text-4xl font-bold text-gray-900 dark:text-white"
          >
            TaskFlow
          </Text>
          <Text className="pb-6 text-center text-lg font-medium text-blue-600 dark:text-blue-400">
            로그인
          </Text>

          <Text className="mb-6 max-w-sm text-center text-gray-600 dark:text-gray-400">
            개인 할일 관리를 시작하세요! 💪
            {'\n'}데모로 아무 이메일과 비밀번호를 입력해주세요.
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
        />
        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          secureTextEntry={true}
        />
        <Button
          testID="login-button"
          label="로그인"
          onPress={handleSubmit(onSubmit)}
          className="mt-4"
        />
      </View>
    </KeyboardAvoidingView>
  );
};
