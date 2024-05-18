import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './layouts/Header/Header.tsx';
import SideBar from './layouts/SideBar/SideBar.tsx';
import Deals from "./pages/Deals/Deals.tsx";
import Login from "./pages/Login/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import './App.scss';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="App">
      {!isLoginRoute && <SideBar />}
      <div className="right">
        {!isLoginRoute && <Header />}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;