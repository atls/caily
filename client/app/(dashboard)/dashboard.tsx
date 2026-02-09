import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { useCallback, useContext, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
    ActivityIcon,
    AddBtnIcon,
    ArrowRight,
    CalenarRecordIcon,
    CloseBtnIcon,
    DownloadPdfDocument,
    DropdownArrow,
    EmptyRecordsIcons,
    FoodIcon,
    KcalFireIcon,
    KmFlagIcon,
    MlWaterIcon,
    RecordsAddBtn,
    SmallCloseBtnIcon,
    WaterIcon,
    WeightIcon,
} from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EStatisticItemVariants, TLogsFoodItem, TLogsList, TLogsWaterItem, TLogsWeightItem } from '@/constants';
import { OnboardingContext } from '@/contexts';

const periodData = [
    {
        value: dayjs().format('DD-MM-YYYY'),
        lable: 'Today',
    },
    {
        value: dayjs().add(-1, 'd').format('DD-MM-YYYY'),
        lable: 'Yesterday',
    },
    {
        value: dayjs().add(-2, 'd').format('DD-MM-YYYY'),
        lable: dayjs().add(-2, 'd').format('MMM, DD'),
    },
];

const getNumericValue = (value: string) => Number(value.replace(/\D/g, ''));

const avatarImages = {
    '1': require('../../assets/images/avatar_1.png'),
    '2': require('../../assets/images/avatar_2.png'),
    '3': require('../../assets/images/avatar_3.png'),
    '4': require('../../assets/images/avatar_4.png'),
    '5': require('../../assets/images/avatar_5.png'),
    '6': require('../../assets/images/avatar_6.png'),
};

export default function Dashboard() {
    const router = useRouter();

    const { avatar, userName, weightUnits, convertWeight } = useContext(OnboardingContext);

    const [period, setPeriod] = useState<string>(dayjs().format('DD-MM-YYYY'));
    const [isModalVisible, setModalVisible] = useState(false);

    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isShiftedModal, setIsShiftedModal] = useState(false);

    const [logs, setLogs] = useState<TLogsList[]>([]);

    const addBtnRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

    useFocusEffect(
        useCallback(() => {
            setTimeout(getLogs, 100);
        }, [period])
    );

    const getLogs = async () => {
        try {
            const key = `LOGS-${period}`;

            const existing = await AsyncStorage.getItem(key);
            const logs: TLogsList[] = existing ? JSON.parse(existing) : [];

            logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setLogs(logs);
        } catch (error) {
            console.error('Failed to load water logs:', error);
        }
    };

    const toggleModalRight = async () => {
        setIsShiftedModal(true);
        if (!isModalVisible) {
            addBtnRef.current?.measure((fx, fy, width, height, px, py) => {
                setModalPosition({ top: py + height + 8, left: px });
                setModalVisible(true);
            });
        } else {
            setIsShiftedModal(false);
            setModalVisible(false);
        }
    };

    const toggleModal = () => {
        setModalVisible(p => {
            if (!p) {
                setIsShiftedModal(false);
            }

            return !p;
        });
    };

    const profileScreenHandler = () => {
        router.push('/(profile)/profile');
    };

    const foodScreenHandler = () => {
        toggleModal();
        router.push('/(dashboard)/food-screen');
    };

    const waterScreenHandler = () => {
        toggleModal();
        router.push('/(dashboard)/water-screen');
    };

    const weightScreenHandler = () => {
        toggleModal();
        router.push('/(dashboard)/weight-screen');
    };

    const activityScreenHandler = () => {
        toggleModal();
        router.push('/(dashboard)/activity-screen');
    };

    const renderRecordTitleBlock = (p: string) => {
        if (p === dayjs().format('DD-MM-YYYY')) {
            return dayjs().format('MMM DD');
        }
        if (p === dayjs().add(-1, 'd').format('DD-MM-YYYY')) {
            return dayjs().add(-1, 'd').format('MMM DD');
        }
        if (p === dayjs().add(-2, 'd').format('DD-MM-YYYY')) {
            return dayjs().add(-2, 'd').format('MMM DD');
        }
    };

    const renderRecordTitleDescrBlock = (p: string) => {
        if (p === dayjs().format('DD-MM-YYYY')) {
            return 'Today';
        }
        if (p === dayjs().add(-1, 'd').format('DD-MM-YYYY')) {
            return 'Yesterday';
        }
        if (p === dayjs().add(-2, 'd').format('DD-MM-YYYY')) {
            return '';
        }
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={profileScreenHandler} style={s.userInfo}>
                    <Image style={s.img} source={avatarImages[avatar ?? '1']} />
                    <Text style={s.userInfoName}>{userName}</Text>
                </TouchableOpacity>

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

            <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
                <View style={s.scrollBlock}>
                    <View style={s.analyticsContainer}>
                        <View style={s.headerBlock}>
                            <Text style={s.headerBlockText}>Analytics</Text>

                            <TouchableOpacity>
                                <DownloadPdfDocument />
                            </TouchableOpacity>
                        </View>

                        <View style={s.analyticsBlock}>
                            <View style={s.kcalAnalyticTextBlock}>
                                <Text style={s.kcalAnalyticCurrentText}>0</Text>
                                <Text style={s.kcalAnalyticTotalText}>of 2100 kcal</Text>
                            </View>

                            <View style={s.chartsBlock}>
                                <View style={s.chart} />
                                <View style={[s.chart, { backgroundColor: COLORS.PRO_BG_30 }]}>
                                    <Text style={[s.chartText, { color: COLORS.PRO_TEXT_100 }]}>
                                        Pro ∙ {convertWeight({ g: 0, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}{' '}
                                    </Text>
                                    <Text style={[s.chartText, { color: COLORS.PRO_TEXT_50 }]}>
                                        of {convertWeight({ g: 169, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}
                                    </Text>
                                </View>
                                <View style={[s.chart, { backgroundColor: COLORS.FIB_BG_30 }]}>
                                    <Text style={[s.chartText, { color: COLORS.FIB_TEXT_100 }]}>
                                        Fib ∙ {convertWeight({ g: 0, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}{' '}
                                    </Text>
                                    <Text style={[s.chartText, { color: COLORS.FIB_TEXT_50 }]}>
                                        of {convertWeight({ g: 66, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}
                                    </Text>
                                </View>
                                <View style={[s.chart, { backgroundColor: COLORS.FAT_BG_30 }]}>
                                    <Text style={[s.chartText, { color: COLORS.FAT_TEXT_100 }]}>
                                        Fat ∙ {convertWeight({ g: 0, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}{' '}
                                    </Text>
                                    <Text style={[s.chartText, { color: COLORS.FAT_TEXT_50 }]}>
                                        of {convertWeight({ g: 199, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}
                                    </Text>
                                </View>
                                <View style={[s.chart, { backgroundColor: COLORS.SUG_BG_30 }]}>
                                    <Text style={[s.chartText, { color: COLORS.SUG_TEXT_100 }]}>
                                        Sug ∙ {convertWeight({ g: 0, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}{' '}
                                    </Text>
                                    <Text style={[s.chartText, { color: COLORS.SUG_TEXT_50 }]}>
                                        of {convertWeight({ g: 50, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}
                                    </Text>
                                </View>
                                <View style={[s.chart, { backgroundColor: COLORS.CARB_BG_30 }]}>
                                    <Text style={[s.chartText, { color: COLORS.CARB_TEXT_100 }]}>
                                        Carb ∙ {convertWeight({ g: 0, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}{' '}
                                    </Text>
                                    <Text style={[s.chartText, { color: COLORS.CARB_TEXT_50 }]}>
                                        of {convertWeight({ g: 188, to: 'lb' })}
                                        {weightUnits === 'kg' ? 'g' : weightUnits}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={s.recordsContainer}>
                        <View style={s.headerBlock}>
                            <View style={s.recordsHeader}>
                                <CalenarRecordIcon />
                                <Text style={s.headerBlockLabel}>{renderRecordTitleDescrBlock(period)}</Text>
                                <Text style={s.headerBlockText}>{renderRecordTitleBlock(period)}</Text>
                            </View>

                            {(!isModalVisible || !isShiftedModal) && (
                                <TouchableOpacity ref={addBtnRef} onPress={toggleModalRight}>
                                    <RecordsAddBtn />
                                </TouchableOpacity>
                            )}
                        </View>

                        {!logs?.length && (
                            <View style={s.recordsEmpty}>
                                <EmptyRecordsIcons />

                                <View style={s.recordsEmptyTextBlock}>
                                    <Text style={s.recordsEmptyTextTitle}>You haven't added anything yet</Text>
                                    <Text style={s.recordsEmptyTextDescr}>
                                        Your food, water, activity, and weight records will be stored here
                                    </Text>
                                </View>
                            </View>
                        )}

                        {!!logs?.length && (
                            <View style={s.logsList}>
                                {logs?.map(log => {
                                    const rawWaterPercentage =
                                        ((log as TLogsWaterItem)?.nowMl / (log as TLogsWaterItem)?.goal) * 100;
                                    const waterWidth = Math.min(rawWaterPercentage, 100);
                                    const goalWidth = 100 - waterWidth;

                                    const weight = (log as TLogsWeightItem).prevWeight
                                        ? (log as TLogsWeightItem).amount - (log as TLogsWeightItem).prevWeight
                                        : 0;

                                    const weightPercent = Math.abs(((log as TLogsWeightItem).amount * weight) / 100);

                                    const sum =
                                        getNumericValue((log as TLogsFoodItem)?.protein || '0') +
                                        getNumericValue((log as TLogsFoodItem)?.fat || '0') +
                                        getNumericValue((log as TLogsFoodItem)?.carbo || '0');

                                    const proteinSize = sum
                                        ? (getNumericValue((log as TLogsFoodItem)?.protein || '0') * 100) / sum
                                        : 0;
                                    const fatSize = sum
                                        ? (getNumericValue((log as TLogsFoodItem)?.fat || '0') * 100) / sum
                                        : 0;
                                    const carboSize = sum
                                        ? (getNumericValue((log as TLogsFoodItem)?.carbo || '0') * 100) / sum
                                        : 0;

                                    return (
                                        <View style={s.logItem} key={log?.date}>
                                            {log?.type === EStatisticItemVariants.FOOD && (
                                                <View style={s.waterContainer}>
                                                    <View>
                                                        <Text style={s.waterContainerTitle}>{log.kcal} kcal</Text>
                                                        <Text style={s.waterContainerText}>{log.text}</Text>
                                                    </View>

                                                    <View style={s.waterProgressBlock}>
                                                        <View style={s.waterProgressLine}>
                                                            <View
                                                                style={[
                                                                    s.waterLine,
                                                                    {
                                                                        width: `${proteinSize}%`,
                                                                        backgroundColor: COLORS.PRO_BG_100,
                                                                    },
                                                                ]}
                                                            />
                                                            <View
                                                                style={[
                                                                    s.waterLine,
                                                                    {
                                                                        width: `${fatSize}%`,
                                                                        backgroundColor: COLORS.YELLOW_100,
                                                                    },
                                                                ]}
                                                            />
                                                            <View
                                                                style={[
                                                                    s.waterLine,
                                                                    {
                                                                        width: `${carboSize}%`,
                                                                        backgroundColor: COLORS.CARB_BG_100,
                                                                    },
                                                                ]}
                                                            />
                                                        </View>

                                                        <View style={s.waterProgressBlockBottom}>
                                                            <View style={s.waterProgressBlockBottomWaterGoal}>
                                                                <View style={s.waterMarker}>
                                                                    <View
                                                                        style={[
                                                                            s.waterMarkerCircle,
                                                                            { backgroundColor: COLORS.PRO_BG_100 },
                                                                        ]}
                                                                    />
                                                                    <Text style={s.waterMarkerText}>
                                                                        protein{' '}
                                                                        <Text style={s.waterMarkerTextBold}>
                                                                            {convertWeight({
                                                                                g: getNumericValue(
                                                                                    (log as TLogsFoodItem)?.protein ||
                                                                                        '0'
                                                                                ),
                                                                                to: 'lb',
                                                                            }) +
                                                                                (weightUnits === 'kg'
                                                                                    ? 'g'
                                                                                    : weightUnits)}
                                                                        </Text>
                                                                    </Text>
                                                                </View>
                                                                <View style={s.goalMarker}>
                                                                    <View
                                                                        style={[
                                                                            s.waterMarkerCircle,
                                                                            { backgroundColor: COLORS.YELLOW_100 },
                                                                        ]}
                                                                    />
                                                                    <Text style={s.waterMarkerText}>
                                                                        fat{' '}
                                                                        <Text style={s.waterMarkerTextBold}>
                                                                            {convertWeight({
                                                                                g: getNumericValue(
                                                                                    (log as TLogsFoodItem)?.fat || '0'
                                                                                ),
                                                                                to: 'lb',
                                                                            }) +
                                                                                (weightUnits === 'kg'
                                                                                    ? 'g'
                                                                                    : weightUnits)}
                                                                        </Text>
                                                                    </Text>
                                                                </View>

                                                                <View style={s.goalMarker}>
                                                                    <View
                                                                        style={[
                                                                            s.waterMarkerCircle,
                                                                            { backgroundColor: COLORS.CARB_BG_100 },
                                                                        ]}
                                                                    />
                                                                    <Text style={s.waterMarkerText}>
                                                                        carbs{' '}
                                                                        <Text style={s.waterMarkerTextBold}>
                                                                            {convertWeight({
                                                                                g: getNumericValue(
                                                                                    (log as TLogsFoodItem)?.carbo || '0'
                                                                                ),
                                                                                to: 'lb',
                                                                            }) +
                                                                                (weightUnits === 'kg'
                                                                                    ? 'g'
                                                                                    : weightUnits)}
                                                                        </Text>
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                            <Text style={s.logTime}>
                                                                {dayjs(log?.date).format('HH:mm')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}

                                            {log?.type === EStatisticItemVariants.WATER && (
                                                <View style={s.waterContainer}>
                                                    <Text style={s.waterContainerTitle}>{log.amount} ml</Text>

                                                    <View style={s.waterProgressBlock}>
                                                        <View style={s.waterProgressLine}>
                                                            <View style={[s.waterLine, { width: `${waterWidth}%` }]} />
                                                            <View
                                                                style={[
                                                                    s.waterLine,
                                                                    s.goalLine,
                                                                    { width: `${goalWidth}%` },
                                                                ]}
                                                            />
                                                        </View>

                                                        <View style={s.waterProgressBlockBottom}>
                                                            <View style={s.waterProgressBlockBottomWaterGoal}>
                                                                <View style={s.waterMarker}>
                                                                    <View style={s.waterMarkerCircle} />
                                                                    <Text style={s.waterMarkerText}>
                                                                        water{' '}
                                                                        <Text style={s.waterMarkerTextBold}>
                                                                            {log?.nowMl}ml
                                                                        </Text>
                                                                    </Text>
                                                                </View>
                                                                <View style={s.goalMarker}>
                                                                    <View style={[s.waterMarkerCircle, s.goalLine]} />
                                                                    <Text style={s.waterMarkerText}>
                                                                        goal{' '}
                                                                        <Text style={s.waterMarkerTextBold}>
                                                                            {log?.goal}ml
                                                                        </Text>
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                            <Text style={s.logTime}>
                                                                {dayjs(log?.date).format('HH:mm')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}

                                            {log?.type === EStatisticItemVariants.WEIGHT && (
                                                <View style={s.waterContainer}>
                                                    <View style={s.weightTitleBlock}>
                                                        <View style={s.weightTitleBlockLeft}>
                                                            <WeightIcon />
                                                            <Text style={s.waterContainerTitle}>
                                                                {convertWeight({ kg: log.amount, to: 'lb' })}{' '}
                                                                {weightUnits === 'kg' ? 'g' : weightUnits}
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
                                                                    ? `${weight > 0 ? '+' : '-'}${Math.abs(
                                                                          weight
                                                                      )?.toFixed(2)} (${weightPercent?.toFixed(2)}%)`
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
                                            )}

                                            {log?.type === EStatisticItemVariants.ACTIVITY && (
                                                <View style={s.waterContainer}>
                                                    <View style={s.weightTitleBlock}>
                                                        {log.kcal && (
                                                            <View style={s.activityTitleBlockLeft}>
                                                                <KcalFireIcon />
                                                                <Text style={s.waterContainerTitle}>
                                                                    {log.kcal} kcal
                                                                </Text>
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
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>

                    <TouchableOpacity style={s.feedbackContainer}>
                        <Image style={s.feedbackImg} source={require('../../assets/images/feedback_icon.png')} />
                        <View style={s.feedbackContainerTextBlock}>
                            <Text style={s.feedbackTitle}>Your feedback fuels improvements!</Text>
                            <Text style={s.feedbackDescr}>
                                Let us know what’s missing, and we’ll make the app even better!
                            </Text>
                        </View>

                        <ArrowRight />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <LinearGradient
                colors={['rgba(255,255,255,0)', '#FFFFFF']}
                locations={[0.0254, 0.6188]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.48, y: 1 }}
                style={s.addBtnBlock}
            >
                <TouchableOpacity onPress={toggleModal}>
                    <AddBtnIcon />
                </TouchableOpacity>
            </LinearGradient>

            <Modal
                animationIn={'fadeIn'}
                animationOut={'fadeOut'}
                style={s.modal}
                backdropColor="transparent"
                onBackdropPress={toggleModal}
                isVisible={isModalVisible}
                animationInTiming={10}
                animationOutTiming={10}
            >
                <LinearGradient
                    colors={['rgba(255,255,255,0)', '#ffffff']}
                    locations={[0.0254, 0.6188]} // 2.54% and 61.88% as decimals
                    start={{ x: 0.51, y: 0 }} // Slight right offset
                    end={{ x: 0.49, y: 1 }} // Slight left offset at bottom
                    style={s.modalContainer} // or any other style
                >
                    <View
                        style={[
                            s.modalBtnsBlock,
                            isShiftedModal && {
                                position: 'absolute',
                                top: modalPosition.top,
                                left: modalPosition.left,
                                transform: [
                                    { translateX: '-75%' },
                                    { translateY: Platform.OS === 'android' ? normalizeSize(-20) : normalizeSize(10) },
                                ],
                                zIndex: 999,
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                            },
                        ]}
                    >
                        <TouchableOpacity onPress={foodScreenHandler} style={s.modalBtns}>
                            <FoodIcon />
                            <Text style={s.modalBtnsText}>Food</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={waterScreenHandler} style={s.modalBtns}>
                            <WaterIcon />
                            <Text style={s.modalBtnsText}>Water</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={activityScreenHandler} style={s.modalBtns}>
                            <ActivityIcon />
                            <Text style={s.modalBtnsText}>Activity</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={weightScreenHandler} style={s.modalBtns}>
                            <WeightIcon />
                            <Text style={s.modalBtnsText}>Weight</Text>
                        </TouchableOpacity>
                    </View>
                    {isShiftedModal && (
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top:
                                    modalPosition.top -
                                    (Platform?.OS === 'ios' ? normalizeSize(36) : normalizeSize(64)),
                                left: modalPosition.left,
                            }}
                            onPress={toggleModal}
                        >
                            <SmallCloseBtnIcon />
                        </TouchableOpacity>
                    )}
                    {!isShiftedModal && (
                        <TouchableOpacity onPress={toggleModal}>
                            <CloseBtnIcon />
                        </TouchableOpacity>
                    )}
                </LinearGradient>
            </Modal>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: normalizeSize(16),
        backgroundColor: COLORS.WHITE,
        position: 'relative',
        paddingBottom: Platform.OS === 'ios' ? 0 : normalizeSize(20),
        gap: normalizeSize(13),
    },

    img: {
        width: normalizeSize(32),
        height: normalizeSize(32),
        borderRadius: 100,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        marginTop: normalizeSize(24),
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    userInfoName: {
        fontSize: normalizeSize(14),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.07),
    },

    dropdown: {
        minHeight: normalizeSize(32),
        minWidth: normalizeSize(120),
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
        transform: [{ translateX: normalizeSize(98) - normalizeSize(105) }],
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

    scroll: {
        alignSelf: 'stretch',
    },

    scrollBlock: {
        alignSelf: 'stretch',
        gap: normalizeSize(8),
        paddingBottom: normalizeSize(110),
    },

    analyticsContainer: {
        alignSelf: 'stretch',
        borderRadius: 16,
        backgroundColor: COLORS.GREY,
        padding: normalizeSize(4),
        gap: normalizeSize(13),
    },

    headerBlock: {
        paddingLeft: normalizeSize(8),
        paddingRight: normalizeSize(3),
        paddingTop: normalizeSize(9),
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerBlockText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    analyticsBlock: {
        alignSelf: 'stretch',
        borderRadius: 12,
        backgroundColor: COLORS.WHITE,

        paddingTop: normalizeSize(12),
        paddingHorizontal: normalizeSize(8),
        paddingBottom: normalizeSize(8),
        gap: normalizeSize(13),

        ...Platform.select({
            ios: {
                shadowColor: 'rgba(35, 26, 11, 0.12)',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 16,
            },
            android: {
                elevation: 1, // Придётся подобрать вручную, точного соответствия нет
            },
        }),
    },

    kcalAnalyticTextBlock: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: normalizeSize(4),
    },

    kcalAnalyticCurrentText: {
        fontSize: normalizeSize(40),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1.6),
    },

    kcalAnalyticTotalText: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.28),
        paddingTop: normalizeSize(10),
    },

    chartsBlock: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: normalizeSize(4),
    },

    chart: {
        width: '49%',
        paddingHorizontal: normalizeSize(4),
        paddingVertical: normalizeSize(5),
        borderRadius: 6,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    chartText: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
    },

    recordsContainer: {
        alignSelf: 'stretch',
        borderRadius: 16,
        backgroundColor: COLORS.GREY,
        padding: normalizeSize(4),
        gap: normalizeSize(13),
    },

    recordsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(4),
    },

    headerBlockLabel: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.64),
    },

    recordsEmpty: {
        paddingVertical: normalizeSize(60),
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalizeSize(20),
    },

    recordsEmptyTextBlock: {
        maxWidth: normalizeSize(218),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: normalizeSize(2),
    },

    recordsEmptyTextTitle: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
        textAlign: 'center',
        color: COLORS.BLACK100,
    },

    recordsEmptyTextDescr: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
        textAlign: 'center',
        color: COLORS.BLACK40,
    },

    feedbackContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        backgroundColor: COLORS.GREY,
        padding: normalizeSize(13),
        gap: normalizeSize(10),
        minHeight: normalizeSize(70),
    },

    feedbackImg: {
        width: normalizeSize(72),
        height: normalizeSize(72),
        position: 'absolute',
    },

    feedbackContainerTextBlock: {
        alignSelf: 'stretch',
        marginLeft: normalizeSize(57),
        flexDirection: 'column',
        maxWidth: normalizeSize(215),
    },

    feedbackTitle: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
        textAlign: 'left',
        color: COLORS.BLACK100,
    },

    feedbackDescr: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.24),
        textAlign: 'left',
        color: COLORS.BLACK40,
    },

    addBtnBlock: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        minHeight: normalizeSize(110),
        alignItems: 'center',
        justifyContent: 'center',
    },

    modal: {
        margin: 0,
    },

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        paddingBottom: normalizeSize(26),
        gap: normalizeSize(24),
    },

    modalBtnsBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: normalizeSize(8),
    },

    modalBtns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalizeSize(4),
        paddingVertical: normalizeSize(12),
        paddingLeft: normalizeSize(12),
        paddingRight: normalizeSize(14),
        borderRadius: 12,
        backgroundColor: COLORS.WHITE,

        // iOS shadow
        shadowColor: Platform.OS === 'android' ? 'rgba(35, 26, 11, 0.72)' : 'rgba(35, 26, 11, 0.12)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 16,

        // Android shadow
        elevation: 4,
    },

    modalBtnsText: {
        fontSize: normalizeSize(20),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.8),
    },

    logsList: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: normalizeSize(4),
    },

    logItem: {
        alignSelf: 'stretch',
        padding: normalizeSize(12),

        borderRadius: 12,
        backgroundColor: COLORS.WHITE,
        shadowColor: 'rgba(35, 26, 11, 0.12)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 4, // для Android
    },

    waterContainer: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        gap: normalizeSize(14),
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

    waterProgressLine: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(1),
    },

    waterLine: {
        height: normalizeSize(8),
        backgroundColor: '#499ECF',
        borderRadius: 4,
    },

    goalLine: { opacity: 0.3 },

    waterProgressBlockBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: normalizeSize(8),
    },

    waterProgressBlockBottomWaterGoal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(8),
    },

    waterMarker: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(4),
    },

    goalMarker: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(4),
    },

    waterMarkerCircle: {
        width: normalizeSize(8),
        height: normalizeSize(8),
        borderRadius: 100,
        backgroundColor: '#499ECF',
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

    waterContainerText: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        textAlign: 'left',
        color: COLORS.BLACK40,
    },
});
