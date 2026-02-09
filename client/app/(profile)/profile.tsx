import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Linking,
    Dimensions,
    Modal,
} from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { OnboardingContext } from '@/contexts';
import { useContext, useState } from 'react';
import { ArrowRightCircle, BackArrowIcon, EditIcon, PremiumPoligon } from '@/components';

const avatarImages = {
    '1': require('../../assets/images/avatar_1.png'),
    '2': require('../../assets/images/avatar_2.png'),
    '3': require('../../assets/images/avatar_3.png'),
    '4': require('../../assets/images/avatar_4.png'),
    '5': require('../../assets/images/avatar_5.png'),
    '6': require('../../assets/images/avatar_6.png'),
};

const getNumericValue = (value: string) => Number(value.replace(/\D/g, ''));

const { height } = Dimensions.get('screen');

const HEIGHT_SELECT = [
    { label: 'Centimeters', value: 'cm' },
    { label: 'Feet', value: 'ft' },
    { label: 'Inches', value: 'in' },
];

const WEIGHT_SELECT = [
    { label: 'Kilograms', value: 'kg' },
    { label: 'Pounds', value: 'lb' },
];

export default function Profile() {
    const router = useRouter();

    const { weightUnits, heightUnits, userName, avatar, deviceId, convertWeight, setWeightUnits, setHeightUnits } =
        useContext(OnboardingContext);

    const [isUnitsModal, setIsUnitsModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [weight, setWeight] = useState<'kg' | 'lb'>(weightUnits);
    const [height, setHeight] = useState<'cm' | 'ft' | 'in'>(heightUnits);

    const toggleUnitsModalHandler = () =>
        setIsUnitsModal(p => {
            setWeight(weightUnits);
            setHeight(heightUnits);
            return !p;
        });

    const toggleDeleteModalHandler = () => setIsDeleteModal(p => !p);

    const dashboardScreenHandler = () => {
        router.push('/(dashboard)/dashboard');
    };

    const editUserScreenHandler = () => {
        router.push('/(profile)/user-edit');
    };

    const deleteUserScreenHandler = () => {
        toggleDeleteModalHandler();

        router.push('/(profile)/delete-screen');
    };

    const questionaryScreenHandler = () => {
        router.push({
            pathname: '/(paywall)/paywall-third',
            params: {
                retake: 'true',
            },
        });
    };

    const subscriptionScreenHandler = () => {
        router.push('/(profile)/subscription-cancel-screen');
    };

    const protein = convertWeight({ g: 12, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits);
    const fat = convertWeight({ g: 40, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits);
    const carbo = convertWeight({ g: 8, to: 'lb' }) + (weightUnits === 'kg' ? 'g' : weightUnits);

    const sum = getNumericValue(protein || '0') + getNumericValue(fat || '0') + getNumericValue(carbo || '0');

    const proteinSize = sum ? (getNumericValue(protein || '0') * 100) / sum : 0;
    const fatSize = sum ? (getNumericValue(fat || '0') * 100) / sum : 0;
    const carboSize = sum ? (getNumericValue(carbo || '0') * 100) / sum : 0;

    const onSupportPressHandler = () => Linking.openURL('mailto:support@aitrackerapp.ai');

    const onTermsPressHandler = () => Linking.openURL('mailto:support@aitrackerapp.ai');
    const onPrivacyPressHandler = () => Linking.openURL('mailto:support@aitrackerapp.ai');

    const onUnitsApply = () => {
        setWeightUnits(weight);
        setHeightUnits(height);

        toggleUnitsModalHandler();
    };

    return (
        <SafeAreaView style={s.container}>
            <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
                <View style={s.scrollBlock}>
                    <View style={s.header}>
                        <TouchableOpacity onPress={dashboardScreenHandler}>
                            <BackArrowIcon />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={subscriptionScreenHandler} style={s.premiumBlock}>
                            <Text style={s.premiumBlockText}>Premium</Text>
                            <PremiumPoligon />
                        </TouchableOpacity>
                    </View>

                    <View style={s.userInfo}>
                        <Image style={s.img} source={avatarImages[avatar ?? '1']} />

                        <View style={s.userInfoBlock}>
                            <View style={s.nameBlock}>
                                <Text style={s.userInfoName}>{userName}</Text>
                                <Text style={s.userInfoId}>ID: {deviceId}</Text>
                            </View>

                            <TouchableOpacity onPress={editUserScreenHandler}>
                                <EditIcon />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={s.nutritionalPlan}>
                        <Text style={s.nutritionalPlanTitle}>Your nutritional plan</Text>

                        <View style={s.nutritionalInnerBlock}>
                            <View style={s.nutritionalTop}>
                                <View style={s.kcalBlock}>
                                    <Text style={s.kcalBlockText}>2432 kcal</Text>
                                    <View style={s.kcalBlockProgress}>
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
                                </View>

                                <TouchableOpacity onPress={questionaryScreenHandler}>
                                    <ArrowRightCircle />
                                </TouchableOpacity>
                            </View>

                            <View style={s.waterProgressBlockBottom}>
                                <View style={s.waterProgressBlockBottomWaterGoal}>
                                    <View style={s.waterMarker}>
                                        <View style={[s.waterMarkerCircle, { backgroundColor: COLORS.PRO_BG_100 }]} />
                                        <Text style={s.waterMarkerText}>
                                            protein <Text style={s.waterMarkerTextBold}>{protein}</Text>
                                        </Text>
                                    </View>
                                    <View style={s.goalMarker}>
                                        <View style={[s.waterMarkerCircle, { backgroundColor: COLORS.YELLOW_100 }]} />
                                        <Text style={s.waterMarkerText}>
                                            fat <Text style={s.waterMarkerTextBold}>{fat}</Text>
                                        </Text>
                                    </View>

                                    <View style={s.goalMarker}>
                                        <View style={[s.waterMarkerCircle, { backgroundColor: COLORS.CARB_BG_100 }]} />
                                        <Text style={s.waterMarkerText}>
                                            carbs <Text style={s.waterMarkerTextBold}>{carbo}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={s.settingsBtn}>
                        <View style={s.nutritionalTop}>
                            <View style={s.kcalBlock}>
                                <Text style={s.kcalBlockText}>Units</Text>
                            </View>
                            <TouchableOpacity onPress={toggleUnitsModalHandler} style={s.unitsBtn}>
                                <Text style={s.unitsBtnText}>
                                    {heightUnits} ∙ {weightUnits}
                                </Text>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>

                        <Text style={s.settingsBtnBottom}>Set measurement units for height and weight</Text>
                    </View>

                    <View style={s.settingsBtn}>
                        <View style={s.nutritionalTop}>
                            <View style={s.kcalBlock}>
                                <Text style={s.kcalBlockText}>Support</Text>
                            </View>
                            <TouchableOpacity onPress={onSupportPressHandler}>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>

                        <Text style={s.settingsBtnBottom}>Write to us at our email</Text>
                    </View>

                    <View style={s.divider} />

                    <View style={s.settingsBtn}>
                        <View style={s.nutritionalTop}>
                            <View style={s.kcalBlock}>
                                <Text style={s.kcalBlockText}>Terms of Service</Text>
                            </View>
                            <TouchableOpacity onPress={onTermsPressHandler}>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[s.settingsBtn, { marginBottom: normalizeSize(24) }]}>
                        <View style={s.nutritionalTop}>
                            <View style={s.kcalBlock}>
                                <Text style={s.kcalBlockText}>Privacy Policy</Text>
                            </View>
                            <TouchableOpacity onPress={onPrivacyPressHandler}>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={s.deleteBlock}>
                        <TouchableOpacity onPress={toggleDeleteModalHandler}>
                            <Text style={s.deleteBlockText}>Delete account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal animationType="fade" transparent={true} visible={isUnitsModal}>
                <View style={s.modalBg}>
                    <View style={s.modalBody}>
                        <View style={s.headerModal}>
                            <View style={s.line} />
                        </View>

                        <Text style={s.modalTitle}>Units</Text>

                        <View style={s.sizeBlock}>
                            <Text style={s.sizeBlockTitle}>Height</Text>

                            <View style={s.sizeBlockList}>
                                {HEIGHT_SELECT?.map(item => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => setHeight(item?.value as 'cm')}
                                            style={s.sizeBlockListItem}
                                            key={item?.value}
                                        >
                                            <Text style={s.sizeBlockListItemText}>{item?.label}</Text>
                                            <View
                                                style={[
                                                    s.sizeBlockListItemCheckbox,
                                                    item?.value === height && s.selectedCheckbox,
                                                ]}
                                            >
                                                <View style={[item?.value === height && s.selectedCheckboxCircle]} />
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={[s.sizeBlock, { marginTop: normalizeSize(24) }]}>
                            <Text style={s.sizeBlockTitle}>Weight</Text>

                            <View style={s.sizeBlockList}>
                                {WEIGHT_SELECT?.map(item => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => setWeight(item?.value as 'kg')}
                                            style={s.sizeBlockListItem}
                                            key={item?.value}
                                        >
                                            <Text style={s.sizeBlockListItemText}>{item?.label}</Text>
                                            <View
                                                style={[
                                                    s.sizeBlockListItemCheckbox,
                                                    item?.value === weight && s.selectedCheckbox,
                                                ]}
                                            >
                                                <View style={[item?.value === weight && s.selectedCheckboxCircle]} />
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={s.btnsBlock}>
                            <TouchableOpacity onPress={toggleUnitsModalHandler} style={s.cancelBtn}>
                                <Text style={s.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={s.logBtn} onPress={onUnitsApply}>
                                <Text style={s.logBtnText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={isDeleteModal}>
                <View style={s.modalBg}>
                    <View style={s.modalBody}>
                        <View style={s.headerModal}>
                            <View style={s.line} />
                        </View>

                        <Text style={s.modalTitle}>Delete account</Text>

                        <View style={s.deleteTextList}>
                            <Text style={s.deleteTextListItem}>Are you sure? What's going to happen:</Text>
                            <Text style={s.deleteTextListItem}>
                                <Text>∙</Text> Your account will be deactivated immediately
                            </Text>
                            <Text style={s.deleteTextListItem}>
                                <Text>∙</Text> It will be reactivated if you re login within 30 days
                            </Text>
                            <Text style={s.deleteTextListItem}>
                                <Text>∙</Text> Afterwards, your data will be permanently deleted
                            </Text>
                        </View>

                        <Text style={s.deleteTextListItem}>
                            For more information about account deletion, read our{' '}
                            <Text style={s.linkText} onPress={onPrivacyPressHandler}>
                                Privacy Policy
                            </Text>
                            .
                        </Text>

                        <View style={s.btnsBlock}>
                            <TouchableOpacity style={s.mindBtn} onPress={toggleDeleteModalHandler}>
                                <Text style={s.logBtnText}>I changed my mind</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={deleteUserScreenHandler} style={s.deleteBtn}>
                                <Text style={[s.cancelBtnText, { color: COLORS.RED }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
        gap: normalizeSize(12),
    },

    img: {
        width: normalizeSize(48),
        height: normalizeSize(48),
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        marginTop: normalizeSize(24),
        marginBottom: normalizeSize(4),
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(8),
        borderRadius: 16,
        backgroundColor: COLORS.GREY,
        paddingHorizontal: normalizeSize(12),
        paddingVertical: normalizeSize(18),
    },

    userInfoName: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    userInfoId: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.28),
    },

    nameBlock: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: normalizeSize(2),
    },

    premiumBlock: {
        marginHorizontal: 'auto',
        paddingVertical: normalizeSize(8),
        paddingHorizontal: normalizeSize(12),
        backgroundColor: COLORS.GREEN_100,
        borderRadius: 8,
        gap: normalizeSize(2),

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    scroll: {
        alignSelf: 'stretch',
    },

    scrollBlock: {
        alignSelf: 'stretch',
        gap: normalizeSize(8),
        paddingBottom: normalizeSize(110),
        minHeight: height,
    },

    premiumBlockText: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.WHITE,
        letterSpacing: normalizeSize(-0.7),
    },

    userInfoBlock: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },

    nutritionalPlan: {
        paddingTop: normalizeSize(13),
        paddingHorizontal: normalizeSize(4),
        paddingBottom: normalizeSize(4),
        borderRadius: 16,
        backgroundColor: COLORS.GREY,
        gap: normalizeSize(13),
    },

    nutritionalPlanTitle: {
        marginLeft: normalizeSize(8),
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    nutritionalInnerBlock: {
        borderRadius: 12,
        backgroundColor: COLORS.WHITE,
        paddingTop: normalizeSize(13),
        paddingRight: normalizeSize(8),
        paddingBottom: normalizeSize(12),
        paddingLeft: normalizeSize(12),
        gap: normalizeSize(17),
    },

    nutritionalTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    kcalBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(6),
    },

    kcalBlockText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    kcalBlockProgress: {
        maxWidth: normalizeSize(80),
        gap: normalizeSize(2),
        flexDirection: 'row',
        alignItems: 'center',
    },

    waterLine: {
        height: normalizeSize(6),
        borderRadius: 8,
    },

    waterProgressBlockBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: normalizeSize(16),
    },

    waterProgressBlockBottomWaterGoal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(16),
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

    settingsBtn: { gap: normalizeSize(2), marginTop: normalizeSize(24) },

    settingsBtnBottom: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        textAlign: 'left',
        color: COLORS.BLACK40,
        maxWidth: normalizeSize(220),
    },

    unitsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(12),
    },

    unitsBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.096),
        textAlign: 'right',
        color: COLORS.BLACK40,
        textTransform: 'capitalize',
    },

    divider: {
        width: '100%',
        height: 1,
        marginTop: normalizeSize(24),
        marginBottom: normalizeSize(6),
        backgroundColor: COLORS.STROKE,
    },

    deleteBlock: { marginTop: 'auto', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' },
    deleteBlockText: {
        fontSize: normalizeSize(14),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.RED,
        letterSpacing: normalizeSize(-0.07),
    },

    modalBg: {
        flex: 1,
        width: '100%',

        backgroundColor: 'rgba(17, 18, 20, 0.8)',
        margin: 'auto',
        position: 'relative',
    },

    modalBody: {
        position: 'absolute',
        bottom: normalizeSize(30),
        left: 0,

        backgroundColor: COLORS.WHITE,
        borderRadius: 28,
        width: '100%',
        paddingHorizontal: normalizeSize(16),
        paddingVertical: normalizeSize(32),
    },

    headerModal: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        top: normalizeSize(9.5),
    },

    line: { width: normalizeSize(24), height: normalizeSize(4), backgroundColor: COLORS.BLACK100, borderRadius: 2.5 },

    btnsBlock: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(4),
        marginTop: normalizeSize(32),
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

    mindBtn: {
        paddingHorizontal: normalizeSize(20),
        paddingVertical: normalizeSize(16),
        backgroundColor: COLORS.BLACK100,
        alignSelf: 'stretch',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
    },

    deleteBtn: {
        paddingHorizontal: normalizeSize(20),
        paddingVertical: normalizeSize(16),
        backgroundColor: COLORS.GREY,
        alignSelf: 'stretch',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
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

    modalTitle: {
        fontSize: normalizeSize(20),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.8),
        marginBottom: normalizeSize(24),
    },

    sizeBlock: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        gap: normalizeSize(8),
    },

    sizeBlockTitle: {
        fontSize: normalizeSize(12),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        color: COLORS.BLACK40,
        letterSpacing: normalizeSize(-0.24),
    },

    sizeBlockList: {
        flexDirection: 'column',
        alignSelf: 'stretch',
    },

    sizeBlockListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalizeSize(8),
    },

    sizeBlockListItemText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },

    sizeBlockListItemCheckbox: {
        width: normalizeSize(20),
        height: normalizeSize(20),
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.STROKE,
    },

    selectedCheckbox: {
        borderColor: COLORS.BLACK100,
    },

    selectedCheckboxCircle: {
        width: normalizeSize(12),
        height: normalizeSize(12),
        borderRadius: 100,
        backgroundColor: COLORS.BLACK100,
    },

    deleteTextList: {
        flexDirection: 'column',
        gap: normalizeSize(8),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: normalizeSize(32),
    },

    deleteTextListItem: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        color: COLORS.BLACK40,
        flexDirection: 'row',
        alignItems: 'center',
    },

    linkText: {
        color: COLORS.BLACK100,
    },
});
