import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ListItem, PickerListItemProps } from './types';
import { COLORS } from '@/constants';
import { normalizeSize } from '@/utils';

export default function DynamicallyWeightPickerListItem<ItemT extends ListItem>({
    item,
    height,
}: PickerListItemProps<ItemT>) {
    return (
        <View style={{ ...s.viewWrapper, width: height }}>
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
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    viewWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        gap: normalizeSize(10),
    },

    line: {
        width: normalizeSize(2),
        height: normalizeSize(82),
        backgroundColor: COLORS.BLACK100,
        opacity: 0.2,
    },

    lineSmall: {
        width: normalizeSize(2),
        height: normalizeSize(27),
        backgroundColor: COLORS.BLACK100,
        opacity: 0.2,
    },

    smallLinesBlock: {
        position: 'absolute',
        right: 0,
        top: normalizeSize(43),
        gap: normalizeSize(10),
        flexDirection: 'column',
    },
});
