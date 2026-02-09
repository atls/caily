import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ListItem, PickerListItemProps } from './types';
import { COLORS } from '@/constants';
import { normalizeSize } from '@/utils';

export default function DynamicallySelectedPickerListItem<ItemT extends ListItem>({
    item,
    height,
    isSelected,
    isPrevious,
}: PickerListItemProps<ItemT>) {
    return (
        <View style={{ ...styles.viewWrapper, width: height }}>
            <Text
                style={{
                    fontSize: normalizeSize(20),
                    color: COLORS.BLACK100,
                    opacity: isSelected ? 1 : 0.2,
                    fontFamily: 'Inter_600SemiBold',
                }}
            >
                {item.label}
            </Text>

            {!isSelected && !isPrevious && <View style={styles.line} />}
        </View>
    );
}

const styles = StyleSheet.create({
    viewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    line: {
        width: 12,
        height: 1,
        backgroundColor: COLORS.BLACK100,
        opacity: 0.2,
        position: 'absolute',
        right: -5,
    },
});
