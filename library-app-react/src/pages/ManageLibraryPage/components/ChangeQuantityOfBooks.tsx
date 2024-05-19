import {SpinnerLoading} from "../../../common/SpinnerLoading/SpinnerLoading";
import {Pagination} from "../../../common/Pagination/Pagination";
import {PaginationProgress} from "../../../common/Pagination/PaginationProgress";
import {useEffect, useState} from "react";
import {BookModel} from "../../../models/BookModel";
import {ChangeQuantityOfBook} from "./ChangeQuantityOfBook";
import {BookApi} from "../../../apis/bookApi";

export const ChangeQuantityOfBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [bookDelete, setBookDelete] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const responseData = await BookApi.getAllBooks(currentPage - 1, booksPerPage);

            const loadedBooks: BookModel[] = responseData.content as BookModel[];

            setTotalAmountOfBooks(responseData.totalElements);
            setTotalPages(responseData.totalPages);
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, bookDelete, booksPerPage]);


    const deleteBook = () => setBookDelete(!bookDelete);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className='container mt-5'>
            {totalAmountOfBooks > 0 ?
                <>
                    <div className='mt-3'>
                        <h3>Number of results: ({totalAmountOfBooks})</h3>
                    </div>
                    <PaginationProgress currentPage={currentPage} totalPages={totalPages} itemsPerPage={booksPerPage}
                                        totalAmountOfItems={totalAmountOfBooks}/>
                    {books.map(book => (
                        <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}/>
                    ))}
                </>
                :
                <h5>Add a book before changing quantity</h5>
            }
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage}/>}
        </div>
    );
}