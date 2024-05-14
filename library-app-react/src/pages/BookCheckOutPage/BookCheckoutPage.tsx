import { useEffect, useState } from "react";
import {BookModel} from "../../models/BookModel";
import {SpinnerLoading} from "../../utils/SpinnerLoading";
import {BookApi} from "../../apis/bookApi";
import {useParams} from "react-router-dom";
import {StarsReview} from "./components/StarsReview";
import {CheckoutAndReviewBox} from "./components/CheckoutAndReviewBox";


export const BookCheckoutPage = () => {

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string>('');
    const {bookId} = useParams();

    useEffect(() => {
        const fetchBooks = async () => {
            const responseData = await BookApi.getBookById(bookId);
            const loadedBook: BookModel = responseData as BookModel;

            setBook(loadedBook);
            setIsLoading(false);
        };

        fetchBooks().catch((error: any) => {
            const errorMsg = 'Error fetching books:' + error;
            setIsLoading(false);
            setHttpError(errorMsg);
        });
    }, [bookId]);


    if (isLoading || !book) {
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

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../assets/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={4} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false}/>
                </div>
                <hr />
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../assets/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true}/>
                <hr />
            </div>
        </div>
    );
}