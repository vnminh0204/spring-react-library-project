import {BASE_URL} from "../configs/env";
import {ReviewRequestModel} from "../models/ReviewRequestModel";

export const BookApi = {

    async getAllBooks(offset = 0, limit = 9, searchUrl = '') {
        const response = await fetch(`${BASE_URL}/books${searchUrl.length > 0 ? searchUrl + '&' : '?'}offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error("Failed to fetch the books");
        }
        return response.json();
    },

    async getBookById(bookID: string | undefined) {
        if (!bookID) {
            throw new Error("Book ID is missing");
        }
        const response = await fetch(`${BASE_URL}/books/${bookID}`);
        return response.json();
    },
    async getUserCurrentLoansCount(authState: any) {
        if (authState && authState.isAuthenticated) {
            const url = `${BASE_URL}/books/secure/currentloans/count`;
            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const currentLoansCountResponse = await fetch(url, requestOptions);
            if (!currentLoansCountResponse.ok) {
                throw new Error('Something went wrong!');
            }
            return currentLoansCountResponse.json();
        } else {
            throw new Error('User is not authenticated');
        }
    },

    async getIfUserCheckedOutBook(authState: any, bookId: string | undefined) {
        if (!bookId) {
            throw new Error("Book ID is missing");
        }
        if (authState && authState.isAuthenticated) {
            const url = `${BASE_URL}/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const bookCheckedOut = await fetch(url, requestOptions);

            if (!bookCheckedOut.ok) {
                throw new Error('Something went wrong!');
            }

            return bookCheckedOut.json();
        } else {
            throw new Error('User is not authenticated');
        }
    },

    async getUserReviewBook(authState: any, bookId: string | undefined) {
        if (!bookId) {
            throw new Error("Book ID is missing");
        }
        if (authState && authState.isAuthenticated) {
            const url = `${BASE_URL}/reviews/secure/user/book/?bookId=${bookId}`;
            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const userReview = await fetch(url, requestOptions);
            if (!userReview.ok) {
                throw new Error('Something went wrong');
            }
            return userReview.json();
        } else {
            throw new Error('User is not authenticated');
        }
    },
    async putCheckoutBook(authState: any, bookId: string | undefined) {
        if (!bookId) {
            throw new Error("Book ID is missing");
        }
        const url = `${BASE_URL}/books/secure/checkout/?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
    },
    async postSubmitReview(authState: any, bookId: string | undefined, starInput: number, reviewDescription: string) {
        const reviewRequestModel: ReviewRequestModel = {rating: starInput, bookId: Number(bookId), reviewDescription};
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