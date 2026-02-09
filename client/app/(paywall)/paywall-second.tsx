import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StyleSheet, View, Text, Platform } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';

//@ts-ignore
import { DashedProgress } from 'react-native-dashed-progress';

import * as Haptics from 'expo-haptics';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('screen');

export default function PaywallSecondScreen() {
    const router = useRouter();

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(paywall)/paywall-third',
            params: {
                retakeFinish: retake?.length ? 'true' : '',
            },
        });
    };

    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newValue = Math.min(Math.floor((elapsed / 2000) * 100), 100);
            setCount(newValue);
            if (newValue === 100) {
                clearInterval(interval);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                nextScreenHandler();
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={s.container}>
            <View style={s.topTextBlock}>
                <Text style={s.title}>Сalculating your personal plan</Text>
            </View>

            <View
                style={{
                    width: width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 'auto',
                    marginBottom: normalizeSize(40),
                }}
            >
                <DashedProgress
                    strokeThickness={2}
                    fill={100}
                    countBars={100}
                    barWidth={20}
                    radius={130}
                    trailColor={'background: rgba(0, 0, 0, 0.12)'}
                    strokeColor="#64C567"
                    showIndicator={false}
                    tooltipSize={normalizeSize(60)}
                    tooltipColor={COLORS?.BLACK100}
                    tooltipFamily="Inter_600SemiBold"
                    duration={5000}
                    text={`${count}%`}
                />
            </View>

            <Image source={require('../../assets/images/emoji.png')} style={s.emoji} />

            <Text style={s.bottomTitle}>You are more active than 80% of people on the planet</Text>

            <Text style={s.descr}>
                Your activity is already helping you feel better and helping you progress. Keep it up and you'll see
                results
            </Text>
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
        paddingBottom: Platform.OS === 'ios' ? normalizeSize(20) : normalizeSize(40),
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

    emoji: {
        width: normalizeSize(40),
        height: normalizeSize(45),

        marginBottom: normalizeSize(5),
        marginTop: 'auto',
    },

    descr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: normalizeSize(260),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.28),

        opacity: 0.4,
    },

    bottomTitle: {
        fontSize: normalizeSize(20),
        textAlign: 'center',
        maxWidth: normalizeSize(257),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.8),
        marginBottom: normalizeSize(12),
    },
});
