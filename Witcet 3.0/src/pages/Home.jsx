import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Filter from '../components/Filter';
import NotesList from '../components/NotesList';

import HomeOffers from '../components/HomeOffers';
import HomeTools from '../components/HomeTools';
import HomeUpdates from '../components/HomeUpdates';

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
