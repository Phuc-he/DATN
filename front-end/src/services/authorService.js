import { del, get, patch, post } from "../utils/request"

export const getAuthors = async () => {
    const result = await get("authors");
    return result;
}

export const getDetailAuthor = async (id) => {
    const result = await get(`authors/${id}`);
    return result;
}

export const createNewAuthor = async (options) => {
    const result = await post(options, `authors`);
    return result;
}

export const updateAuthor = async (options, id) => {
    const result = await patch(options, `authors/${id}`);
    return result;
}

export const delAuthor = async (id) => {
    await del(`authors/${id}`);
}