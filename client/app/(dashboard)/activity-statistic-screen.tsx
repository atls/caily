import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Platform, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EStatisticItemVariants, TLogsList } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { KcalFireIcon, KmFlagIcon, MlWaterIcon } from '@/components';
import dayjs from 'dayjs';

export default function ActivityStatisticScreen() {
    const router = useRouter();
    const [logs, setLogs] = useState<TLogsList[]>([]);

    useEffect(() => {
        setTimeout(getAllActivityLogs, 100);
    }, []);

    const getAllActivityLogs = async () => {
        try {
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

            const weightLogs = allLogs.filter(log => log?.type === EStatisticItemVariants?.ACTIVITY);

            setLogs(weightLogs);
        } catch (error) {
            console.error('Failed to load all water logs:', error);
        }
    };

    const goDashboard = () => {
        router.push('/(dashboard)/dashboard');
    };

    const sortedLogs = logs
        .map(log => ({ ...log, dateObj: new Date(log.date) }))
        .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    const newLog = [sortedLogs[0]];

    const newLogDate = newLog.length > 0 ? newLog[0].date : null;

    const startOfThisWeek = dayjs().startOf('week');
    const endOfThisWeek = dayjs().endOf('week');
    const startOfLastWeek = dayjs().subtract(1, 'week').startOf('week');
    const endOfLastWeek = dayjs().subtract(1, 'week').endOf('week');

    const thisWeekLogs = sortedLogs.filter(
        log => dayjs(log.date).isAfter(startOfThisWeek) && dayjs(log.date).isBefore(endOfThisWeek)
    );

    const lastWeekLogs = sortedLogs.filter(
        log => dayjs(log.date).isAfter(startOfLastWeek) && dayjs(log.date).isBefore(endOfLastWeek)
    );

    const thisWeekLogsWithoutNew = thisWeekLogs.filter(log => log.date !== newLogDate);

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
                        <View style={s.progressBlock}>
                            <View style={[s.progressItem, { backgroundColor: COLORS.ACTIVITY_GREEN_30 }]}>
                                <View style={[s.progressItemCircle, { backgroundColor: '#3EBB6F', opacity: 1 }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#3EBB6F' }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#3EBB6F' }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#3EBB6F' }]} />
                            </View>

                            <View style={[s.progressItem, { backgroundColor: COLORS.ACTIVITY_ORANGE_30 }]}>
                                <View style={[s.progressItemCircle, { backgroundColor: '#DC8A2D' }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#DC8A2D' }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#DC8A2D' }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#DC8A2D' }]} />
                            </View>

                            <View style={[s.progressItem, { backgroundColor: COLORS.ACTIVITY_RED_30 }]}>
                                <View style={[s.progressItemCircle, { backgroundColor: '#E44331' }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#E44331' }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#E44331' }]} />
                                <View style={[s.progressItemCircle, { backgroundColor: '#E44331' }]} />
                            </View>
                        </View>

                        <Text style={s.title}>Activity has updated </Text>
                    </View>

                    <View style={s.logsList}>
                        <Text style={s.timeTitle}>New</Text>
                        {newLog?.map(log => {
                            if (log?.type === EStatisticItemVariants.ACTIVITY) {
                                return (
                                    <View style={s.logItem} key={log?.date}>
                                        <View style={s.waterContainer}>
                                            <View style={s.weightTitleBlock}>
                                                {log.kcal && (
                                                    <View style={s.activityTitleBlockLeft}>
                                                        <KcalFireIcon />
                                                        <Text style={s.waterContainerTitle}>{log.kcal} kcal</Text>
                                                    </View>
                                                )}

                                                {log.ml && (
                                                    <View style={s.activityTitleBlockLeft}>
                                                        <MlWaterIcon />
                                                        <Text style={s.waterContainerTitle}>{log.ml} ml</Text>
                                                    </View>
                                                )}

                                                {log.km && (
                                                    <View style={s.activityTitleBlockLeft}>
                                                        <KmFlagIcon />
                                                        <Text style={s.waterContainerTitle}>{log.km} km</Text>
                                                    </View>
                                                )}
                                            </View>

                                            <View style={s.waterProgressBlock}>
                                                <View style={s.waterProgressBlockBottom}>
                                                    <View style={s.activityMarkerContent}>
                                                        <Text style={s.activityMarkerText}>{log.text}</Text>

                                                        {(log.hours || log.mins) && (
                                                            <Text style={s.activityMarkerTime}>
                                                                {log.hours && <Text>{log.hours}h</Text>}{' '}
                                                                {log.mins && <Text>{log.mins}min</Text>}
                                                            </Text>
                                                        )}
                                                    </View>

                                                    <Text style={s.logTime}>{dayjs(log?.date).format('HH:mm')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }
                        })}
                    </View>

                    {!!thisWeekLogsWithoutNew?.length && (
                        <View style={s.logsList}>
                            <Text style={s.timeTitle}>This week</Text>
                            {thisWeekLogsWithoutNew?.map(log => {
                                if (log?.type === EStatisticItemVariants.ACTIVITY) {
                                    return (
                                        <View style={s.logItem} key={log?.date}>
                                            <View style={s.waterContainer}>
                                                <View style={s.weightTitleBlock}>
                                                    {log.kcal && (
                                                        <View style={s.activityTitleBlockLeft}>
                                                            <KcalFireIcon />
                                                            <Text style={s.waterContainerTitle}>{log.kcal} kcal</Text>
                                                        </View>
                                                    )}

                                                    {log.ml && (
                                                        <View style={s.activityTitleBlockLeft}>
                                                            <MlWaterIcon />
                                                            <Text style={s.waterContainerTitle}>{log.ml} ml</Text>
                                                        </View>
                                                    )}

                                                    {log.km && (
                                                        <View style={s.activityTitleBlockLeft}>
                                                            <KmFlagIcon />
                                                            <Text style={s.waterContainerTitle}>{log.km} km</Text>
                                                        </View>
                                                    )}
                                                </View>

                                                <View style={s.waterProgressBlock}>
                                                    <View style={s.waterProgressBlockBottom}>
                                                        <View style={s.activityMarkerContent}>
                                                            <Text style={s.activityMarkerText}>{log.text}</Text>

                                                            {(log.hours || log.mins) && (
                                                                <Text style={s.activityMarkerTime}>
                                                                    {log.hours && <Text>{log.hours}h</Text>}{' '}
                                                                    {log.mins && <Text>{log.mins}min</Text>}
                                                                </Text>
                                                            )}
                                                        </View>

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

                    {!!lastWeekLogs?.length && (
                        <View style={s.logsList}>
                            <Text style={s.timeTitle}>Past week</Text>
                            {lastWeekLogs?.map(log => {
                                if (log?.type === EStatisticItemVariants.ACTIVITY) {
                                    return (
                                        <View style={s.logItem} key={log?.date}>
                                            <View style={s.waterContainer}>
                                                <View style={s.weightTitleBlock}>
                                                    {log.kcal && (
                                                        <View style={s.activityTitleBlockLeft}>
                                                            <KcalFireIcon />
                                                            <Text style={s.waterContainerTitle}>{log.kcal} kcal</Text>
                                                        </View>
                                                    )}

                                                    {log.ml && (
                                                        <View style={s.activityTitleBlockLeft}>
                                                            <MlWaterIcon />
                                                            <Text style={s.waterContainerTitle}>{log.ml} ml</Text>
                                                        </View>
                                                    )}

                                                    {log.km && (
                                                        <View style={s.activityTitleBlockLeft}>
                                                            <KmFlagIcon />
                                                            <Text style={s.waterContainerTitle}>{log.km} km</Text>
                                                        </View>
                                                    )}
                                                </View>

                                                <View style={s.waterProgressBlock}>
                                                    <View style={s.waterProgressBlockBottom}>
                                                        <View style={s.activityMarkerContent}>
                                                            <Text style={s.activityMarkerText}>{log.text}</Text>

                                                            {(log.hours || log.mins) && (
                                                                <Text style={s.activityMarkerTime}>
                                                                    {log.hours && <Text>{log.hours}h</Text>}{' '}
                                                                    {log.mins && <Text>{log.mins}min</Text>}
                                                                </Text>
                                                            )}
                                                        </View>

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

    progressBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalizeSize(2),
        marginBottom: normalizeSize(19),
    },

    progressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: normalizeSize(44),
        height: normalizeSize(14),
        borderRadius: 7,
    },

    progressItemCircle: {
        width: normalizeSize(9),
        height: normalizeSize(9),
        borderRadius: 100,
        opacity: 0.3,
    },

    activityTitleBlockLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: normalizeSize(2),
    },

    activityMarkerText: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        textAlign: 'left',
        color: COLORS.BLACK40,
        maxWidth: normalizeSize(220),
    },

    activityMarkerTime: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
        textAlign: 'left',
        color: COLORS.BLACK100,
    },

    activityMarkerContent: {
        flexDirection: 'column',
        gap: normalizeSize(4),
    },
});
