export const setCategory = (items) => {
    return ({
        type: "SET_CATEGORY",
        items: items,
    })
}

export const createCategory = (item) => {
    return ({
        type: "CREATE_CATEGORY",
        item: item,
    })
}

export const editCategory = (options) => {
    return ({
        type: "EDIT_CATEGORY",
        options: options,
    })
}

export const deleteCategory = (id) => {
    return ({
        type: "DELETE_CATEGORY",
        id: id,
    })
}