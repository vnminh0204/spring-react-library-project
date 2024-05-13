import {BASE_URL} from "../configs/env";

export const BookApi = {

    async getAllBooks(offset = 0, limit = 9, searchUrl = '?') {
        const response = await fetch(`${BASE_URL}/books${searchUrl.length > 0 ? searchUrl + '&' : '?'}offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error("Failed to fetch the books");
        }
        return response.json();
    },

    async getBookContainingSearch(search: string, offset = 0, limit = 9) {
        const response = await fetch(`${BASE_URL}/books/search/findByTitleContaining?title=${search}&offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error("Failed to fetch the books");
        }
        return response.json();
    },

    async getBookById(bookID: number) {
        const response = await fetch(`${BASE_URL}/books/${bookID}`);
        return response.json();
    },
};