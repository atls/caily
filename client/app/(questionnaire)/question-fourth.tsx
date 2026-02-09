import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { CheckboxCheckedGreen, CheckboxCheckedRed, CheckboxUnchecked, QuestionnaireHeader } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { OnboardingContext } from '@/contexts';
import * as Haptics from 'expo-haptics';

export default function QuestionnaireFourthScreen() {
    const { isCaloriesCounting, setIsCaloriesCounting } = useContext(OnboardingContext);

    const router = useRouter();

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(questionnaire)/question-fifth',
            params: {
                retake: retake,
            },
        });
    };

    const onYesPressHandler = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsCaloriesCounting(true);
        nextScreenHandler();
    };

    const onNoPressHandler = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsCaloriesCounting(false);
        nextScreenHandler();
    };

    return (
        <SafeAreaView style={s.container}>
            <QuestionnaireHeader step={4} />

            <View style={s.topTextBlock}>
                <Text style={s.title}>Have you ever tried counting calories before?</Text>
                <Text style={s.descr}>Your previous experience will help provide more precise recommendations</Text>
            </View>

            <View style={s.checkboxBlock}>
                <TouchableOpacity
                    onPress={onYesPressHandler}
                    style={[s.yesBox, isCaloriesCounting && { transform: [{ rotate: '0deg' }] }]}
                >
                    {isCaloriesCounting ? <CheckboxCheckedGreen /> : <CheckboxUnchecked />}
                    <Text style={s.checkboxText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onNoPressHandler}
                    style={[s.noBox, isCaloriesCounting === false && { transform: [{ rotate: '0deg' }] }]}
                >
                    {isCaloriesCounting === false ? <CheckboxCheckedRed /> : <CheckboxUnchecked />}
                    <Text style={s.checkboxText}>No</Text>
                </TouchableOpacity>
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
        maxWidth: normalizeSize(280),
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
        minWidth: normalizeSize(180),
        minHeight: normalizeSize(116),
        gap: normalizeSize(20),
        flexDirection: 'column',
        paddingVertical: normalizeSize(28),
        paddingHorizontal: normalizeSize(8),

        backgroundColor: '#F3F3F3',
        borderRadius: normalizeSize(16),

        alignItems: 'center',
        justifyContent: 'center',
    },

    yesBox: {
        minWidth: normalizeSize(55),
        minHeight: normalizeSize(20),
        gap: normalizeSize(8),
        flexDirection: 'row',
        paddingVertical: normalizeSize(12),
        paddingLeft: normalizeSize(12),
        paddingRight: normalizeSize(16),

        backgroundColor: COLORS.WHITE,
        borderRadius: normalizeSize(12),

        // iOS Shadow
        shadowColor: '#231A0B', // Solid color instead of rgba
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12, // Matches rgba alpha
        shadowRadius: 16,

        // Android Shadow

        transform: [{ rotate: '3deg' }],

        alignItems: 'center',
    },

    noBox: {
        minWidth: normalizeSize(55),
        minHeight: normalizeSize(20),
        gap: normalizeSize(8),
        flexDirection: 'row',
        paddingVertical: normalizeSize(12),
        paddingLeft: normalizeSize(12),
        paddingRight: normalizeSize(16),

        backgroundColor: COLORS.WHITE,
        borderRadius: normalizeSize(12),

        // iOS Shadow
        shadowColor: '#231A0B', // Solid color instead of rgba
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12, // Matches rgba alpha
        shadowRadius: 16,

        // Android Shadow

        transform: [{ rotate: '-3deg' }],

        alignItems: 'center',
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
