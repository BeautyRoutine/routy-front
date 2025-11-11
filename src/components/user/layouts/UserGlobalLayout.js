import React from 'react';
import { Header } from './Header';
import SideSticky from './SideSticky';
import { DEMO_RECENT_ITEMS, DEMO_CART_COUNT } from '../data/headerMocks';

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
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 로그인한 경우에만 더미 최근 목록을 넘겨 UI를 시연한다.
  const recentItems = isLoggedIn ? DEMO_RECENT_ITEMS : [];

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
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
