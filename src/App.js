import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Header } from './components/user/layouts/Header';
import SideSticky from './components/user/layouts/SideSticky';
// TODO: 로그인/회원가입 API 연동 시 ENDPOINTS import를 복원하시면 됩니다.
// import { Header, ENDPOINTS as HEADER_ENDPOINTS } from './components/user/layouts/Header';
import Home from './components/user/pages/Home';
import AdminHome from './components/admin/pages/AdminHome';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();
  const demoRecentItems = [
    {
      id: 'demo-1',
      title: '히알루론산 앰플 세럼',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1586495578044-4413f21062fa?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: 'demo-2',
      title: '비타민 C 토너',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1583241800696-c55fea4c4125?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: 'demo-3',
      title: '세라마이드 에센스',
      price: 39000,
      image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=160&q=80',
    },
  ];
  const cartItemCount = 3;

  const handleLoginClick = async () => {
    // 현재는 데모 목적으로 버튼 클릭 시 바로 로그인 상태로 전환한다.
    // 실제 적용 시 HEADER_ENDPOINTS.login을 활용해 모달/로그인 API와 연동하도록 변경한다.
    setIsLoggedIn(true);
  };

  const handleSignupClick = () => {
    // 회원가입 페이지 또는 모달이 준비되면 여기에서 navigate를 호출해 흐름을 연결한다.
    console.info('회원가입 절차를 연결하세요.');
  };

  const handleLogoutClick = () => {
    // 인증 토큰이나 세션을 사용하는 경우, 여기에서 정리 로직과 API 호출을 추가한다.
    setIsLoggedIn(false);
  };

  const handleRequireLogin = () => {
    navigate('/login');
  };

  const handleCartNavigate = () => {
    navigate('/cart');
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <>
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
          <SideSticky
            isLoggedIn={isLoggedIn}
            recentItems={isLoggedIn ? demoRecentItems : []}
            cartCount={cartItemCount}
            onRequireLogin={handleRequireLogin}
            onCartClick={handleCartNavigate}
            onScrollTop={handleScrollTop}
          />
        </>
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
