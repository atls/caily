import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { ArrowButton, CheckboxCheckedBlack, CheckboxUnchecked, QuestionnaireHeader } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useRef } from 'react';
import { OnboardingContext } from '@/contexts';
import * as Haptics from 'expo-haptics';

export default function QuestionnaireFifthScreen() {
    const { exercise, setExercise } = useContext(OnboardingContext);
    const router = useRouter();

    type RotationKeys = 'times1' | 'times2' | 'times3' | 'freq1' | 'freq2' | 'freq3' | 'nope';

    const rotationValues: Record<RotationKeys, Animated.Value> = {
        times1: useRef(new Animated.Value(exercise?.times === '1 – 2' ? 0 : -3)).current,
        times2: useRef(new Animated.Value(exercise?.times === '3 – 5' ? 0 : 3)).current,
        times3: useRef(new Animated.Value(exercise?.times === '>5' ? 0 : -2)).current,
        freq1: useRef(new Animated.Value(exercise?.freq === 'Every week' ? 0 : 3)).current,
        freq2: useRef(new Animated.Value(exercise?.freq === 'Every 2 weeks' ? 0 : -3)).current,
        freq3: useRef(new Animated.Value(exercise?.freq === 'Every month' ? 0 : 2)).current,
        nope: useRef(new Animated.Value(exercise?.nope ? 0 : -2)).current,
    };

    const animateRotation = (key: RotationKeys, isSelected: boolean, defaultRotation: number) => {
        Animated.timing(rotationValues[key], {
            toValue: isSelected ? 0 : defaultRotation,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const onPressHandler = ({ freq, times }: { freq?: string | null; times?: string | null }) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setExercise({ times: times ?? exercise?.times, freq: freq ?? exercise?.freq, nope: false });

        if (times) {
            animateRotation('times1', times === '1 – 2', -3);
            animateRotation('times2', times === '3 – 5', 3);
            animateRotation('times3', times === '>5', -2);
        }
        if (freq) {
            animateRotation('freq1', freq === 'Every week', 3);
            animateRotation('freq2', freq === 'Every 2 weeks', -3);
            animateRotation('freq3', freq === 'Every month', 2);
        }
    };

    const onPressNopeHandler = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setExercise({ times: null, freq: null, nope: !exercise.nope });

        animateRotation('nope', !exercise.nope, -2);
        if (!exercise.nope) nextScreenHandler();
    };

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(questionnaire)/question-sixth',
            params: {
                retake: retake,
            },
        });
    };

    return (
        <SafeAreaView style={s.container}>
            <QuestionnaireHeader step={5} />

            <View style={s.topTextBlock}>
                <Text style={s.title}>Do you exercise?</Text>
                <Text style={s.descr}>Any training and physical activity are taken into account</Text>
            </View>

            <View style={s.checkboxBlock}>
                <View style={s.topBlock}>
                    <View style={s.timesBlock}>
                        {[
                            { label: '1 – 2', key: 'times1' as RotationKeys, value: '1 – 2' },
                            { label: '3 – 5', key: 'times2' as RotationKeys, value: '3 – 5' },
                            { label: '>5', key: 'times3' as RotationKeys, value: '>5' },
                        ].map(({ label, key, value }) => (
                            <Animated.View
                                key={key}
                                style={[
                                    s.box,
                                    {
                                        transform: [
                                            {
                                                rotate: rotationValues[key].interpolate({
                                                    inputRange: [-10, 10],
                                                    outputRange: ['-10deg', '10deg'],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <TouchableOpacity style={s.boxBtn} onPress={() => onPressHandler({ times: value })}>
                                    {exercise?.times === value ? <CheckboxCheckedBlack /> : <CheckboxUnchecked />}
                                    <Text style={s.checkboxText}>{label}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

                    <View style={s.frequencyBlock}>
                        {[
                            { label: 'Every week', key: 'freq1' as RotationKeys, value: 'Every week' },
                            { label: 'Every 2 weeks', key: 'freq2' as RotationKeys, value: 'Every 2 weeks' },
                            { label: 'Every month', key: 'freq3' as RotationKeys, value: 'Every month' },
                        ].map(({ label, key, value }) => (
                            <Animated.View
                                key={key}
                                style={[
                                    s.box,
                                    {
                                        transform: [
                                            {
                                                rotate: rotationValues[key].interpolate({
                                                    inputRange: [-10, 10],
                                                    outputRange: ['-10deg', '10deg'],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <TouchableOpacity style={s.boxBtn} onPress={() => onPressHandler({ freq: value })}>
                                    {exercise?.freq === value ? <CheckboxCheckedBlack /> : <CheckboxUnchecked />}
                                    <Text style={s.checkboxText}>{label}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </View>

                <View style={s.bottomBlock}>
                    <View style={s.nopeBlock}>
                        <Animated.View
                            style={[
                                s.box,
                                {
                                    transform: [
                                        {
                                            rotate: rotationValues.nope.interpolate({
                                                inputRange: [-10, 10],
                                                outputRange: ['-10deg', '10deg'],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <TouchableOpacity style={s.boxBtn} onPress={onPressNopeHandler}>
                                {exercise?.nope ? <CheckboxCheckedBlack /> : <CheckboxUnchecked />}
                                <Text style={s.checkboxText}>Nope, not today</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </View>

            <ArrowButton style={s.nextBtn} disabled={!exercise?.freq || !exercise?.times} onPress={nextScreenHandler} />
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
        paddingBottom: Platform.OS === 'ios' ? 0 : normalizeSize(20),
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
        maxWidth: normalizeSize(242),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
        marginTop: normalizeSize(12),
        letterSpacing: -0.28,
    },

    topTextBlock: {
        marginBottom: normalizeSize(36),
    },

    nextBtn: {
        marginTop: 'auto',
    },

    checkboxBlock: {
        flexDirection: 'column',
        gap: normalizeSize(8),
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

    topBlock: { flexDirection: 'row', gap: normalizeSize(8) },

    timesBlock: {
        minWidth: normalizeSize(96),
        minHeight: normalizeSize(196),
        gap: normalizeSize(20),
        flexDirection: 'column',
        paddingVertical: normalizeSize(20),
        paddingHorizontal: normalizeSize(8),

        backgroundColor: '#F3F3F3',
        borderRadius: normalizeSize(16),

        alignItems: 'center',
        justifyContent: 'center',
    },

    frequencyBlock: {
        minWidth: normalizeSize(168),
        minHeight: normalizeSize(196),
        gap: normalizeSize(20),
        flexDirection: 'column',
        paddingVertical: normalizeSize(20),
        paddingHorizontal: normalizeSize(8),

        backgroundColor: '#F3F3F3',
        borderRadius: normalizeSize(16),

        alignItems: 'center',
        justifyContent: 'center',
    },

    bottomBlock: {
        flex: 1,
        maxHeight: 88,
    },

    nopeBlock: {
        alignSelf: 'stretch',
        flex: 1,
        minHeight: normalizeSize(88),
        gap: normalizeSize(20),
        flexDirection: 'column',
        paddingVertical: normalizeSize(20),
        paddingHorizontal: normalizeSize(8),

        backgroundColor: '#F3F3F3',
        borderRadius: normalizeSize(16),

        alignItems: 'center',
        justifyContent: 'center',
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
