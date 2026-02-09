import React, { createRef, useState } from 'react';

import { StyleSheet, View, ScrollView, NativeScrollEvent, NativeSyntheticEvent, Text, Dimensions } from 'react-native';
import DynamicallyWeightPickerListItem from './DynamicallyWeightPickerListItem';
import type { ListItem, PickerProps } from './types';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants';
import { ArrowBottomHeight, ArrowTopHeight } from '../svg';
import { normalizeSize } from '@/utils';

const itemDefaults: Array<ListItem> = [
    {
        label: 'No items',
        value: 0,
        itemColor: 'red',
    },
];

export function DynamicallyWeightPicker<ItemT extends ListItem>({
    items = itemDefaults as unknown as Array<ItemT>,
    onScroll,
    width = 300,
    height = 300,
    initialSelectedIndex = 0,
    transparentItemRows = 2,
}: PickerProps<ItemT>) {
    const itemSize = Math.ceil(width / (transparentItemRows * 2 + 1));

    const [itemIndex, setItemIndex] = useState<number>(initialSelectedIndex);

    const scrollViewRef = createRef<ScrollView>();

    const scrollToInitialPosition = () => {
        scrollViewRef.current?.scrollTo({ x: itemSize * initialSelectedIndex, animated: false });
    };

    function fakeItems(n = 3): Array<ItemT> {
        const itemsArr = [];
        for (let i = 0; i < n; i++) {
            itemsArr[i] = {
                value: -1,
                label: '',
                fakeItem: true,
            };
        }
        return itemsArr as Array<ItemT>;
    }

    function allItemsLength() {
        return extendedItems().length - transparentItemRows * 2;
    }

    function onScrollListener(event: NativeSyntheticEvent<NativeScrollEvent>) {
        if (onScroll != null) {
            const index = getItemIndex(event);
            if (itemIndex !== index && index >= 0 && index < allItemsLength()) {
                setItemIndex(index);
                onScroll({ index });

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            }
        }
    }

    function onMomentumScrollEndListener(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const index = getItemIndex(event);

        if (index >= 0 && index < allItemsLength()) {
            setItemIndex(index);

            scrollViewRef.current?.scrollTo({ x: index * itemSize, animated: true });
        }
    }

    function getItemIndex(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const offset = event.nativeEvent.contentOffset.x;
        return Math.round(offset / itemSize);
    }

    function extendedItems(): Array<ItemT> {
        return [...fakeItems(transparentItemRows), ...items, ...fakeItems(transparentItemRows)];
    }

    return (
        <View style={{ height, width, ...s.wrapper }}>
            <ScrollView
                ref={scrollViewRef}
                onLayout={scrollToInitialPosition}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEndListener}
                onScroll={onScrollListener}
                scrollEventThrottle={20}
                snapToInterval={itemSize}
                horizontal
            >
                {extendedItems().map((item: ItemT, index) => {
                    return (
                        <DynamicallyWeightPickerListItem
                            key={index}
                            item={item}
                            isSelected={itemIndex + transparentItemRows === index}
                            height={itemSize}
                        />
                    );
                })}
            </ScrollView>

            <View style={s.selectedLine} />

            <View style={[s.selectedWrapper, { top: height / 2 - 70 }]}>
                <ArrowTopHeight style={s.topArrow} />
                <Text
                    style={{
                        fontSize: normalizeSize(20),
                        color: COLORS.BLACK100,
                        opacity: 1,
                        fontFamily: 'Inter_600SemiBold',
                    }}
                >
                    {extendedItems()?.[itemIndex + transparentItemRows].label}
                </Text>
                <ArrowBottomHeight style={s.bottomArrow} />
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    wrapper: { justifyContent: 'center', alignItems: 'center' },
    selectedLine: {
        width: normalizeSize(2),
        height: normalizeSize(86),
        backgroundColor: COLORS.RED,

        position: 'absolute',

        bottom: normalizeSize(4),
        transform: [{ translateX: normalizeSize(2) }],
    },

    selectedWrapper: {
        width: 60,
        height: 40,
        backgroundColor: COLORS.WHITE,

        shadowColor: 'rgba(17, 18, 20, 0.16)', // Shadow color
        shadowOffset: { width: 0, height: 0 }, // X and Y offset
        shadowOpacity: 1, // Opacity of the shadow
        shadowRadius: 16, // Blur radius

        // For Android:
        elevation: 16, // Controls shadow intensity on Android
        borderRadius: 31,

        position: 'absolute',

        alignItems: 'center',
        justifyContent: 'center',
    },

    topArrow: {
        position: 'absolute',
        right: -12,
        transform: [{ rotate: '90deg' }],
    },

    bottomArrow: {
        position: 'absolute',
        left: -12,
        transform: [{ rotate: '90deg' }],
    },
});
