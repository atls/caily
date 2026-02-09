import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const CheckboxCheckedBlack = (props: SvgProps) => (
    <Svg width={20} height={20} fill="none" {...props}>
        <Rect width={20} height={20} fill="#EEE" rx={4} />
        <Path stroke="#000" strokeLinejoin="round" strokeWidth={2.222} d="m3.333 10.833 4.167 5L17.5 5" />
    </Svg>
);
