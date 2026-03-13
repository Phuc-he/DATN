export const addToCart = (info) => {
    return ({
        type: "ADD_TO_CART",
        id: info.id,
        info: info,
    })
}

export const updateQuantity = (id, quantity = 1) => {
    return ({
        type: "UPDATE_QUANTITY",
        id: id,
        quantity: quantity
    })
}

export const deleteItem = (id) => {
    return ({
        type: "DELETE_ITEM",
        id: id,
    })
}

export const deleteAllItem = () => {
    return ({
        type: "DELETE_ALL_ITEM",
    })
}

export const setCart = (items) => ({
    type: "SET_CART",
    items: items
});