import {BASE_URL} from "../configs/env";

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
    async getUserCurrentLoans(authState: any, getCount = false) {
        if (authState && authState.isAuthenticated) {
            const endpoint = getCount ? '/count' : '';
            const url = `${BASE_URL}/books/secure/currentloans${endpoint}`;
            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const currentLoansResponse = await fetch(url, requestOptions);
            if (!currentLoansResponse.ok) {
                throw new Error('Something went wrong!');
            }
            return currentLoansResponse.json();
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
    async updateBook(authState: any, bookId: number | string | undefined, updateType: BookUpdateType) {
        if (!bookId) {
            throw new Error("Book ID is missing");
        }
        // Determine the endpoint based on the updateType
        const endpointMap: { [key in BookUpdateType]: string } = {
            [BookUpdateType.Checkout]: 'checkout',
            [BookUpdateType.Return]: 'return',
            [BookUpdateType.Renew]: 'renew/loan'
        };

        // Get the endpoint from the map
        const endpoint = endpointMap[updateType];
        if (!endpoint) {
            throw new Error('Invalid update type');
        }

        // Construct the URL
        const url = `${BASE_URL}/books/secure/${endpoint}/?bookId=${bookId}`;
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
};

export enum BookUpdateType {
    Checkout = 'checkout',
    Return = 'return',
    Renew = 'renew'
}