import { Outlet, Link } from "react-router-dom";
import {Navbar} from "../NavbarAndFooter/Navbar";
import React from "react";
import {Footer} from "../NavbarAndFooter/Footer";

const Layout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet />
            <Footer/>
        </div>
    )
};

export default Layout;