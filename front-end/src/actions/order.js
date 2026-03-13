export const SET_ORDER = "SET_ORDER";
export const ADD_ORDER = "ADD_ORDER";
export const UPDATE_ORDER = "UPDATE_ORDER";
export const DELETE_ORDER = "DELETE_ORDER";

export const setOrder = (orders) => ({
  type: SET_ORDER,
  payload: orders,
});

export const addOrder = (order) => ({
  type: ADD_ORDER,
  payload: order,
});

export const updateOrderAction = (order) => ({
  type: UPDATE_ORDER,
  payload: order,
});

export const deleteOrder = (id) => ({
  type: DELETE_ORDER,
  payload: id,
});