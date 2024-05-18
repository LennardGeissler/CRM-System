import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from "./components/Header.tsx";
import SideBar from "./components/SideBar.tsx";
import Deals from "./components/Deals.tsx";
import Login from "./components/Login.tsx";
import Dashboard from "./components/Dashboard.tsx";
import './App.scss';

// function App() {
//   return (
//     <div className="App">
//       <SideBar></SideBar>
//       <div className="right">
//         <Header></Header>
//         <Router>
//           <Routes>
//             <Route path="/dashboard" element={<Dashboard />}/>
//             <Route path="/deals" element={<Deals />} />
//             <Route path="/login" element={<Login />}/>
//           </Routes>
//         </Router>
//       </div>
//     </div>
//   )
// }

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