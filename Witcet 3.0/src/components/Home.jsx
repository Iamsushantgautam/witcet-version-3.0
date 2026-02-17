import React, { useEffect } from 'react';
import Hero from './Hero';
import Filter from './Filter';
import NotesList from './NotesList';

import HomeOffers from './HomeOffers';
import HomeTools from './HomeTools';
import HomeUpdates from './HomeUpdates';

const Home = () => {
    useEffect(() => {
        if (window.location.pathname !== '/') {
            window.history.replaceState(null, '', '/');
        }
    }, []);

    return (
        <>
            <Hero />
            <HomeUpdates />

            <Filter />
            <NotesList />
            <HomeOffers />
            <HomeTools />
        </>
    );
};

export default Home;
