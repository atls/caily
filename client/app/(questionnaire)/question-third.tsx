import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, Platform, Pressable, Dimensions, FlatList } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import {
    ArrowButton,
    EstabilishDietIcon,
    GainMuscleMassicon,
    LoseWeightIcon,
    MaintainWeightIcon,
    QuestionnaireHeader,
} from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useContext, useMemo } from 'react';
import { OnboardingContext } from '@/contexts';
import * as Haptics from 'expo-haptics';
import { SvgProps } from 'react-native-svg';

type GoalCardType = {
    id: number;
    title: string;
    color: string;
    icon: (props: SvgProps) => React.JSX.Element;
};

const { width } = Dimensions.get('screen');

export default function QuestionnaireThirdScreen() {
    const { userGoal, setUserGoal } = useContext(OnboardingContext);
    const router = useRouter();

    const { retake } = useLocalSearchParams();

    const nextScreenHandler = () => {
        router.push({
            pathname: '/(questionnaire)/question-fourth',
            params: {
                retake: retake,
            },
        });
    };

    const onGoalPressHandler = useCallback(
        (goalId: number) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setUserGoal(prevGoal => (prevGoal === goalId ? null : goalId));
        },
        [setUserGoal]
    );

    const GOAL_CARDS = useMemo<GoalCardType[]>(
        () => [
            { id: 1, title: 'Lose weight', color: '#3375F6', icon: LoseWeightIcon },
            { id: 2, title: 'Maintain weight', color: '#F7CF46', icon: MaintainWeightIcon },
            { id: 3, title: 'Establish a diet', color: '#64C567', icon: EstabilishDietIcon },
            { id: 4, title: 'Gain muscle mass', color: '#B36CF1', icon: GainMuscleMassicon },
        ],
        []
    );

    const renderGoalCard = ({ item }: { item: GoalCardType }) => {
        const isSelected = userGoal === item.id;
        const IconComponent = item.icon;
        const iconColor = isSelected ? item.color : COLORS.GREY;
        const iconOpacity = isSelected ? 1 : 0.1;

        return (
            <Pressable
                key={item.id}
                onPress={() => onGoalPressHandler(item.id)}
                style={[s.selectGenderBtn, isSelected && { backgroundColor: item?.color }]}
            >
                <Text style={s.selectGenderBtnText}>{item.title}</Text>
                <View style={s.selectGenderBtnIconBlock}>
                    <IconComponent fill={iconColor} />
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={s.container}>
            <QuestionnaireHeader step={3} />

            <View style={s.topTextBlock}>
                <Text style={s.title}>What’s your goal?</Text>
                <Text style={s.descr}>Your body needs different calorie intake based on your goal</Text>
            </View>

            <FlatList
                data={GOAL_CARDS}
                keyExtractor={item => item.id.toString()}
                renderItem={renderGoalCard}
                contentContainerStyle={s.grid}
                numColumns={2}
                columnWrapperStyle={{ gap: normalizeSize(8) }}
            />

            <ArrowButton style={s.nextBtn} disabled={!userGoal} onPress={nextScreenHandler} />
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
        paddingTop: normalizeSize(8),
        paddingBottom: Platform.OS === 'ios' ? 0 : normalizeSize(20),
    },

    title: {
        fontSize: normalizeSize(32),
        textAlign: 'center',
        maxWidth: normalizeSize(304),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: -1.6,
    },

    descr: {
        fontSize: normalizeSize(14),
        textAlign: 'center',
        maxWidth: normalizeSize(252),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK100,
        opacity: 0.4,
        letterSpacing: -0.28,
    },

    topTextBlock: {
        marginBottom: normalizeSize(38),
        gap: normalizeSize(12),
    },

    nextBtn: {
        marginTop: 'auto',
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: normalizeSize(8),
    },

    selectGenderBtn: {
        padding: normalizeSize(8),
        backgroundColor: COLORS.GREY,
        width: width / 2 - 23,
        borderRadius: 16,
        gap: 8,
    },

    selectGenderBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 500,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
    },

    selectGenderBtnIconBlock: {
        width: '100%',
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        aspectRatio: 140 / 120,

        // iOS shadow
        shadowColor: 'rgba(35, 26, 11, 0.12)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 16,

        // Android shadow
        elevation: 8,

        alignItems: 'center',
        justifyContent: 'center',
    },
});
