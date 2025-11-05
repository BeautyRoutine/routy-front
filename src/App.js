import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Header, ENDPOINTS as HEADER_ENDPOINTS } from './components/user/layouts/Header';
import Home from './components/user/pages/Home';
import AdminHome from './components/admin/pages/AdminHome';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    // TODO: Replace with real login modal/API integration.
    // Example:
    // const response = await fetch(HEADER_ENDPOINTS.login, { method: 'POST', body: JSON.stringify(credentials) });
    // if (!response.ok) throw new Error('로그인 실패');
    // setIsLoggedIn(true);
    setIsLoggedIn(true);
  };

  const handleSignupClick = () => {
    // TODO: Swap in sign-up modal or navigation to join page when ready.
    console.info('회원가입 절차를 연결하세요.');
  };

  const handleLogoutClick = () => {
    // TODO: Connect to logout API if tokens/sessions need clearing.
    setIsLoggedIn(false);
  };

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

  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {/* Home인 경우에만 Header 추가 */}
      {!isAdmin && (
        <Header
          isLoggedIn={isLoggedIn}
          onLoginChange={setIsLoggedIn}
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          onLogoutClick={handleLogoutClick}
          onNavigate={handleNavigate}
          userRole={userRole}
          onRoleChange={setUserRole}
        />
      )}

      {/* 콘텐츠 영역 */}
      <div style={{ paddingTop: !isAdmin ? '140px' : '0px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminHome />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
