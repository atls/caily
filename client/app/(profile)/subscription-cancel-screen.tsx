import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StyleSheet, Platform, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { GreenCheckIcon, PremiumIcon } from '@/components';

const { width } = Dimensions.get('screen');

const TEXTS = [
    { title: 'Personalized nutrition goals', description: 'Tailored to your body and lifestyle' },
    { title: 'Smart food tracking', description: 'Log meals via text, photo, voice' },
    { title: 'Water & activity tracking', description: 'Stay on top of your daily habits' },
    { title: 'Advanced analytics & insights', description: 'Understand your progress' },
    { title: 'Mind & body balance', description: 'Guided meditations & motivation' },
];

export default function SubscriptionCancelScreen() {
    const router = useRouter();

    const nextScreenHandler = () => {
        router.push('/(profile)/subscription-screen');
    };

    return (
        <SafeAreaView style={s.wrapper}>
            <ScrollView bounces={false} style={s.scroll} showsVerticalScrollIndicator={false}>
                <View style={s.container}>
                    <Text style={s.howtoreach}>Your path to healthy habits</Text>
                    <PremiumIcon />
                    <Text style={s.howtoreachDescrTop}>
                        Get precise calorie tracking, personalized insights, and tools to build lasting healthy habits
                    </Text>

                    <View style={s.cardBlock}>
                        <View style={s.cardBlockTexts}>
                            <Text style={s.cardBlockTextsTitle}>$12 Monthly</Text>
                            <Text style={s.cardBlockTextsDescr}>$144 per year ∙ billed monthly</Text>
                        </View>

                        <View style={s.cardBlockInner}>
                            {TEXTS?.map(text => {
                                return (
                                    <View style={s.cardBlockInnerItem}>
                                        <GreenCheckIcon style={{ marginTop: normalizeSize(4) }} />
                                        <View style={s.cardBlockInnerItemTexts}>
                                            <Text style={s.cardBlockInnerItemTextsTitle}>{text?.title}</Text>
                                            <Text style={s.cardBlockInnerItemTextsDescr}>{text?.description}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <TouchableOpacity onPress={nextScreenHandler} style={s.bottomBtn}>
                        <Text style={s.bottomBtnText}>Cancel subscription</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scroll: { flex: 1, backgroundColor: COLORS.WHITE },

    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: normalizeSize(16),
        backgroundColor: COLORS.WHITE,
        position: 'relative',
        paddingBottom: normalizeSize(50),
        paddingTop: normalizeSize(55),
    },

    linearTop: {
        width: width,
        height: normalizeSize(274),
        paddingHorizontal: normalizeSize(16),
    },

    header: {
        marginTop: Platform.OS === 'ios' ? normalizeSize(-20) : normalizeSize(14),
        height: normalizeSize(52),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    howtoreach: {
        fontSize: normalizeSize(32),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1.6),
        textAlign: 'center',

        marginBottom: normalizeSize(24),
        maxWidth: normalizeSize(252),
    },

    howtoreachDescrTop: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.28),
        maxWidth: normalizeSize(249),
        textAlign: 'center',
        marginVertical: normalizeSize(24),
    },

    cardBlock: {
        alignSelf: 'stretch',
        paddingHorizontal: normalizeSize(4),
        paddingBottom: normalizeSize(4),
        paddingTop: normalizeSize(13),
        gap: normalizeSize(12),
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: 16,
        backgroundColor: COLORS.GREY,
        marginBottom: normalizeSize(20),
    },

    cardBlockTextsDescr: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.24),
        lineHeight: normalizeSize(16),
    },

    cardBlockTextsTitle: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
        lineHeight: normalizeSize(16),
    },

    cardBlockTexts: {
        gap: normalizeSize(6),
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: normalizeSize(8),
    },

    bottomBtnWrap: {
        width: width,
        minHeight: normalizeSize(120),
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: normalizeSize(20),
        paddingBottom: normalizeSize(26),
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexShrink: 0,
    },

    bottomBtn: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.STROKE,
        borderRadius: 20,
        paddingHorizontal: normalizeSize(40),
        paddingVertical: normalizeSize(16),
        minHeight: normalizeSize(56),
    },

    bottomBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    cardBlockInner: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingVertical: normalizeSize(44),
        paddingHorizontal: normalizeSize(36),
        backgroundColor: COLORS.WHITE,
        alignSelf: 'stretch',
        borderRadius: 12,

        shadowColor: 'rgba(35, 26, 11, 0.12)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,

        gap: normalizeSize(16),
    },

    cardBlockInnerItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: normalizeSize(4),
    },

    cardBlockInnerItemTexts: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: normalizeSize(2),
    },

    cardBlockInnerItemTextsTitle: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    cardBlockInnerItemTextsDescr: {
        fontSize: normalizeSize(14),

        fontWeight: 400,
        fontFamily: 'Inter_400Regular',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.14),
    },
});
