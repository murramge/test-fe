import * as React from 'react';
import { useState } from 'react';

import { ControlledInput, View } from '@/components/ui';

type Props = {
  onSearchChange: (query: string) => void;
  placeholder?: string;
};

export function TaskSearch({
  onSearchChange,
  placeholder = '할일 검색...',
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearchChange(text);
  };

  return (
    <View className="px-4 pb-4">
      <ControlledInput
        name="search"
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={handleSearch}
        className="bg-gray-100 dark:bg-gray-800"
      />
    </View>
  );
}
