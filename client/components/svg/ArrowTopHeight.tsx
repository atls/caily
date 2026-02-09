import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
export const ArrowTopHeight = (props: SvgProps) => (
    <Svg width={8} height={6} fill="none" {...props}>
        <Path fill="#E44331" d="m4 0 3.464 6H.536L4 0Z" />
    </Svg>
);
