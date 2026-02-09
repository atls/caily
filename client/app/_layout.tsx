import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Inter_600SemiBold, Inter_500Medium, Inter_400Regular, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import 'react-native-get-random-values';

import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

import { OnboardingProvider } from '@/contexts';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 1000, fade: true });

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter_600SemiBold,
        Inter_500Medium,
        Inter_400Regular,
    });

    const getOrCreateUniqueId = async () => {
        let uniqueId = await SecureStore.getItemAsync('uniqueId');

        if (!uniqueId) {
            uniqueId = uuidv4();

            console.log(uniqueId, 'uniqueId here');
            await SecureStore.setItemAsync('uniqueId', uniqueId);
        }
    };

    useEffect(() => {
        getOrCreateUniqueId();
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) return null;

    return (
        <ThemeProvider value={DefaultTheme}>
            <OnboardingProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(onboarding)" />
                    <Stack.Screen name="(questionnaire)" />
                    <Stack.Screen name="(paywall)" />
                    <Stack.Screen name="(dashboard)" />
                    <Stack.Screen name="(profile)" />
                </Stack>
                <StatusBar style="auto" />
            </OnboardingProvider>
        </ThemeProvider>
    );
}
