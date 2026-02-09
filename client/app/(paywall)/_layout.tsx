import { Stack } from 'expo-router';

export default function PaywallLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="paywall-first" />
            <Stack.Screen name="paywall-second" />
            <Stack.Screen name="paywall-third" />
            <Stack.Screen name="paywall-fourth" />
        </Stack>
    );
}
