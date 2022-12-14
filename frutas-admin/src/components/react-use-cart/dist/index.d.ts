import * as React from "react";
interface Item {
    id: string;
    price: number;
    quantity?: number;
    product_weight?: number;
    itemTotal?: number;
    [key: string]: any;
}
interface InitialState {
    items: Item[];
    isEmpty: boolean;
    totalItems: number;
    totalUniqueItems: number;
    cartTotal: number;
    cartWeight: number;
    metadata?: Metadata;
}
interface Metadata {
    [key: string]: any;
}
interface CartProviderState extends InitialState {
    addItem: (item: Item, quantity?: number) => void;
    removeItem: (id: Item["id"]) => void;
    updateItem: (id: Item["id"], payload: object) => void;
    updateItemQuantity: (id: Item["id"], quantity: number, product_weight: number) => void;
    emptyCart: () => void;
    getItem: (id: Item["id"]) => any | undefined;
    inCart: (id: Item["id"]) => boolean;
}
export declare type Actions = {
    type: "SET_ITEMS";
    payload: Item[];
} | {
    type: "ADD_ITEM";
    payload: Item;
} | {
    type: "REMOVE_ITEM";
    id: Item["id"];
} | {
    type: "UPDATE_ITEM";
    id: Item["id"];
    payload: object;
    weight: object;
} | {
    type: "EMPTY_CART";
} | {
    type: "UPDATE_CART_META";
    payload: Metadata;
};
export declare const initialState: any;
export declare const createCartIdentifier: (len?: number) => string;
export declare const useCart: () => CartProviderState;
export declare const CartProvider: React.FC<{
    children?: React.ReactNode;
    id?: string;
    defaultItems?: Item[];
    onSetItems?: (items: Item[]) => void;
    onItemAdd?: (payload: Item) => void;
    onItemUpdate?: (payload: object) => void;
    onItemRemove?: (id: Item["id"]) => void;
    storage?: (key: string, initialValue: string) => [string, (value: Function | string) => void];
    metadata?: Metadata;
}>;
export {};


