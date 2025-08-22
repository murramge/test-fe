import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

import { Text, View } from '@/components/ui';

type Props = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  value?: string;
};

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  label,
  value,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }} className="relative">
        <Svg width={size} height={size} className="absolute">
          {/* Background circle */}
          <Circle
            stroke={backgroundColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <Circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Center content */}
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </Text>
          {value && (
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {value}
            </Text>
          )}
        </View>
      </View>

      {label && (
        <Text className="mt-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Text>
      )}
    </View>
  );
}
