import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, ChevronRight, X, Search, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import './Header.css';
import logoImage from '../../../logo.svg';

// CRA 환경 변수로 덮어쓸 수 있도록 기본 Spring Boot API 루트를 지정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 나중에 Spring Boot REST 엔드포인트를 쉽게 교체할 수 있도록 중앙 집중화
const ENDPOINTS = {
  // GET /api/categories/top  -> ["오늘", "랭킹", ...] 형태 (문자열 배열)
  topCategories: '/api/categories/top',
  // GET /api/categories/tree -> [{ title: "스킨케어", items: ["스킨/토너", ...] }, ...]
  categoryTree: '/api/categories/tree',
};

// API 응답 실패 시에도 레이아웃이 무너지지 않도록 준비된 기본 상단 카테고리
const FALLBACK_TOP = ['랭킹', '멤버십/쿠폰', '이벤트', 'MyRouty'];

// 기본 카테고리 트리 (Spring Boot 연동 전까지 UI 유지용)
const FALLBACK_TREE = [
  {
    title: '스킨케어',
    items: ['스킨/토너', '에센스/세럼/앰플', '크림', '로션', '미스트/오일', '스킨케어세트', '스킨케어 디바이스'],
  },
  {
    title: '메이크업',
    items: ['립메이크업', '베이스메이크업', '아이메이크업', '아이소품', '뷰티잡화'],
  },
  {
    title: '마스크팩',
    items: ['시트팩', '패드', '페이셜팩', '코팩'],
  },
  {
    title: '클렌징',
    items: ['클렌징오일/워터', '폼/젤/크림', '립&아이 리무버', '티슈/패드', '클렌징 디바이스'],
  },
  {
    title: '선케어',
    items: ['선크림', '선스틱', '선쿠션', '선로션'],
  },
  {
    title: '맨즈케어',
    items: ['스킨케어', '메이크업', '헤어케어', '쉐이빙/왁싱'],
  },
];

// API 루트 + 상대 경로를 안전하게 붙이기 위한 헬퍼
function buildUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

// 공통 fetch 래퍼: 인증 포함, 204 처리
async function fetchJson(path, signal) {
  const response = await fetch(buildUrl(path), {
    signal,
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`status ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function normalizeTopCategories(data) {
  if (!Array.isArray(data)) return FALLBACK_TOP;
  const result = data
    .map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') return item.name || item.title;
      return null;
    })
    .filter(Boolean);
  return result.length ? result : FALLBACK_TOP;
}

function normalizeCategoryTree(data) {
  if (!Array.isArray(data)) return FALLBACK_TREE;
  const result = data
    .map(category => {
      if (!category) return null;
      const title = category.title || category.name || category.label;
      if (!title) return null;
      const items = Array.isArray(category.items || category.children)
        ? (category.items || category.children)
            .map(item => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object') return item.name || item.title || item.label;
              return null;
            })
            .filter(Boolean)
        : [];
      return { title, items };
    })
    .filter(Boolean);
  return result.length ? result : FALLBACK_TREE;
}

export function Header({
  isLoggedIn,
  onLoginChange,
  onNavigate,
  onLoginClick,
  onSignupClick,
  onMyPageClick,
  onLogoutClick,
}) {
  // 로그인 관련 prop 설명
  // isLoggedIn      : Spring Boot 인증 결과(세션/토큰 검사)를 부모가 내려줌
  // onLoginChange   : 로그아웃 같은 상태 변경 시 부모가 다시 Spring Boot와 동기화할 수 있게 호출
  // onLoginClick    : Spring Boot 로그인 API 연동을 위한 다이얼로그/폼 오픈 콜백
  // onSignupClick   : Spring Boot 회원가입 API에 연결될 다이얼로그 오픈 콜백
  // onMyPageClick   : 필요 시 Spring Boot에서 사용자 정보를 불러오는 페이지로 이동시키는 콜백
  // onLogoutClick   : Spring Boot 로그아웃 API 호출 후 정리하는 커스텀 콜백

  // 헤더 렌더링 전반에 필요한 상태와 참조 값들
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [topCategories, setTopCategories] = useState(FALLBACK_TOP);
  const [categoryTree, setCategoryTree] = useState(FALLBACK_TREE);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const categoryButtonRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(140);

  // 스크롤 위치에 따라 헤더 그림자 토글
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 드롭다운이 헤더 바로 아래 붙도록 높이를 기억
  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
  }, []);

  // 드롭다운 바깥을 클릭하면 닫히도록 처리
  useEffect(() => {
    const handleClickOutside = event => {
      const clickedInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      const clickedToggleButton = categoryButtonRef.current && categoryButtonRef.current.contains(event.target);
      if (clickedInsideDropdown || clickedToggleButton) return;
      setCategoryOpen(false);
    };
    if (categoryOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoryOpen]);

  // Spring Boot API에서 카테고리 데이터 로드
  const loadCategories = useCallback(() => {
    const controller = new AbortController();
    setCategoryLoading(true);
    setCategoryError(null);

    Promise.all([
      // topCategories: 문자열 리스트만 필요 ("/api/categories/top")
      fetchJson(ENDPOINTS.topCategories, controller.signal).catch(() => null),
      // categoryTree: title + items 배열을 가진 객체 리스트 필요 ("/api/categories/tree")
      fetchJson(ENDPOINTS.categoryTree, controller.signal).catch(() => null),
    ])
      .then(([topRes, treeRes]) => {
        if (topRes) setTopCategories(normalizeTopCategories(topRes));
        if (treeRes) setCategoryTree(normalizeCategoryTree(treeRes));
      })
      .catch(error => {
        console.error('카테고리 불러오기 실패:', error);
        setCategoryError(error);
        setTopCategories(FALLBACK_TOP);
        setCategoryTree(FALLBACK_TREE);
      })
      .finally(() => setCategoryLoading(false));

    return () => controller.abort();
  }, []);

  // 마운트 시 카테고리 데이터 초기화
  useEffect(() => {
    const abort = loadCategories();
    return () => abort && abort();
  }, [loadCategories]);

  return (
    <>
      <header ref={headerRef} className={`routy-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <div className="header-top">
            <button type="button" className="logo-button" onClick={() => onNavigate?.('home')} aria-label="홈으로 이동">
              <img src={logoImage} alt="Routy" className="logo-mark" width={52} height={52} />
              <span className="logo-text">Routy</span>
            </button>

            <div className="search-wrapper">
              <Search className="search-icon" size={18} strokeWidth={2.4} />
              <input type="text" placeholder="제품 검색..." className="search-input" aria-label="제품 검색" />
            </div>

            <div className="auth-area">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    className="auth-link"
                    // 외부에서 모달/라우팅을 주입할 수 있도록 우선 콜백을 실행
                    onClick={() => {
                      if (onMyPageClick) {
                        onMyPageClick();
                        return;
                      }
                      onNavigate?.('mypage');
                    }}
                  >
                    <User size={18} />
                    마이페이지
                  </button>
                  <button
                    type="button"
                    className="auth-button--primary"
                    // 로그아웃도 동일하게 커스텀 콜백이 우선
                    onClick={() => {
                      if (onLogoutClick) {
                        onLogoutClick();
                        return;
                      }
                      onLoginChange?.(false);
                      onNavigate?.('home');
                    }}
                  >
                    <LogOut size={18} />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="auth-link" onClick={() => onLoginClick?.()}>
                    <LogIn size={18} />
                    로그인
                  </button>
                  <button type="button" className="auth-button--primary" onClick={() => onSignupClick?.()}>
                    <UserPlus size={18} />
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="header-nav">
            <button
              type="button"
              className={`category-trigger ${categoryOpen ? 'active' : ''}`}
              ref={categoryButtonRef}
              onClick={() => {
                if (categoryLoading && !categoryOpen) return;
                setCategoryOpen(prev => !prev);
              }}
            >
              <Menu size={18} />
              카테고리
            </button>

            <div className="nav-separator" />

            <div className="nav-scroll">
              {(categoryError ? FALLBACK_TOP : topCategories).map(item => (
                <button
                  type="button"
                  key={item}
                  className="nav-item"
                  // 상단 네비에서 별도 라우팅이 필요한 항목만 조건 처리
                  onClick={() => {
                    if (item === '랭킹') onNavigate?.('ranking');
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {categoryOpen && (
        <div ref={dropdownRef} className="category-panel" style={{ top: `${headerHeight}px` }}>
          <div className="category-inner">
            {categoryLoading && <div className="category-loading">카테고리를 불러오는 중...</div>}
            {!categoryLoading && (
              <div className="category-grid">
                {(categoryError ? FALLBACK_TREE : categoryTree).map(category => (
                  <div key={category.title} className="category-column">
                    <button
                      type="button"
                      className="category-title"
                      onClick={() => {
                        setCategoryOpen(false);
                        onNavigate?.('category');
                      }}
                    >
                      {category.title}
                      <ChevronRight size={14} strokeWidth={2.4} />
                    </button>
                    <ul className="category-list">
                      {category.items.map(name => (
                        <li key={name}>
                          <button
                            type="button"
                            // 개별 카테고리는 모두 동일 페이지로 진입하므로 공통 처리
                            onClick={() => {
                              setCategoryOpen(false);
                              onNavigate?.('category');
                            }}
                          >
                            {name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <button type="button" className="category-close" onClick={() => setCategoryOpen(false)}>
              <X size={18} />
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
