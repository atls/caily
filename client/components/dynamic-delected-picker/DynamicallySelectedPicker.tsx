import React, { createRef, useState } from 'react';

import { StyleSheet, View, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import DynamicallySelectedPickerListItem from './DynamicallySelectedPickerListItem';
import type { ListItem, PickerProps } from './types';
import * as Haptics from 'expo-haptics';
import { SelectPicker } from '../svg';
const itemDefaults: Array<ListItem> = [
    {
        label: 'No items',
        value: 0,
        itemColor: 'red',
    },
];

export function DynamicallySelectedPicker<ItemT extends ListItem>({
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
                scrollEventThrottle={10}
                horizontal
                snapToInterval={itemSize}
                style={s.scroll}
            >
                {extendedItems().map((item: ItemT, index) => {
                    return (
                        <DynamicallySelectedPickerListItem
                            key={index}
                            item={item}
                            isSelected={itemIndex + transparentItemRows === index}
                            isPrevious={itemIndex + transparentItemRows === index + 1}
                            height={itemSize}
                        />
                    );
                })}
            </ScrollView>

            <SelectPicker style={s.gradientHorizontalWrapper} />
        </View>
    );
}

const s = StyleSheet.create({
    wrapper: { justifyContent: 'center', alignItems: 'center' },
    scroll: { zIndex: 2 },
    gradientHorizontalWrapper: {
        position: 'absolute',
        zIndex: 1,
    },
});
