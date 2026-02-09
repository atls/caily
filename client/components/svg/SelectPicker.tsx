import { normalizeSize } from '@/utils';
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export const SelectPicker = (props: SvgProps) => (
    <Svg width={normalizeSize(84)} height={normalizeSize(84)} fill="none" viewBox="0 0 84 84" {...props}>
        <Path
            fill="#E44331"
            fillRule="evenodd"
            d="M16 0C7.163 0 0 7.163 0 16v52c0 8.837 7.163 16 16 16h52c8.837 0 16-7.163 16-16V16c0-8.837-7.163-16-16-16H16Zm4 16c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h44c6.627 0 12-5.373 12-12V28c0-6.627-5.373-12-12-12H20Z"
            clipRule="evenodd"
        />
        <Path fill="#E44331" d="m14 42-6-3.464v6.928L14 42ZM70 42l6-3.464v6.928L70 42Z" />
    </Svg>
);
