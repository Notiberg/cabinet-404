import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleBottomNavigation from './components/SimpleBottomNavigation';
import FirebaseStatus from './components/FirebaseStatus';
import SimpleHomePage from './pages/SimpleHomePage';
import SimpleTasksPage from './pages/SimpleTasksPage';
import MetalTrackingPage from './pages/MetalTrackingPage';
import WorkClosurePage from './pages/WorkClosurePage';
import DocumentTrackingPage from './pages/DocumentTrackingPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import { useFirebase } from './hooks/useFirebase';

function App() {
  // Initialize Firebase connection
  const { isConnected } = useFirebase();

  return (
    <Router>
      <div style={{minHeight: '100vh'}}>
        <FirebaseStatus />
        <Routes>
          <Route path="/" element={<SimpleHomePage />} />
          <Route path="/tasks" element={<SimpleTasksPage />} />
          <Route path="/metal-tracking" element={<MetalTrackingPage />} />
          <Route path="/work-closure" element={<WorkClosurePage />} />
          <Route path="/document-tracking" element={<DocumentTrackingPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        
        <SimpleBottomNavigation />
      </div>
    </Router>
  );
}

export default App;
