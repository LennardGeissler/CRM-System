import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './layouts/Header/Header.tsx';
import SideBar from './layouts/SideBar/SideBar.tsx';
import Deals from "./pages/Deals/Deals.tsx";
import Login from "./pages/Login/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Calendar from "./pages/Calendar/Calendar.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import GenerateSessionToken from "./utils/SessionToken.tsx";
import './App.scss';
import Documents from "./pages/Documents/Documents.tsx";
import Tasks from "./pages/Tasks/Tasks.tsx";
import ThemeProvider from './ThemeContext';
import Projects from "./pages/Projects/Projects.tsx";
import Contacts from "./pages/Contacts/Contacts.tsx";

const App = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [userID, setUserID] = useState<number | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('sessionToken');
    const lastActivity = sessionStorage.getItem('lastActivity');
    const storedUserName = sessionStorage.getItem('user');
    const storedUserID = sessionStorage.getItem('userID');

    if (token && lastActivity) {
      const expirationTime = new Date(parseInt(lastActivity, 10) + 30 * 60 * 1000); // 30 minutes in milliseconds
      const currentTime = new Date();

      if (currentTime < expirationTime) {
        // Session still valid, update last activity time
        sessionStorage.setItem('lastActivity', currentTime.getTime().toString());
        setSessionToken(token);
        setUser(storedUserName);
        if (storedUserID !== null) {
          setUserID(parseInt(storedUserID)); // Parse userID from Local Storage if not null
        }
      } else {
        // Session expired, logout
        sessionStorage.removeItem('sessionToken');
        sessionStorage.removeItem('lastActivity');
        sessionStorage.removeItem('userID');
        setSessionToken(null);
      }
    }
  }, []);

  const handleLogin = (name: string, userID:number) => {
    setUser(name);
    console.log(userID);
    setUserID(userID);
    const token = GenerateSessionToken(32); // Generate a session token
    const currentTime = new Date();
    sessionStorage.setItem('sessionToken', token);
    sessionStorage.setItem('lastActivity', currentTime.getTime().toString());
    sessionStorage.setItem('user', name);
    sessionStorage.setItem('userID', userID.toString());
    setSessionToken(token);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sessionToken');
    sessionStorage.removeItem('lastActivity');
    setSessionToken(null);
  };

  const profileImages = {
    "Lennard Geissler": "src/assets/images/lennard.png",
    "Cedric Bergmann": "src/assets/images/cedric.png",
    // Add more mappings as needed
  };

  return (
    <ThemeProvider>
      <Router>
        <MainContent userID={userID} user={user} sessionToken={sessionToken} handleLogin={handleLogin} handleLogout={handleLogout} profileImages={profileImages} />
      </Router>
    </ThemeProvider>
  );
}

interface MainContentProps {
  userID: number | null,
  user: string | null;
  sessionToken: string | null;
  handleLogin: (name: string, userID:number) => void;
  handleLogout: () => void;
  profileImages: { [key: string]: string }
}

const MainContent: React.FC<MainContentProps> = ({ userID, user, sessionToken, handleLogin, handleLogout, profileImages }) => {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="App">
      {sessionToken && !isLoginRoute && <SideBar handleLogout={handleLogout} />}
      <div className="right">
        {sessionToken && !isLoginRoute && <Header user={user} profileImages={profileImages} />}
        <Routes>
          <Route path="/" element={<Login handleLogin={handleLogin} />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/dashboard" element={sessionToken ? <Dashboard userID={userID} /> : <Login handleLogin={handleLogin} />} />
          <Route path="/deals" element={sessionToken ? <Deals /> : <Login handleLogin={handleLogin} />} />
          <Route path="/tasks" element={sessionToken ? <Tasks /> : <Login handleLogin={handleLogin} />} />
          <Route path="/calendar" element={sessionToken ? <Calendar /> : <Login handleLogin={handleLogin} />} />
          <Route path="/settings" element={sessionToken ? <Settings /> : <Login handleLogin={handleLogin} />} />
          <Route path="/documents" element={sessionToken ? <Documents /> : <Login handleLogin={handleLogin} />} />
          <Route path="/projects" element={sessionToken ? <Projects /> : <Login handleLogin={handleLogin} />} />
          <Route path="/contacts" element={sessionToken ? <Contacts /> : <Login handleLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;