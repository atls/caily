import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Platform, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EStatisticItemVariants, TLogsList, TLogsWeightItem } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { WeightIcon } from '@/components';
import dayjs from 'dayjs';
import { OnboardingContext } from '@/contexts';

export default function WeightStatisticScreen() {
    const router = useRouter();
    const [logs, setLogs] = useState<TLogsList[]>([]);

    const { weightUnits, convertWeight } = useContext(OnboardingContext);

    useEffect(() => {
        setTimeout(getAllWaterLogs, 100);
    }, []);

    const getAllWaterLogs = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const logKeys = keys.filter(key => key.startsWith('LOGS-'));

            const keyValuePairs = await AsyncStorage.multiGet(logKeys);
            const allLogs = keyValuePairs.flatMap(([key, value]) => {
                try {
                    const parsed: TLogsList[] = value ? JSON.parse(value) : [];
                    return parsed;
                } catch {
                    return [];
                }
            });

            const weightLogs = allLogs.filter(log => log?.type === EStatisticItemVariants?.WEIGHT);

            setLogs(weightLogs);
        } catch (error) {
            console.error('Failed to load all water logs:', error);
        }
    };

    const goDashboard = () => {
        router.push('/(dashboard)/dashboard');
    };

    const lastLogs = logs?.slice(-7);
    const maxAmount = Math.max(...lastLogs.map(log => Number((log as TLogsWeightItem).amount)));

    const sortedLogs = logs
        .map(log => ({ ...log, dateObj: new Date(log.date) }))
        .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const newLog = [sortedLogs[0]];

    const thisMonthLogs = sortedLogs
        .slice(1)
        .filter(log => log.dateObj.getMonth() === currentMonth && log.dateObj.getFullYear() === currentYear);

    const pastMonthLogs = sortedLogs.slice(1).filter(log => {
        const prevMonth = (currentMonth + 11) % 12;
        const year = currentMonth === 0 ? currentYear - 1 : currentYear;
        return log.dateObj.getMonth() === prevMonth && log.dateObj.getFullYear() === year;
    });

    return (
        <SafeAreaView style={s.container}>
            <LinearGradient
                colors={['rgba(255, 255, 255, 0)', 'rgb(255, 255, 255)']}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={s.topGradient}
            />

            <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
                <View style={s.scrollContainer}>
                    <View style={s.headerBlock}>
                        <Text style={s.title}>Weight has updated</Text>
                        <Text style={s.descr}>
                            Every step is progress. Patience and consistency matter most. You’ve got this! 🚀
                        </Text>
                    </View>

                    <View style={s.weightBlockList}>
                        {lastLogs?.map((log, i) => {
                            const height = (Number((log as TLogsWeightItem).amount) / maxAmount) * 140;
                            const lastItem = lastLogs?.length - 1 === i;

                            return (
                                <Fragment key={log?.date}>
                                    <View style={s.border} />
                                    <View style={s.weightBlockWrapper}>
                                        <View style={s.weightBlock}>
                                            <View
                                                style={[
                                                    s.weightBlockGraph,
                                                    { height },
                                                    lastItem && { backgroundColor: COLORS.FIB_BG_100 },
                                                ]}
                                            />
                                            <Text style={[s.weightBlockText, lastItem && { color: COLORS.FIB_BG_100 }]}>
                                                {convertWeight({ kg: (log as TLogsWeightItem)?.amount, to: 'lb' })}
                                            </Text>
                                        </View>
                                    </View>
                                </Fragment>
                            );
                        })}
                    </View>

                    <View style={s.logsList}>
                        <Text style={s.timeTitle}>New</Text>
                        {newLog?.map(log => {
                            if (log?.type === EStatisticItemVariants.WEIGHT) {
                                const weight = log.prevWeight ? log.amount - log.prevWeight : 0;
                                const weightPercent = Math.abs((log.amount * weight) / 100);

                                return (
                                    <View style={s.logItem} key={log?.date}>
                                        <View style={s.waterContainer}>
                                            <View style={s.weightTitleBlock}>
                                                <View style={s.weightTitleBlockLeft}>
                                                    <WeightIcon />
                                                    <Text style={s.waterContainerTitle}>
                                                        {convertWeight({ kg: log.amount, to: 'lb' })} {weightUnits}
                                                    </Text>
                                                </View>

                                                <View
                                                    style={[
                                                        s.weightTitleBlockRight,
                                                        weight > 0 && { backgroundColor: COLORS.RED },
                                                        weight < 0 && { backgroundColor: COLORS.GREEN_100 },
                                                    ]}
                                                >
                                                    <Text style={s.weightTitleBlockRightText}>
                                                        {!!log?.prevWeight
                                                            ? `${weight > 0 ? '+' : '-'}${Math.abs(weight)?.toFixed(
                                                                  2
                                                              )} (${weightPercent?.toFixed(2)}%)`
                                                            : '0 (0,0%)'}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={s.waterProgressBlock}>
                                                <View style={s.waterProgressBlockBottom}>
                                                    <Text style={s.waterMarkerText}>
                                                        Your goal <Text style={s.waterMarkerTextBold}>Lose weight</Text>
                                                    </Text>

                                                    <Text style={s.logTime}>{dayjs(log?.date).format('HH:mm')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }
                        })}
                    </View>

                    {!!thisMonthLogs?.length && (
                        <View style={s.logsList}>
                            <Text style={s.timeTitle}>This month</Text>
                            {thisMonthLogs?.map(log => {
                                if (log?.type === EStatisticItemVariants.WEIGHT) {
                                    const weight = log.prevWeight ? log.amount - log.prevWeight : 0;
                                    const weightPercent = Math.abs((log.amount * weight) / 100);

                                    return (
                                        <View style={s.logItem} key={log?.date}>
                                            <View style={s.waterContainer}>
                                                <View style={s.weightTitleBlock}>
                                                    <View style={s.weightTitleBlockLeft}>
                                                        <WeightIcon />
                                                        <Text style={s.waterContainerTitle}>
                                                            {convertWeight({ kg: log.amount, to: 'lb' })} {weightUnits}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            s.weightTitleBlockRight,
                                                            weight > 0 && { backgroundColor: COLORS.RED },
                                                            weight < 0 && { backgroundColor: COLORS.GREEN_100 },
                                                        ]}
                                                    >
                                                        <Text style={s.weightTitleBlockRightText}>
                                                            {!!log?.prevWeight
                                                                ? `${weight > 0 ? '+' : '-'}${Math.abs(weight)?.toFixed(
                                                                      2
                                                                  )} (${weightPercent?.toFixed(2)}%)`
                                                                : '0 (0,0%)'}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={s.waterProgressBlock}>
                                                    <View style={s.waterProgressBlockBottom}>
                                                        <Text style={s.waterMarkerText}>
                                                            Your goal{' '}
                                                            <Text style={s.waterMarkerTextBold}>Lose weight</Text>
                                                        </Text>

                                                        <Text style={s.logTime}>
                                                            {dayjs(log?.date).format('HH:mm')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    )}

                    {!!pastMonthLogs?.length && (
                        <View style={s.logsList}>
                            <Text style={s.timeTitle}>Past month</Text>
                            {pastMonthLogs?.map(log => {
                                if (log?.type === EStatisticItemVariants.WEIGHT) {
                                    const weight = log.prevWeight ? log.amount - log.prevWeight : 0;
                                    const weightPercent = Math.abs((log.amount * weight) / 100);

                                    return (
                                        <View style={s.logItem} key={log?.date}>
                                            <View style={s.waterContainer}>
                                                <View style={s.weightTitleBlock}>
                                                    <View style={s.weightTitleBlockLeft}>
                                                        <WeightIcon />
                                                        <Text style={s.waterContainerTitle}>
                                                            {convertWeight({ kg: log.amount, to: 'lb' })} {weightUnits}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            s.weightTitleBlockRight,
                                                            weight > 0 && { backgroundColor: COLORS.RED },
                                                            weight < 0 && { backgroundColor: COLORS.GREEN_100 },
                                                        ]}
                                                    >
                                                        <Text style={s.weightTitleBlockRightText}>
                                                            {!!log?.prevWeight
                                                                ? `${weight > 0 ? '+' : '-'}${Math.abs(weight)?.toFixed(
                                                                      2
                                                                  )} (${weightPercent?.toFixed(2)}%)`
                                                                : '0 (0,0%)'}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={s.waterProgressBlock}>
                                                    <View style={s.waterProgressBlockBottom}>
                                                        <Text style={s.waterMarkerText}>
                                                            Your goal{' '}
                                                            <Text style={s.waterMarkerTextBold}>Lose weight</Text>
                                                        </Text>

                                                        <Text style={s.logTime}>
                                                            {dayjs(log?.date).format('HH:mm')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            <LinearGradient
                colors={['rgba(255,255,255,0)', '#FFFFFF']}
                locations={[0.0254, 0.6188]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.48, y: 1 }}
                style={s.btnBlock}
            >
                <TouchableOpacity onPress={goDashboard} style={s.logBtn}>
                    <Text style={s.logBtnText}>Close</Text>
                </TouchableOpacity>
            </LinearGradient>
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

    topGradient: { width: '100%', height: normalizeSize(120), position: 'absolute', top: 0, left: 0, zIndex: 2 },

    scroll: {
        width: '100%',
    },

    scrollContainer: {
        width: '100%',
        flexDirection: 'column',
        paddingBottom: normalizeSize(140),
    },

    headerBlock: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalizeSize(55),
        gap: normalizeSize(9),
    },

    title: {
        fontSize: normalizeSize(32),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1.6),
    },

    descr: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        textAlign: 'center',
        color: COLORS.BLACK100,
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

    btnBlock: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'flex-end',
        height: normalizeSize(140),
        paddingBottom: normalizeSize(24),
    },

    weightBlockList: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: normalizeSize(4),
        marginTop: normalizeSize(28),
    },

    border: {
        height: normalizeSize(140),
        borderRightWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.STROKE,
    },

    weightBlockWrapper: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignSelf: 'stretch',
    },

    weightBlock: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalizeSize(11),
    },

    weightBlockGraph: {
        width: normalizeSize(38),
        height: normalizeSize(140),
        backgroundColor: COLORS.GREY,
        borderRadius: 8,
    },

    weightBlockText: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        textAlign: 'center',
        color: COLORS.BLACK20,
    },

    logsList: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: normalizeSize(4),
        width: '100%',
        padding: normalizeSize(4),
        marginTop: normalizeSize(28),
    },

    logItem: {
        alignSelf: 'stretch',
        padding: normalizeSize(12),

        borderRadius: 12,
        backgroundColor: COLORS.WHITE,
        shadowColor: 'rgba(35, 26, 11, 0.72)',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 4, // для Android
    },

    waterContainer: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        gap: normalizeSize(14),
    },

    weightTitleBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(8),
    },

    weightTitleBlockLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(2),
    },

    weightTitleBlockRight: {
        paddingVertical: normalizeSize(2),
        paddingHorizontal: normalizeSize(4),
        borderRadius: 100,
        backgroundColor: COLORS.BLACK40,
    },

    weightTitleBlockRightText: {
        fontSize: normalizeSize(10),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.2),
        color: COLORS.WHITE,
    },

    waterContainerTitle: {
        fontSize: normalizeSize(20),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1),
    },

    waterProgressBlock: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        gap: normalizeSize(8),
    },

    waterProgressBlockBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: normalizeSize(16),
    },

    waterMarkerText: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
        textAlign: 'left',
        color: COLORS.BLACK40,
    },

    waterMarkerTextBold: {
        color: COLORS.BLACK100,
    },

    logTime: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
        textAlign: 'right',
        color: COLORS.BLACK40,
    },

    timeTitle: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
        textAlign: 'left',
        color: COLORS.BLACK40,
        marginBottom: normalizeSize(8),
    },
});
