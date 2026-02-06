import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navbar';
import Home from './components/Home';
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
import Search from './components/Search';
import ScrollToTop from './components/ScrollToTop';
import { View, StyleSheet, Platform } from 'react-native';
import './styles/App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <View style={styles.container}>
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/notes/:notesCode" element={<NoteDetails />} />
          <Route path="/notes" element={<AllNotes />} />
          <Route path="/search" element={<Search />} />
          <Route path="/quantums" element={<Quantums />} />
          <Route path="/pyqs" element={<Pyqs />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<Home />} />
        </Routes>

        <Footer />
      </View>
    </Router>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
});

export default App
