export interface AddBookRequest {
    title: string;
    author: string;
    description: string;
    copies: number;
    category: string;
    img?: string;
}