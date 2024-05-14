import {ExploreTopBooks} from "./components/ExploreTopBooks";
import {Carousel} from "./components/Carousel";
import {Heros} from "./components/Heros";
import {LibraryServices} from "./components/LibraryServices";
import React, {useEffect} from "react";

export const HomePage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <>
            <ExploreTopBooks/>
            <Carousel/>
            <Heros/>
            <LibraryServices/>
        </>
    )
}