import * as React from 'react';
import Svg, { SvgProps, Rect } from 'react-native-svg';
export const CheckboxUnchecked = (props: SvgProps) => (
    <Svg width={20} height={20} fill="none" {...props}>
        <Rect width={20} height={20} fill="#EEE" rx={4} />
    </Svg>
);
