const authorReducer = (state = [], action) => {
    let newState = [...state];

    switch (action.type) {
        case "SET_AUTHOR":
            return action.items.reverse();
        case "CREATE_AUTHOR":
            return [
                action.item,
                ...newState,
            ];
        case "EDIT_AUTHOR":
            const index = newState.findIndex(item => item.id === action.options.id);
            newState[index] = action.options;
            return newState;
        case "DELETE_AUTHOR":
            return newState.filter(item => item.id !== action.id);
        // case "DELETE_ALL_AUTHOR":
        //     return [];
        default:
            return state;
    }
}

export default authorReducer;