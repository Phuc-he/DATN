const cartReducer = (state = [], action) => {
    let newState = [...state]; 
    
    switch (action.type) {
        case "ADD_TO_CART":
            newState = [
                ...state,
                {
                    id: action.info.id,
                    info: action.info,
                    quantity: 1
                }
            ];
            return newState;
        case "UPDATE_QUANTITY":
            const itemUpdate = newState.find(item => item.id === action.id);
            if(itemUpdate) {
                itemUpdate.quantity = itemUpdate.quantity + action.quantity;
            }
            return newState;
        case "DELETE_ITEM":
            return newState.filter(item => item.id !== action.id);
        case "DELETE_ALL_ITEM":
            return [];
        case "SET_CART":
            newState = action.items;
            return newState;
        default:
            return state;
    }
}

export default cartReducer;