const bookReducer = (state = [], action) => {
    let newState = [...state];

    switch (action.type) {
        case "SET_BOOK":
            return action.items.reverse();
        case "CREATE_BOOK":
            return [
                action.item,
                ...newState,
            ];
        case "EDIT_BOOK":
            const index = newState.findIndex(item => item.id === action.options.id);
            newState[index] = action.options;
            return newState;
        case "DELETE_BOOK":         
            return newState.filter(item => item.id !== action.id);
        // case "DELETE_ALL_ITEM":
        //     return [];
        default:
            return state;
    }
}

export default bookReducer;