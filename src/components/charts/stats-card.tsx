import * as React from 'react';

import { Text, View } from '@/components/ui';

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: string;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'bg-blue-500',
  trend,
}: Props) {
  return (
    <View className={`rounded-lg p-4 ${color}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium text-white/80">{title}</Text>
          <Text className="mt-1 text-2xl font-bold text-white">{value}</Text>
          {subtitle && (
            <Text className="mt-1 text-sm text-white/70">{subtitle}</Text>
          )}
        </View>

        {icon && <Text className="ml-2 text-2xl">{icon}</Text>}
      </View>

      {trend && (
        <View className="mt-2 flex-row items-center">
          <Text className="text-xs text-white/80">
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
          </Text>
          <Text className="ml-1 text-xs text-white/60">지난주 대비</Text>
        </View>
      )}
    </View>
  );
}
