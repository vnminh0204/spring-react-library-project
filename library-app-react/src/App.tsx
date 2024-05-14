import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage/HomePage";
import {SearchBooksPage} from "./pages/SearchBooksPage/SearchBooksPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./common/Layout/Layout";
import {BookCheckoutPage} from "./pages/BookCheckOutPage/BookCheckoutPage";
import {oktaConfig} from "./configs/oktaConfig";
import {OktaAuth} from '@okta/okta-auth-js';
import LoginWidget from "./common/Auth/LoginWidget";

// TODO later remove Okta with own implementation

const oktaAuth = new OktaAuth(oktaConfig);

export function App() {

    // const navigate = useNavigate();
    //
    // const customAuthHandler = () => {
    //     navigate('/login');
    // };
    //
    // const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    //     navigate(toRelativeUrl(originalUri || '/', window.location.origin), {replace: true});
    // }

    return (
        <BrowserRouter>
            {/*<Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>*/}
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route path="" element={<HomePage/>}/>
                    <Route path="home" element={<HomePage/>}/>
                    <Route path="search" element={<SearchBooksPage/>}/>
                    <Route path="checkout/:bookId" element={<BookCheckoutPage/>}></Route>
                    <Route path="login" element={<LoginWidget config={oktaConfig}/>}></Route>
                    {/*<Route path="login/callback" element={<LoginCallback/>}></Route>*/}
                </Route>
            </Routes>
            {/*</Security>*/}
        </BrowserRouter>
    );
}

export default App;
