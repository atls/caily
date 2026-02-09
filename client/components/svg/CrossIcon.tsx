import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
export const CrossIcon = (props: SvgProps) => (
    <Svg width={24} height={24} fill="none">
        <Path
            fill={props?.fill || '#fff'}
            fillOpacity={props.opacity || 0.4}
            fillRule="evenodd"
            d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Zm4.32-16.235a.906.906 0 0 0-1.28 0l-3.06 3.06-3.06-3.06a.906.906 0 0 0-1.28 1.28l3.06 3.06-3.435 3.435a.906.906 0 0 0 1.28 1.28l3.435-3.434 3.435 3.435a.906.906 0 0 0 1.28-1.281l-3.434-3.435 3.06-3.06a.906.906 0 0 0 0-1.28Z"
            clipRule="evenodd"
        />
    </Svg>
);
