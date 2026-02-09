import Svg, { SvgProps, Path } from 'react-native-svg';

export const DropdownArrow = (props: SvgProps) => (
    <Svg width={6} height={5} fill="none" {...props}>
        <Path
            fill="#111214"
            d="M2.134.5a1 1 0 0 1 1.732 0l1.732 3A1 1 0 0 1 4.732 5H1.268a1 1 0 0 1-.866-1.5l1.732-3Z"
        />
    </Svg>
);
