import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Header } from './components/user/layouts/Header';
import Home from './components/user/pages/Home';
import AdminHome from './components/admin/pages/AdminHome';
import Footer from './components/user/layouts/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  // 공통 네비게이션 요청을 route key 기반으로 처리해 헤더/푸터에서 같은 매핑을 재사용할 수 있도록 함
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
      {/* 사용자 영역에는 헤더를 유지하고, 관리자 화면에서는 중복 레이아웃을 피하기 위해 제거 */}
      {!isAdmin && (
        <Header
          isLoggedIn={isLoggedIn}
          onLoginChange={setIsLoggedIn}
          onNavigate={handleNavigate}
          userRole={userRole}
          onRoleChange={setUserRole}
        />
      )}

      {/* 메인 콘텐츠를 별도 래퍼로 감싸 레이아웃과 패딩을 일관되게 관리 */}
      <main className="app-body" style={{ paddingTop: !isAdmin ? '140px' : '0px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminHome />} />
        </Routes>
      </main>

      {/* 관리자 페이지는 별도의 레이아웃을 갖기 때문에 푸터도 사용자 페이지에서만 노출 */}
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
