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
} from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { DropdownArrow } from '@/components';
import { useRouter } from 'expo-router';

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

export default function ActivityScreen() {
    const router = useRouter();

    const inputRef = useRef<TextInput>(null);

    const [period, setPeriod] = useState<0 | 1 | 2>(0);

    const [count, setCount] = useState('');

    const [focused, setFocused] = useState(false);

    const goNextStep = () => {
        router.push({
            pathname: '/(dashboard)/activity-screen-confirm',
            params: {
                countState: count,
                periodState: String(period),
            },
        });
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={s.container}>
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
                        <Text style={s.title}>Activity</Text>

                        {!focused && (
                            <Text style={s.descr}>
                                By focusing on intensity and frequency, we help users build real, lasting habits{' '}
                                <Text style={s.descrLight}>instead of just chasing the 10,000-step myth.</Text>
                            </Text>
                        )}
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
                                        style={[s.selectItem, item?.value === '1' && { paddingTop: normalizeSize(12) }]}
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
                        <TextInput
                            ref={inputRef}
                            style={s.input}
                            value={count}
                            onChangeText={setCount}
                            placeholder="Simply describe what you’ve done or you can send photo or screenshot of your training plan for today and add some info"
                            placeholderTextColor={COLORS.BLACK40}
                            numberOfLines={10}
                            multiline
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            returnKeyType="done"
                        />

                        <TouchableOpacity
                            disabled={count?.length < 1}
                            onPress={goNextStep}
                            style={[s.logBtn, count?.length < 1 && s.disabledBtn]}
                        >
                            <Text style={s.logBtnText}>Log entry</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
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
    },

    headerBlock: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalizeSize(21),
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
        marginTop: 'auto',
        gap: normalizeSize(12),
        padding: normalizeSize(16),
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.BLACK40,
        width: '100%',
    },

    logBtn: {
        paddingHorizontal: normalizeSize(16),
        paddingVertical: normalizeSize(12),
        backgroundColor: COLORS.BLACK100,
        alignSelf: 'stretch',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: normalizeSize(120),
        marginLeft: 'auto',
    },

    disabledBtn: { opacity: 0.3 },

    logBtnText: {
        fontSize: normalizeSize(14),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.SHADOW_GRAY_WHITE,
        letterSpacing: normalizeSize(-0.07),
    },

    input: {
        fontSize: normalizeSize(14),
        fontWeight: 400,
        fontFamily: 'Inter_400Regular',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.14),
        width: '100%',
        textAlignVertical: 'top',
        minHeight: normalizeSize(92),
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
});
