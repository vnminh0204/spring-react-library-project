import {BookModel} from "./BookModel";

export interface ShelfCurrentLoans {
    book: BookModel;
    daysLeft: number;
}