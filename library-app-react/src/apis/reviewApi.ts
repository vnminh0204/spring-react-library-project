import {BASE_URL} from "../configs/env";

export const ReviewApi = {

    async getReviewsByBookId(bookID: string  | undefined, offset = 0, limit = 2) {
        if (!bookID) {
            throw new Error("Book ID is missing");
        }
        const response = await fetch(`${BASE_URL}/reviews/search/findByBookId?bookId=${bookID}&offset=${offset}&limit=${limit}`);
        return response.json();
    },
};