import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Platform, View, Text, Animated, Dimensions, Easing, TouchableOpacity } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { DropdownArrow, MinusIcon, PlusIcon } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EStatisticItemVariants, TLogsList, TLogsWaterItem } from '@/constants';

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

const { height, width, scale } = Dimensions.get('screen');

export default function WaterScreen() {
    const router = useRouter();

    const [period, setPeriod] = useState<0 | 1 | 2>(0);

    const [count, setCount] = useState(250);

    const [heightFill, setHeightFill] = useState<number>(0);
    const [lastValue, setLastValue] = useState<TLogsWaterItem | null>(null);

    const waterHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        getWaterLogs();
    }, []);

    const getWaterLogs = async () => {
        try {
            const key = `LOGS-${dayjs().add(-period, 'd').format('DD-MM-YYYY')}`;

            const existing = await AsyncStorage.getItem(key);
            const logs: TLogsList[] = existing ? JSON.parse(existing) : [];

            logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const waterLogs = logs?.filter(log => log?.type === EStatisticItemVariants?.WATER);
            const lastWaterLog = waterLogs?.[0];

            setLastValue(lastWaterLog ?? null);

            if (lastWaterLog) {
                const { nowMl, goal } = lastWaterLog;

                const maxHeightInPixels = height * scale;
                const percentage = Math.min(nowMl / goal, 1);
                const calculatedHeight = Math.floor(percentage * maxHeightInPixels);

                setHeightFill(calculatedHeight);
            } else {
                setHeightFill(0);
            }
        } catch (error) {
            console.error('Failed to load water logs:', error);
        }
    };

    const saveWaterLog = async () => {
        try {
            const key = `LOGS-${dayjs().add(-period, 'd').format('DD-MM-YYYY')}`;
            const existing = await AsyncStorage.getItem(key);
            const logs = existing ? JSON.parse(existing) : [];

            const newType = EStatisticItemVariants?.WATER;

            const lastSameTypeLog = [...logs]
                .filter(log => log.type === newType)
                .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
                .pop();

            const previousNowMl = lastSameTypeLog?.nowMl ?? 0;

            const newLog = {
                date: dayjs().add(-period, 'd').format(),
                amount: count,
                nowMl: previousNowMl + count,
                goal: 2400,
                type: newType,
            };

            const updatedLogs = [...logs, newLog];

            await AsyncStorage.setItem(key, JSON.stringify(updatedLogs));
        } catch (error) {
            console.error('Failed to save water log:', error);
        }
    };

    const goDashboard = () => {
        saveWaterLog();
        router.push('/(dashboard)/dashboard');
    };

    useEffect(() => {
        Animated.timing(waterHeight, {
            toValue: heightFill / 2,
            duration: 4000,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.ease),
        }).start();
    }, [heightFill]);

    const increaseWaterHandler = () => {
        setCount(c => c + 50);
    };

    const decreaseWaterHandler = () => {
        setCount(c => (c >= 50 ? c - 50 : c));
    };

    return (
        <SafeAreaView style={s.container}>
            <Animated.View style={[s.animatedWater, { height: waterHeight }]}>
                <LinearGradient
                    colors={['#F5FBFF', '#AED9FF']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={s.gradientWater}
                />

                <Svg height={50} width={width} viewBox={`0 0 ${width} 50`} style={s.wave}>
                    <Path d={`M0 30 Q ${width / 4} 0, ${width / 2} 30 T ${width} 30 V60 H0 Z`} fill="#F5FBFF" />
                </Svg>
            </Animated.View>
            <View style={s.headerBlock}>
                {!lastValue && (
                    <Text style={s.headerBlockGoal}>
                        Recommended goal:
                        <Text style={s.headerBlockGoalBold}> 2400ml or 7 cups</Text>
                    </Text>
                )}

                {lastValue && (
                    <Text style={s.headerBlockGoal}>
                        <Text style={s.headerBlockGoalBold}>Today {lastValue.nowMl}ml</Text> of {lastValue.goal}ml
                    </Text>
                )}

                <Text style={s.title}>Add water</Text>

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
                <Text style={s.counterText}>{count} ml</Text>

                <View style={s.btnsBlock}>
                    <TouchableOpacity onPress={decreaseWaterHandler} style={s.counterBtn}>
                        <MinusIcon width={16} height={8} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={increaseWaterHandler} style={s.counterBtn}>
                        <PlusIcon width={16} height={16} />
                    </TouchableOpacity>
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
});
