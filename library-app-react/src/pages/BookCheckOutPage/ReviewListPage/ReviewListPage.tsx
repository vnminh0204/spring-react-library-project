import {useEffect, useState} from 'react';

import {ReviewApi} from "../../../apis/reviewApi";
import {ReviewModel} from "../../../models/ReviewModel";
import {SpinnerLoading} from "../../../common/SpinnerLoading/SpinnerLoading";
import {Review} from "../components/Review";
import {Pagination} from "../../../common/Pagination/Pagination";
import {useParams} from "react-router-dom";
import {PaginationProgress} from "../../../common/Pagination/PaginationProgress";

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Book to lookup reviews
    const {bookId} = useParams();

    useEffect(() => {
        const fetchBookReviewsData = async () => {
            const responseData = await ReviewApi.getReviewsByBookId(bookId);
            const loadedReviews: ReviewModel[] = responseData.content as ReviewModel[];

            setTotalAmountOfReviews(responseData.totalElements);
            setTotalPages(responseData.totalPages);
            setReviews(loadedReviews);
            setIsLoading(false);
        };
        fetchBookReviewsData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, bookId]);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <PaginationProgress currentPage={currentPage} totalAmountOfItems={totalAmountOfReviews}
                                totalPages={totalPages} itemsPerPage={reviewsPerPage}/>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id}/>
                ))}
            </div>

            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage}/>}
        </div>
    );
}