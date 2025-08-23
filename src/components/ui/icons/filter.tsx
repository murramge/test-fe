import * as React from 'react';
import Svg, { Polygon } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function Filter({ color = '#000', size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
