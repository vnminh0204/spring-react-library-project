import {BASE_URL} from "../configs/env";
import {MessageModel} from "../models/MessageModel";
import {AdminMessageRequest} from "../models/AdminMessageRequest";

export const MessagesApi = {

    async userPostMessage(authState: any, messageRequestModel: MessageModel) {
        if (!messageRequestModel || Object.keys(messageRequestModel).length === 0) {
            throw new Error('Request body is empty!');
        }

        const url = `${BASE_URL}/messages/secure/add/message`;

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
    },

    async adminReplyMessage(authState: any, messageAdminRequestModel: AdminMessageRequest) {
        if (!messageAdminRequestModel || Object.keys(messageAdminRequestModel).length === 0) {
            throw new Error('Request body is empty!');
        }

        const url = `${BASE_URL}/messages/secure/admin/message`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageAdminRequestModel)
        };

        const messageAdminRequestModelResponse = await fetch(url, requestOptions);
        if (!messageAdminRequestModelResponse.ok) {
            throw new Error('Something went wrong!');
        }
    },

    async getMessages(authState: any, offset = 0, limit = 5, searchUrl = '') {
        if (authState && authState?.isAuthenticated) {
            const url = `${BASE_URL}/messages${searchUrl.length > 0 ? searchUrl + '&' : '?'}offset=${offset}&limit=${limit}`;
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