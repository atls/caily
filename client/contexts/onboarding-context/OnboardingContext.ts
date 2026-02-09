'use client';

import { createContext, SetStateAction } from 'react';

export type WeightInput =
    | { g?: number; kg?: number; lb?: never; to: 'lb' }
    | { lb: number; g?: never; kg?: never; to: 'kg' | 'g' };

type TOnboardingContext = {
    gender: 'male' | 'female' | null;
    age: number | null;

    userHeight: number | null;
    userWeight: number | null;

    userGoal: number | null;

    isCaloriesCounting: boolean | null;

    exercise: { times: string | null; freq: string | null; nope: boolean };

    userJob: string | null;
    steps: number;

    avatar: '1' | '2' | '3' | '4' | '5' | '6';
    deviceId: string | null;
    userName: string;
    weightUnits: 'kg' | 'lb';
    heightUnits: 'cm' | 'ft' | 'in';

    setGender: React.Dispatch<React.SetStateAction<'male' | 'female' | null>>;
    setAge: React.Dispatch<React.SetStateAction<number | null>>;
    setUserHeight: React.Dispatch<React.SetStateAction<number | null>>;
    setUserWeight: React.Dispatch<React.SetStateAction<number | null>>;

    setUserGoal: React.Dispatch<React.SetStateAction<number | null>>;

    setIsCaloriesCounting: React.Dispatch<React.SetStateAction<boolean | null>>;
    setExercise: React.Dispatch<React.SetStateAction<{ times: string | null; freq: string | null; nope: boolean }>>;

    setUserJob: React.Dispatch<React.SetStateAction<string | null>>;
    setSteps: React.Dispatch<React.SetStateAction<number>>;

    setAvatar: React.Dispatch<React.SetStateAction<'1' | '2' | '3' | '4' | '5' | '6'>>;

    setUserName: React.Dispatch<React.SetStateAction<string>>;

    convertWeight: (param: WeightInput) => number;

    setWeightUnits: React.Dispatch<React.SetStateAction<'kg' | 'lb'>>;

    setHeightUnits: React.Dispatch<React.SetStateAction<'cm' | 'ft' | 'in'>>;
};

const defaultValue: TOnboardingContext = {
    gender: null,
    age: null,
    userHeight: null,
    userWeight: null,
    userGoal: null,
    isCaloriesCounting: null,
    exercise: {
        times: null,
        freq: null,
        nope: false,
    },
    userJob: null,
    deviceId: null,
    steps: 5000,
    avatar: '1',
    userName: 'User',
    weightUnits: 'kg',
    heightUnits: 'cm',

    setGender: function (value: SetStateAction<'male' | 'female' | null>): void {
        throw new Error('Function not implemented.');
    },
    setAge: function (value: SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
    },
    setUserHeight: function (value: SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
    },
    setUserWeight: function (value: SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
    },
    setUserGoal: function (value: SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
    },
    setIsCaloriesCounting: function (value: SetStateAction<boolean | null>): void {
        throw new Error('Function not implemented.');
    },
    setExercise: function (value: SetStateAction<{ times: string | null; freq: string | null; nope: boolean }>): void {
        throw new Error('Function not implemented.');
    },
    setUserJob: function (value: SetStateAction<string | null>): void {
        throw new Error('Function not implemented.');
    },
    setSteps: function (value: SetStateAction<number>): void {
        throw new Error('Function not implemented.');
    },
    setAvatar: function (value: SetStateAction<'1' | '2' | '3' | '4' | '5' | '6'>): void {
        throw new Error('Function not implemented.');
    },
    setUserName: function (value: SetStateAction<string>): void {
        throw new Error('Function not implemented.');
    },

    convertWeight: function (param: WeightInput): number {
        throw new Error('Function not implemented.');
    },

    setWeightUnits: function (value: SetStateAction<'kg' | 'lb'>): void {
        throw new Error('Function not implemented.');
    },
    setHeightUnits: function (value: SetStateAction<'cm' | 'ft' | 'in'>): void {
        throw new Error('Function not implemented.');
    },
};

export const OnboardingContext = createContext(defaultValue);
