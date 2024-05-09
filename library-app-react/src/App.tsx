import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage/HomePage";
import {Navbar} from "./components/NavbarAndFooter/Navbar";
import {Footer} from "./components/NavbarAndFooter/Footer";

function App() {
    return (
        <div>
            <Navbar/>
            <HomePage/>
            <Footer/>
        </div>
    );
}

export default App;
