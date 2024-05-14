import { Outlet } from "react-router-dom";
import {Navbar} from "../NavbarAndFooter/Navbar";
import React from "react";
import {Footer} from "../NavbarAndFooter/Footer";

const Layout = () => {
    return (
        <div className='d-flex flex-column min-vh-100'>
            <Navbar/>
            <div className='flex-grow-1'>
                <Outlet />
            </div>
            <Footer/>
        </div>
    )
};

export default Layout;