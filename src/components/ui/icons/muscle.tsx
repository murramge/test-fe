import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type IconProps = SvgProps & {
  color?: string;
  size?: number;
};

export function Muscle({ color = '#000', size = 24, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 2a2 2 0 012 2v3.5l3-1.5a2 2 0 012.83 1.17A2 2 0 0120 8v4.5a2 2 0 01-1 1.73l-3 1.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-4.27L1 13.23A2 2 0 010 11.5V7a2 2 0 012.17-1.83L5 6.5V4a2 2 0 012-2h5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
