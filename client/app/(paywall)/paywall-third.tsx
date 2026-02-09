import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StyleSheet, Platform, View, TouchableOpacity, Text, ScrollView, TextInput } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BackArrowIcon, MedicalGuidelinesIcon } from '@/components';
import { useContext, useState } from 'react';
import { OnboardingContext } from '@/contexts';

const { width } = Dimensions.get('screen');

const CARDS_LIST = [
    {
        name: '🍴Eat what you love',
        description: 'Choose foods you enjoy to reduce cravings and make the process more sustainable.',
        rotate: '3deg',
    },
    {
        name: '📊 Follow your own nutrition plan',
        description: 'Your plan is designed for your goals. Just start, and you’ll see the results.',
        rotate: '-3deg',
    },
    {
        name: '⚖️ Maintain balance',
        description: 'The right ratio of proteins, fats, and carbs keeps you energized and feeling light every day.',
        rotate: '2deg',
    },
    {
        name: '💧 Stay hydrated',
        description: 'Drinking enough water is key to good health and well-being. Without it, your body slows down.',
        rotate: '-2deg',
    },
    {
        name: '🛀 Give yourself rest',
        description: 'Sleep and relaxation are just as important as training. Without them, progress may stall.',
        rotate: '3deg',
    },
];

const CALORIES_PER_GRAM = {
    protein: 4,
    fat: 9,
    carbo: 4,
};

const INITIAL_MACROS = {
    protein: 150,
    fat: 78,
    carbo: 282,
};

const getNumericValue = (value: string) => Number(value.replace(/\D/g, ''));

export default function PaywallThirdScreen() {
    const router = useRouter();

    const { weightUnits, convertWeight } = useContext(OnboardingContext);

    const { retake, retakeFinish } = useLocalSearchParams();

    const nextScreenHandler = () => {
        if (retake?.length) {
            router.push({
                pathname: '/(questionnaire)/question-first',
                params: {
                    retake: retake,
                },
            });
            return;
        }

        if (retakeFinish?.length) {
            router.push('/(profile)/profile');
            return;
        }
        router.push('/(paywall)/paywall-fourth');
    };

    const [protein, setProtein] = useState(
        convertWeight({ g: 150, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits)
    );
    const [fat, setFat] = useState(convertWeight({ g: 78, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits));
    const [carbo, setCarbo] = useState(
        convertWeight({ g: 282, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits)
    );

    const [kcal, setKcal] = useState('2432 Kcal');

    const sum = getNumericValue(protein) + getNumericValue(fat) + getNumericValue(carbo);

    const proteinSize = sum ? (getNumericValue(protein) * 100) / sum - 1 : 0;
    const fatSize = sum ? (getNumericValue(fat) * 100) / sum - 1 : 0;
    const carboSize = sum ? (getNumericValue(carbo) * 100) / sum - 1 : 0;

    const updateCaloriesByMacros = (proteinVal: number, fatVal: number, carboVal: number) => {
        const newKcal =
            proteinVal * CALORIES_PER_GRAM.protein +
            fatVal * CALORIES_PER_GRAM.fat +
            carboVal * CALORIES_PER_GRAM.carbo;

        setKcal(String(newKcal) + ' Kcal');
    };

    const updateMacrosByCalories = (newKcal: number) => {
        if (newKcal === 0) return;

        // Используем изначальные пропорции
        const totalInitialKcal =
            INITIAL_MACROS.protein * CALORIES_PER_GRAM.protein +
            INITIAL_MACROS.fat * CALORIES_PER_GRAM.fat +
            INITIAL_MACROS.carbo * CALORIES_PER_GRAM.carbo;

        const scaleFactor = newKcal / totalInitialKcal;

        setProtein(
            String(Math.max(1, Math.round(INITIAL_MACROS.protein * scaleFactor))) +
                (weightUnits === 'kg' ? 'g' : weightUnits)
        );
        setFat(
            String(Math.max(1, Math.round(INITIAL_MACROS.fat * scaleFactor))) +
                (weightUnits === 'kg' ? 'g' : weightUnits)
        );
        setCarbo(
            String(Math.max(1, Math.round(INITIAL_MACROS.carbo * scaleFactor))) +
                (weightUnits === 'kg' ? 'g' : weightUnits)
        );
    };

    const handleProteinChange = (text: string) => {
        const numericValue = getNumericValue(text);
        setProtein(numericValue > 15000 ? '10000' : numericValue === 0 ? '1' : String(numericValue));
        updateCaloriesByMacros(numericValue === 0 ? 1 : numericValue, getNumericValue(fat), getNumericValue(carbo));
    };

    const handleFatChange = (text: string) => {
        const numericValue = getNumericValue(text);
        setFat(numericValue > 15000 ? '10000' : numericValue === 0 ? '1' : String(numericValue));
        updateCaloriesByMacros(getNumericValue(protein), numericValue === 0 ? 1 : numericValue, getNumericValue(carbo));
    };

    const handleCarboChange = (text: string) => {
        const numericValue = getNumericValue(text);
        setCarbo(numericValue > 15000 ? '10000' : numericValue === 0 ? '1' : String(numericValue));
        updateCaloriesByMacros(getNumericValue(protein), getNumericValue(fat), numericValue === 0 ? 1 : numericValue);
    };

    const handleKcalChange = (text: string) => {
        const numericValue = getNumericValue(text);
        setKcal(numericValue > 10000 ? '10000' : String(numericValue));
        updateMacrosByCalories(numericValue);
    };

    const handleFocus = (setter: (value: string) => void, value: string) => () => {
        setter(getNumericValue(value).toString()); // Удаляем все нечисловые символы
    };

    const handleBlur = (setter: (value: string) => void, value: string, suffix: string) => () => {
        setter(value ? `${value}${suffix}` : '');
    };

    return (
        <View style={s.wrapper}>
            <ScrollView bounces={false} style={s.scroll} showsVerticalScrollIndicator={false}>
                <View style={s.container}>
                    <LinearGradient
                        colors={['#64C567', 'rgba(100, 197, 103, 0.00)']}
                        style={s.linearTop}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    >
                        <SafeAreaView />
                        <View style={s.header}>
                            <TouchableOpacity onPress={() => router?.back()} style={s.btn}>
                                <BackArrowIcon />
                            </TouchableOpacity>
                        </View>

                        <View style={s.topTextBlock}>
                            <Text style={s.title}>You're on the right track!</Text>
                            <Text style={s.descr}>We've calculated your daily intake to help you reach your goal:</Text>
                        </View>
                    </LinearGradient>

                    <View style={s.inputsWrapper}>
                        <View style={s.inputsBlock}>
                            <View style={s.inputWrap}>
                                <View style={s.nameInput}>
                                    <View style={{ ...s.circleName }} />
                                    <Text style={s.inputLabel}>Protein</Text>
                                </View>
                                <TextInput
                                    value={protein}
                                    onChangeText={handleProteinChange}
                                    onFocus={handleFocus(setProtein, protein)}
                                    onBlur={handleBlur(setProtein, protein, weightUnits === 'kg' ? 'g' : weightUnits)}
                                    style={s.input}
                                    keyboardType="numeric"
                                    maxLength={6}
                                />
                            </View>
                            <View style={s.inputWrap}>
                                <View style={s.nameInput}>
                                    <View style={{ ...s.circleName, backgroundColor: COLORS.YELLOW_100 }} />
                                    <Text style={s.inputLabel}>Fat</Text>
                                </View>
                                <TextInput
                                    value={fat}
                                    onChangeText={handleFatChange}
                                    onFocus={handleFocus(setFat, fat)}
                                    onBlur={handleBlur(setFat, fat, weightUnits === 'kg' ? 'g' : weightUnits)}
                                    style={s.input}
                                    keyboardType="numeric"
                                    maxLength={6}
                                />
                            </View>
                            <View style={s.inputWrap}>
                                <View style={s.nameInput}>
                                    <View style={{ ...s.circleName, backgroundColor: COLORS.CARB_BG_100 }} />
                                    <Text style={s.inputLabel}>Сarbohydrates</Text>
                                </View>
                                <TextInput
                                    value={carbo}
                                    onChangeText={handleCarboChange}
                                    onFocus={handleFocus(setCarbo, carbo)}
                                    onBlur={handleBlur(setCarbo, carbo, weightUnits === 'kg' ? 'g' : weightUnits)}
                                    style={s.input}
                                    keyboardType="numeric"
                                    maxLength={6}
                                />
                            </View>
                        </View>

                        <View style={s.caloriesBlock}>
                            <TextInput
                                value={kcal}
                                onChangeText={handleKcalChange}
                                onFocus={handleFocus(setKcal, kcal)}
                                onBlur={handleBlur(setKcal, kcal, ' Kcal')}
                                style={s.inputKcal}
                                keyboardType="numeric"
                                maxLength={10}
                            />
                        </View>

                        <View style={s.progress}>
                            <View style={{ ...s.progressLine, width: `${proteinSize}%` }} />
                            <View
                                style={{ ...s.progressLine, backgroundColor: COLORS.YELLOW_100, width: `${fatSize}%` }}
                            />
                            <View
                                style={{
                                    ...s.progressLine,
                                    backgroundColor: COLORS.CARB_BG_100,
                                    width: `${carboSize}%`,
                                }}
                            />
                        </View>
                    </View>
                    <Text style={s.inputsDescr}>
                        If you have personal preferences, you can adjust these values to fit your needs.
                    </Text>

                    <Text style={s.howtoreach}>How to reach your goal easily, enjoyably, and without setbacks?</Text>

                    <View style={s.cardBlock}>
                        {CARDS_LIST?.map(c => (
                            <View style={{ ...s.cardItem, transform: [{ rotate: c?.rotate }] }} key={c.name}>
                                <Text style={s.cardItemName}>{c.name}</Text>
                                <Text style={s.cardItemDescription}>{c.description}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={s.howtoreachDescr}>
                        This plan is based on authoritative international scientific research and medical guidelines:
                    </Text>

                    <MedicalGuidelinesIcon />
                </View>
            </ScrollView>

            <LinearGradient
                colors={['rgba(255, 255, 255, .0)', '#FFF']} // Corresponds to your CSS colors
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={s.bottomBtnWrap}
            >
                <TouchableOpacity onPress={nextScreenHandler} style={s.bottomBtn}>
                    <Text style={s.bottomBtnText}>{retake?.length ? 'Retake survey' : 'Let’s start'}</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scroll: { flex: 1, backgroundColor: COLORS.WHITE },

    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: normalizeSize(16),
        backgroundColor: COLORS.WHITE,
        position: 'relative',
        paddingBottom: normalizeSize(140),
    },

    linearTop: {
        width: width,
        height: normalizeSize(274),
        paddingHorizontal: normalizeSize(16),
    },

    header: {
        marginTop: Platform.OS === 'ios' ? normalizeSize(-20) : normalizeSize(14),
        height: normalizeSize(52),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    btn: {
        position: 'absolute',
        left: 0,
        height: normalizeSize(52),
        width: normalizeSize(52),

        borderRadius: 100,
        backgroundColor: COLORS.GREY,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: normalizeSize(32),
        textAlign: 'center',
        maxWidth: normalizeSize(224),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: -1.6,
    },

    descr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: normalizeSize(240),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.28),
    },

    topTextBlock: {
        marginBottom: normalizeSize(38),
        marginTop: normalizeSize(19),
        marginHorizontal: 'auto',
        gap: normalizeSize(18),
    },

    inputsWrapper: {
        flexDirection: 'column',
        gap: normalizeSize(8),
        alignSelf: 'stretch',
        marginTop: normalizeSize(40),
    },

    caloriesBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        minHeight: normalizeSize(68),
        borderRadius: normalizeSize(8),
        borderWidth: 1,
        borderColor: COLORS.STROKE,
    },

    caloriesBlockText: {
        fontSize: normalizeSize(16),
        textAlign: 'center',
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    inputsBlock: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: normalizeSize(6),
        alignSelf: 'stretch',
    },

    inputWrap: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        flexBasis: '32.1%',
        gap: normalizeSize(6),
    },

    input: {
        alignSelf: 'stretch',
        borderRadius: normalizeSize(8),
        borderWidth: 1,
        borderColor: COLORS.STROKE,
        minHeight: normalizeSize(48),
        padding: normalizeSize(16),

        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    inputKcal: {
        flex: 1,
        width: '100%',
        textAlign: 'center',

        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    progress: {
        width: '100%',
        height: normalizeSize(9),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalizeSize(4),
    },

    progressLine: {
        borderRadius: 8,
        width: '32.1%',
        backgroundColor: COLORS.PRO_BG_100,
        height: normalizeSize(9),
    },

    nameInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(4),
    },

    circleName: {
        width: 8,
        height: 8,
        borderRadius: 100,
        backgroundColor: COLORS.PRO_BG_100,
    },

    inputLabel: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.24),
        opacity: 0.5,
    },

    inputsDescr: {
        marginBottom: normalizeSize(60),
        marginTop: normalizeSize(16),

        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.24),
    },

    howtoreach: {
        fontSize: normalizeSize(20),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.8),
        textAlign: 'center',
        maxWidth: normalizeSize(320),
        marginBottom: normalizeSize(28),
    },

    cardBlock: {
        marginHorizontal: normalizeSize(8),
        alignSelf: 'stretch',
        paddingHorizontal: normalizeSize(20.2),
        paddingVertical: normalizeSize(28),
        gap: normalizeSize(30),
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: COLORS.GREY,
    },

    cardItem: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: normalizeSize(16),
        paddingVertical: normalizeSize(12),
        borderRadius: 12,
        alignSelf: 'stretch',
        gap: normalizeSize(8),

        // Shadow for iOS
        shadowColor: 'rgba(35, 26, 11, 1)', // Approximate the given RGBA color
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12, // Matches the alpha value in rgba
        shadowRadius: 16,
        // Shadow for Android
        elevation: 8, // Adjust this to match the effect
    },

    cardItemName: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    cardItemDescription: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.24),
    },

    howtoreachDescr: {
        marginBottom: normalizeSize(36),
        marginTop: normalizeSize(28),

        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.28),

        maxWidth: normalizeSize(312),

        textAlign: 'center',
    },

    bottomBtnWrap: {
        width: width,
        minHeight: normalizeSize(120),
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: normalizeSize(20),
        paddingBottom: normalizeSize(26),
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexShrink: 0,
    },

    bottomBtn: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BLACK100,
        borderRadius: 20,
        paddingHorizontal: normalizeSize(40),
        paddingVertical: normalizeSize(16),
        minHeight: normalizeSize(56),
    },

    bottomBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.WHITE,
        letterSpacing: normalizeSize(-0.64),
    },
});
