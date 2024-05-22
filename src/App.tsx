import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './layouts/Header/Header.tsx';
import SideBar from './layouts/SideBar/SideBar.tsx';
import Deals from "./pages/Deals/Deals.tsx";
import Login from "./pages/Login/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Calendar from "./pages/Calendar/Calendar.tsx";
import GenerateSessionToken from "./utils/SessionToken.tsx";
import './App.scss';

const App = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('sessionToken');
    const lastActivity = sessionStorage.getItem('lastActivity');

    if (token && lastActivity) {
      const expirationTime = new Date(parseInt(lastActivity, 10) + 30 * 60 * 1000); // 30 minutes in milliseconds
      const currentTime = new Date();

      if (currentTime < expirationTime) {
        // Session still valid, update last activity time
        sessionStorage.setItem('lastActivity', currentTime.getTime().toString());
        setSessionToken(token);
      } else {
        // Session expired, logout
        sessionStorage.removeItem('sessionToken');
        sessionStorage.removeItem('lastActivity');
        setSessionToken(null);
      }
    }
  }, []);

  const handleLogin = () => {
    const token = GenerateSessionToken(32); // Generate a session token
    const currentTime = new Date();
    sessionStorage.setItem('sessionToken', token);
    sessionStorage.setItem('lastActivity', currentTime.getTime().toString());
    setSessionToken(token);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sessionToken');
    sessionStorage.removeItem('lastActivity');
    setSessionToken(null);
  };

  return (
    <Router>
      <MainContent sessionToken={sessionToken} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  );
}

interface MainContentProps {
  sessionToken: string | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ sessionToken, handleLogin, handleLogout }) => {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="App">
      {sessionToken && !isLoginRoute && <SideBar handleLogout={handleLogout} />}
      <div className="right">
        {sessionToken && !isLoginRoute && <Header />}
        <Routes>
          <Route path="/" element={<Login handleLogin={handleLogin} />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/dashboard" element={sessionToken ? <Dashboard /> : <Login handleLogin={handleLogin} />} />
          <Route path="/deals" element={sessionToken ? <Deals /> : <Login handleLogin={handleLogin} />} />
          <Route path="/calendar" element={sessionToken ? <Calendar /> : <Login handleLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;