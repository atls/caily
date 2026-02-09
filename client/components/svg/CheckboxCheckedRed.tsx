import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const CheckboxCheckedRed = (props: SvgProps) => (
    <Svg width={21} height={21} fill="none" {...props}>
        <Rect width={20} height={20} x={0.5} y={0.045} fill="#EEE" rx={4} />
        <Path stroke="#EC5555" strokeLinejoin="round" strokeWidth={1.667} d="m15.5 5.045-10 10M15.5 15.045l-10-10" />
    </Svg>
);
