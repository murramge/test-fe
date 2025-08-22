import * as z from 'zod';

// 기본 필드 스키마들
const nameSchema = z.string({
  required_error: '이름을 입력해주세요',
}).min(2, '이름은 2자 이상 입력해주세요');

const emailSchema = z
  .string({
    required_error: '이메일을 입력해주세요',
  })
  .email('올바른 이메일 형식이 아닙니다');

const passwordSchema = z
  .string({
    required_error: '비밀번호를 입력해주세요',
  })
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, 
    '비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다');

// 로그인 스키마
export const loginSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// 회원가입 스키마
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string({
    required_error: '비밀번호 확인을 입력해주세요',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

// 타입 정의
export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterFormType = z.infer<typeof registerSchema>;
