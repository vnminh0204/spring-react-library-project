export interface MessageModel {
    title: string;
    question: string;
    id?: number;
    userEmail?: string;
    adminEmail?: string;
    response?: string;
    closed?: boolean;
}