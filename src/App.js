// src/App.js-수정예정
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { CartPage } from './pages/CartPage';

import UserGlobalLayout from './components/user/layouts/UserGlobalLayout';

// TODO: 로그인/회원가입 API 연동 시 ENDPOINTS import를 복원하시면 됩니다.
// import { Header, ENDPOINTS as HEADER_ENDPOINTS } from './components/user/layouts/Header';
import Home from 'pages/Home';
import MyPage from './pages/MyPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LogoutPage from './pages/LogoutPage';
import AdminHome from 'pages/admin/AdminHome';
import Footer from 'components/user/layouts/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // 공통 네비게이션 요청을 route key 기반으로 처리해 헤더/푸터에서 같은 매핑을 재사용할 수 있도록 함
  const handleLoginClick = () => {
    // 로그인 버튼 클릭 시 로그인 페이지로 이동
    navigate('/login');
  };

  const handleSignupClick = () => {
    // 회원가입 페이지로 이동
    navigate('/signup');
  };

  const handleLogoutClick = () => {
    // 실제 로그아웃 시에는 토큰/회원정보 제거 로직을 추가해야 함
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
      {/* 사용자 영역에는 헤더를 유지하고, 관리자 화면에서는 중복 레이아웃을 피하기 위해 제거 */}
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

      {/* 메인 콘텐츠 */}
      <main className="app-body" style={{ paddingTop: !isAdmin ? '140px' : '0px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />

          {/* TODO: 로그인 체크 로직 (테스트를 위해 주석 처리됨). 배포 시 주석 해제 및 아래 Route 삭제 필요 */}
          {/* <Route
            path="/mypage"
            element={isLoggedIn ? <MyPage /> : <Navigate to="/login" replace />}
          /> */}
          <Route path="/mypage" element={<MyPage />} />

          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/admin/*" element={<AdminHome />} />

          {/* 로그인 */}
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />

          {/* 회원가입 */}
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <SignupPage />} />

          {/* 로그아웃 */}
          <Route path="/logout" element={<LogoutPage />} />

          {/* 404 */}
          <Route path="*" element={<div style={{ padding: 24 }}>페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </main>

      {/* 관리자 페이지는 별도의 레이아웃을 갖기 때문에 푸터도 사용자 페이지에서만 노출 */}
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
