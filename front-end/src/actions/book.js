export const setBook = (items) => {
    return ({
        type: "SET_BOOK",
        items: items,
    })
}

export const createBook = (item) => {
    return ({
        type: "CREATE_BOOK",
        item: item,
    })
}

export const editBook = (options) => {
    return ({
        type: "EDIT_BOOK",
        options: options,
    })
}

export const deleteBook = (id) => {
    return ({
        type: "DELETE_BOOK",
        id: id,
    })
}