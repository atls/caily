import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const RecordsAddBtn = (props: SvgProps) => (
    <Svg width={28} height={28} fill="none" {...props}>
        <Rect width={28} height={28} fill="#111214" fillOpacity={0.1} rx={14} />
        <Path
            fill="#111214"
            fillRule="evenodd"
            d="M13.143 13.143V8h1.714v5.143H20v1.714h-5.143V20h-1.714v-5.143H8v-1.714h5.143Z"
            clipRule="evenodd"
        />
    </Svg>
);
