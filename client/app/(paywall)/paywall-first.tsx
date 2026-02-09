import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StyleSheet, View, Text, Platform } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { ArrowButton } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('screen');

export default function PaywallFirstScreen() {
    const router = useRouter();

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(paywall)/paywall-second',
            params: {
                retake: retake,
            },
        });
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.topTextBlock}>
                <Text style={s.title}> You are more active than 80% of people on the planet</Text>
            </View>

            <LottieView
                autoPlay
                style={{
                    width: normalizeSize(width),
                    height: normalizeSize(303),
                    marginBottom: normalizeSize(45),
                }}
                source={require('../../assets/lottie/planet.json')}
            />

            <Text style={s.descr}>
                Your activity is already helping you feel better and helping you progress. Keep it up and you'll see
                results
            </Text>

            <ArrowButton style={s.nextBtn} onPress={nextScreenHandler} />
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

    nextBtn: {
        marginTop: 'auto',
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

    topTextBlock: {
        marginBottom: normalizeSize(33),
        marginTop: normalizeSize(55),
    },

    descr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: normalizeSize(252),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.28),

        marginBottom: normalizeSize(48),
    },
});
