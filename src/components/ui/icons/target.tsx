import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function Target({ color = '#000', size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={10}
        stroke={color}
        strokeWidth={2}
      />
      <Circle
        cx={12}
        cy={12}
        r={6}
        stroke={color}
        strokeWidth={2}
      />
      <Circle
        cx={12}
        cy={12}
        r={2}
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}
