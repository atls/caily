import Svg, { SvgProps, Path } from 'react-native-svg';

export const ArrowRight = (props: SvgProps) => (
    <Svg width={16} height={16} fill="none" {...props}>
        <Path fill="#111214" d="m5.76 14-1.093-1.177L9.238 8 4.667 3.177 5.76 2l5.573 6-5.573 6Z" />
    </Svg>
);
