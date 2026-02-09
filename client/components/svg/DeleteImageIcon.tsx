import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const DeleteImageIcon = (props: SvgProps) => (
    <Svg width={16} height={16} fill="none" {...props}>
        <Rect width={16} height={16} fill="#fff" rx={8} />
        <Path
            fill="#111214"
            d="M7.367 8 5 10.367l.633.633L8 8.633 10.367 11l.633-.633L8.633 8 11 5.633 10.367 5 8 7.367 5.633 5 5 5.633 7.367 8Z"
        />
    </Svg>
);
