import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const SmallCloseBtnIcon = (props: SvgProps) => (
    <Svg width={28} height={28} fill="none" {...props}>
        <Rect width={28} height={28} fill="#111214" fillOpacity={0.1} rx={14} />
        <Path
            fill="#111214"
            d="M12.735 14 8 18.735 9.265 20 14 15.265 18.735 20 20 18.735 15.265 14 20 9.265 18.735 8 14 12.735 9.265 8 8 9.265 12.735 14Z"
        />
    </Svg>
);
