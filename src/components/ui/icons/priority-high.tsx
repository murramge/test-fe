import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Circle } from 'react-native-svg';

type IconProps = SvgProps & {
  color?: string;
  size?: number;
};

export function PriorityHigh({ color = '#ef4444', size = 24, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle
        cx={12}
        cy={12}
        r={10}
        fill={color}
      />
    </Svg>
  );
}
