import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageNotes from './pages/ManageNotes';
import AddNote from './pages/AddNote';
import EditNote from './pages/EditNote';
import Quantum from './pages/Quantum';
import PYQs from './pages/PYQs';
import Profile from './pages/Profile';
import AddDetailedNotes from './pages/AddDetailedNotes';
import DetailedNotesList from './pages/DetailedNotesList';
import Updates from './pages/Updates';
import AddUpdate from './pages/AddUpdate';
import EditUpdate from './pages/EditUpdate';
import './App.css';
import './styles/dashboard.css';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<ManageNotes />} />
          <Route path="add-note" element={<AddNote />} />
          <Route path="edit-note/:id" element={<EditNote />} />
          <Route path="quantum" element={<Quantum />} />
          <Route path="pyqs" element={<PYQs />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add-detailed-notes" element={<AddDetailedNotes />} />
          <Route path="detailed-notes" element={<DetailedNotesList />} />
          <Route path="updates" element={<Updates />} />
          <Route path="updates/add" element={<AddUpdate />} />
          <Route path="updates/edit/:id" element={<EditUpdate />} />
          <Route path="users" element={<div className="p-8">Users Management (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
