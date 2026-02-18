import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import NoteDetails from './pages/NoteDetails';
import AllNotes from './pages/AllNotes';
import Quantums from './pages/Quantums';
import Pyqs from './pages/Pyqs';
import Updates from './pages/Updates';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import Help from './pages/Help';
import About from './pages/About';
import Policy from './pages/Policy';
import Search from './pages/Search';
import Tools from './pages/Tools';
import Offers from './pages/Offers';
import ScrollToTop from './components/ScrollToTop';
// React Native imports removed
import './styles/App.css';

const MainContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`main-content-wrapper ${isHomePage ? 'home-layout' : 'page-layout'}`}>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/notes/:notesCode" element={<NoteDetails />} />
        <Route path="/notes" element={<AllNotes />} />
        <Route path="/search" element={<Search />} />
        <Route path="/quantums" element={<Quantums />} />
        <Route path="/pyqs" element={<Pyqs />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainContent />
    </Router>
  );
}

export default App;
