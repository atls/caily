import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const AddBtnIcon = (props: SvgProps) => (
    <Svg width={56} height={56} fill="none" {...props}>
        <Rect width={56} height={56} fill="#111214" rx={28} />
        <Path
            fill="#fff"
            fillRule="evenodd"
            d="M26.714 26.714V19h2.572v7.714H37v2.572h-7.714V37h-2.572v-7.714H19v-2.572h7.714Z"
            clipRule="evenodd"
        />
    </Svg>
);
