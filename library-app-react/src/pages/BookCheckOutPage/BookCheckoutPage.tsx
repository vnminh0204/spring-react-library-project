import {useEffect, useState} from "react";
import {BookModel} from "../../models/BookModel";
import {SpinnerLoading} from "../../common/SpinnerLoading/SpinnerLoading";
import {BookApi} from "../../apis/bookApi";
import {useParams} from "react-router-dom";
import {StarsReview} from "./components/StarsReview";
import {CheckoutAndReviewBox} from "./components/CheckoutAndReviewBox";
import {ReviewModel} from "../../models/ReviewModel";
import {ReviewApi} from "../../apis/reviewApi";
import {LatestReviews} from "./components/LatestReviews";
import {useOktaAuth} from "@okta/okta-react";


export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string>('');
    const {bookId} = useParams();

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

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
    }, [bookId, isCheckedOut]);

    useEffect(() => {
        const fetchReviews = async () => {
            const responseData = await ReviewApi.getReviewsByBookId(bookId);
            const loadedReviews: ReviewModel[] = responseData.content as ReviewModel[];

            const weightedStarReviews = loadedReviews.reduce((sum, review) => {
                return sum + review.rating;
            }, 0);

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchReviews().catch((error: any) => {
            const errorMsg = 'Error fetching books:' + error;
            setIsLoadingReview(false);
            setHttpError(errorMsg);
        });
    }, [bookId]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            const currentLoansCountResponse = await BookApi.getUserCurrentLoansCount(authState);
            setCurrentLoansCount(currentLoansCountResponse);
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            const bookCheckedOutResponseJson = await BookApi.getIfUserCheckedOutBook(authState, bookId);
            setIsCheckedOut(bookCheckedOutResponseJson);
            setIsLoadingBookCheckedOut(false);
        }
        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState, bookId]);

    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const checkoutBook = async () => {
        await BookApi.putCheckoutBook(authState, bookId);
        setIsCheckedOut(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book'/>
                            :
                            <img src={require('./../../assets/BooksImages/book-luv2code-1000.png')} width='226'
                                 height='349' alt='Book'/>
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedOut={isCheckedOut}
                        checkoutBook={checkoutBook}
                    />
                </div>
                <hr/>
                <LatestReviews reviews={reviews} bookId={Number(bookId)} mobile={false}/>
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book'/>
                        :
                        <img src={require('./../../assets/BooksImages/book-luv2code-1000.png')} width='226'
                             height='349' alt='Book'/>
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32}/>
                    </div>
                </div>
                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated}
                    isCheckedOut={isCheckedOut}
                    checkoutBook={checkoutBook}
                />
                <hr/>
                <LatestReviews reviews={reviews} bookId={Number(bookId)} mobile={true}/>
            </div>
        </div>
    );
}