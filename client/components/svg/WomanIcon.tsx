import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';
export const WomanIcon = (props: SvgProps) => (
    <Svg width={48} height={68} fill="none" >
        <Circle cx={24} cy={8} r={8} fill={props?.fill || '#111214'} opacity={props?.opacity || 0.1} />
        <Path
            fill={props?.fill || '#111214'}
            fillRule="evenodd"
            d="M4.857 61.99 23.25 25.25a.838.838 0 0 1 1.5 0l18.393 36.74a.844.844 0 0 1-.75 1.224H5.607a.844.844 0 0 1-.75-1.224ZM18.998 23.1c2.069-4.132 7.935-4.132 10.004 0l18.393 36.74C49.269 63.583 46.562 68 42.393 68H5.607c-4.17 0-6.876-4.417-5.002-8.161l18.393-36.74Z"
            clipRule="evenodd"
            opacity={props?.opacity || 0.1}
        />
    </Svg>
);
