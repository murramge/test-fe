import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path, Rect } from 'react-native-svg';

type IconProps = SvgProps & {
  color?: string;
  size?: number;
};

export function System({ color = '#000', size = 24, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Rect
        x={2}
        y={3}
        width={20}
        height={14}
        rx={2}
        ry={2}
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M8 21h8M12 17v4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
