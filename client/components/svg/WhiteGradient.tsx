import * as React from 'react';
import Svg, { SvgProps, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export const WhiteGradient = (props: SvgProps) => (
    <Svg
        width={360}
        height={props?.width ? (Number(props?.width) / 360) * 396 : 396}
        fill="none"
        viewBox="0 0 360 396"
        {...props}
    >
        <Path fill="url(#a)" d="M-11 0h371v401H-11z" />
        <Defs>
            <LinearGradient id="a" x1={174.5} x2={173.786} y1={0} y2={200.999} gradientUnits="userSpaceOnUse">
                <Stop stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" />
            </LinearGradient>
        </Defs>
    </Svg>
);
