import {BASE_URL} from "../configs/env";
import {ReviewRequestModel} from "../models/ReviewRequestModel";

export const ReviewApi = {

    async getReviewsByBookId(bookID: string | undefined, offset = 0, limit = 2) {
        if (!bookID) {
            throw new Error("Book ID is missing");
        }
        const response = await fetch(`${BASE_URL}/reviews/search/findByBookId?bookId=${bookID}&offset=${offset}&limit=${limit}`);
        return response.json();
    },

    async postSubmitReview(authState: any, reviewRequestModel: ReviewRequestModel) {
        if (!reviewRequestModel || Object.keys(reviewRequestModel).length === 0) {
            throw new Error('Request body is empty!');
        }

        const url = `${BASE_URL}/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
    }
};