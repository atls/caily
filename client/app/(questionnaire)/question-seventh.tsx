import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { CheckboxCheckedBlack, CheckboxUnchecked, QuestionnaireHeader } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useRef } from 'react';
import { OnboardingContext } from '@/contexts';
import * as Haptics from 'expo-haptics';

const jobOptions = [
    { label: 'Sedentary work', key: 'job1', value: 'Sedentary work', defaultRotation: 3 },
    { label: 'Sometimes I stand or walk', key: 'job2', value: 'Sometimes I stand or walk', defaultRotation: -3 },
    { label: 'Occasional physical effort', key: 'job3', value: 'Occasional physical effort', defaultRotation: 2 },
    { label: 'Regularly physical effort', key: 'job4', value: 'Regularly physical effort', defaultRotation: -2 },
];

export default function QuestionnaireSeventhScreen() {
    const { userJob, setUserJob } = useContext(OnboardingContext);

    const router = useRouter();

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(paywall)/paywall-first',
            params: {
                retake: retake,
            },
        });
    };

    const rotationValues = useRef(
        jobOptions.reduce((acc, { key, value, defaultRotation }) => {
            acc[key] = new Animated.Value(userJob === value ? 0 : defaultRotation);
            return acc;
        }, {} as Record<string, Animated.Value>)
    ).current;

    const animateRotation = (selectedValue: string) => {
        jobOptions.forEach(({ key, value, defaultRotation }) => {
            Animated.timing(rotationValues[key], {
                toValue: selectedValue === value ? 0 : defaultRotation,
                duration: 50,
                useNativeDriver: true,
            }).start();
        });
    };

    const onPressHandler = (value: string) => {
        nextScreenHandler();

        setUserJob(value);
        animateRotation(value);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <SafeAreaView style={s.container}>
            <QuestionnaireHeader step={7} />
            <View style={s.topTextBlock}>
                <Text style={s.title}>Is there any physical activity in your job?</Text>
                <Text style={s.descr}>Choose what is the most similar to your regime</Text>
            </View>
            <View style={s.checkboxBlock}>
                {jobOptions.map(({ label, key, value }) => (
                    <Animated.View
                        key={key}
                        style={{
                            ...s.box,
                            transform: [
                                {
                                    rotate: rotationValues[key].interpolate({
                                        inputRange: [-10, 10],
                                        outputRange: ['-10deg', '10deg'],
                                    }),
                                },
                            ],
                        }}
                    >
                        <TouchableOpacity
                            style={s.boxBtn}
                            onPress={() => {
                                onPressHandler(value);
                            }}
                        >
                            {userJob === value ? <CheckboxCheckedBlack /> : <CheckboxUnchecked />}
                            <Text style={s.checkboxText}>{label}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: normalizeSize(20),
        backgroundColor: COLORS.WHITE,
        position: 'relative',
        paddingTop: normalizeSize(8),
    },

    title: {
        fontSize: normalizeSize(32),
        textAlign: 'center',
        maxWidth: normalizeSize(304),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: -1.6,
    },

    descr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: normalizeSize(252),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
        marginTop: normalizeSize(12),
        letterSpacing: -0.28,
    },

    topTextBlock: {
        marginBottom: normalizeSize(36),
        justifyContent: 'center',
        alignItems: 'center',
    },

    nextBtn: {
        marginTop: 'auto',
    },

    checkboxBlock: {
        gap: normalizeSize(20),
        flexDirection: 'column',
        paddingVertical: normalizeSize(28),
        paddingHorizontal: normalizeSize(8),

        backgroundColor: '#F3F3F3',
        borderRadius: normalizeSize(16),

        alignItems: 'center',
        justifyContent: 'center',

        minWidth: normalizeSize(296),
        minHeight: normalizeSize(274),
    },

    box: {
        backgroundColor: COLORS.WHITE,
        borderRadius: normalizeSize(12),

        // iOS Shadow
        shadowColor: '#231A0B', // Solid color instead of rgba
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12, // Matches rgba alpha
        shadowRadius: 16,

        // Android Shadow

        alignItems: 'center',
    },

    boxBtn: {
        gap: normalizeSize(8),
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: normalizeSize(55),
        minHeight: normalizeSize(20),
        paddingVertical: normalizeSize(12),
        paddingLeft: normalizeSize(12),
        paddingRight: normalizeSize(16),
    },

    checkboxText: {
        fontSize: normalizeSize(16),
        textAlign: 'center',
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: -0.64,
    },
});
