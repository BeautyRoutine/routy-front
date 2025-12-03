import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header } from './Header';
import SideSticky from './SideSticky';
import api from '../../../lib/apiClient';
import { DEMO_RECENT_ITEMS, DEMO_CART_COUNT } from './headerConstants';

/**
 * 사용자용 전역 레이아웃. Header와 사이드 스티키를 묶어 렌더링하며,
 * API가 연동되기 전까지는 이 컴포넌트에서만 더미 데이터를 관리한다.
 */
const UserGlobalLayout = ({
  isLoggedIn,
  userRole,
  onLoginChange,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onNavigate,
  onRoleChange,
  onRequireLogin,
  onCartClick,
}) => {
  const [recentItems, setRecentItems] = useState([]);
  const { currentUser } = useSelector(state => state.user);
  const userId = currentUser?.userId;

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 로그인 상태 변경 시 최근 본 상품 API 호출
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setRecentItems([]);
      return;
    }

    // /api/users/{userId}/recent-products
    api
      .get(`/api/users/${userId}/recent-products`)
      .then(response => {
        // API 응답이 배열이라고 가정
        if (Array.isArray(response.data)) {
          setRecentItems(response.data);
        } else {
          setRecentItems([]);
        }
      })
      .catch(error => {
        console.error('최근 본 상품 로드 실패:', error);
        // API 실패 시 데모 데이터 폴백 (개발 편의용)
        setRecentItems(DEMO_RECENT_ITEMS);
      });
  }, [isLoggedIn, userId]);

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userId={userId}
        onLoginChange={onLoginChange}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onLogoutClick={onLogoutClick}
        onNavigate={onNavigate}
        userRole={userRole}
        onRoleChange={onRoleChange}
      />
      <SideSticky
        isLoggedIn={isLoggedIn}
        recentItems={recentItems}
        cartCount={DEMO_CART_COUNT}
        onRequireLogin={onRequireLogin}
        onCartClick={onCartClick}
        onScrollTop={handleScrollTop}
      />
    </>
  );
};

export default UserGlobalLayout;
