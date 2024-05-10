import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header.tsx";
import SideBar from "./components/SideBar.tsx";
import Deals from "./components/Deals.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Preloader from "./components/Preloader.tsx";
import './App.scss';

function App() {
  const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => setLoading(false), 2000);
        setLoading(false);
    })
    if (loading) {
        return <Preloader/>
    }

  return (
    <div className="App">
      <SideBar></SideBar>
      <div className="right">
        <Header></Header>
        <Router>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/deals" element={<Deals />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App;