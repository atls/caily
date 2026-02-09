import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
export const ArrowBottomHeight = (props: SvgProps) => (
    <Svg width={8} height={6} fill="none" {...props}>
        <Path fill="#E44331" d="m4 6 3.464-6H.536L4 6Z" />
    </Svg>
);
