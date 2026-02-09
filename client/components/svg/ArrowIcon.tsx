import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export const ArrowIcon = (props: SvgProps) => (
    <Svg width={16} height={12} fill="none" viewBox="0 0 16 12" {...props}>
        <Path
            fill="#fff"
            d="M10.01 12 16 6.012 9.984 0 8.911 1.048l4.219 4.216H0v1.497h13.13l-4.194 4.191L10.009 12Z"
        />
    </Svg>
);
