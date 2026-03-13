const categoryReducer = (state = [], action) => {
    let newState = [...state];

    switch (action.type) {
        case "SET_CATEGORY":
            return action.items.reverse();
        case "CREATE_CATEGORY":
            return [
                action.item,
                ...newState,
            ];
        case "EDIT_CATEGORY":
            const index = newState.findIndex(item => item.id === action.options.id);
            newState[index] = action.options;
            return newState;
        case "DELETE_CATEGORY":
            return newState.filter(item => item.id !== action.id);
            // case "DELETE_ALL_CATEGORY":
        //     return [];
        default:
            return state;
    }
}

export default categoryReducer;