'use client';
import { memo, PropsWithChildren, useEffect, useState } from 'react';

import { OnboardingContext, WeightInput } from './OnboardingContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customAlphabet } from 'nanoid';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';

export const OnboardingProvider = memo((props: PropsWithChildren) => {
    const { children } = props;

    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [userHeight, setUserHeight] = useState<number | null>(null);
    const [userWeight, setUserWeight] = useState<number | null>(null);
    const [userGoal, setUserGoal] = useState<number | null>(null);

    const [isCaloriesCounting, setIsCaloriesCounting] = useState<boolean | null>(null);

    const [steps, setSteps] = useState<number>(5000);

    const [exercise, setExercise] = useState<{ times: string | null; freq: string | null; nope: boolean }>({
        times: null,
        freq: null,
        nope: false,
    });

    const [userJob, setUserJob] = useState<string | null>(null);

    const [avatar, setAvatar] = useState<'1' | '2' | '3' | '4' | '5' | '6'>('1');

    const [deviceId, setDeviceId] = useState<string | null>(null);

    const [userName, setUserName] = useState<string>('User');

    const [weightUnits, setWeightUnits] = useState<'kg' | 'lb'>('kg');
    const [heightUnits, setHeightUnits] = useState<'cm' | 'ft' | 'in'>('cm');

    useEffect(() => {
        getAvatarNumber();
        uniqueDeviceId();
        getUserName();
    }, []);

    const getAvatarNumber = async () => {
        const avatar = (await AsyncStorage.getItem('user-avatar')) as '1' | '2' | '3' | '4' | '5' | '6';
        setAvatar(avatar ?? '1');
    };

    const getUserName = async () => {
        const name = await AsyncStorage.getItem('user-name');
        setUserName(name ?? 'User');
    };

    const generateNumericId = customAlphabet('0123456789', 10);

    const uniqueDeviceId = async () => {
        let uuid = generateNumericId();
        let fetchUUID = await SecureStore.getItemAsync('user_deviceId');

        if (fetchUUID) {
            uuid = JSON.parse(fetchUUID);
        }

        await SecureStore.setItemAsync('user_deviceId', JSON.stringify(uuid));
        setDeviceId(uuid);
    };

    function convertWeight(input: WeightInput): number {
        if (input.to === 'lb' && weightUnits === 'lb') {
            const totalGrams = input.g ?? (input.kg !== undefined ? input.kg * 1000 : 0);
            const pounds = totalGrams / 453.59237;
            return +pounds.toFixed(2);
        }

        if (input.lb && input.to === 'kg') {
            const kg = input.lb * 0.45359237;
            return +kg.toFixed(2);
        }

        if (input.lb && input.to === 'g') {
            const grams = input.lb * 453.59237;
            return +grams.toFixed(2);
        }

        if (weightUnits === 'kg' && input.kg) {
            return input.kg;
        }

        if (weightUnits === 'kg' && input.g) {
            return input.g;
        }

        return 0;
    }
    type LengthInput = { cm?: number; m?: number };

    function convertLength({ cm, m }: LengthInput): { feet: number; inches: number } {
        const totalCm = cm ?? (m !== undefined ? m * 100 : 0);
        const totalInches = totalCm / 2.54;

        const feet = Math.floor(totalInches / 12);
        const inches = +(totalInches % 12).toFixed(2); // округляем до 2 знаков

        return { feet, inches };
    }

    return (
        <OnboardingContext.Provider
            value={{
                gender,
                age,
                userHeight,
                userWeight,
                userGoal,
                isCaloriesCounting,
                exercise,
                userJob,
                steps,
                avatar,
                deviceId,
                userName,
                weightUnits,
                heightUnits,

                setGender,
                setAge,
                setUserHeight,
                setUserWeight,
                setUserGoal,
                setIsCaloriesCounting,
                setExercise,
                setUserJob,
                setSteps,
                setAvatar,
                setUserName,
                convertWeight,

                setWeightUnits,
                setHeightUnits,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
});

OnboardingProvider.displayName = 'OnboardingProvider';
