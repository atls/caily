import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Index() {
    const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

    const getAuthState = async () => {
        const res = await AsyncStorage.getItem('auth');
        return res ?? 'false';
    };

    useEffect(() => {
        const checkAuth = async () => {
            const authed = await getAuthState();
            setIsAuthed(JSON.parse(authed));
        };

        checkAuth();
    }, []);

    if (isAuthed === null) return null;

    return <Redirect href={!!isAuthed ? '/(dashboard)/dashboard' : '/(onboarding)/onboarding'} />;
}
