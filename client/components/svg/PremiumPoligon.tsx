import Svg, { SvgProps, Path } from 'react-native-svg';
export const PremiumPoligon = (props: SvgProps) => (
    <Svg width={5} height={6} fill="none" {...props}>
        <Path
            fill="#fff"
            d="M4.5 2.134a1 1 0 0 1 0 1.732l-3 1.732A1 1 0 0 1 0 4.732V1.268A1 1 0 0 1 1.5.402l3 1.732Z"
        />
    </Svg>
);
