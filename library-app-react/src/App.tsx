import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage/HomePage";
import {Navbar} from "./components/NavbarAndFooter/Navbar";
import {Footer} from "./components/NavbarAndFooter/Footer";
import {BASE_URL} from "./configs/env";

function App() {
    console.log(BASE_URL);
    return (
        <div>
            <Navbar/>
            <HomePage/>
            <Footer/>
        </div>
    );
}

export default App;
