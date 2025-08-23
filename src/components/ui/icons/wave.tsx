import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type IconProps = SvgProps & {
  color?: string;
  size?: number;
};

export function Wave({ color = '#000', size = 24, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M17 18c.5-1.6 2.3-2.6 4-2m-4 2c-.5 1.6-2.3 2.6-4 2s-2.5-1.4-4-2c-1.7-.6-3.5.4-4 2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 12c.5-1.6 2.3-2.6 4-2m-4 2c-.5 1.6-2.3 2.6-4 2s-2.5-1.4-4-2c-1.7-.6-3.5.4-4 2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6c.5-1.6 2.3-2.6 4-2m-4 2c-.5 1.6-2.3 2.6-4 2s-2.5-1.4-4-2c-1.7-.6-3.5.4-4 2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
