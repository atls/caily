import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const CheckboxCheckedGreen = (props: SvgProps & { withoutRect?: boolean }) => (
    <Svg width={21} height={21} fill="none" {...props}>
        {!props?.withoutRect && <Rect width={20} height={20} x={0.5} y={0.918} fill="#EEE" rx={4} />}
        <Path stroke="#64C567" strokeLinejoin="round" strokeWidth={2.222} d="m3.833 11.751 4.167 5L18 5.918" />
    </Svg>
);
