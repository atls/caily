import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { ArrowButton, WhiteGradient } from '@/components';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('screen');

export default function WelconeScreenThird() {
    const nextScreenHandler = () => router.push('/(questionnaire)/question-first');

    return (
        <SafeAreaView style={s.container}>
            <View style={s.rectangle} />
            <WhiteGradient width={width} style={s.gradient} />

            <View style={s.bottomBlock}>
                <Text style={s.title}>The way to your dream body is easier starting today</Text>
                <Text style={s.decr}>
                    Get support every step of the way and start your journey to the perfect result
                </Text>

                <ArrowButton onPress={nextScreenHandler} />
            </View>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: COLORS.WHITE,
        position: 'relative',
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
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
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
        maxWidth: 305,
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: -1.6,
    },

    decr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: 272,
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
        marginTop: normalizeSize(12),
        marginBottom: normalizeSize(37),
        letterSpacing: -0.28,
    },
});
