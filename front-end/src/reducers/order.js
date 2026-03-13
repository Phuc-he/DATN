import { SET_ORDER, ADD_ORDER, UPDATE_ORDER, DELETE_ORDER } from "../actions/order";

const initialState = [];

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER:
      return action.payload;

    case ADD_ORDER:
      return [...state, action.payload];

    case UPDATE_ORDER:
      return state.map((order) =>
        order.id === action.payload.id ? { ...order, ...action.payload } : order
      );

    case DELETE_ORDER:
      return state.filter((order) => order.id !== action.payload);

    default:
      return state;
  }
};

export default orderReducer;