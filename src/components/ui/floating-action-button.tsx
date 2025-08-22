import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable } from 'react-native';

import { Text } from '@/components/ui';
import { Plus } from '@/components/ui/icons';

type Props = {
  onPress?: () => void;
  label?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-center';
};

export function FloatingActionButton({
  onPress,
  label = '추가',
  icon,
  size = 'md',
  position = 'bottom-right',
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/add-task');
    }
  };

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14',
    lg: 'h-16 w-16',
  };

  const positionClasses = {
    'bottom-right': 'absolute bottom-6 right-6',
    'bottom-center': 'absolute bottom-6 self-center',
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`${positionClasses[position]} ${sizeClasses[size]} items-center justify-center rounded-full bg-blue-500 shadow-lg`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {icon || <Plus color="white" size={24} />}
      {label && size === 'lg' && (
        <Text className="mt-1 text-xs text-white">{label}</Text>
      )}
    </Pressable>
  );
}
