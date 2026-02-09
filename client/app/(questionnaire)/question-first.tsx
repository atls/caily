import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { ArrowButton, DynamicallySelectedPicker, ManIcon, QuestionnaireHeader, WomanIcon } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useContext } from 'react';
import { OnboardingContext } from '@/contexts';

const { width, height } = Dimensions.get('screen');

export default function QuestionnaireFirstScreen() {
    const { gender, age, setAge, setGender } = useContext(OnboardingContext);

    const router = useRouter();

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(questionnaire)/question-second',
            params: {
                retake: retake,
            },
        });
    };

    const onGenderSelectHandler = (val: 'male' | 'female') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setGender(gender === val ? null : val);
    };

    return (
        <SafeAreaView style={s.container}>
            <QuestionnaireHeader step={1} />

            <View style={s.topTextBlock}>
                <Text style={s.title}>Your gender and age</Text>
                <Text style={s.descr}>The male body requires more calories than the female body</Text>
            </View>

            <View style={s.selectBlock}>
                <Pressable
                    onPress={() => onGenderSelectHandler('male')}
                    style={[s.selectGenderBtn, gender === 'male' && { backgroundColor: COLORS.BLUE }]}
                >
                    <Text style={s.selectGenderBtnText}>Man</Text>

                    <View style={s.selectGenderBtnIconBlock}>
                        <ManIcon
                            fill={gender === 'male' ? COLORS.BLUE : undefined}
                            opacity={gender === 'male' ? 1 : 0.1}
                        />
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => onGenderSelectHandler('female')}
                    style={[s.selectGenderBtn, gender === 'female' && { backgroundColor: COLORS.YELLOW_100 }]}
                >
                    <Text style={s.selectGenderBtnText}>Women</Text>

                    <View style={s.selectGenderBtnIconBlock}>
                        <WomanIcon
                            fill={gender === 'female' ? COLORS.YELLOW_100 : undefined}
                            opacity={gender === 'female' ? 1 : 0.1}
                        />
                    </View>
                </Pressable>
            </View>

            <Text style={s.bottomDescr}>
                Every 10 years, the need for calories decreases by 1-2% after the age of 25. The older you get, the less
                you need
            </Text>

            <View style={s.swiper}>
                <DynamicallySelectedPicker
                    onScroll={({ index }) => setAge(index)}
                    items={Array.from({ length: 100 }, (_, index) => ({
                        value: index + 1,
                        label: `${index + 1}`,
                    }))}
                    width={normalizeSize(width)}
                    height={normalizeSize(84)}
                    initialSelectedIndex={age || 29}
                />
            </View>

            <ArrowButton style={s.nextBtn} disabled={!age || !gender} onPress={nextScreenHandler} />
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
    rectangle: {
        width: width - 24,
        height: height - 185,
        borderRadius: 40,
        backgroundColor: COLORS.GREY,
        position: 'absolute',
        top: normalizeSize(59),
    },

    gradient: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: 'auto',
    },

    bottomBlock: {
        marginTop: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    title: {
        fontSize: normalizeSize(32),
        textAlign: 'center',
        maxWidth: 320,
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

    bottomDescr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: 272,
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
        marginBottom: normalizeSize(22),
        letterSpacing: -0.28,
    },

    topTextBlock: {
        marginBottom: normalizeSize(34),
    },

    selectBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: width - 40,

        marginBottom: normalizeSize(40),
    },

    selectGenderBtn: {
        padding: normalizeSize(8),
        backgroundColor: COLORS.GREY,
        width: width / 2 - 40,
        borderRadius: 16,
        gap: 8,
    },

    selectGenderBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 500,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
    },

    selectGenderBtnIconBlock: {
        width: '100%',
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        aspectRatio: 140 / 120,

        // iOS shadow
        shadowColor: 'rgba(35, 26, 11, 0.12)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 16,

        // Android shadow
        elevation: 8,

        alignItems: 'center',
        justifyContent: 'center',
    },

    slide: {
        width: 28,
        borderWidth: 1,
    },

    swiper: {
        height: 84,
        width: normalizeSize(width),
    },

    nextBtn: {
        marginTop: 'auto',
    },
});
