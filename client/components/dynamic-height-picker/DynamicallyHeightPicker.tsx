import React, { createRef, useState } from 'react';

import { StyleSheet, View, ScrollView, NativeScrollEvent, NativeSyntheticEvent, Text } from 'react-native';
import DynamicallyHeightPickerListItem from './DynamicallyHeightPickerListItem';
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

export function DynamicallyHeightPicker<ItemT extends ListItem>({
    items = itemDefaults as unknown as Array<ItemT>,
    onScroll,
    width = 300,
    height = 300,
    initialSelectedIndex = 0,
    transparentItemRows = 1,
}: PickerProps<ItemT>) {
    // work out the size of each 'slice' so it fits in the size of the view
    const itemSize = Math.ceil(height / (transparentItemRows * 2 + 1));

    const [itemIndex, setItemIndex] = useState<number>(initialSelectedIndex);

    // create a reference to the scroll view so we can control it's fine scroll
    const scrollViewRef = createRef<ScrollView>();

    const scrollToInitialPosition = () => {
        scrollViewRef.current?.scrollTo({ y: itemSize * initialSelectedIndex, animated: false });
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

            scrollViewRef.current?.scrollTo({ y: index * itemSize, animated: true });
        }
    }

    function getItemIndex(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const offset = event.nativeEvent.contentOffset.y;

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
            >
                {extendedItems().map((item: ItemT, index) => {
                    return <DynamicallyHeightPickerListItem key={index} item={item} height={itemSize} />;
                })}
            </ScrollView>

            <View style={s.selectedLine} />

            <View style={[s.selectedWrapper, { top: height / 2 - 20, left: width / 2 - 30 }]}>
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
        width: normalizeSize(82),
        height: normalizeSize(2),
        backgroundColor: COLORS.RED,

        position: 'absolute',

        right: 0,
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
        top: -10,
    },

    bottomArrow: {
        position: 'absolute',
        bottom: -10,
    },
});
