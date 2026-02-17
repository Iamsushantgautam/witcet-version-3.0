import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AddNote from './pages/AddNote';
import EditNote from './pages/EditNote';
import Quantum from './pages/Quantum';
import PYQs from './pages/PYQs';
import Profile from './pages/Profile';
import AddDetailedNotes from './pages/AddDetailedNotes';
import EditDetailedNotes from './pages/EditDetailedNotes';
import DetailedNotesList from './pages/DetailedNotesList';
import Updates from './pages/Updates';
import AddUpdate from './pages/AddUpdate';
import EditUpdate from './pages/EditUpdate';
import ManageTools from './pages/ManageTools';
import ManageOffers from './pages/ManageOffers';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';
import './styles/dashboard.css';



// Auto-logout after 1 hour of inactivity
const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour

const InactivityMonitor = ({ children }) => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    let timer;

    // Check if token exists on mount
    const token = localStorage.getItem('token');
    if (!token) return;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logout, INACTIVITY_LIMIT);
    };

    // Events to track user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Initial start
    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [logout]);

  return children;
};

import { View, StyleSheet, Platform } from 'react-native';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <InactivityMonitor>
      {children}
    </InactivityMonitor>
  );
};

function App() {
  return (
    <View style={styles.container}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="add-note" element={<AddNote />} />
            <Route path="edit-note/:id" element={<EditNote />} />
            <Route path="quantum" element={<Quantum />} />
            <Route path="pyqs" element={<PYQs />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-detailed-notes" element={<AddDetailedNotes />} />
            <Route path="detailed-notes" element={<DetailedNotesList />} />
            <Route path="edit-detailed-notes/:id" element={<EditDetailedNotes />} />
            <Route path="updates" element={<Updates />} />
            <Route path="updates/add" element={<AddUpdate />} />
            <Route path="updates/edit/:id" element={<EditUpdate />} />
            <Route path="tools" element={<ManageTools />} />
            <Route path="offers" element={<ManageOffers />} />
            <Route path="users" element={<div className="p-8">Users Management (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
    width: '100%',
  },
});

export default App;
