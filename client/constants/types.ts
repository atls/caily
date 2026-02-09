export enum EStatisticItemVariants {
    WATER = 'WATER',
    FOOD = 'FOOD',
    ACTIVITY = 'ACTIVITY',
    WEIGHT = 'WEIGHT',
}

export type TLogsItemDefault = { date: string };

export type TLogsWaterItem = TLogsItemDefault & {
    type: EStatisticItemVariants.WATER;
    amount: number;
    nowMl: number;
    goal: number;
};

export type TLogsWeightItem = TLogsItemDefault & {
    type: EStatisticItemVariants.WEIGHT;
    amount: number;
    prevWeight: number;
};

export type TLogsActivityItem = TLogsItemDefault & {
    type: EStatisticItemVariants.ACTIVITY;
    text: string;
    kcal: number;
    ml: number;
    hours: number;
    mins: number;
    km: number;
};

export type TLogsFoodItem = TLogsItemDefault & {
    type: EStatisticItemVariants.FOOD;
    text: string;
    sugar: string;
    fiber: string;
    water: string;
    protein: string;
    fat: string;
    carbo: string;
    kcal: string;
    portion: string;
    cooked: string;
};

export type TLogsList = TLogsWaterItem | TLogsWeightItem | TLogsActivityItem | TLogsFoodItem;
