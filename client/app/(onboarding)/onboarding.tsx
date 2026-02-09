import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { ArrowButton } from '@/components';
import { useRouter } from 'expo-router';

export default function WelconeScreen() {
    const router = useRouter();

    const nextScreenHandler = () => router.push('/(onboarding)/welcome-first');

    return (
        <ImageBackground
            source={require('../../assets/images/onboarding-first-screen-bg.png')}
            style={s.background}
            resizeMode="cover"
        >
            <SafeAreaView style={s.container}>
                <View style={s.bottomBlock}>
                    <Text style={s.title}>AI-powered food journal</Text>
                    <Text style={s.decr}>We’ve made your path to success easier with modern technology</Text>

                    <ArrowButton onPress={nextScreenHandler} />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const s = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 0 : normalizeSize(20),
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
        maxWidth: 250,
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: -1.6,
    },

    decr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: 252,
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
        marginTop: normalizeSize(12),
        marginBottom: normalizeSize(36),
        letterSpacing: -0.28,
    },
});
