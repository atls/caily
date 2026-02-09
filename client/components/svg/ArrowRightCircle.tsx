import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const ArrowRightCircle = (props: SvgProps) => (
    <Svg width={28} height={28} fill="none" {...props}>
        <Rect width={28} height={28} fill="#EEE" rx={14} />
        <Path fill="#111214" d="m11.76 20-1.094-1.177L15.238 14l-4.572-4.823L11.76 8l5.573 6-5.573 6Z" />
    </Svg>
);
