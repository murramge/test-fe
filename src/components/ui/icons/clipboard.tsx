import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function Clipboard({ color = '#000', size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x={8}
        y={2}
        width={8}
        height={4}
        rx={1}
        ry={1}
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}
