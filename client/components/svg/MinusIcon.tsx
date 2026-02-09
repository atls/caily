import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
export const MinusIcon = (props: SvgProps) => (
    <Svg width={10} height={2} viewBox="0 0 10 2" fill="none" {...props}>
        <Path fill="#111214" d="M0 1.59V0h9.375v1.59H0Z" />
    </Svg>
);
