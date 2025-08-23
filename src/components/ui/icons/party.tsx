import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path, Circle } from 'react-native-svg';

type IconProps = SvgProps & {
  color?: string;
  size?: number;
};

export function Party({ color = '#000', size = 24, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={8} cy={8} r={1} fill={color} />
      <Circle cx={16} cy={6} r={1} fill={color} />
      <Circle cx={18} cy={14} r={1} fill={color} />
      <Circle cx={6} cy={16} r={1} fill={color} />
    </Svg>
  );
}
