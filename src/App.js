import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './components/pages/Home';
import AdminHome from './components/admin/AdminHome';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<AdminHome />} />
      </Routes>
    </div>
  );
}

export default App;
