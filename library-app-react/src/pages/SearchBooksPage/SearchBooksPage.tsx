import { useEffect, useState } from 'react';

import {BookApi} from "../../apis/bookApi";
import {BookModel} from "../../models/BookModel";
import {SpinnerLoading} from "../../utils/SpinnerLoading";
import {SearchBook} from "./components/SearchBook";
import {Pagination} from "../../components/Pagination/Pagination";

export const SearchBooksPage = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchUrl, setSearchUrl] = useState('');

    useEffect(() => {
        setIsLoading(true);
        const fetchBooks = async () => {
            const responseData = await BookApi.getAllBooks(currentPage-1, booksPerPage, searchUrl);

            const loadedBooks: BookModel[] = responseData.content as BookModel[];

            setTotalAmountOfBooks(responseData.totalElements);
            setTotalPages(responseData.totalPages);
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            const errorMsg = 'Error fetching books:' + error;
            setIsLoading(false);
            setHttpError(errorMsg);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl, booksPerPage]);


    const searchTitleSubmitHandler = () => {
        setCurrentPage(1);
        if (searchTitle === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${searchTitle}`)
        }
    }

    const categorySelectHandler = (value: string) => {
        setCurrentPage(1);
        if (
            value.toLowerCase() === 'fe' ||
            value.toLowerCase() === 'be' ||
            value.toLowerCase() === 'data' ||
            value.toLowerCase() === 'devops'
        ) {
            setSearchUrl(`/search/findByCategory?category=${value}`)
        } else {
            setSearchUrl(``)
        }
    }

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber:  number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                       placeholder='Search' aria-labelledby='Search'
                                       onChange={e => setSearchTitle(e.target.value)}
                                />
                                <button className='btn btn-outline-success' onClick={() => searchTitleSubmitHandler()}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                        id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                        aria-expanded='false'>
                                    Category
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={() => categorySelectHandler('All')}>
                                        <a className='dropdown-item' href='#'>
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => categorySelectHandler('FE')}>
                                        <a className='dropdown-item' href='#'>
                                            Front End
                                        </a>
                                    </li>
                                    <li onClick={() => categorySelectHandler('BE')}>
                                        <a className='dropdown-item' href='#'>
                                            Back End
                                        </a>
                                    </li>
                                    <li onClick={() => categorySelectHandler('Data')}>
                                        <a className='dropdown-item' href='#'>
                                            Data
                                        </a>
                                    </li>
                                    <li onClick={() => categorySelectHandler('DevOps')}>
                                        <a className='dropdown-item' href='#'>
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {
                        totalAmountOfBooks > 0 ?
                    <>
                        <div className='mt-3'>
                            <h5>Number of results: ({totalAmountOfBooks})</h5>
                        </div>
                        <p>
                            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                        </p>
                        {books.map(book => (
                            <SearchBook book={book} key={book.id} />
                        ))}
                    </>
                        :
                    <div className='m-5'>
                        <h3>
                            Can't find what you are looking for?
                        </h3>
                        <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white' href='#'>
                            Library Services
                        </a>
                    </div>
                    }
                    {/* Return pagination only if there are more than 1 page*/}
                    {totalPages > 1 && 
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>
                    }
                </div>
            </div>
        </div>
    );
}