import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './layouts/Header/Header.tsx';
import SideBar from './layouts/SideBar/SideBar.tsx';
import Deals from "./pages/Deals/Deals.tsx";
import Login from "./pages/Login/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Calendar from "./pages/Calendar/Calendar.tsx";
import './App.scss';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in, for example by checking a token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <MainContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

interface MainContentProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainContent: React.FC<MainContentProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="App">
      {isLoggedIn && !isLoginRoute && <SideBar />}
      <div className="right">
        {isLoggedIn && !isLoginRoute && <Header />}
        <Routes>
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/deals" element={isLoggedIn ? <Deals /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/calendar" element={isLoggedIn ? <Calendar /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;