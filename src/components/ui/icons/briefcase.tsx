import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function Briefcase({ color = '#000', size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={2}
        y={7}
        width={20}
        height={14}
        rx={2}
        ry={2}
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
