import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StyleSheet, Platform, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('screen');

const CARDS_LIST = [
    {
        name: '🍴Eat what you love',
        description: 'Choose foods you enjoy to reduce cravings and make the process more sustainable.',
        rotate: '3deg',
    },
    {
        name: '📊 Follow your own nutrition plan',
        description: 'Your plan is designed for your goals. Just start, and you’ll see the results.',
        rotate: '-3deg',
    },
    {
        name: '⚖️ Maintain balance',
        description: 'The right ratio of proteins, fats, and carbs keeps you energized and feeling light every day.',
        rotate: '2deg',
    },
    {
        name: '💧 Stay hydrated',
        description: 'Drinking enough water is key to good health and well-being. Without it, your body slows down.',
        rotate: '-2deg',
    },
    {
        name: '🛀 Give yourself rest',
        description: 'Sleep and relaxation are just as important as training. Without them, progress may stall.',
        rotate: '3deg',
    },
];

export default function SubscriptionScreen() {
    const router = useRouter();

    const nextScreenHandler = () => {
        router.push('/(dashboard)/dashboard');
    };

    return (
        <SafeAreaView style={s.wrapper}>
            <ScrollView bounces={false} style={s.scroll} showsVerticalScrollIndicator={false}>
                <View style={s.container}>
                    <Text style={s.howtoreach}>Are you sure?</Text>
                    <Text style={s.howtoreachDescrTop}>
                        Wait! Before you go, remember that canceling means losing access to premium features like:
                    </Text>

                    <View style={s.cardBlock}>
                        {CARDS_LIST?.map(c => (
                            <View style={{ ...s.cardItem, transform: [{ rotate: c?.rotate }] }} key={c.name}>
                                <Text style={s.cardItemName}>{c.name}</Text>
                                <Text style={s.cardItemDescription}>{c.description}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={s.howtoreachDescr}>Give it another try and enjoy 50% off!</Text>

                    <TouchableOpacity onPress={nextScreenHandler} style={s.bottomBtn}>
                        <Text style={s.bottomBtnText}>Continue with 50% off</Text>
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

    title: {
        fontSize: normalizeSize(32),
        textAlign: 'center',
        maxWidth: normalizeSize(224),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: -1.6,
    },

    descr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: normalizeSize(240),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.28),
    },

    topTextBlock: {
        marginBottom: normalizeSize(38),
        marginTop: normalizeSize(19),
        marginHorizontal: 'auto',
        gap: normalizeSize(18),
    },

    inputsWrapper: {
        flexDirection: 'column',
        gap: normalizeSize(8),
        alignSelf: 'stretch',
        marginTop: normalizeSize(40),
    },

    caloriesBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        minHeight: normalizeSize(68),
        borderRadius: normalizeSize(8),
        borderWidth: 1,
        borderColor: COLORS.STROKE,
    },

    caloriesBlockText: {
        fontSize: normalizeSize(16),
        textAlign: 'center',
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    inputsBlock: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: normalizeSize(6),
        alignSelf: 'stretch',
    },

    inputWrap: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        flexBasis: '32.1%',
        gap: normalizeSize(6),
    },

    input: {
        alignSelf: 'stretch',
        borderRadius: normalizeSize(8),
        borderWidth: 1,
        borderColor: COLORS.STROKE,
        minHeight: normalizeSize(48),
        padding: normalizeSize(16),

        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    inputKcal: {
        flex: 1,
        width: '100%',
        textAlign: 'center',

        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    progress: {
        width: '100%',
        height: normalizeSize(9),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalizeSize(4),
    },

    progressLine: {
        borderRadius: 8,
        width: '32.1%',
        backgroundColor: COLORS.PRO_BG_100,
        height: normalizeSize(9),
    },

    nameInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(4),
    },

    circleName: {
        width: 8,
        height: 8,
        borderRadius: 100,
        backgroundColor: COLORS.PRO_BG_100,
    },

    inputLabel: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.24),
        opacity: 0.5,
    },

    inputsDescr: {
        marginBottom: normalizeSize(60),
        marginTop: normalizeSize(16),

        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.24),
    },

    howtoreach: {
        fontSize: normalizeSize(32),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1.6),
        textAlign: 'center',

        marginBottom: normalizeSize(18),
    },

    howtoreachDescrTop: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.28),
        maxWidth: normalizeSize(249),
        textAlign: 'center',
        marginBottom: normalizeSize(18),
    },

    cardBlock: {
        marginHorizontal: normalizeSize(8),
        alignSelf: 'stretch',
        paddingHorizontal: normalizeSize(20.2),
        paddingVertical: normalizeSize(28),
        gap: normalizeSize(30),
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: COLORS.GREY,
    },

    cardItem: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: normalizeSize(16),
        paddingVertical: normalizeSize(12),
        borderRadius: 12,
        alignSelf: 'stretch',
        gap: normalizeSize(8),

        // Shadow for iOS
        shadowColor: 'rgba(35, 26, 11, 1)', // Approximate the given RGBA color
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12, // Matches the alpha value in rgba
        shadowRadius: 16,
        // Shadow for Android
        elevation: 8, // Adjust this to match the effect
    },

    cardItemName: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    cardItemDescription: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.24),
    },

    howtoreachDescr: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
        textAlign: 'center',
        marginTop: normalizeSize(40),
        marginBottom: normalizeSize(16),
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
        backgroundColor: COLORS.BLACK100,
        borderRadius: 20,
        paddingHorizontal: normalizeSize(40),
        paddingVertical: normalizeSize(16),
        minHeight: normalizeSize(56),
    },

    bottomBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.WHITE,
        letterSpacing: normalizeSize(-0.64),
    },
});
