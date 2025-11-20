import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import '../styles/MyPage.css';
import {
  MYPAGE_ENDPOINTS,
  FALLBACK_USER_PROFILE,
  FALLBACK_ORDER_STEPS,
  FALLBACK_INGREDIENT_GROUPS,
  FALLBACK_INGREDIENT_BLOCK_META,
} from 'components/user/data/mypageConstants';

// 사용자 데이터에 따라 사이드바 문구를 동적으로 만들어 주는 빌더.
const buildNavSections = user => [
  {
    title: '마이 쇼핑',
    items: ['주문/배송 조회', '취소·반품/교환 내역', '거래증빙서류 확인', '장바구니', '좋아요', '재입고 알림'],
  },
  {
    title: '마이 활동',
    items: ['1:1 문의 내역', `리뷰 (${user.reviews})`, '상품 Q&A 내역', '이벤트 참여 현황', '체험단 리뷰'],
  },
  {
    title: '마이 정보',
    items: ['회원정보 수정', '배송지/환불계좌', 'MY 환경설정', '회원탈퇴'],
  },
];

// 주요 지표 카드를 생성한다. 숫자 포맷이나 항목 구성이 바뀌면 이 함수만 수정하면 된다.
const buildActivityStats = user => [
  { label: '주문/배송', value: user.orders, icon: '🚚' },
  { label: '포인트', value: user.points.toLocaleString(), icon: '💎' },
  { label: '쿠폰', value: 2, icon: '🎟️' },
  { label: '찜한 상품', value: user.favorites, icon: '💗' },
];

const MyPage = () => {
  // ===== State scaffolding =====
  // 각 state는 추후 API 응답으로 대체될 예정이며, 초기값만 더미 데이터로 채워둔다.
  const [userProfile, setUserProfile] = useState(FALLBACK_USER_PROFILE);
  // const [activityStats, setActivityStats] = useState(buildActivityStats(FALLBACK_USER_PROFILE)); // Unused in new design
  const [navSections, setNavSections] = useState(buildNavSections(FALLBACK_USER_PROFILE));
  const [ingredients, setIngredients] = useState(FALLBACK_INGREDIENT_GROUPS);
  const [orderSteps, setOrderSteps] = useState(FALLBACK_ORDER_STEPS);

  useEffect(() => {
    // ===== Example API wiring =====
    // axios.get(`${MYPAGE_ENDPOINTS.profile}/1`).then(({ data }) => {
    //   setUserProfile(data.profile);
    //   // setActivityStats(buildActivityStats(data.profile));
    //   setNavSections(buildNavSections(data.profile));
    //   setOrderSteps(data.orderSteps);
    //   setIngredients(data.favoriteIngredients);
    // });
  }, []);

  return (
    <div className="mypage">
      {/* 좌측 고정 내비게이션: 추후 라우팅 연결 시 클릭 핸들러만 추가하면 된다. */}
      <aside className="mypage-sidebar">
        <h1>마이페이지</h1>
        {navSections.map(section => (
          <div key={section.title} className="sidebar-section">
            <p className="sidebar-title">{section.title}</p>
            <ul>
              {section.items.map(item => (
                // TODO: onClick={() => navigate('/path')} 같은 라우팅 로직 추가
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <div className="mypage-content">
        {/* 상단 히어로: 사용자 환영 문구 + 핵심 지표 3종을 요약 */}
        <section className="mypage-hero">
          <div className="hero-top">
            <div className="hero-user-info">
              <div className="user-avatar-placeholder"></div>
              <div className="hero-text-group">
                <p className="hero-greeting">
                  <strong>ROUTY {userProfile.tier}</strong> {userProfile.name}님 반갑습니다.
                </p>
                <div className="hero-tags">
                  {userProfile.tags &&
                    userProfile.tags.map(tag => (
                      <span key={tag} className="skin-tag">
                        {tag}
                      </span>
                    ))}
                  <button type="button" className="hero-settings-btn" aria-label="피부 타입 설정">
                    <Settings size={14} color="#fff" />
                  </button>
                </div>
              </div>
            </div>
            <div className="hero-links">
              <button>나의프로필 &gt;</button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-label">보유 포인트</span>
              <strong className="stat-value point">{userProfile.points.toLocaleString()} P</strong>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">쿠폰</span>
              <strong className="stat-value">2 개</strong>
            </div>
          </div>
        </section>

        {/* 주문/배송 단계 진행상황 */}
        <section className="mypage-status">
          <header>
            <h3>
              주문/배송 조회 <span className="sub-title">(최근 1개월)</span>
            </h3>
            <button type="button">더보기 &gt;</button>
          </header>
          <div className="status-steps">
            {/* Hardcoded steps to match the image for now, or map if data aligns */}
            {[
              { label: '주문접수', value: 0 },
              { label: '결제완료', value: 0 },
              { label: '배송준비중', value: 0 },
              { label: '배송중', value: 0 },
              { label: '배송완료', value: 0 },
            ].map((step, index, arr) => (
              <React.Fragment key={step.label}>
                <div className="status-step">
                  <strong>{step.value}</strong>
                  <span>{step.label}</span>
                </div>
                {index < arr.length - 1 && <div className="step-arrow">&gt;</div>}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 찜한 상품 비어 있을 때 빈 상태 안내 */}
        <section className="mypage-favorite">
          <header>
            <h3>좋아요</h3>
            <button type="button">더보기 &gt;</button>
          </header>
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <p>좋아요 상품이 없습니다.</p>
          </div>
        </section>

        {/* 즐겨 찾는 성분 - 관심/피할 목록을 각각 두 개씩 미리보기로 제공 */}
        <section className="mypage-ingredients">
          <div className="ingredients-header">
            <h3>즐겨 찾는 성분</h3>
          </div>
          <div className="ingredient-groups">
            {FALLBACK_INGREDIENT_BLOCK_META.map(block => (
              <article key={block.key} className={`ingredient-block ${block.key}`}>
                <div className="ingredient-block-header">
                  <h4>{block.label}</h4>
                  <button type="button">전체 보기</button>
                </div>
                <ul className="ingredient-list">
                  {(ingredients[block.key] ?? []).slice(0, 2).map(ingredient => (
                    <li key={ingredient.name} className={`ingredient-item ${ingredient.type}`}>
                      <span className={`ingredient-pill ${ingredient.type}`}>{ingredient.name}</span>
                      <p>{ingredient.desc}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* 문의 내역 카드 */}
        <section className="mypage-inquiry-grid">
          <article>
            <header>
              <h3>1:1 문의내역</h3>
              <button type="button">더보기 &gt;</button>
            </header>
            <div className="inquiry-content">
              <p className="empty-copy">최근 1개월간 문의하신 내용이 없습니다.</p>
            </div>
          </article>
          <article>
            <header>
              <h3>상품 Q&A 내역</h3>
              <button type="button">더보기 &gt;</button>
            </header>
            <div className="inquiry-content">
              <p className="empty-copy">작성하신 상품 Q&A가 없습니다.</p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default MyPage;
