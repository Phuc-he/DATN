import { get, post } from "../utils/requestLocal";
import * as real from "../utils/request";

export const loginPostV2 = async (options) => {
    const result = await real.post(options, "users/login");
    return result;
}

export const registerPost = async (options) => {
    const result = await real.post(options, "users/register");
    return result;
}

export const loginPost = async (options) => {
    const result = await post(options, "login");
    return result;
}

export const checkUserExist = async (username) => {
    const result = await get(`users?username=${username}`);
    return result;
}

