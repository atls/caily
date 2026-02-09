import Svg, { SvgProps, Path } from 'react-native-svg';
export const GreenCheckIcon = (props: SvgProps) => (
    <Svg width={16} height={16} fill="none" {...props}>
        <Path
            fill="#64C567"
            fillRule="evenodd"
            d="m14.222 4.222-8.533 8.667-3.912-4.4L3.12 7.44l2.637 2.967 7.183-7.296 1.283 1.11Z"
            clipRule="evenodd"
        />
    </Svg>
);
