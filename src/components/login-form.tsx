import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import TeamSkyIcon from "/assets/teamsky-icon.png"

import { Button, ControlledInput, Image, Pressable, Text, View } from '@/components/ui';
import { loginSchema, type LoginFormType } from '@/lib/validation/auth-schemas';

export type LoginFormProps = {
  onSubmit?: SubmitHandler<LoginFormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
       <Image source={TeamSkyIcon} className="w-48 h-48" />
          <Text
            testID="form-title"
            className="p-5 text-center text-4xl font-bold text-gray-900 dark:text-white"
          >
            TaskFlow
          </Text>
          <Text className="mb-6 max-w-sm text-center text-gray-600 dark:text-gray-400">
            직장인 할일 관리를 시작하세요! 💪
           
          </Text>
        </View>

        <ControlledInput
          testID="name"
          control={control}
          name="name"
          label="이름"
          placeholder="강은화"
        />

        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="이메일"
          placeholder="eunhwa@example.com"
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

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-gray-600 dark:text-gray-400">
              계정이 없으신가요?{' '}
            </Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text className="font-medium text-blue-600 dark:text-blue-400">
                  회원가입
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
