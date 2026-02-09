import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Platform,
    Modal,
    TextInput,
} from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { CheckboxCheckedGreen, CrossIcon } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

const { width, height } = Dimensions.get('screen');

const LIST = [
    { title: 'Personalized nutrition goals', description: 'Tailored to your body and lifestyle' },
    { title: 'Smart food tracking', description: 'Log meals via text, photo, voice' },
    { title: 'Water & activity tracking', description: 'Stay on top of your daily habits' },
    { title: 'Advanced analytics & insights', description: 'Understand your progress' },
    { title: 'Mind & body balance', description: 'Guided meditations & motivation' },
];

export default function PaywallThirdScreen() {
    const [isPromocodeModal, setIsPromocodeModal] = useState(false);

    const togglePromocodeModalHandler = () => setIsPromocodeModal(p => !p);

    return (
        <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
            <ImageBackground
                source={require('../../assets/images/paywal-bg.png')}
                style={s.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.20)', 'rgba(0, 0, 0, 0.20)']} // Same color at both stops
                    start={{ x: 0, y: 0 }} // 0deg equivalent
                    end={{ x: 0, y: 1 }} // Top to bottom
                    style={s.backgroundGradient}
                />
            </ImageBackground>

            <LinearGradient
                colors={[
                    'rgba(0, 0, 0, 0.00)', // 0%
                    'rgba(13, 14, 16, 0.78)', // 32.79%
                    '#111214', // 50%
                ]}
                locations={[0, 0.3279, 0.5]} // Match color stops with CSS
                start={{ x: 0.5, y: 0 }} // 180deg equivalent (top to bottom)
                end={{ x: 0.5, y: 1 }}
                style={s.containerGradient}
            >
                <View style={s.header}>
                    <TouchableOpacity onPress={togglePromocodeModalHandler}>
                        <Text style={s.promoText}>I have a promo code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.crossBtn}>
                        <CrossIcon />
                    </TouchableOpacity>
                </View>

                <Text style={s.title}>
                    {'Beyond calorie\ntracking — a complete\nassistant to'}{' '}
                    <Text style={s.titleGreen}>your dream body and mind</Text>
                </Text>

                <TouchableOpacity style={s.startTrialBtn}>
                    <Text style={s.startTrialBtnText}>Start free trial, then 60$/quarter</Text>
                </TouchableOpacity>

                <View style={s.list}>
                    {LIST?.map(l => (
                        <View style={s.listItem} key={l?.title}>
                            <CheckboxCheckedGreen withoutRect style={s.checkIcon} />
                            <Text style={s.listItemTitle}>{l.title}</Text>
                            <Text style={s.listItemDescription}>{l.description}</Text>
                        </View>
                    ))}
                </View>

                <Text style={s.termsText}>
                    By continuing you acknowledge that you have read, understood and agree to{' '}
                    <Text style={s.termsTextUnderLine}>Terms</Text> and{' '}
                    <Text style={s.termsTextUnderLine}>Privacy Policy</Text>.
                </Text>
            </LinearGradient>

            <Modal animationType="fade" transparent={true} visible={isPromocodeModal}>
                <View style={s.modalBg}>
                    <View style={s.headerModal}>
                        <TouchableOpacity onPress={togglePromocodeModalHandler} style={s.crossBtn}>
                            <CrossIcon fill={COLORS.BLACK100} opacity={0.2} />
                        </TouchableOpacity>
                    </View>

                    <Text style={s.modalTitle}>Enter your promo code</Text>

                    <TextInput style={s.promoInput} placeholderTextColor={COLORS.BLACK40} placeholder="Promo code" />

                    <TouchableOpacity onPress={togglePromocodeModalHandler} style={s.bottomBtn}>
                        <Text style={s.bottomBtnText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
    },

    background: {
        width: width,
        minHeight: normalizeSize(height / 2),
        position: 'absolute',
        zIndex: 1,
    },

    backgroundGradient: {
        flex: 1,
    },

    containerGradient: {
        flex: 1,
        width: width,
        height: height,
        zIndex: 2,
        paddingHorizontal: normalizeSize(24),
        paddingBottom: normalizeSize(36),
    },

    header: {
        flexDirection: 'row',

        alignSelf: 'stretch',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    crossBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
    },

    promoText: {
        fontSize: normalizeSize(12),
        textAlign: 'center',

        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.WHITE,
        letterSpacing: normalizeSize(-0.24),
        textDecorationLine: 'underline',
    },

    title: {
        marginTop: Platform.OS === 'ios' ? normalizeSize(100) : normalizeSize(142),
        fontSize: normalizeSize(32),
        textAlign: 'center',
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.WHITE,
        letterSpacing: normalizeSize(-1.6),
        marginHorizontal: 'auto',
    },

    titleGreen: {
        color: COLORS.FIB_BG_100,
    },

    startTrialBtn: {
        paddingHorizontal: normalizeSize(28),
        paddingVertical: normalizeSize(16),
        backgroundColor: COLORS.FIB_BG_100,
        borderRadius: 19,
        minHeight: normalizeSize(56),
        marginTop: normalizeSize(24),

        alignItems: 'center',
        justifyContent: 'center',

        maxWidth: normalizeSize(290),
        width: '100%',
        marginHorizontal: 'auto',

        // **Shadow for iOS**
        shadowColor: '#3EBB6F', // Matches the color in CSS
        shadowOffset: { width: 0, height: 0 }, // No offset, centered shadow
        shadowOpacity: 1, // Fully visible shadow
        shadowRadius: 16, // Matches the blur intensity

        // **Shadow for Android**
        elevation: 16, // Roughly matches the effect on Android
    },

    startTrialBtnText: {
        fontSize: normalizeSize(16),
        textAlign: 'center',
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    list: {
        maxWidth: normalizeSize(240),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalizeSize(16),
        marginHorizontal: 'auto',
        marginTop: normalizeSize(32),
        marginBottom: normalizeSize(28),
        position: 'relative',
        left: normalizeSize(20),
    },

    listItem: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        gap: normalizeSize(2),
        position: 'relative',
    },

    listItemTitle: {
        fontSize: normalizeSize(16),

        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.WHITE,
        letterSpacing: normalizeSize(-0.64),
    },

    listItemDescription: {
        fontSize: normalizeSize(14),

        fontWeight: 400,
        fontFamily: 'Inter_400Regular',
        color: COLORS.WHITE,
        letterSpacing: normalizeSize(-0.14),
        opacity: 0.4,
    },

    checkIcon: {
        position: 'absolute',
        left: -4,
        transform: [{ translateX: '-100%' }],
    },

    termsText: {
        fontSize: normalizeSize(10),

        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.GREY,
        letterSpacing: normalizeSize(-0.2),
        opacity: 0.4,
        textAlign: 'center',

        marginTop: 'auto',
    },
    termsTextUnderLine: {
        textDecorationLine: 'underline',
    },

    modalBg: {
        width: width - 40,
        minHeight: normalizeSize(208),
        padding: normalizeSize(24),
        backgroundColor: COLORS.WHITE,
        borderRadius: 28,
        margin: 'auto',

        shadowColor: 'rgba(35, 26, 11, 1)', // React Native does not support alpha in shadowColor
        shadowOffset: { width: 0, height: 0 }, // No offset, centered shadow
        shadowOpacity: 0.12, // Matches the alpha value in rgba
        shadowRadius: 16, // Matches the blur intensity

        elevation: 8, // Android does not support shadowColor, so we use elevation
        alignItems: 'center',
    },

    headerModal: {
        alignSelf: 'stretch',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: normalizeSize(12),
    },

    modalTitle: {
        fontSize: normalizeSize(20),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.8),
        marginBottom: normalizeSize(24),
    },

    promoInput: {
        alignSelf: 'stretch',
        borderRadius: normalizeSize(18),
        borderWidth: 1,
        borderColor: COLORS.STROKE,
        minHeight: normalizeSize(56),
        paddingHorizontal: normalizeSize(16),
        paddingVertical: normalizeSize(16),

        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),

        marginBottom: normalizeSize(20),
    },

    bottomBtn: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BLACK100,
        borderRadius: 16,
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
