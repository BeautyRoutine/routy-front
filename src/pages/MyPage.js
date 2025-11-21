import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import ProfileEditModal from '../components/user/mypage/ProfileEditModal';
import ProfileDetail from '../components/user/mypage/ProfileDetail';
import DeliveryAddress from '../components/user/mypage/DeliveryAddress';
import MemberWithdrawal from '../components/user/mypage/MemberWithdrawal';
import PasswordChange from '../components/user/mypage/PasswordChange';
import { fetchMyPageData, updateUserProfile } from '../features/user/userSlice';
import '../styles/MyPage.css';
import { FALLBACK_INGREDIENT_BLOCK_META } from 'components/user/data/mypageConstants';

/**
 * buildNavSections Helper
 *
 * 사용자 데이터에 따라 사이드바 네비게이션 메뉴 구조를 생성합니다.
 * @param {Object} user - 사용자 프로필 데이터
 * @returns {Array} 네비게이션 섹션 배열
 */
const buildNavSections = user => [
  {
    title: '마이 쇼핑',
    items: ['주문/배송 조회', '취소·반품/교환 내역', '좋아요'],
  },
  {
    title: '마이 활동',
    items: ['1:1 문의 내역', `리뷰 (${user.reviews})`, '상품 Q&A 내역', '이벤트 참여 현황'],
  },
  {
    title: '마이 정보',
    items: ['회원정보 수정', '배송지/환불계좌', '비밀번호 수정', '회원탈퇴'],
  },
];

/**
 * MyPage Component
 *
 * 마이페이지의 메인 컨테이너 컴포넌트입니다.
 * 좌측 사이드바와 우측 컨텐츠 영역으로 구성되며,
 * 대시보드, 프로필 상세, 배송지 관리, 회원 탈퇴 등의 서브 페이지를 렌더링합니다.
 * 비밀번호 변경 기능은 모달 형태로 제공됩니다.
 */
const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile: userProfile, orderSteps, ingredients, loading } = useSelector(state => state.user);

  // UI State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 프로필 수정 모달 상태
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // 비밀번호 변경 모달 상태
  const [viewMode, setViewMode] = useState('dashboard'); // 현재 보여줄 뷰 모드 ('dashboard' | 'profile' | 'delivery' | 'withdrawal')

  // Derived State: 사용자 정보가 변경될 때마다 네비게이션 메뉴 재생성
  const navSections = useMemo(() => buildNavSections(userProfile), [userProfile]);

  useEffect(() => {
    dispatch(fetchMyPageData());
  }, [dispatch]);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleShowProfileDetail = () => setViewMode('profile');
  const handleShowDashboard = () => setViewMode('dashboard');

  // Handler: 사이드바 메뉴 클릭 처리
  const handleNavClick = item => {
    if (item === '회원정보 수정') setViewMode('profile');
    else if (item === '배송지/환불계좌') setViewMode('delivery');
    else if (item === '회원탈퇴') setViewMode('withdrawal');
    else if (item === '비밀번호 수정') setIsPasswordModalOpen(true); // 비밀번호 수정은 모달 오픈
    else {
      // For other items, maybe navigate or show placeholder
      console.log('Clicked:', item);
    }
  };

  const handleSaveProfile = updatedData => {
    // Redux Thunk를 통해 프로필 업데이트 요청
    dispatch(updateUserProfile(updatedData));
  };

  // 뷰 모드에 따른 메인 컨텐츠 렌더링
  const renderContent = () => {
    switch (viewMode) {
      case 'profile':
        return (
          <ProfileDetail userProfile={userProfile} onEditProfile={handleOpenEditModal} onBack={handleShowDashboard} />
        );
      case 'delivery':
        return <DeliveryAddress />;
      case 'withdrawal':
        return <MemberWithdrawal onCancel={handleShowDashboard} />;
      case 'dashboard':
      default:
        return (
          <>
            {/* 상단 히어로: 사용자 환영 문구 + 핵심 지표 3종을 요약 */}
            <section className="mypage-hero">
              <div className="hero-top">
                <div className="hero-user-info">
                  <div className="user-avatar-placeholder"></div>
                  <div className="hero-text-group">
                    <p className="hero-greeting">
                      <strong>{userProfile.name}</strong>님 반갑습니다.
                    </p>
                    <div className="hero-tags-row">
                      {userProfile.tags &&
                        userProfile.tags.map(tag => (
                          <span key={tag} className="skin-tag">
                            {tag}
                          </span>
                        ))}
                    </div>
                    {userProfile.skinConcerns && userProfile.skinConcerns.length > 0 && (
                      <div className="hero-tags-row">
                        {userProfile.skinConcerns.map(concern => (
                          <span key={concern} className="skin-tag">
                            {concern}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="hero-links">
                  <button
                    type="button"
                    className="hero-settings-btn"
                    aria-label="회원정보 수정"
                    onClick={handleOpenEditModal}
                  >
                    <span>회원정보 수정</span>
                    <Settings size={14} color="#fff" />
                  </button>
                  <button onClick={handleShowProfileDetail}>나의프로필 &gt;</button>
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
          </>
        );
    }
  };

  return (
    <div className="mypage">
      {/* 좌측 고정 내비게이션: 추후 라우팅 연결 시 클릭 핸들러만 추가하면 된다. */}
      <aside className="mypage-sidebar">
        <h1 onClick={handleShowDashboard} style={{ cursor: 'pointer' }}>
          마이페이지
        </h1>
        {navSections.map(section => (
          <div key={section.title} className="sidebar-section">
            <p className="sidebar-title">{section.title}</p>
            <ul>
              {section.items.map(item => (
                // TODO: onClick={() => navigate('/path')} 같은 라우팅 로직 추가
                <li key={item} onClick={() => handleNavClick(item)}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <div className="mypage-content">{renderContent()}</div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        userProfile={userProfile}
        onSave={handleSaveProfile}
      />
      {/* 비밀번호 변경 모달 컴포넌트 */}
      <PasswordChange isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  );
};

export default MyPage;
