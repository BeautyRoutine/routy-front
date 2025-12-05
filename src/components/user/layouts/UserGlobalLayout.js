import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header } from './Header';
import SideSticky from './SideSticky';
import api from '../../../lib/apiClient';
import { DEMO_RECENT_ITEMS } from './headerConstants';

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
  const [cartCount, setCartCount] = useState(0);
  const { currentUser } = useSelector(state => state.user);
  const userId = currentUser?.userId;

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 로그인 상태 변경 시 최근 본 상품 API 호출
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setRecentItems([]);
      setCartCount(0);
      return;
    }

    // 1. 최근 본 상품 조회
    api
      .get(`/api/users/${userId}/recent-products`)
      .then(response => {
        const rawData = response.data;
        const list = Array.isArray(rawData) ? rawData : rawData?.data || [];

        if (Array.isArray(list)) {
          // SideSticky가 기대하는 포맷(id, title, image)으로 매핑
          const mappedItems = list.map(item => {
            return {
              id: item.prdNo,
              title: item.prdName,
              image: item.prdImg ? `${process.env.PUBLIC_URL}/images/product/${item.prdImg}` : null,
            };
          });
          // 최신순 정렬 (API가 최신순으로 준다고 가정하고 reverse 제거)
          setRecentItems(mappedItems);
        } else {
          setRecentItems([]);
        }
      })
      .catch(error => {
        console.error('최근 본 상품 로드 실패:', error);
        // API 실패 시 데모 데이터 폴백 (개발 편의용)
        setRecentItems(DEMO_RECENT_ITEMS);
      });

    // 2. 장바구니 개수 조회
    api
      .get(`/api/users/${userId}/cart/count`)
      .then(response => {
        // 응답 구조: { resultCode: 200, resultMsg: "SUCCESS", data: { count: 3 } }
        const result = response.data;
        if (result && result.data && typeof result.data.count === 'number') {
          setCartCount(result.data.count);
        } else {
          setCartCount(0);
        }
      })
      .catch(error => {
        console.error('장바구니 개수 로드 실패:', error);
        setCartCount(0);
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
        cartCount={cartCount}
      />
      <SideSticky
        isLoggedIn={isLoggedIn}
        recentItems={recentItems}
        onRequireLogin={onRequireLogin}
        onScrollTop={handleScrollTop}
        onNavigate={onNavigate}
      />
    </>
  );
};

export default UserGlobalLayout;
