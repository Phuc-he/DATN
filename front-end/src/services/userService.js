import { del, get, patch, post } from "../utils/request";

export const getInfoUser = async (id) => {
    const result = await get(`users/${id}`);
    return result;
}

export const getUserByRole = async (role) => {
    const result = await get(`users/role?role=${role}`);
    return result;
}

export const createNewUser = async (options) => {
    const result = await post(options, `users`);
    return result;
}

export const delUser = async (id) => {
    const result = await del(`users/${id}`);
    return result;
}

export const updateUser = async (options, id) => {
    const result = await patch(options, `users/${id}`);
    return result;
}