import { SafeAreaView } from 'react-native-safe-area-context';
import {
    StyleSheet,
    Platform,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Dimensions,
} from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import dayjs from 'dayjs';
import { useContext, useRef, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { DropdownArrow } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

const { height } = Dimensions.get('screen');

const getNumericValue = (value: string) => Number(value.replace(/\D/g, ''));

export default function ActivityScreenConfirm() {
    const { countState, periodState } = useLocalSearchParams();

    const { weightUnits, convertWeight } = useContext(OnboardingContext);

    const router = useRouter();

    const inputRef = useRef<TextInput>(null);

    const [period, setPeriod] = useState<0 | 1 | 2>((Number(periodState) as 0 | 1 | 2) ?? 0);

    const [count, setCount] = useState(countState as string);

    const [kcal, setKcal] = useState(565);

    const [sugar, setSugar] = useState(
        convertWeight({ g: 100, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits)
    );
    const [fiber, setFiber] = useState(convertWeight({ g: 16, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits));
    const [water, setWater] = useState('100ml');

    const [protein, setProtein] = useState(
        convertWeight({ g: 25, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits)
    );
    const [fat, setFat] = useState(convertWeight({ g: 25, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits));
    const [carbo, setCarbo] = useState(convertWeight({ g: 75, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits));

    const [portion, setPortion] = useState(
        convertWeight({ g: 200, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits)
    );
    const [cooked, setCooked] = useState('Steamed');

    const saveFoodLog = async () => {
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

            const weightLogs = allLogs.filter(log => log?.type === EStatisticItemVariants?.FOOD);

            const newType = EStatisticItemVariants?.FOOD;

            const lastSameTypeLog = [...weightLogs]
                .filter(log => log.type === newType)
                .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
                .pop();

            const newLog = {
                date: dayjs().add(-period, 'd').format(),
                text: count,
                sugar: sugar,
                fiber: fiber,
                water: water,
                protein: protein,
                fat: fat,
                carbo: carbo,
                kcal: kcal,
                portion: portion,
                cooked: cooked,
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

    const goCancel = () => {
        router.push('/(dashboard)/dashboard');
    };

    const goDashboard = () => {
        saveFoodLog();
        router.push('/(dashboard)/dashboard');
    };

    const handleFocus = (setter: (value: string) => void, value: string) => () => {
        setter(getNumericValue(value).toString()); // Удаляем все нечисловые символы
    };

    const handleBlur = (setter: (value: string) => void, value: string, suffix: string) => () => {
        setter(value ? `${value}${suffix}` : '');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SafeAreaView style={s.container}>
                        <View style={s.headerBlock}>
                            <Text style={s.title}>{kcal} kcal</Text>

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
                                        <View
                                            style={[
                                                s.selectItem,
                                                item?.value === '1' && { paddingTop: normalizeSize(12) },
                                            ]}
                                        >
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
                            <Text style={s.label}>Your text</Text>
                            <TextInput
                                ref={inputRef}
                                style={s.input}
                                value={count}
                                onChangeText={setCount}
                                placeholder="Simply describe what you’ve done or you can send photo or screenshot of your training plan for today and add some info"
                                placeholderTextColor={COLORS.BLACK40}
                                numberOfLines={10}
                                multiline
                            />
                        </View>

                        <View style={s.timeBlock}>
                            <View style={[s.counterTime, { width: '67%' }]}>
                                <Text style={s.label}>Cooked</Text>
                                <TextInput
                                    ref={inputRef}
                                    style={s.inputTime}
                                    value={cooked}
                                    onChangeText={setCooked}
                                    numberOfLines={1}
                                />
                            </View>
                            <View style={s.counterTime}>
                                <Text style={s.label}>Portion</Text>
                                <TextInput
                                    ref={inputRef}
                                    style={s.inputTime}
                                    value={portion}
                                    onChangeText={setPortion}
                                    keyboardType="numeric"
                                    numberOfLines={1}
                                    onFocus={handleFocus(setPortion, portion)}
                                    onBlur={handleBlur(setPortion, portion, weightUnits === 'kg' ? 'g' : weightUnits)}
                                />
                            </View>
                        </View>

                        <View style={s.timeBlock}>
                            <View style={s.counterTime}>
                                <Text style={s.label}>Protein</Text>
                                <TextInput
                                    ref={inputRef}
                                    style={s.inputTime}
                                    value={protein}
                                    onChangeText={setProtein}
                                    keyboardType="numeric"
                                    numberOfLines={1}
                                    onFocus={handleFocus(setProtein, protein)}
                                    onBlur={handleBlur(setProtein, protein, weightUnits === 'kg' ? 'g' : weightUnits)}
                                />
                            </View>
                            <View style={s.counterTime}>
                                <Text style={s.label}>Fat</Text>
                                <TextInput
                                    ref={inputRef}
                                    style={s.inputTime}
                                    value={fat}
                                    onChangeText={setFat}
                                    keyboardType="numeric"
                                    numberOfLines={1}
                                    onFocus={handleFocus(setFat, fat)}
                                    onBlur={handleBlur(setFat, fat, weightUnits === 'kg' ? 'g' : weightUnits)}
                                />
                            </View>

                            <View style={s.counterTime}>
                                <Text style={s.label}>Carbo</Text>
                                <TextInput
                                    ref={inputRef}
                                    style={s.inputTime}
                                    value={carbo}
                                    onChangeText={setCarbo}
                                    keyboardType="numeric"
                                    onFocus={handleFocus(setCarbo, carbo)}
                                    onBlur={handleBlur(setCarbo, carbo, weightUnits === 'kg' ? 'g' : weightUnits)}
                                />
                            </View>
                        </View>

                        <View style={s.timeBlock}>
                            <View style={s.counterTime}>
                                <Text style={s.label}>Sugar</Text>
                                <TextInput
                                    ref={inputRef}
                                    style={s.inputTime}
                                    value={sugar}
                                    onChangeText={setSugar}
                                    keyboardType="numeric"
                                    numberOfLines={1}
                                    onFocus={handleFocus(setSugar, sugar)}
                                    onBlur={handleBlur(setSugar, sugar, weightUnits === 'kg' ? 'g' : weightUnits)}
                                />
                            </View>
                            <View style={s.counterTime}>
                                <Text style={s.label}>Fiber</Text>
                                <TextInput
                                    ref={inputRef}
                                    style={s.inputTime}
                                    value={fiber}
                                    onChangeText={setFiber}
                                    keyboardType="numeric"
                                    numberOfLines={1}
                                    onFocus={handleFocus(setFiber, fiber)}
                                    onBlur={handleBlur(setFiber, fiber, weightUnits === 'kg' ? 'g' : weightUnits)}
                                />
                            </View>

                            <View style={s.counterTime}>
                                <Text style={s.label}>Water</Text>
                                <TextInput
                                    ref={inputRef}
                                    style={s.inputTime}
                                    value={water}
                                    onChangeText={setWater}
                                    keyboardType="numeric"
                                    onFocus={handleFocus(setWater, water)}
                                    onBlur={handleBlur(setWater, water, 'ml')}
                                />
                            </View>
                        </View>

                        <View style={s.btnsBlock}>
                            <TouchableOpacity onPress={goCancel} style={s.cancelBtn}>
                                <Text style={s.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={goDashboard} style={s.logBtn}>
                                <Text style={s.logBtnText}>Log entry</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
        minHeight: height - normalizeSize(50),
    },

    headerBlock: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalizeSize(55),
        marginBottom: normalizeSize(28),
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
        marginBottom: normalizeSize(18),
    },

    descr: {
        maxWidth: normalizeSize(260),
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.28),
        textAlign: 'center',
        marginBottom: normalizeSize(20),
    },

    descrLight: { color: COLORS.BLACK40 },

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

    counter: {
        flexDirection: 'column',
        width: '100%',
    },

    counterTime: {
        flexDirection: 'column',
        width: '33%',
    },

    disabledBtn: { opacity: 0.3 },

    label: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.24),
        marginBottom: normalizeSize(6),
    },

    input: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),

        width: '100%',
        textAlignVertical: 'top',
        minHeight: normalizeSize(92),

        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.STROKE,
        padding: normalizeSize(16),
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

    timeBlock: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        gap: normalizeSize(6),
        marginTop: normalizeSize(28),
    },

    inputTime: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),

        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.STROKE,
        padding: normalizeSize(16),

        width: '100%',
    },

    btnsBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(4),
        marginTop: 'auto',
        width: '100%',
        alignSelf: 'stretch',
    },

    logBtn: {
        paddingHorizontal: normalizeSize(20),
        paddingVertical: normalizeSize(16),
        backgroundColor: COLORS.BLACK100,
        alignSelf: 'stretch',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
    },

    cancelBtn: {
        paddingHorizontal: normalizeSize(20),
        paddingVertical: normalizeSize(16),
        backgroundColor: COLORS.GREY,
        alignSelf: 'stretch',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
    },

    logBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.SHADOW_GRAY_WHITE,
        letterSpacing: normalizeSize(-0.64),
    },

    cancelBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },
});
