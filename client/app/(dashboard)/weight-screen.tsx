import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Platform, View, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import dayjs from 'dayjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { DropdownArrow } from '@/components';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EStatisticItemVariants, TLogsList } from '@/constants';
import { OnboardingContext } from '@/contexts';

const periodData = [
    {
        value: 0,
        lable: 'Today',
    },
    {
        value: 1,
        lable: 'Yesterday',
    },
    {
        value: 2,
        lable: dayjs().add(-2, 'd').format('MMM, DD'),
    },
];

const { width } = Dimensions.get('screen');

export default function WeightScreen() {
    const router = useRouter();

    const { weightUnits, convertWeight } = useContext(OnboardingContext);

    const inputRef = useRef<TextInput>(null);

    const [period, setPeriod] = useState<0 | 1 | 2>(0);

    const [count, setCount] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const saveWeightLog = async () => {
        try {
            let weight = count;
            const keys = await AsyncStorage.getAllKeys();
            const logKeys = keys.filter(key => key.startsWith('LOGS-'));

            const keyValuePairs = await AsyncStorage.multiGet(logKeys);
            const allLogs = keyValuePairs.flatMap(([_, value]) => {
                try {
                    const parsed: TLogsList[] = value ? JSON.parse(value) : [];
                    return parsed;
                } catch {
                    return [];
                }
            });

            const weightLogs = allLogs.filter(log => log?.type === EStatisticItemVariants?.WEIGHT);

            const newType = EStatisticItemVariants?.WEIGHT;

            const lastSameTypeLog = [...weightLogs]
                .filter(log => log.type === newType)
                .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
                .pop();

            const previousNowKg = lastSameTypeLog?.amount ?? 0;

            if (weightUnits === 'lb') {
                weight = convertWeight({ lb: Number(weight), to: 'kg' })?.toString();
            }

            const newLog = {
                date: dayjs().add(-period, 'd').format(),
                amount: weight,
                prevWeight: previousNowKg,
                type: newType,
            };

            const logKey = `LOGS-${dayjs().add(-period, 'd').format('DD-MM-YYYY')}`;

            const existing = await AsyncStorage.getItem(logKey);
            const existingLogs: TLogsList[] = existing ? JSON.parse(existing) : [];

            const updatedLogs = [...existingLogs, newLog];

            await AsyncStorage.setItem(logKey, JSON.stringify(updatedLogs));
        } catch (error) {
            console.error('Failed to save weight log:', error);
        }
    };

    const goDashboard = () => {
        saveWeightLog();
        router.push('/(dashboard)/weight-statistic-screen');
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.headerBlock}>
                <Text style={s.title}>Add weight</Text>

                <Dropdown
                    activeColor={'transparent'}
                    style={s.dropdown}
                    selectedTextStyle={s.selectedTextStyle}
                    containerStyle={s.containerSelect}
                    maxHeight={200}
                    value={period}
                    data={periodData}
                    valueField="value"
                    labelField="lable"
                    placeholder="Select country"
                    searchPlaceholder="Search..."
                    itemContainerStyle={s.itemContainerStyle}
                    renderRightIcon={visible => (
                        <DropdownArrow style={{ transform: [{ rotate: visible ? '0deg' : '180deg' }] }} />
                    )}
                    onChange={e => {
                        setPeriod(e.value);
                    }}
                    renderItem={(item, selected) => {
                        return (
                            <View style={[s.selectItem, item?.value === '1' && { paddingTop: normalizeSize(12) }]}>
                                <Text style={s.selectItemText}>{item?.lable}</Text>

                                <View style={[s.selectCircle, selected && s.selectedSelectCircle]}>
                                    <View style={[selected && s.selectedInnerCircle]} />
                                </View>
                            </View>
                        );
                    }}
                />
            </View>

            <View style={s.counter}>
                <View style={s.inputWrapper}>
                    <TextInput
                        ref={inputRef}
                        style={s.input}
                        value={count}
                        onChangeText={setCount}
                        keyboardType="numeric"
                        maxLength={3}
                        placeholder=""
                        placeholderTextColor={COLORS.BLACK100}
                        textAlign="center"
                    />
                    <Text style={s.unit}>{weightUnits === 'kg' ? 'g' : weightUnits}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={goDashboard} style={s.logBtn}>
                <Text style={s.logBtnText}>Log entry</Text>
            </TouchableOpacity>
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

    headerBlock: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalizeSize(55),
    },

    headerBlockGoal: {
        marginBottom: normalizeSize(17),
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        color: COLORS.BLACK40,
    },

    headerBlockGoalBold: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        color: COLORS.BLACK100,
    },

    title: {
        fontSize: normalizeSize(32),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1.6),
        marginBottom: normalizeSize(22),
    },

    dropdown: {
        minHeight: normalizeSize(32),
        minWidth: normalizeSize(120),
        maxWidth: normalizeSize(120),
        backgroundColor: 'transparent',
        borderColor: COLORS.STROKE,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: normalizeSize(12),
        paddingVertical: normalizeSize(8),
        alignItems: 'center',
        gap: normalizeSize(8),
    },

    selectedTextStyle: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.7),
        textAlign: 'center',
    },

    containerSelect: {
        width: normalizeSize(125),
        borderRadius: 8,
        backgroundColor: COLORS.WHITE,

        marginTop: normalizeSize(4),
        paddingHorizontal: normalizeSize(12),
        paddingBottom: normalizeSize(6),
    },

    selectItem: {
        paddingVertical: normalizeSize(6),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    selectItemText: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.7),
    },

    itemContainerStyle: { backgroundColor: COLORS.WHITE, borderRadius: 8 },

    selectCircle: {
        borderRadius: 100,
        width: normalizeSize(16),
        height: normalizeSize(16),
        borderWidth: 1,
        borderColor: COLORS.STROKE,
        alignItems: 'center',
        justifyContent: 'center',
    },

    selectedSelectCircle: { borderColor: COLORS.BLACK100 },

    selectedInnerCircle: {
        borderRadius: 100,
        width: normalizeSize(10),
        height: normalizeSize(10),
        backgroundColor: COLORS.BLACK100,
    },

    animatedWater: {
        position: 'absolute',
        bottom: 0,
        width: width,
    },

    gradientWater: {
        flex: 1,
        width: width,
    },

    wave: {
        position: 'absolute',
        top: -50,
        left: 0,
    },

    counter: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 'auto',
        gap: normalizeSize(28),
    },

    counterText: {
        fontSize: normalizeSize(40),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1.6),
    },

    btnsBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalizeSize(8),
    },

    counterBtn: {
        width: normalizeSize(108),
        height: normalizeSize(72),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 56,
        borderColor: COLORS.STROKE,
    },

    logBtn: {
        padding: normalizeSize(16),
        backgroundColor: COLORS.BLACK100,
        alignSelf: 'stretch',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.SHADOW_GRAY_WHITE,
        letterSpacing: normalizeSize(-0.64),
    },

    inputWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    input: {
        fontSize: normalizeSize(40),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1.6),
    },
    unit: {
        fontSize: normalizeSize(40),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-1.6),
    },
});
