import React, { useEffect, useState } from 'react';
import { Clock3, ShoppingCart, ChevronUp } from 'lucide-react';

import './SideSticky.css';

/**
 * 사용자가 어느 페이지를 이동하더라도(관리자 전용 페이지 제외) 우측에 고정되어
 * 최근 본 상품 패널, 장바구니 진입 버튼, 맨 위로 이동 버튼을 제공하는 컴포넌트다.
 * Header 아래에서 전역으로 렌더링되며, 로그인 상태와 클릭 핸들러를 외부에서 주입받는다.
 */
const SideSticky = ({
  isLoggedIn = false,
  recentItems = [],
  cartCount = 0,
  onRequireLogin,
  onCartClick,
  onScrollTop,
  onNavigate,
}) => {
  // ------------------------------
  // localStorage 최근 본 상품 불러오기
  // ------------------------------
  const [localRecent, setLocalRecent] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recentItems')) || [];
      setLocalRecent(saved);
    } catch (e) {
      console.error('최근 본 상품 로드 실패:', e);
    }
  }, []);

  // props.recentItems가 우선, 없으면 localStorage fallback
  const finalRecentItems = recentItems.length > 0 ? recentItems : localRecent;
  // ------------------------------

  // 최근 본 상품 패널 펼침 여부. 로그인 상태가 바뀌면 자동으로 접히도록 별도 effect 를 둔다.
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  // 서버에서 전달받은 최근 상품 개수. 현재는 접힘/펼침 텍스트 표시와 빈 목록 안내에만 사용한다.
  const recentCount = finalRecentItems.length;

  // 로그인 해제 시 최근 카드가 펼쳐져 있으면 UI를 닫아서 비로그인 상태와 정합성을 맞춘다.
  useEffect(() => {
    if (!isLoggedIn && isRecentOpen) {
      setIsRecentOpen(false);
    }
  }, [isLoggedIn, isRecentOpen]);

  /**
   * 최근 본 상품 카드 클릭 시
   * - 비로그인 사용자는 로그인 안내 콜백을 실행하고
   * - 로그인 사용자는 펼침/접힘을 토글한다.
   */
  const handleRecentClick = () => {
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    setIsRecentOpen(prev => !prev);
  };

  /**
   * 장바구니 버튼은 로그인 시에만 실제 라우팅 콜백을 호출한다.
   * 비로그인 사용자는 동일하게 로그인 안내 콜백으로 유도한다.
   */
  const handleCartClick = () => {
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    onCartClick?.();
  };

  return (
    <div className="side-sticky">
      {/* 장바구니 버튼 - 항상 최상단에 위치하며 뱃지는 아이콘 우측 상단에 얹힌다. */}
      <button type="button" className="sticky-card cart" onClick={handleCartClick}>
        <span className="cart-icon">
          <ShoppingCart size={18} />
          {cartCount > 0 && <span className="count-badge cart-badge">{cartCount}</span>}
        </span>
        <span className="sticky-card-title cart-title">장바구니</span>
      </button>

      {/* 최근 본 상품 카드 - 로그인 시에만 펼칠 수 있고, 이미지는 세로 목록으로 노출된다. */}
      <div className={`recent-wrapper ${isRecentOpen ? 'open' : ''}`}>
        <div className="recent-icon" aria-hidden="true">
          <span className="sticky-circle-icon">
            <Clock3 size={16} />
          </span>
        </div>
        <button type="button" className="recent-toggle" onClick={handleRecentClick} aria-expanded={isRecentOpen}>
          <span className="sticky-card-title">최근 본 상품</span>
          <ChevronUp size={14} className={`card-arrow ${isRecentOpen ? 'open' : 'closed'}`} />
        </button>

        {isRecentOpen && (
          <div className="recent-catalog">
            {recentCount === 0 ? (
              <p className="recent-empty">최근 본 상품이 없습니다.</p>
            ) : (
              <ul>
                {finalRecentItems.map(item => {
                  const key = item.id || item.title;
                  const thumb = item.image;

                  return (
                    <li key={key} className="recent-item">
                      <button
                        type="button"
                        className="recent-item-button"
                        onClick={() => onNavigate?.('product', item.id)}
                      >
                        {thumb ? (
                          <img src={thumb} alt={item.title} className="recent-thumb" />
                        ) : (
                          // 이미지가 없으면 타이틀 첫 글자를 원형 플레이스홀더로 노출한다.
                          <span className="recent-thumb placeholder">{item.title?.[0] ?? '?'}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 맨 위로 이동 버튼 - sticky 열 하단에서 가로 중앙으로 살짝 이동한 위치에 둔다. */}
      <button type="button" className="scroll-top-button" onClick={onScrollTop} aria-label="맨 위로 이동">
        <ChevronUp size={20} />
      </button>
    </div>
  );
};

export default SideSticky;
