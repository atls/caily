export type ListItem = {
    label: string;
    value: number;
    itemColor?: string;
    fakeItem?: boolean; // property will only be defined on fake items
};

export interface PickerProps<ItemT extends ListItem> {
    items?: Array<ItemT>;
    onScroll?: ({ index }: { index: number }) => void;
    initialSelectedIndex?: number;
    height?: number;
    width?: number;

    transparentItemRows?: number;
}

export interface PickerListItemProps<ItemT extends ListItem> {
    key: number;
    item: ItemT;
    height: number;
}
