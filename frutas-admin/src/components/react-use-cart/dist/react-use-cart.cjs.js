'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function useLocalStorage(key, initialValue) {
    var _a = React.useState(function () {
        try {
            var item = typeof window !== "undefined" && window.localStorage.getItem(key);
            return item ? item : initialValue;
        }
        catch (error) {
            return initialValue;
        }
    }), storedValue = _a[0], setStoredValue = _a[1];
    var setValue = function (value) {
        try {
            var valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, valueToStore);
        }
        catch (error) {
            console.log(error);
        }
    };
    return [storedValue, setValue];
}

var initialState = {
    items: [],
    isEmpty: true,
    totalItems: 0,
    totalUniqueItems: 0,
    cartTotal: 0,
    cartWeight: 0,
    metadata: {},
};
var CartContext = React.createContext(initialState);
var createCartIdentifier = function (len) {
    if (len === void 0) { len = 12; }
    return __spreadArrays(Array(len)).map(function () { return (~~(Math.random() * 36)).toString(36); }).join("");
};
var useCart = function () {
    var context = React.useContext(CartContext);
    if (!context)
        throw new Error("Expected to be wrapped in a CartProvider");
    return context;
};
function reducer(state, action) {
    
    switch (action.type) {
        case "SET_ITEMS":
            return generateCartState(state, action.payload);
        case "ADD_ITEM": {
            console.log(' cjs payload :',action.payload);
            var items = __spreadArrays(state.items, [action.payload]);
            return generateCartState(state, items);
        }
        case "UPDATE_ITEM": {
            var items = state.items.map(function (item) {
                if (item.id !== action.id)
                    return item;
                return __assign(__assign({}, item), action.payload);
            });
            return generateCartState(state, items);
        }
        case "REMOVE_ITEM": {
            var items = state.items.filter(function (i) { return i.id !== action.id; });
            return generateCartState(state, items);
        }
        case "EMPTY_CART":
            return initialState;
        case "UPDATE_CART_META":
            return __assign(__assign({}, state), { metadata: __assign(__assign({}, state.metadata), action.payload) });
        default:
            throw new Error("No action specified");
    }
}
var generateCartState = function (state, items) {
    console.log(items);
    if (state === void 0) { state = initialState; }
    var totalUniqueItems = calculateUniqueItems(items);
    var isEmpty = totalUniqueItems === 0;
    return __assign(__assign(__assign({}, initialState), state), { items: calculateItemTotals(items), totalItems: calculateTotalItems(items), totalUniqueItems: totalUniqueItems, cartTotal: calculateCartTotal(items), cartWeight: calculateCartWeight(items), isEmpty: isEmpty });
};
var calculateItemTotals = function (items) {
    return items.map(function (item) { return (__assign(__assign({}, item), { itemTotal: item.price * item.quantity })); });
};
var calculateCartTotal = function (items) {
    return items.reduce(function (total, item) { return total + item.quantity * item.price; }, 0);
};
var calculateCartWeight = function (items) {
    return items.reduce(function (total, item) { return total + item.quantity * item.basket_weight; }, 0);
};
var calculateTotalItems = function (items) {
    return items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
};
var calculateUniqueItems = function (items) { return items.length; };
var CartProvider = function (_a) {
    var children = _a.children, cartId = _a.id, _b = _a.defaultItems, defaultItems = _b === void 0 ? [] : _b, onSetItems = _a.onSetItems, onItemAdd = _a.onItemAdd, onItemUpdate = _a.onItemUpdate, onItemRemove = _a.onItemRemove, _c = _a.storage, storage = _c === void 0 ? useLocalStorage : _c, metadata = _a.metadata;
    var id = cartId ? cartId : createCartIdentifier();
    var _d = storage(cartId ? "subs-react-use-cart-" + id : "subs-react-use-cart", JSON.stringify(__assign(__assign({ id: id }, initialState), { items: defaultItems, metadata: metadata }))), savedCart = _d[0], saveCart = _d[1];
    var _e = React.useReducer(reducer, JSON.parse(savedCart)), state = _e[0], dispatch = _e[1];
    React.useEffect(function () {
        saveCart(JSON.stringify(state));
    }, [state, saveCart]);
    var setItems = function (items) {
        dispatch({
            type: "SET_ITEMS",
            payload: items,
        });
        onSetItems && onSetItems(items);
    };
    var addItem = function (item, quantity) {
        if (quantity === void 0) { quantity = 1; }
        if (!item.id)
            throw new Error("You must provide an `id` for items");
        if (quantity <= 0)
            return;
        var currentItem = state.items.find(function (i) { return i.id === item.id; });
        if (!currentItem && !item.hasOwnProperty("price"))
            throw new Error("You must pass a `price` for new items");
        if (!currentItem) {
            var payload_1 = __assign(__assign({}, item), { quantity: quantity });
            dispatch({ type: "ADD_ITEM", payload: payload_1 });
            onItemAdd && onItemAdd(payload_1);
            return;
        }
        var payload = __assign(__assign({}, item), { quantity: currentItem.quantity + quantity });
        dispatch({
            type: "UPDATE_ITEM",
            id: item.id,
            payload: payload,
        });
        onItemUpdate && onItemUpdate(payload);
    };
    var updateItem = function (id, payload) {
        if (!id || !payload) {
            return;
        }
        dispatch({ type: "UPDATE_ITEM", id: id, payload: payload });
        onItemUpdate && onItemUpdate(payload);
    };
    var updateItemQuantity = function (id, quantity, weight) {
        console.log(' cjs updateItemQuantity :',weight);
        if (quantity <= 0) {
            onItemRemove && onItemRemove(id);
            dispatch({ type: "REMOVE_ITEM", id: id });
            return;
        }
        var currentItem = state.items.find(function (item) { return item.id === id; });
        if (!currentItem)
            throw new Error("No such item to update");
        var payload = __assign(__assign({}, currentItem), { quantity: quantity,basket_weight: weight });
        dispatch({
            type: "UPDATE_ITEM",
            id: id,
            payload: payload,
        });
        onItemUpdate && onItemUpdate(payload);
    };
    var removeItem = function (id) {
        if (!id)
            return;
        dispatch({ type: "REMOVE_ITEM", id: id });
        onItemRemove && onItemRemove(id);
    };
    var emptyCart = function () {
        return dispatch({
            type: "EMPTY_CART",
        });
    };
    var getItem = function (id) {
        return state.items.find(function (i) { return i.id === id; });
    };
    var inCart = function (id) { return state.items.some(function (i) { return i.id === id; }); };
    var updateCartMetadata = function (metadata) {
        if (!metadata)
            return;
        dispatch({
            type: "UPDATE_CART_META",
            payload: metadata,
        });
    };
    return (React.createElement(CartContext.Provider, { value: __assign(__assign({}, state), { getItem: getItem,
            inCart: inCart,
            setItems: setItems,
            addItem: addItem,
            updateItem: updateItem,
            updateItemQuantity: updateItemQuantity,
            removeItem: removeItem,
            emptyCart: emptyCart,
            updateCartMetadata: updateCartMetadata }) }, children));
};

exports.CartProvider = CartProvider;
exports.createCartIdentifier = createCartIdentifier;
exports.initialState = initialState;
exports.useCart = useCart;
//# sourceMappingURL=react-use-cart.cjs.js.map
