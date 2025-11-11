import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { CartPage } from './pages/CartPage';

import UserGlobalLayout from './components/user/layouts/UserGlobalLayout';

// TODO: 로그인/회원가입 API 연동 시 ENDPOINTS import를 복원하시면 됩니다.
// import { Header, ENDPOINTS as HEADER_ENDPOINTS } from './components/user/layouts/Header';
import Home from 'pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LogoutPage from './pages/LogoutPage';
import AdminHome from 'pages/admin/AdminHome';
import Footer from 'components/user/layouts/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductDetailPage from 'pages/ProductDetailPage';
import MyPage from 'pages/MyPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  // 공통 네비게이션 요청을 route key 기반으로 처리해 헤더/푸터에서 같은 매핑을 재사용할 수 있도록 함
  const handleLoginClick = async () => {
    //  로그인 버튼 클릭 시 로그인 페이지로 이동합니다.
    // 실제 적용 시 HEADER_ENDPOINTS.login을 활용해 모달/로그인 API와 연동하도록 변경한다.
    navigate('/login');
  };

  const handleSignupClick = () => {
    // 회원가입 페이지 또는 모달이 준비되면 여기에서 navigate를 호출해 흐름을 연결한다.
    navigate('/signup');
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

  const handleNavigate = page => {
    if (page === 'mypage' && !isLoggedIn) {
      handleRequireLogin();
      return;
    }

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
  const isConnectionTest = location.pathname.startsWith('/connection-test');

  return (
    <div className="App">
      {/* Home인 경우에만 Header 추가 */}
      {/* 사용자 영역에는 헤더를 유지하고, 관리자 화면에서는 중복 레이아웃을 피하기 위해 제거 */}
      {!isAdmin && !isConnectionTest && (
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

      {/* 메인 콘텐츠를 별도 래퍼로 감싸 레이아웃과 패딩을 일관되게 관리 */}
      <main className="app-body" style={{ paddingTop: !isAdmin && !isConnectionTest ? '140px' : '0px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/mypage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" replace />} />
          <Route path="/admin/*" element={<AdminHome />} />
          {/* 로그인 */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage
                  onSuccess={member => {
                    setIsLoggedIn(true);
                    setUserRole(member?.role || 'user');
                  }}
                />
              )
            }
          />

          {/* 회원가입 */}
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <SignupPage />} />

          {/* 로그아웃 */}
          <Route path="/logout" element={<LogoutPage />} />

          {/* 404 */}
          <Route path="*" element={<div style={{ padding: 24 }}>페이지를 찾을 수 없습니다.</div>} />

          {/*제품 상세정보 페이지 */}
          <Route path="/products/:prdNo" element={<ProductDetailPage />} />
        </Routes>
      </main>

      {/* 관리자 페이지는 별도의 레이아웃을 갖기 때문에 푸터도 사용자 페이지에서만 노출 */}
      {!isAdmin && !isConnectionTest && <Footer />}
    </div>
  );
}

export default App;
