import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { ListItem, PickerListItemProps } from './types';
import { COLORS } from '@/constants';
import { normalizeSize } from '@/utils';

const { width } = Dimensions.get('screen');

export default function DynamicallyHeightPickerListItem<ItemT extends ListItem>({
    item,
    height,
}: PickerListItemProps<ItemT>) {
    return (
        <View
            style={{
                ...s.viewWrapper,
                height: height,
            }}
        >
            <Text
                style={{
                    fontSize: normalizeSize(20),
                    color: COLORS.BLACK100,
                    opacity: 0.2,
                    fontFamily: 'Inter_600SemiBold',
                }}
            >
                {item.label}
            </Text>

            <View style={s.line} />

            <View style={s.smallLinesBlock}>
                <View style={s.lineSmall} />
                <View style={s.lineSmall} />
                <View style={s.lineSmall} />
                <View style={s.lineSmall} />
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    viewWrapper: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    line: {
        width: normalizeSize(82),
        height: 2,
        backgroundColor: COLORS.BLACK100,
        opacity: 0.2,
        position: 'absolute',

        right: 0,
    },

    lineSmall: {
        width: normalizeSize(27),
        height: 2,
        backgroundColor: COLORS.BLACK100,
        opacity: 0.2,
    },
    smallLinesBlock: {
        position: 'absolute',
        right: 0,
        top: normalizeSize(46),
        gap: normalizeSize(12),
        flexDirection: 'column',
    },
});
