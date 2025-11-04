import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './components/user/layouts/Header';
import Home from './components/user/pages/Home';
import AdminHome from './components/admin/pages/AdminHome';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  const handleNavigate = page => {
    const routes = {
      home: '/',
      admin: '/admin',
      mypage: '/mypage',
      cart: '/cart',
      order: '/order',
      customerservice: '/customerservice',
      category: '/category',
      ranking: '/ranking',
      product: '/product',
    };

    if (routes[page]) {
      navigate(routes[page]);
    }
  };

  return (
    <div className="App">
      {/* Header 추가 */}
      <Header
        isLoggedIn={isLoggedIn}
        onLoginChange={setIsLoggedIn}
        onNavigate={handleNavigate}
        userRole={userRole}
        onRoleChange={setUserRole}
      />

      {/* 콘텐츠 영역 */}
      <div style={{ paddingTop: '140px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminHome />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
