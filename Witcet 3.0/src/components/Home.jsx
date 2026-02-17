import React, { useEffect } from 'react';
import Hero from './Hero';
import Filter from './Filter';
import NotesList from './NotesList';

import HomeOffers from './HomeOffers';

const Home = () => {
    useEffect(() => {
        if (window.location.pathname !== '/') {
            window.history.replaceState(null, '', '/');
        }
    }, []);

    return (
        <>
            <Hero />

            <Filter />
            <NotesList />
            <HomeOffers />
        </>
    );
};

export default Home;
