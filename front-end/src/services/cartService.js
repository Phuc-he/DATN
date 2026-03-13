import { del, get, patch, post } from "../utils/requestLocal";

export const getCart = async (id) => {
    const result = await get(`carts/${id}`);
    return result;
}

export const getCartByUser = async (userId) => {
    const result = await get(`carts?userId=${userId}`);
    return result;
}

export const addPost = async (options) => {
    const result = await post(options, "carts");
    return result;
}

export const updatePatch = async (options, id) => {
    const result = await patch(options, `carts/${id}`);
    return result;
}

export const delCart = async (id) => {
    const result = await del(`carts/${id}`);
    return result;
}