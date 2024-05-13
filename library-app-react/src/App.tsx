import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage/HomePage";
import {Navbar} from "./components/NavbarAndFooter/Navbar";
import {Footer} from "./components/NavbarAndFooter/Footer";
import {SearchBooksPage} from "./pages/SearchBooksPage/SearchBooksPage";

function App() {
    return (
        <div>
            <Navbar/>
            {/*<HomePage/>*/}
            <SearchBooksPage/>
            <Footer/>
        </div>
    );
}

export default App;
