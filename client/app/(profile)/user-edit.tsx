import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Platform,
    StyleSheet,
    View,
    Dimensions,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { OnboardingContext } from '@/contexts';
import { useCallback, useContext, useRef, useState } from 'react';
import Carousel, { ICarouselInstance, TAnimationStyle } from 'react-native-reanimated-carousel';
import { interpolate, useSharedValue } from 'react-native-reanimated';
import { Keyboard, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatarImages = {
    '1': require('../../assets/images/avatar_1.png'),
    '2': require('../../assets/images/avatar_2.png'),
    '3': require('../../assets/images/avatar_3.png'),
    '4': require('../../assets/images/avatar_4.png'),
    '5': require('../../assets/images/avatar_5.png'),
    '6': require('../../assets/images/avatar_6.png'),
};

const { width } = Dimensions.get('window');

export default function Profile() {
    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const { avatar, userName, setUserName, setAvatar } = useContext(OnboardingContext);

    const [activeIndex, setActiveIndex] = useState(Number(avatar) - 1);
    const [name, setName] = useState(userName);

    const [onFocus, setOnFocus] = useState(false);

    const router = useRouter();

    const profileScreenHandler = () => {
        router.push('/(profile)/profile');
    };

    const saveDataHandler = async () => {
        setUserName(name);
        setAvatar((activeIndex + 1)?.toString() as '1');

        await AsyncStorage.setItem('user-avatar', (activeIndex + 1)?.toString());
        await AsyncStorage.setItem('user-name', name);

        router.push('/(profile)/profile');
    };

    const itemSize = 80;
    const centerOffset = width / 2 - itemSize / 2;

    const animationStyle: TAnimationStyle = useCallback(
        (value: number) => {
            'worklet';

            const itemGap = interpolate(value, [-3, -2, -1, 0, 1, 2, 3], [-30, -15, 0, 0, 0, 15, 30]);

            const translateX = interpolate(value, [-1, 0, 1], [-itemSize, 0, itemSize]) + centerOffset - itemGap;

            const scale = interpolate(value, [-1, -0.5, 0, 0.5, 1], [0.8, 0.85, 1.1, 0.85, 0.8]);

            return {
                transform: [
                    {
                        translateX,
                    },

                    { scale },
                ],
            };
        },
        [centerOffset]
    );

    const isDirty = avatar !== (activeIndex + 1).toString() || name !== userName;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={s.container}>
                    <View style={s.scrollBlock}>
                        <View style={[s.header, onFocus && { marginBottom: 0 }]}>
                            <Text style={s.headerTitle}>Edit profile info</Text>
                        </View>
                        {!onFocus && (
                            <Carousel
                                ref={ref}
                                defaultIndex={activeIndex}
                                width={itemSize}
                                height={itemSize}
                                style={{
                                    width: width,
                                    height: itemSize + 20,
                                    alignItems: 'center',
                                }}
                                onProgressChange={progress}
                                loop
                                data={Array.from({ length: 6 }, (_, i) => i)}
                                onSnapToItem={setActiveIndex}
                                modeConfig={{
                                    snapDirection: 'left',
                                }}
                                renderItem={({ index }) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            {
                                                width: '100%',
                                                height: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            },
                                            activeIndex === index && {
                                                borderWidth: 2,
                                                borderColor: COLORS.STROKE,
                                                borderRadius: 100,
                                            },
                                        ]}
                                        onPress={() => {
                                            setActiveIndex(index);

                                            ref?.current?.scrollTo({
                                                count: index - progress?.value,
                                                animated: true,
                                            });
                                        }}
                                    >
                                        <Image
                                            source={avatarImages[(index + 1).toString() as '1']}
                                            style={s.image}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                )}
                                customAnimation={animationStyle}
                            />
                        )}
                        <View style={s.counter}>
                            <Text style={s.label}>Your name</Text>
                            <TextInput
                                style={s.input}
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={COLORS.BLACK40}
                                onFocus={() => setOnFocus(true)}
                                onBlur={() => setOnFocus(false)}
                            />
                        </View>
                    </View>

                    <View style={s.btnsBlock}>
                        <TouchableOpacity onPress={profileScreenHandler} style={s.cancelBtn}>
                            <Text style={s.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!isDirty}
                            style={[s.logBtn, !isDirty && { backgroundColor: COLORS.SHADOW_GRAY_10 }]}
                            onPress={saveDataHandler}
                        >
                            <Text style={[s.logBtnText, !isDirty && { color: COLORS.SHADOW_GRAY_30 }]}>Apply</Text>
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
        backgroundColor: COLORS.WHITE,
        position: 'relative',
        paddingBottom: Platform.OS === 'ios' ? 0 : normalizeSize(20),
        gap: normalizeSize(12),
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginTop: normalizeSize(55),
        marginBottom: normalizeSize(30),
    },

    scroll: {
        alignSelf: 'stretch',
    },

    scrollBlock: {
        alignSelf: 'stretch',
        gap: normalizeSize(8),
        paddingBottom: normalizeSize(110),
        flex: 1,
    },

    headerTitle: {
        fontSize: normalizeSize(32),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-1.6),
    },

    item: {
        borderRadius: 40,
        padding: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    active: {
        borderRadius: 100,
        padding: normalizeSize(10),
        borderWidth: 2,
        borderColor: COLORS.STROKE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 66,
        height: 66,
        borderRadius: 100,
    },

    counter: {
        flexDirection: 'column',
        width: '100%',
        paddingHorizontal: normalizeSize(16),
        marginTop: normalizeSize(30),
    },

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

        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.STROKE,
        padding: normalizeSize(16),
    },

    btnsBlock: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalizeSize(4),
        marginTop: 'auto',
        paddingHorizontal: normalizeSize(16),
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
