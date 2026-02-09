import React from 'react';
import { Animated, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SQUARE_DIMENSIONS, s } from './RingPicker';

export const Icon = ({ icon, onPress, styleIconText }) => {
    let getIconsTransformDynamicStyles = () => ({
        opacity: icon.position.x.interpolate({
            inputRange: [0, SQUARE_DIMENSIONS.WIDTH * 0.3, SQUARE_DIMENSIONS.WIDTH * 0.7],
            outputRange: [0.4, 1, 0.4],
        }),
        transform: [
            {
                scale: icon.position.x.interpolate({
                    inputRange: [0, SQUARE_DIMENSIONS.WIDTH * 0.375, SQUARE_DIMENSIONS.WIDTH * 0.8],
                    outputRange: [0.5, 1.2, 0.25],
                }),
            },
        ],
    });

    return (
        <TouchableWithoutFeedback onPress={() => onPress(icon.id)}>
            <Animated.View style={[s.icon, icon.styles, icon.position.getLayout(), getIconsTransformDynamicStyles()]}>
                {icon.isShown && (
                    <View style={s.iconContainer}>
                        {icon.el}
                        <Text style={[s.iconText, styleIconText]}>{icon.title}</Text>
                    </View>
                )}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};
