import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navbar';
import Hero from './components/Hero';
import Filter from './components/Filter';
import NotesList from './components/NotesList';
import Footer from './components/Footer';
import NoteDetails from './components/NoteDetails';
import AllNotes from './components/AllNotes';
import Quantums from './components/Quantums';
import Pyqs from './components/Pyqs';
import Updates from './components/Updates';
import Contact from './components/Contact';
import Feedback from './components/Feedback';
import Help from './components/Help';
import About from './components/About';
import Policy from './components/Policy';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container-fluid">
        <Navigation />

        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Filter />
              <NotesList />


            </>
          } />

          <Route path="/notes/:notesCode" element={<NoteDetails />} />
          <Route path="/notes" element={<AllNotes />} />
          <Route path="/quantums" element={<Quantums />} />
          <Route path="/pyqs" element={<Pyqs />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/policy" element={<Policy />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App
