import { del, get, patch, post } from "../utils/request";

export const getBook = async () => {
    const result = await get("books");
    return result;
}

export const getBookById = async (id) => {
    const result = await get(`books/${id}`);
    return result;
}

export const findBooks = async (keyword) => {
    const result = await get(`books/search?searchTerm=${keyword}`);
    return result;
}

export const getBooksByCategory = async (id) => {
    const result = await get(`books/category/${id}`);
    return result;
}

export const createNewBook = async (options) => {
    const result = await post(options, `books`);
    return result;
}

export const updateBook = async (options, id) => {
    const result = await patch(options, `books/${id}`);
    return result;
}

export const delBook = async (id) => {
    const result = await del(`books/${id}`);
    return result;
}