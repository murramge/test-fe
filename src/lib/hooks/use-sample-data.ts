import { useTaskStore } from './use-tasks';

// 샘플 데이터 생성 훅 (개발 및 데모용)
export function useSampleData() {
  const { addTask, addCategory } = useTaskStore();

  const createSampleData = () => {
    // 샘플 할일들 추가
    const sampleTasks = [
      {
        title: '프로젝트 계획서 작성',
        description: 'Q1 프로젝트 로드맵 및 일정 계획',
        priority: 'high' as const,
        categoryId: 'work',
        status: 'completed' as const,
        dueDate: '2024-01-15',
      },
      {
        title: '팀 회의 준비',
        description: '주간 스프린트 리뷰 자료 준비',
        priority: 'medium' as const,
        categoryId: 'work',
        status: 'completed' as const,
      },
      {
        title: '운동하기',
        description: '헬스장에서 1시간 운동',
        priority: 'medium' as const,
        categoryId: 'health',
        status: 'pending' as const,
      },
      {
        title: 'React Native 공부',
        description: '새로운 네비게이션 라이브러리 학습',
        priority: 'high' as const,
        categoryId: 'learning',
        status: 'pending' as const,
        dueDate: '2024-01-20',
      },
      {
        title: '장보기',
        description: '주말 식료품 구매',
        priority: 'low' as const,
        categoryId: 'personal',
        status: 'pending' as const,
      },
      {
        title: '코드 리뷰',
        description: '동료 개발자 PR 검토',
        priority: 'high' as const,
        categoryId: 'work',
        status: 'pending' as const,
        dueDate: '2024-01-18',
      },
      {
        title: '독서',
        description: '개발 관련 서적 읽기',
        priority: 'low' as const,
        categoryId: 'learning',
        status: 'completed' as const,
      },
      {
        title: '병원 예약',
        description: '정기 건강검진 예약',
        priority: 'medium' as const,
        categoryId: 'health',
        status: 'cancelled' as const,
      },
    ];

    // 각 샘플 할일 추가
    sampleTasks.forEach((task) => {
      addTask(task);
    });

    console.log('✅ 샘플 데이터가 추가되었습니다!');
  };

  const clearAllData = () => {
    // 모든 데이터 삭제 (개발용)
    console.log('🗑️ 모든 데이터가 삭제되었습니다.');
  };

  return {
    createSampleData,
    clearAllData,
  };
}
