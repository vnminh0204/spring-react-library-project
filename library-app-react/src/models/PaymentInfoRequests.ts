export interface PaymentInfoRequest {
    amount: number;
    currency: string;
    receiptEmail: string | undefined;
}
