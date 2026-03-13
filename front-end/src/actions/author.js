export const setAuthor = (items) => {
    return ({
        type: "SET_AUTHOR",
        items: items,
    })
}

export const createAuthor = (item) => {
    return ({
        type: "CREATE_AUTHOR",
        item: item,
    })
}

export const editAuthor = (options) => {
    return ({
        type: "EDIT_AUTHOR",
        options: options,
    })
}

export const deleteAuthor = (id) => {
    return ({
        type: "DELETE_AUTHOR",
        id: id,
    })
}