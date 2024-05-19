import {BASE_URL} from "../configs/env";
import {PaymentInfoRequest} from "../models/PaymentInfoRequests";

export const PaymentApi = {
    async getPaymentByUserEmail(userEmail: string | undefined) {
        if (!userEmail) throw new Error("User email is not valid");
        const url = `${BASE_URL}/payment/secure/search/findByUserEmail?userEmail=${userEmail}`;
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };
        const paymentResponse = await fetch(url, requestOptions);
        if (!paymentResponse.ok) throw new Error('Something went wrong!');

        return paymentResponse.json();
    },

    async sendPaymentIntent(authState: any, paymentInfo: PaymentInfoRequest) {
        if (!paymentInfo || Object.keys(paymentInfo).length === 0) throw new Error('Something went wrong!');

        const url = `${BASE_URL}/payment/secure/payment-intent`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentInfo)
        };
        return fetch(url, requestOptions);
    },

    async updatePaymentComplete(authState: any) {
        const url = `${BASE_URL}/payment/secure/payment-complete`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        return fetch(url, requestOptions);
    }
}