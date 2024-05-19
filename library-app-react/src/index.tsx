import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {STRIPE_PUBLISHABLE_KEY} from "./configs/stripeConfig";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Elements stripe={stripePromise}>
                <App/>
            </Elements>
        </BrowserRouter>
    </React.StrictMode>
);
