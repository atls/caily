import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export const BackArrowIcon = (props: SvgProps) => (
    <Svg width={24} height={24} fill="none" {...props}>
        <Path fill="#111214" d="m10 18-6-6 6.025-6.024 1.075 1.05-4.225 4.225h13.15v1.5H6.875l4.2 4.2L10 18Z" />
    </Svg>
);
