import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="welcome-first" />
            <Stack.Screen name="welcome-second" />
            <Stack.Screen name="welcome-third" />
        </Stack>
    );
}
