const userReducer = (state = [], action) => {
    let newState = [...state];

    switch (action.type) {
        case "GET_USER":
            newState = [
                ...state,
                action.items
            ];            
            return newState;
        case "SET_USER":
            return action.items.reverse();
        case "CREATE_USER":
            return [
                action.item,
                ...newState,
            ];
        case "EDIT_USER":
            const index = newState.findIndex(item => item.id === action.options.id);
            newState[index] = action.options;
            return newState;
        case "DELETE_USER":
            return newState.filter(item => item.id !== action.id);
        // case "DELETE_ALL_USER":
        //     return [];
        default:
            return state;
    }
}

export default userReducer;