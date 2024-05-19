import {Link} from "react-router-dom";
import {SpinnerLoading} from "../../common/SpinnerLoading/SpinnerLoading";
import {useEffect, useState} from "react";
import {useOktaAuth} from "@okta/okta-react";
import {PaymentInfoRequest} from "../../models/PaymentInfoRequests";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {PaymentApi} from "../../apis/paymentApi";

export const PaymentPage = () => {

    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            if (authState && authState.isAuthenticated) {
                const userEmail = authState.accessToken?.claims.sub;
                const paymentResponseJson = await PaymentApi.getPaymentByUserEmail(userEmail);
                setFees(paymentResponseJson.amount);
                setLoadingFees(false);
            }
        }
        fetchFees().catch((error: any) => {
            setLoadingFees(false);
            setHttpError(error.message);
        })
    }, [authState]);

    const elements = useElements();
    const stripe = useStripe();

    const checkout = async () => {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisabled(true);

        const paymentInfo: PaymentInfoRequest = {
            amount: (Math.round(fees * 100)),
            currency: 'USD',
            receiptEmail: authState?.accessToken?.claims.sub
        };

        const stripeResponse = await PaymentApi.sendPaymentIntent(authState, paymentInfo);
        if (!stripeResponse.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error('Something went wrong!');
        }
        const stripeResponseJson = await stripeResponse.json();

        stripe.confirmCardPayment(
            stripeResponseJson.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: authState?.accessToken?.claims.sub
                    }
                }
            }, {handleActions: false}
        ).then(async function (result: any) {
            if (result.error) {
                setSubmitDisabled(false)
                alert('There was an error')
            } else {
                const stripeResponse = await PaymentApi.updatePaymentComplete(authState);
                if (!stripeResponse.ok) {
                    setHttpError(true)
                    setSubmitDisabled(false)
                    throw new Error('Something went wrong!')
                }
                setFees(0);
                setSubmitDisabled(false);
            }
        });
        setHttpError(false);
    }

    if (loadingFees) {
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


    return (
        <div className='container'>
            {fees > 0 && <div className='card mt-3'>
                <h5 className='card-header'>Fees pending: <span className='text-danger'>${fees}</span></h5>
                <div className='card-body'>
                    <h5 className='card-title mb-3'>Credit Card</h5>
                    <CardElement id='card-element'/>
                    <button disabled={submitDisabled} type='button' className='btn btn-md main-color text-white mt-3'
                            onClick={checkout}>
                        Pay fees
                    </button>
                </div>
            </div>}

            {fees === 0 &&
                <div className='mt-3'>
                    <h5>You have no fees!</h5>
                    <Link type='button' className='btn main-color text-white' to='/search'>
                        Explore top books
                    </Link>
                </div>
            }
            {submitDisabled && <SpinnerLoading/>}
        </div>
    );
}