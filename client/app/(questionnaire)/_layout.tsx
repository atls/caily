import { Stack } from 'expo-router';

export default function QuestionLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="question-first" />
            <Stack.Screen name="question-second" />
            <Stack.Screen name="question-third" />
            <Stack.Screen name="question-fourth" />
            <Stack.Screen name="question-fifth" />
            <Stack.Screen name="question-sixth" />
            <Stack.Screen name="question-seventh" />
        </Stack>
    );
}
