import React from 'react';
import { View } from 'react-native';
import { Icon } from './Icon';

export const Icons = ({ icons, onPress, styleIconText }) => (
    <View>
        {icons.map(icon => (
            <Icon key={icon.index} icon={icon} onPress={onPress} styleIconText={styleIconText} />
        ))}
    </View>
);
