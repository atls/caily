import { COLORS } from '@/constants';
import { GestureResponderEvent, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { BackArrowIcon } from '@/components/svg';
import { normalizeSize } from '@/utils';
import { useRouter } from 'expo-router';

type TProps = {
    onPressBack?: (event: GestureResponderEvent) => void;
    step: number;
};

const MAX_STEPS = 7;

export const QuestionnaireHeader = ({ step = 1, onPressBack }: TProps) => {
    const router = useRouter();

    return (
        <>
            <View style={s.wrapper}>
                <TouchableOpacity onPress={() => onPressBack ?? router?.back()} style={s.btn}>
                    <BackArrowIcon />
                </TouchableOpacity>

                <Text style={s.steps}>
                    {step} of {MAX_STEPS}
                </Text>
            </View>
            <View style={s.progress}>
                <View style={[s.bar, { width: `${(step / MAX_STEPS) * 100}%` }]} />
            </View>
        </>
    );
};

const s = StyleSheet.create({
    wrapper: {
        height: normalizeSize(52),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    btn: {
        position: 'absolute',
        left: 0,
        height: normalizeSize(52),
        width: normalizeSize(52),

        borderRadius: 100,
        backgroundColor: COLORS.GREY,
        alignItems: 'center',
        justifyContent: 'center',
    },

    steps: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
    },

    progress: {
        width: 56,
        height: normalizeSize(8),
        borderRadius: 4,
        backgroundColor: COLORS.GREY,
        marginTop: normalizeSize(8),
        marginBottom: normalizeSize(20),
    },

    bar: {
        height: normalizeSize(8),
        borderRadius: 4,
        backgroundColor: COLORS.BLACK100,
    },
});
