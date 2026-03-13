import { combineReducers } from "redux";
import cartReducer from "./cart";
import categoryReducer from "./category";
import bookReducer from "./book";
import authorReducer from "./author";
import userReducer from "./user";
import orderReducer from "./order";

const allReducers = combineReducers({
    cartReducer,
    categoryReducer,
    bookReducer,
    authorReducer,
    userReducer,
    orderReducer
});

export default allReducers;