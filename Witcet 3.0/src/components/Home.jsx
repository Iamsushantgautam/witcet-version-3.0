import React, { useEffect } from 'react';
import Hero from './Hero';
import Filter from './Filter';
import NotesList from './NotesList';

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
        </>
    );
};

export default Home;
