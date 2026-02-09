import React from 'react';
import { StyleSheet, Image, Platform, PixelRatio, ImageProps } from 'react-native';

export const InlineImage = (
    props: React.JSX.IntrinsicAttributes & React.JSX.IntrinsicClassAttributes<Image> & Readonly<ImageProps>
) => {
    let style = props.style;
    if (style && Platform.OS !== 'ios') {
        style = Object.assign({}, StyleSheet.flatten(props.style));
        ['width', 'height'].forEach(propName => {
            if (style[propName]) {
                style[propName] *= PixelRatio.get();
            }
        });
    }

    return <Image {...props} style={style} />;
};
