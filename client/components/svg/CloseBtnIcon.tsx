import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const CloseBtnIcon = (props: SvgProps) => (
    <Svg width={56} height={56} fill="none" {...props}>
        <Rect width={56} height={56} fill="#111214" rx={28} />
        <Path
            fill="#fff"
            d="M26.102 28 19 35.102 20.898 37 28 29.898 35.102 37 37 35.102 29.898 28 37 20.898 35.102 19 28 26.102 20.898 19 19 20.898 26.102 28Z"
        />
    </Svg>
);
