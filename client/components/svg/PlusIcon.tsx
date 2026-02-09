import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
export const PlusIcon = (props: SvgProps) => (
    <Svg width={10} height={10} fill="none" viewBox="0 0 10 10" {...props}>
        <Path fill="#111214" d="M3.892 9.688V.312h1.59v9.376h-1.59ZM0 5.795v-1.59h9.375v1.59H0Z" />
    </Svg>
);
