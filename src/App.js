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

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAdmin = location.pathname.startsWith('/admin');

  const noLayoutRoutes = ['/kakao/callback'];
  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  // 최초 로드 시 localStorage에서 로그인 상태 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userStr = localStorage.getItem('user');

    if (token && userId) {
      setIsLoggedIn(true);

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(setUser(user));
        } catch (e) {
          console.error('User 데이터 파싱 실패:', e);
        }
      }
    } else {
      setIsLoggedIn(false);
      dispatch(setUser(null));
    }
  }, [dispatch]);

  // 경로 변경 시마다 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newLoginState = !!token;

    if (isLoggedIn !== newLoginState) {
      setIsLoggedIn(newLoginState);

      if (newLoginState) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            dispatch(setUser(user));
          } catch (e) {
            console.error('User 데이터 파싱 실패:', e);
          }
        }
      }
    }
  }, [location.pathname, isLoggedIn, dispatch]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(setUser(null));
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="App">
      <ScrollToTop />

      {/* KakaoCallback에서는 헤더 표시 안 함 */}
      {!isAdmin && !isNoLayout && (
        <UserGlobalLayout
          isLoggedIn={isLoggedIn}
          onLoginClick={() => navigate('/login')}
          onSignupClick={() => navigate('/signup')}
          onLogoutClick={handleLogout}
        />
      )}

      <main
        className="app-body"
        /** 🔥 KakaoCallback에서는 padding-top 제거 */
        style={{ paddingTop: !isAdmin && !isNoLayout ? '140px' : '0px' }}
      >
        <Routes>
          <Route path="/" element={<Home />} />

          {/* 카카오 콜백 → 레이아웃 없음 */}
          <Route path="/kakao/callback" element={<KakaoCallback />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/products/:prdNo" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/ranking" element={<RankingPage />} />

          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/logout" element={<LogoutPage />} />

          <Route path="/skin-profile" element={<SkinProfileSetupPage />} />
          <Route path="/admin/*" element={<AdminHome />} />
          
          <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </main>

      {/* KakaoCallback에서는 Footer 표시 안 함 */}
      {!isAdmin && !isNoLayout && <Footer />}
    </div>
  );
}

export default App;
