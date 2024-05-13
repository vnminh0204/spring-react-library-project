import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage/HomePage";
import {SearchBooksPage} from "./pages/SearchBooksPage/SearchBooksPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout/Layout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<HomePage/>} />
                    <Route path="search" element={<SearchBooksPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
