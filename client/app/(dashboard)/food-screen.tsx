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
import { CameraImageIcon, DeleteImageIcon, DropdownArrow, PickImageIcon } from '@/components';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

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

export default function FoodScreen() {
    const router = useRouter();

    const inputRef = useRef<TextInput>(null);

    const [period, setPeriod] = useState<0 | 1 | 2>(0);

    const [count, setCount] = useState('');

    const [focused, setFocused] = useState(false);

    const [selectedImages, setSelectedImages] = useState<string[] | []>([]);

    const goNextStep = () => {
        router.push({
            pathname: '/(dashboard)/food-screen-confirm',
            params: {
                countState: count,
                periodState: String(period),
            },
        });
    };

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages(p => [...p, result.assets[0].uri]);
        }
    };

    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted === false) {
            alert('Permission to access camera is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages(p => [...p, result.assets[0].uri]);
        }
    };

    const removeImage = (uri: string) => {
        setSelectedImages(prev => prev.filter(img => img !== uri));
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={s.container}>
                    <View style={s.headerBlock}>
                        <Text style={s.title}>Add meal</Text>

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

                    {!focused && <Image style={s.img} source={require('../../assets/images/add-food.png')} />}

                    <View style={s.counter}>
                        {!!selectedImages?.length && (
                            <View style={s.imagesList}>
                                {selectedImages?.map(img => (
                                    <View style={s.imageContainer} key={img}>
                                        <TouchableOpacity onPress={() => removeImage(img)} style={s.imageClose}>
                                            <DeleteImageIcon />
                                        </TouchableOpacity>
                                        <Image style={s.imageSelected} source={img} />
                                    </View>
                                ))}
                            </View>
                        )}
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

                        <View style={s.btnsBlock}>
                            <View style={s.btnsBlockLeft}>
                                <TouchableOpacity onPress={pickImageAsync}>
                                    <PickImageIcon />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={openCamera}>
                                    <CameraImageIcon />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                disabled={count?.length < 1}
                                onPress={goNextStep}
                                style={[s.logBtn, count?.length < 1 && s.disabledBtn]}
                            >
                                <Text style={s.logBtnText}>Log entry</Text>
                            </TouchableOpacity>
                        </View>
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

    img: {
        width: normalizeSize(258),
        height: 'auto',
        aspectRatio: 218 / 116,
        marginTop: 'auto',
    },

    btnsBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: normalizeSize(4),
    },

    btnsBlockLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: normalizeSize(4),
    },

    imagesList: {
        flexDirection: 'row',
        gap: normalizeSize(8),
        alignItems: 'center',
    },

    imageSelected: {
        width: normalizeSize(60),
        height: normalizeSize(60),
        borderRadius: 12,
    },

    imageContainer: {
        position: 'relative',
    },

    imageClose: {
        position: 'absolute',
        right: normalizeSize(4),
        top: normalizeSize(4),
        zIndex: 2,
    },
});
