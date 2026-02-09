import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, Platform, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { ArrowButton, LeftStepIcon, MinusIcon, PlusIcon, QuestionnaireHeader, RightStepIcon } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Fragment, useContext, useRef } from 'react';
import { OnboardingContext } from '@/contexts';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('screen');

export default function QuestionnaireSixthScreen() {
    const { steps, setSteps } = useContext(OnboardingContext);

    const router = useRouter();

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(questionnaire)/question-seventh',
            params: {
                retake: retake,
            },
        });
    };

    const trackPosition = useRef(new Animated.Value(0)).current;
    const accumulatedOffset = useRef(0);

    const footstepTranslateYLeft = useRef(new Animated.Value(0)).current;
    const footstepTranslateYRight = useRef(new Animated.Value(0)).current;
    const footstepRotateLeft = useRef(new Animated.Value(0)).current;
    const footstepRotateRight = useRef(new Animated.Value(0)).current;

    const PATTERN_WIDTH = 100;
    const SEGMENTS = 100;

    // Функция анимации шагов
    const animateFootsteps = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(footstepTranslateYLeft, {
                    toValue: -20, // Поднимаем левый след
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(footstepRotateLeft, {
                    toValue: -3, // Наклоняем левый след
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(footstepTranslateYLeft, {
                    toValue: 0, // Возвращаем левый след
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(footstepRotateLeft, {
                    toValue: 0, // Выравниваем левый след
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(footstepTranslateYRight, {
                    toValue: -20, // Поднимаем правый след
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(footstepRotateRight, {
                    toValue: 3, // Наклоняем правый след
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(footstepTranslateYRight, {
                    toValue: 0, // Возвращаем правый след
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(footstepRotateRight, {
                    toValue: 0, // Выравниваем правый след
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    };

    const increaseCounter = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setSteps(prev => {
            const newSteps = prev + 500;
            animateFootsteps(); // Запускаем анимацию шага
            return newSteps;
        });

        accumulatedOffset.current -= 100;

        Animated.timing(trackPosition, {
            toValue: accumulatedOffset.current,
            duration: 300, // Плавная анимация
            useNativeDriver: true,
        }).start(() => {
            if (Math.abs(accumulatedOffset.current) >= PATTERN_WIDTH) {
                accumulatedOffset.current %= PATTERN_WIDTH; // Сбрасываем оффсет, чтобы создать эффект бесконечного движения
                trackPosition.setValue(accumulatedOffset.current);
            }
        });
    };

    const decreaseCounter = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setSteps(prev => {
            const newSteps = prev - 500;
            if (newSteps < 0) return 0;
            animateFootsteps();
            return newSteps;
        });

        accumulatedOffset.current += 100;
        Animated.timing(trackPosition, {
            toValue: accumulatedOffset.current,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (Math.abs(accumulatedOffset.current) >= PATTERN_WIDTH) {
                accumulatedOffset.current %= PATTERN_WIDTH;
                trackPosition.setValue(accumulatedOffset.current);
            }
        });
    };

    return (
        <SafeAreaView style={s.container}>
            <QuestionnaireHeader step={6} />

            <View style={s.topTextBlock}>
                <Text style={s.title}>How many steps do you walk a day?</Text>
                <Text style={s.descr}>If you don't know, look at the average value in {'      '} Health app</Text>

                <Image style={s.img} source={require('../../assets/images/health-app-icon.png')} />
            </View>

            <View style={s.containerSteps}>
                <View style={s.trackContainer}>
                    <Animated.View style={[s.track, { transform: [{ translateX: trackPosition }] }]}>
                        {/* Повторяем узор бесконечно */}
                        {Array.from({ length: SEGMENTS }).map((_, i) => (
                            <Fragment key={i}>
                                <View style={s.solidLine} />
                                <View style={s.dashedLine} />
                            </Fragment>
                        ))}
                    </Animated.View>
                </View>

                <View style={s.counterBlock}>
                    <TouchableOpacity onPress={decreaseCounter} style={s.counterBtn}>
                        <MinusIcon />
                    </TouchableOpacity>
                    <View style={s.counter}>
                        <Text style={s.text}>{steps.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity onPress={increaseCounter} style={s.counterBtn}>
                        <PlusIcon />
                    </TouchableOpacity>
                </View>

                <View style={s.steps}>
                    <Animated.View
                        style={[
                            s.leftFoot,
                            {
                                transform: [
                                    { translateY: footstepTranslateYLeft },
                                    {
                                        rotate: footstepRotateLeft.interpolate({
                                            inputRange: [-3, 3],
                                            outputRange: ['-3deg', '3deg'],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <LeftStepIcon />
                    </Animated.View>
                    <Animated.View
                        style={[
                            s.rightFoot,
                            {
                                transform: [
                                    { translateY: footstepTranslateYRight },
                                    {
                                        rotate: footstepRotateRight.interpolate({
                                            inputRange: [-3, 3],
                                            outputRange: ['-3deg', '3deg'],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <RightStepIcon />
                    </Animated.View>
                </View>

                <View style={s.line}>
                    <View style={s.circle} />
                </View>
            </View>

            <ArrowButton disabled={steps === 0} style={s.nextBtn} onPress={nextScreenHandler} />
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
        letterSpacing: normalizeSize(-1.6),
    },

    descr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: normalizeSize(280),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
        marginTop: normalizeSize(12),
        letterSpacing: normalizeSize(-0.28),
    },

    topTextBlock: {
        marginBottom: normalizeSize(36),
        position: 'relative',
    },

    nextBtn: {
        marginTop: 'auto',
    },

    img: {
        width: normalizeSize(30),
        height: normalizeSize(30),
        position: 'absolute',
        bottom: normalizeSize(-5),
        left: normalizeSize(112),
    },

    containerSteps: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', width: width },
    trackContainer: {
        position: 'absolute',
        left: normalizeSize(-300),
        bottom: normalizeSize(50),
        width: '200%',
        height: 4,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    track: {
        flexDirection: 'row',
        width: '200%',
    },
    solidLine: {
        width: normalizeSize(60),
        height: normalizeSize(2),
        backgroundColor: COLORS.BLACK100,
    },
    dashedLine: {
        width: normalizeSize(80),
        height: normalizeSize(2),
        borderColor: COLORS.BLACK100,
        borderWidth: Platform?.OS === 'ios' ? normalizeSize(1) : 0,
        borderTopWidth: Platform?.OS === 'ios' ? normalizeSize(1) : normalizeSize(2),
        borderStyle: 'dashed',
    },
    counterBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(8),
    },
    counter: {
        paddingHorizontal: normalizeSize(23),
        minWidth: normalizeSize(40),
        minHeight: normalizeSize(40),
        backgroundColor: COLORS.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 31,

        shadowColor: 'rgba(17, 18, 20, 1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 4,
    },
    text: {
        fontSize: normalizeSize(20),
        textAlign: 'center',
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
    },

    line: {
        position: 'absolute',
        height: normalizeSize(148),
        width: normalizeSize(2),
        backgroundColor: COLORS.RED,
        bottom: normalizeSize(54),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    circle: {
        width: normalizeSize(12),
        height: normalizeSize(12),
        borderRadius: 100,
        backgroundColor: COLORS.RED,
    },

    topArrow: {
        position: 'absolute',
        right: normalizeSize(-15),
        transform: [{ rotate: '90deg' }],
    },

    bottomArrow: {
        position: 'absolute',
        left: normalizeSize(-15),
        transform: [{ rotate: '90deg' }],
    },

    steps: {
        position: 'absolute',
        bottom: normalizeSize(54) + normalizeSize(148) + normalizeSize(42),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateX: normalizeSize(-12) }],
    },

    leftFoot: {
        left: '45%',
        transform: [{ rotate: '-20deg' }],
    },
    rightFoot: {
        left: '50%',
        transform: [{ rotate: '20deg' }],
    },

    counterBtn: {
        width: normalizeSize(60),
        height: normalizeSize(40),

        backgroundColor: COLORS.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 31,

        shadowColor: 'rgba(17, 18, 20, 1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 4,
    },
});
