// src/App.js - 로그인 상태 동기화 버전
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { CartPage } from './pages/CartPage';

import UserGlobalLayout from './components/user/layouts/UserGlobalLayout';
import SkinProfileSetupPage from './pages/SkinProfileSetupPage';
import Home from 'pages/Home';
import MyPage from './pages/MyPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListPage from './pages/ProductListPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LogoutPage from './pages/LogoutPage';
import AdminHome from 'pages/admin/AdminHome';
import Footer from 'components/user/layouts/footer';
import ScrollToTop from 'components/common/ScrollToTop';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // 추가: 컴포넌트 마운트 시 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 추가: 현재 경로가 변경될 때마다 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    navigate('/logout');
  };

  const handleRequireLogin = () => {
    navigate('/login');
  };

  const handleCartNavigate = () => {
    navigate('/cart');
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

  return (
    <div className="App">
      <ScrollToTop />
      {!isAdmin && (
        <UserGlobalLayout
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginChange={setIsLoggedIn}
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          onLogoutClick={handleLogoutClick}
          onNavigate={handleNavigate}
          onRoleChange={setUserRole}
          onRequireLogin={handleRequireLogin}
          onCartClick={handleCartNavigate}
        />
      )}

      <main className="app-body" style={{ paddingTop: !isAdmin ? '140px' : '0px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/products/:prdNo" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/admin/*" element={<AdminHome />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <SignupPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<div style={{ padding: 24 }}>페이지를 찾을 수 없습니다.</div>} />
          <Route path="/skin-profile" element={<SkinProfileSetupPage />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
