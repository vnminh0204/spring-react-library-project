
import { StarsReview } from "./StarsReview";
import {ReviewModel} from "../../../models/ReviewModel";
import {formatDate} from "../../../utils/dateUtils";
import React from "react";

export const Review: React.FC<{ review: ReviewModel }> = (props) => {

    const dateRender = formatDate(props.review.date);
    
    return (
        <div>
            <div className='col-sm-8 col-md-8'>
                <h5>{props.review.userEmail}</h5>
                <div className='row'>
                    <div className='col'>
                        {dateRender}
                    </div>
                    <div className='col'>
                        <StarsReview rating={props.review.rating} size={16} />
                    </div>
                </div>
                <div className='mt-2'>
                    <p>
                        {props.review.reviewDescription}
                    </p>
                </div>
            </div>
            <hr/>
        </div>
    );
}