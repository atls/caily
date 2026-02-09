import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StyleSheet, View, Text, Platform } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { ArrowButton, DynamicallyHeightPicker, DynamicallyWeightPicker, QuestionnaireHeader } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { OnboardingContext } from '@/contexts';

const { width, height } = Dimensions.get('screen');

export default function QuestionnaireSecondScreen() {
    const { userWeight, userHeight, setUserWeight, setUserHeight } = useContext(OnboardingContext);

    const router = useRouter();

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(questionnaire)/question-third',
            params: {
                retake: retake,
            },
        });
    };

    return (
        <>
            {/* <View
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    height: height,
                    backgroundColor: COLORS.RED,
                    width: 2,
                    transform: [{ translateX: 2 }],
                    zIndex: 999,
                }}
            /> */}
            <SafeAreaView style={s.container}>
                <QuestionnaireHeader step={2} />

                <View style={s.topTextBlock}>
                    <Text style={s.title}>What is your current height?</Text>
                    <Text style={s.descr}>The shorter you are, the fewer calories your body needs</Text>
                </View>

                <View style={s.heightPicker}>
                    <DynamicallyHeightPicker
                        onScroll={({ index }) => setUserHeight(index)}
                        items={Array.from({ length: 200 }, (_, index) => ({
                            value: index + 1,
                            label: `${index + 100}`,
                        }))}
                        width={width}
                        height={normalizeSize(194)}
                        initialSelectedIndex={userHeight || 65}
                    />
                </View>

                <Text style={s.bottomTitle}>And weight</Text>

                <View style={s.swiper}>
                    <DynamicallyWeightPicker
                        onScroll={({ index }) => setUserWeight(index)}
                        items={Array.from({ length: 200 }, (_, index) => ({
                            value: index + 1,
                            label: `${index}`,
                        }))}
                        width={normalizeSize(width)}
                        height={normalizeSize(130)}
                        initialSelectedIndex={userWeight || 60}
                    />
                </View>

                <ArrowButton style={s.nextBtn} disabled={!userWeight || !userHeight} onPress={nextScreenHandler} />
            </SafeAreaView>
        </>
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
        maxWidth: 252,
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: -1.6,
    },

    descr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: 262,
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
        marginTop: normalizeSize(12),
        letterSpacing: -0.28,
    },

    bottomTitle: {
        fontSize: normalizeSize(20),
        textAlign: 'center',
        fontWeight: 500,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        marginBottom: normalizeSize(30),
        letterSpacing: -0.28,
    },

    topTextBlock: {
        marginBottom: normalizeSize(36),
    },

    swiper: {
        width: normalizeSize(width),
    },

    nextBtn: {
        marginTop: 'auto',
    },

    heightPicker: {
        paddingBottom: normalizeSize(40),
    },
});
