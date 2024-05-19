import {BASE_URL} from "../configs/env";
import {MessageModel} from "../models/MessageModel";

export const MessagesApi = {

    async postMessage(authState: any, title: string, question: string) {
        const url = `${BASE_URL}/messages/secure/add/message`;
        if (authState?.isAuthenticated && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = {title, question};
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };

            const submitNewQuestionResponse = await fetch(url, requestOptions);
            if (!submitNewQuestionResponse.ok) {
                throw new Error('Something went wrong!');
            }
        }
    },

    async getMessages(authState: any, offset = 0, limit = 5) {
        if (authState && authState?.isAuthenticated) {
            const url = `${BASE_URL}/messages/search/findByUserEmail/?userEmail=${authState?.accessToken?.claims.sub}&offset=${offset}&limit=${limit}`;
            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const messagesResponse = await fetch(url, requestOptions);
            if (!messagesResponse.ok) {
                throw new Error('Something went wrong!');
            }
            return messagesResponse.json();
        } else {
            throw new Error('User does not log in!');
        }
    }
};