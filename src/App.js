// src/App.js (최종 통합 안정화 버전)

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './features/user/userSlice';

import KakaoCallback from './pages/KakaoCallback';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LogoutPage from './pages/LogoutPage';
import Home from 'pages/Home';
import MyPage from './pages/MyPage';
import MyRoutyPage from './pages/MyRoutyPage';
import RoutineEditPage from './pages/RoutineEditPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListPage from './pages/ProductListPage';
import RankingPage from './pages/RankingPage';
import { CartPage } from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import SkinProfileSetupPage from './pages/SkinProfileSetupPage';
import AdminHome from 'pages/admin/AdminHome';

import UserGlobalLayout from './components/user/layouts/UserGlobalLayout';
import Footer from 'components/user/layouts/footer';
import ScrollToTop from 'components/common/ScrollToTop';
import UnderConstruction from 'pages/UnderConstruction';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAdmin = location.pathname.startsWith('/admin');
  const noLayoutRoutes = ['/kakao/callback'];
  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  // ---------------------------------------------------
  // 1. 최초 로드 시 로그인 상태 복원
  // ---------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userStr = localStorage.getItem('user');

    if (token && userId) {
      setIsLoggedIn(true);

      if (userStr) {
        try {
          dispatch(setUser(JSON.parse(userStr)));
        } catch (err) {
          console.error('User 데이터 파싱 실패:', err);
        }
      }
    } else {
      setIsLoggedIn(false);
      dispatch(setUser(null));
    }
  }, [dispatch]);

  // ---------------------------------------------------
  // 2. 경로 변경 시 로그인 상태 동기화
  // ---------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newLogin = !!token;

    if (isLoggedIn !== newLogin) {
      setIsLoggedIn(newLogin);

      if (newLogin) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            dispatch(setUser(JSON.parse(userStr)));
          } catch (err) {
            console.error('User 데이터 파싱 실패:', err);
          }
        }
      } else {
        dispatch(setUser(null));
      }
    }
  }, [location.pathname, isLoggedIn, dispatch]);

  // ---------------------------------------------------
  // 3. 헤더에서 사용할 네비게이션 함수 (복원)
  // ---------------------------------------------------
  const handleNavigate = (page, param) => {
    // 1) 절대 경로 직접 이동
    if (typeof page === 'string' && page.startsWith('/')) {
      navigate(page);
      return;
    }

    // 2) 사전 정의된 라우트 매핑
    const routes = {
      home: '/',
      mypage: '/mypage',
      ranking: '/ranking',
      cart: '/cart',
      product: '/products',
      myrouty: '/myrouty',
    };

    // 상품 상세
    if (page === 'product' && param) {
      navigate(`/products/${param}`);
      return;
    }

    // 검색
    if (page === 'search' && param) {
      navigate(`/products?search=${encodeURIComponent(param)}`);
      return;
    }

    // 카테고리
    if (page === 'category' && param) {
      navigate(`/products?category=${param}`);
      return;
    }

    // 일반 라우트 이동
    if (routes[page]) {
      navigate(routes[page]);
    }
  };

  // ---------------------------------------------------
  // 4. 로그아웃
  // ---------------------------------------------------
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    dispatch(setUser(null));
    navigate('/');
  };

  return (
    <div className="App">
      <ScrollToTop />

      {/* KakaoCallback에서는 Header 제외 */}
      {!isAdmin && !isNoLayout && (
        <UserGlobalLayout
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginChange={setIsLoggedIn}
          onLoginClick={() => navigate('/login')}
          onSignupClick={() => navigate('/signup')}
          onLogoutClick={handleLogout}
          onNavigate={handleNavigate} // ★★★ 반드시 복원된 핵심 부분
          onRoleChange={setUserRole}
          onCartClick={() => navigate('/cart')}
          onRequireLogin={() => navigate('/login')}
        />
      )}

      {/* 메인 콘텐츠 */}
      <main className="app-body" style={{ paddingTop: !isAdmin && !isNoLayout ? '140px' : '0px' }}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* KakaoCallback (레이아웃 없음) */}
          <Route path="/kakao/callback" element={<KakaoCallback />} />

          {/* 장바구니 & 결제 */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />

          {/* 사용자 페이지 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/myrouty" element={<MyRoutyPage />} />
          <Route path="/my-routy/edit/:date" element={<RoutineEditPage />} />

          {/* 상품 관련 */}
          <Route path="/products/:prdNo" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductListPage />} />

          <Route path="/ranking" element={<RankingPage />} />

          {/* 인증 관련 */}
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/logout" element={<LogoutPage />} />

          <Route path="/skin-profile" element={<SkinProfileSetupPage />} />

          {/* 관리자 */}
          <Route path="/admin/*" element={<AdminHome />} />

          {/* 예외 처리 */}
          <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
          <Route path="/underconstruction" element={<UnderConstruction />} />
        </Routes>
      </main>

      {/* Footer도 KakaoCallback에서는 제거 */}
      {!isAdmin && !isNoLayout && <Footer />}
    </div>
  );
}

export default App;
