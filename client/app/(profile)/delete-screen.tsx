import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StyleSheet, Text, ImageBackground, View, TouchableOpacity } from 'react-native';
import { normalizeSize } from '@/utils';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';

export default function Profile() {
    const router = useRouter();

    const dashboardScreenHandler = () => {
        router.push('/(dashboard)/dashboard');
    };

    return (
        <ImageBackground
            source={require('../../assets/images/delete_account.png')}
            style={s.background}
            resizeMode="cover"
        >
            <SafeAreaView style={s.container}>
                <View style={s.bottomBlock}>
                    <Text style={s.title}>We’ll miss you</Text>
                    <Text style={s.descr}>Your account is now disabled. Your data will be deleted within 30 days</Text>
                </View>

                <TouchableOpacity onPress={dashboardScreenHandler} style={s.deleteBtn}>
                    <Text style={[s.cancelBtnText]}>Close</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
    );
}

const s = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 0 : normalizeSize(20),
    },

    bottomBlock: {
        marginTop: 'auto',
        marginBottom: normalizeSize(52),
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: normalizeSize(249),
    },

    title: {
        fontSize: normalizeSize(32),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.WHITE,
        letterSpacing: normalizeSize(-1.6),
    },

    descr: {
        fontSize: normalizeSize(14),
        fontWeight: 500,
        fontFamily: 'Inter_500Medium',
        letterSpacing: normalizeSize(-0.28),
        color: COLORS.WHITE,
        textAlign: 'center',
    },

    deleteBtn: {
        paddingHorizontal: normalizeSize(20),
        paddingVertical: normalizeSize(16),
        backgroundColor: COLORS.GREY,
        alignSelf: 'stretch',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    cancelBtnText: {
        fontSize: normalizeSize(16),
        fontWeight: 600,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.BLACK100,
        letterSpacing: normalizeSize(-0.64),
    },
});
