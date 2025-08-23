import React from 'react';
import { useState } from 'react';

import { CategoryManagementModal } from '@/components/ui';

import { Item } from './item';

export function CategoryItem() {
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  return (
    <>
      <Item
        text="카테고리 관리"
        value="카테고리 추가, 수정, 삭제"
        onPress={() => setShowCategoryManagement(true)}
      />
      <CategoryManagementModal
        isVisible={showCategoryManagement}
        onClose={() => setShowCategoryManagement(false)}
      />
    </>
  );
}
