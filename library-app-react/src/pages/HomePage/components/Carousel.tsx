import {ReturnBook} from "./ReturnBook";
import {useEffect, useState} from "react";
import {BookModel} from "../../../models/BookModel";
import {SpinnerLoading} from "../../../utils/SpinnerLoading";
import {BookApi} from "../../../apis/bookApi";
import {Link} from "react-router-dom";

export const Carousel = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            const responseData = await BookApi.getAllBooks();
            const loadedBooks: BookModel[] = responseData.content as BookModel[];

            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            const errorMsg = 'Error fetching books:' + error;
            setIsLoading(false);
            setHttpError(errorMsg);
        });
    }, []);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError.length !== 0) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return (
        <div className='container mt-5' style={{height: 550}}>
            <div className='homepage-carousel-title'>
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5 
                d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(0,3).map((book: BookModel) =>
                                <ReturnBook book={book} key={book.id} />
                            )}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(3,6).map((book: BookModel) =>
                                <ReturnBook book={book} key={book.id} />
                            )}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(6,9).map((book: BookModel) =>
                                <ReturnBook book={book} key={book.id} />
                            )}
                        </div>
                    </div>
                    <button className='carousel-control-prev' type='button'
                            data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button'
                            data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>
                </div>
            </div>

            {/* Mobile */}
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnBook book={books[7]} key={books[7].id} />
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to='/search'>View More</Link>
            </div>
        </div>
    );
}