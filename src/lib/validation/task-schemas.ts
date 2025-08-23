import * as z from 'zod';

import type { TaskPriority, TaskStatus } from '@/types/task';

// 기본 필드 스키마들
const titleSchema = z.string({
  required_error: '할 일을 입력해주세요',
  invalid_type_error: '할 일을 입력해주세요',
}).min(1, '할 일을 입력해주세요').refine((val) => val.trim().length > 0, {
  message: '할 일을 입력해주세요',
});

const descriptionSchema = z.string().optional();

const categoryIdSchema = z.string().optional();

const prioritySchema = z.enum(['low', 'medium', 'high'] as const, {
  required_error: '우선순위를 선택해주세요',
});

const statusSchema = z.enum(['pending', 'in-progress', 'completed', 'cancelled'] as const, {
  required_error: '상태를 선택해주세요',
});

const dueDateSchema = z.string().optional();

// 할일 생성/수정 스키마
export const taskFormSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  categoryId: categoryIdSchema,
  priority: prioritySchema,
  status: statusSchema.default('pending'),
  dueDate: dueDateSchema,
});

// 할일 필터 스키마
export const taskFilterSchema = z.object({
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
});

// 타입 정의
export type TaskFormType = z.infer<typeof taskFormSchema>;
export type TaskFilterType = z.infer<typeof taskFilterSchema>;
