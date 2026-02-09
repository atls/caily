import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
export const EditIcon = (props: SvgProps) => (
    <Svg width={28} height={28} fill="none" {...props}>
        <Rect width={28} height={28} fill="#111214" fillOpacity={0.1} rx={14} />
        <Path
            fill="#111214"
            fillRule="evenodd"
            d="M16.39 8a1.333 1.333 0 0 1 1.886 0L20 9.724a1.333 1.333 0 0 1 0 1.885l-1.057 1.057-3.61-3.609L16.391 8Zm-2 2-6 6c-.25.25-.39.589-.39.942v1.724A1.333 1.333 0 0 0 9.333 20h1.724c.354 0 .693-.14.943-.39l6-6L14.39 10Z"
            clipRule="evenodd"
        />
    </Svg>
);
