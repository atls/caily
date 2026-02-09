import { COLORS } from '@/constants';
import { GestureResponderEvent, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { normalizeSize } from '@/utils';
import { ArrowIcon } from '../svg';

type TProps = {
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
};

export const ArrowButton = ({ style, disabled, onPress }: TProps) => {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={[s.btn, disabled && s.disabled, style]}>
            <ArrowIcon />
        </TouchableOpacity>
    );
};

const s = StyleSheet.create({
    btn: {
        minHeight: 56,
        maxWidth: 96,

        borderRadius: 20,
        backgroundColor: COLORS.SHADOW_GRAY_100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: normalizeSize(40),
        paddingVertical: normalizeSize(16),
    },

    disabled: {
        opacity: 0.2,
    },
});
