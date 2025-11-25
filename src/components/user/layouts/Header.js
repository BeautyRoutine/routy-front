import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  ChevronRight,
  X,
  Search,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Bell,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';
import './Header.css';
import logoImage from 'logo.svg';
import {
  API_BASE_URL,
  ENDPOINTS,
  FALLBACK_TOP,
  FALLBACK_TREE,
  FALLBACK_COUNTS,
  FALLBACK_NOTIFICATIONS,
  FALLBACK_RECENT_SEARCHES,
  FALLBACK_SIMILAR_SKIN,
} from './headerConstants';

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

// 최상위 카테고리 응답을 문자열 배열로 정규화
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

// 중첩 카테고리를 { title, items } 구조의 배열로 정규화
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

// 검색 패널이 다양한 응답 포맷을 받아도 동작하도록 정규화 함수 묶음
function normalizeRecentSearches(data) {
  if (!Array.isArray(data)) return FALLBACK_RECENT_SEARCHES;
  const result = data
    .map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') return item.keyword || item.term || item.value;
      return null;
    })
    .filter(Boolean);
  return result.length ? result : FALLBACK_RECENT_SEARCHES;
}

function normalizeSimilarSkinSearches(data) {
  if (!Array.isArray(data)) return FALLBACK_SIMILAR_SKIN;
  const result = data
    .map(item => {
      if (!item) return null;
      const keyword =
        typeof item === 'string' ? item : typeof item === 'object' ? item.keyword || item.term || item.value : null;
      if (!keyword) return null;
      const trend = typeof item === 'object' && typeof item.trend === 'string' ? item.trend.toLowerCase() : undefined;
      return { keyword, trend: trend === 'up' || trend === 'down' ? trend : 'steady' };
    })
    .filter(Boolean);
  return result.length ? result : FALLBACK_SIMILAR_SKIN;
}

function normalizeSearchSuggestions(data) {
  if (!Array.isArray(data)) return [];
  return data
    .map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') return item.keyword || item.term || item.value;
      return null;
    })
    .filter(Boolean);
}

const RECENT_STORAGE_KEY = 'routy:recent-searches';
const SAVE_PREF_KEY = 'routy:search-save-enabled';

/**
 * 사용자 레이아웃 공통 헤더 컴포넌트.
 * - 로그인 상태 / 알림 / 드롭다운 카테고리 등을 하나의 컴포넌트에서 관리한다.
 * - Spring Boot 백엔드와의 연계를 가정하여 작성되어 있으며, props 콜백으로 라우팅을 제어한다.
 */
export function Header({
  isLoggedIn,
  onLoginChange,
  onNavigate,
  onLoginClick,
  onSignupClick,
  onMyPageClick,
  onLogoutClick,
  onNotificationsClick,
  onCartClick,
  onOrdersClick,
  onReviewManageClick,
  onSupportClick,
  notificationCount,
  cartCount,
}) {
  // 로그인 관련 prop 설명
  // isLoggedIn      : Spring Boot 인증 결과(세션/토큰 검사)를 부모가 내려줌
  // onLoginChange   : 로그아웃 같은 상태 변경 시 부모가 다시 Spring Boot와 동기화할 수 있게 호출
  // onLoginClick    : Spring Boot 로그인 API 연동을 위한 다이얼로그/폼 오픈 콜백
  // onSignupClick   : Spring Boot 회원가입 API에 연결될 다이얼로그 오픈 콜백
  // onMyPageClick   : 필요 시 Spring Boot에서 사용자 정보를 불러오는 페이지로 이동시키는 콜백
  // onLogoutClick   : Spring Boot 로그아웃 API 호출 후 정리하는 커스텀 콜백

  // ------------------------------
  // UI 상태(state) & DOM 참조(ref)
  // ------------------------------
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [topCategories, setTopCategories] = useState(FALLBACK_TOP);
  const [categoryTree, setCategoryTree] = useState(FALLBACK_TREE);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(140);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // 알림 벨 드롭다운과 배지 숫자, 리스트 상태.
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [autoNotificationCount, setAutoNotificationCount] = useState(FALLBACK_COUNTS.notifications);
  const [autoCartCount, setAutoCartCount] = useState(FALLBACK_COUNTS.cart);
  const [notifications, setNotifications] = useState(FALLBACK_NOTIFICATIONS);
  // 검색 패널 캐시 및 열림 제어
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(FALLBACK_RECENT_SEARCHES);
  const [similarSkinSearches, setSimilarSkinSearches] = useState(FALLBACK_SIMILAR_SKIN);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchSavingEnabled, setSearchSavingEnabled] = useState(true);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const categoryButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const userMenuButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const recentFetchController = useRef(null);
  const similarFetchController = useRef(null);
  const suggestionFetchController = useRef(null);
  const suggestionDebounceRef = useRef(null);
  const recentFetchedRef = useRef(false);
  const similarFetchedRef = useRef(false);

  // ------------------------------
  // 라이프사이클 관련 이펙트
  // ------------------------------

  // 스크롤 위치에 따라 헤더 그림자 토글
  useEffect(() => {
    // 검색창이 열려 있는 동안에만 자동완성을 요청 (디바운스 포함)
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

  useEffect(() => {
    if (!userMenuOpen) return undefined;
    const handleClickOutside = event => {
      const withinMenu = userMenuRef.current && userMenuRef.current.contains(event.target);
      const onToggle = userMenuButtonRef.current && userMenuButtonRef.current.contains(event.target);
      if (withinMenu || onToggle) return;
      setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!isLoggedIn) setUserMenuOpen(false);
  }, [isLoggedIn]);

  useEffect(() => {
    // 로그인 해제 시 더미 알림으로 리셋하고 패널을 닫는다.
    if (!isLoggedIn) {
      setNotificationPanelOpen(false);
      setNotifications(FALLBACK_NOTIFICATIONS);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!notificationPanelOpen) return undefined;
    // 패널이 열린 동안 외부 클릭을 감지해 닫아준다.
    const handleClickOutside = event => {
      const insidePanel = notificationPanelRef.current && notificationPanelRef.current.contains(event.target);
      const onToggle = notificationButtonRef.current && notificationButtonRef.current.contains(event.target);
      if (insidePanel || onToggle) return;
      setNotificationPanelOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationPanelOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const handleClickOutside = event => {
      if (searchWrapperRef.current && searchWrapperRef.current.contains(event.target)) return;
      setSearchOpen(false);
      setSearchSuggestions([]);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedPref = window.localStorage.getItem(SAVE_PREF_KEY);
      if (savedPref === 'false') {
        setSearchSavingEnabled(false);
      }
      const storedRecent = window.localStorage.getItem(RECENT_STORAGE_KEY);
      if (storedRecent) {
        const parsed = JSON.parse(storedRecent);
        const normalized = normalizeRecentSearches(Array.isArray(parsed) ? parsed : []);
        if (normalized.length) {
          setRecentSearches(normalized);
        }
      }
    } catch (error) {
      console.error('검색 패널 로컬 데이터 불러오기 실패:', error);
    }
  }, []);

  useEffect(() => {
    if (!searchSavingEnabled) return;
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentSearches));
    } catch (error) {
      console.error('최근 검색어 저장 실패:', error);
    }
  }, [recentSearches, searchSavingEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(SAVE_PREF_KEY, searchSavingEnabled ? 'true' : 'false');
      if (!searchSavingEnabled) {
        window.localStorage.removeItem(RECENT_STORAGE_KEY);
      }
    } catch (error) {
      console.error('검색어 저장 설정 동기화 실패:', error);
    }
  }, [searchSavingEnabled]);

  useEffect(() => {
    if (suggestionDebounceRef.current) {
      clearTimeout(suggestionDebounceRef.current);
      suggestionDebounceRef.current = null;
    }
    if (!searchOpen) {
      setSearchSuggestions([]);
      if (suggestionFetchController.current) {
        suggestionFetchController.current.abort();
        suggestionFetchController.current = null;
      }
      return undefined;
    }
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchSuggestions([]);
      if (suggestionFetchController.current) {
        suggestionFetchController.current.abort();
        suggestionFetchController.current = null;
      }
      return undefined;
    }

    suggestionDebounceRef.current = setTimeout(() => {
      if (suggestionFetchController.current) {
        suggestionFetchController.current.abort();
      }
      if (!ENDPOINTS.searchSuggestions) {
        setSearchSuggestions([]);
        return;
      }
      const controller = new AbortController();
      suggestionFetchController.current = controller;
      fetchJson(`${ENDPOINTS.searchSuggestions}?q=${encodeURIComponent(trimmed)}`, controller.signal)
        .then(result => {
          setSearchSuggestions(normalizeSearchSuggestions(result));
        })
        .catch(error => {
          if (error.name === 'AbortError') return;
          console.error('검색 자동완성 불러오기 실패:', error);
          setSearchSuggestions([]);
        });
    }, 250);

    return () => {
      if (suggestionDebounceRef.current) {
        clearTimeout(suggestionDebounceRef.current);
        suggestionDebounceRef.current = null;
      }
    };
  }, [searchQuery, searchOpen]);

  useEffect(
    // 컴포넌트 언마운트 시 진행 중인 네트워크 요청/타이머 정리
    () => () => {
      if (recentFetchController.current) recentFetchController.current.abort();
      if (similarFetchController.current) similarFetchController.current.abort();
      if (suggestionFetchController.current) suggestionFetchController.current.abort();
      if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);
    },
    [],
  );

  useEffect(() => {
    // 메뉴 버튼과 알림 패널이 겹치지 않도록 상호 배타 처리.
    if (userMenuOpen) {
      setNotificationPanelOpen(false);
    }
  }, [userMenuOpen]);

  // 로그인 이후 알림/장바구니 카운트를 API에서 읽어온다 (상위에서 내려주지 않은 경우에 한해)
  useEffect(() => {
    if (!isLoggedIn) {
      setAutoNotificationCount(FALLBACK_COUNTS.notifications);
      setAutoCartCount(FALLBACK_COUNTS.cart);
      return undefined;
    }

    const aborters = [];

    if (typeof notificationCount !== 'number') {
      const controller = new AbortController();
      aborters.push(() => controller.abort());
      fetchJson(ENDPOINTS.notificationCount, controller.signal)
        .then(result => {
          const value =
            typeof result === 'number'
              ? result
              : result && typeof result === 'object'
              ? result.count ?? result.total ?? result.value ?? FALLBACK_COUNTS.notifications
              : FALLBACK_COUNTS.notifications;
          setAutoNotificationCount(value);
        })
        .catch(error => {
          console.error('알림 수 불러오기 실패:', error);
          setAutoNotificationCount(FALLBACK_COUNTS.notifications);
        });
    } else {
      setAutoNotificationCount(notificationCount);
    }

    if (typeof cartCount !== 'number') {
      const controller = new AbortController();
      aborters.push(() => controller.abort());
      fetchJson(ENDPOINTS.cartCount, controller.signal)
        .then(result => {
          const value =
            typeof result === 'number'
              ? result
              : result && typeof result === 'object'
              ? result.count ?? result.total ?? result.value ?? FALLBACK_COUNTS.cart
              : FALLBACK_COUNTS.cart;
          setAutoCartCount(value);
        })
        .catch(error => {
          console.error('장바구니 수 불러오기 실패:', error);
          setAutoCartCount(FALLBACK_COUNTS.cart);
        });
    } else {
      setAutoCartCount(cartCount);
    }

    return () => {
      aborters.forEach(abort => abort());
    };
  }, [isLoggedIn, notificationCount, cartCount]);

  useEffect(() => {
    if (typeof notificationCount === 'number') return;
    const unread = notifications.filter(item => item.unread).length;
    setAutoNotificationCount(unread);
  }, [notifications, notificationCount]);

  const effectiveNotificationCount = typeof notificationCount === 'number' ? notificationCount : autoNotificationCount;
  const effectiveCartCount = typeof cartCount === 'number' ? cartCount : autoCartCount;

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
  // useEffect(() => {
  //   const abort = loadCategories();
  //   return () => abort && abort();
  // }, [loadCategories]);

  // UI 버튼에서 호출: 알림 모두 읽음 처리 및 배지 초기화.
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, unread: false })));
    if (typeof notificationCount !== 'number') {
      setAutoNotificationCount(0);
    }
  };

  // ---------------------------------
  // 검색 패널 관련 헬퍼 및 핸들러
  // ---------------------------------
  // 백엔드가 지원하면 최근 검색어/유사 피부 추천 목록을 API로 갱신
  const fetchRecentSearches = useCallback(() => {
    if (!ENDPOINTS.searchRecent) return;
    if (recentFetchController.current) {
      recentFetchController.current.abort();
    }
    const controller = new AbortController();
    recentFetchController.current = controller;
    fetchJson(ENDPOINTS.searchRecent, controller.signal)
      .then(result => {
        const normalized = normalizeRecentSearches(result);
        if (Array.isArray(normalized) && normalized.length) {
          setRecentSearches(normalized);
        }
      })
      .catch(error => {
        if (error.name === 'AbortError') return;
        console.error('최근 검색어 불러오기 실패:', error);
      });
  }, []);

  const fetchSimilarSkinSearches = useCallback(() => {
    if (!ENDPOINTS.searchSimilarSkin) return;
    if (similarFetchController.current) {
      similarFetchController.current.abort();
    }
    const controller = new AbortController();
    similarFetchController.current = controller;
    fetchJson(ENDPOINTS.searchSimilarSkin, controller.signal)
      .then(result => {
        const normalized = normalizeSimilarSkinSearches(result);
        if (Array.isArray(normalized) && normalized.length) {
          setSimilarSkinSearches(normalized);
        }
      })
      .catch(error => {
        if (error.name === 'AbortError') return;
        console.error('비슷한 피부 검색어 불러오기 실패:', error);
        setSimilarSkinSearches(FALLBACK_SIMILAR_SKIN);
      });
  }, []);

  // 사용자가 검색할 때마다 중복을 제거하고 최신순으로 갱신
  const addRecentSearch = useCallback(
    keyword => {
      if (!keyword || !searchSavingEnabled) return;
      setRecentSearches(prev => {
        const normalized = keyword.trim();
        if (!normalized) return prev;
        const filtered = prev.filter(item => item !== normalized);
        return [normalized, ...filtered].slice(0, 10);
      });
    },
    [searchSavingEnabled],
  );

  const handleSearchSubmit = useCallback(
    keyword => {
      const value = (typeof keyword === 'string' ? keyword : searchQuery).trim();
      if (!value) return;
      if (searchSavingEnabled) {
        addRecentSearch(value);
      }
      setSearchQuery(value);
      setSearchOpen(false);
      setSearchSuggestions([]);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
      onNavigate?.('search', value);
    },
    [addRecentSearch, onNavigate, searchQuery, searchSavingEnabled],
  );

  const handleSearchFocus = () => {
    // 포커스 시 최초 한 번만 서버에서 패널 데이터를 당겨옴
    setSearchOpen(true);
    if (!recentFetchedRef.current) {
      recentFetchedRef.current = true;
      fetchRecentSearches();
    }
    if (!similarFetchedRef.current) {
      similarFetchedRef.current = true;
      fetchSimilarSkinSearches();
    }
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
    if (!searchOpen) setSearchOpen(true);
  };

  const handleSearchKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setSearchOpen(false);
      setSearchSuggestions([]);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  const handleKeywordPick = keyword => {
    handleSearchSubmit(keyword);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(RECENT_STORAGE_KEY);
      } catch (error) {
        console.error('최근 검색어 삭제 실패:', error);
      }
    }
  };

  const handleToggleSaveRecent = () => {
    setSearchSavingEnabled(prev => !prev);
  };

  const preventMouseDownBlur = event => {
    // 검색 패널 안에서 클릭해도 인풋 포커스가 유지되도록 기본 동작 취소
    event.preventDefault();
  };

  const hasRecentSearches = recentSearches.length > 0;
  const hasSimilarSearches = similarSkinSearches.length > 0;
  const hasSuggestions = searchQuery.trim().length > 0 && searchSuggestions.length > 0;

  // 알림 유형별 라벨링을 한 곳에서 관리.
  const notificationTypeMeta = type => {
    switch (type) {
      case 'delivery':
        return { icon: '📦', background: 'linear-gradient(135deg, #93c5fd, #60a5fa)' };
      case 'like':
        return { icon: '❤️', background: 'linear-gradient(135deg, #fca5a5, #f87171)' };
      case 'comment':
        return { icon: '💬', background: 'linear-gradient(135deg, #86efac, #4ade80)' };
      case 'promotion':
        return { icon: '🎁', background: 'linear-gradient(135deg, #c4b5fd, #a855f7)' };
      default:
        return { icon: '🔔', background: 'linear-gradient(135deg, #d1d5db, #9ca3af)' };
    }
  };

  return (
    <>
      <header ref={headerRef} className={`routy-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <div className="header-top">
            {/* 로고와 홈 이동 버튼 */}
            <button type="button" className="logo-button" onClick={() => onNavigate?.('home')} aria-label="홈으로 이동">
              <img src={logoImage} alt="Routy" className="logo-mark" width={52} height={52} />
              <span className="logo-text">Routy</span>
            </button>

            {/* 검색 입력 영역: 최근/추천/연관 검색어 패널 포함 */}
            <div ref={searchWrapperRef} className={`search-wrapper ${searchOpen ? 'open' : ''}`}>
              <Search className="search-icon" size={18} strokeWidth={2.4} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={handleSearchFocus}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="제품 검색..."
                className="search-input"
                aria-label="제품 검색"
              />
              {searchOpen && (
                <div className="search-panel" role="listbox" aria-label="검색 추천" onMouseDown={preventMouseDownBlur}>
                  {/* 최근 검색어 목록 */}
                  <div className="search-panel__section search-panel__section--recent">
                    <div className="search-panel__row">
                      <span className="search-panel__title">최근 검색어</span>
                      <div className="search-panel__actions">
                        <button type="button" onClick={handleClearRecent} disabled={!hasRecentSearches}>
                          전체 삭제
                        </button>
                        <button type="button" onClick={handleToggleSaveRecent}>
                          {searchSavingEnabled ? '검색어 저장 끄기' : '검색어 저장 켜기'}
                        </button>
                      </div>
                    </div>
                    <div className="search-panel__chips">
                      {hasRecentSearches ? (
                        recentSearches.map(keyword => (
                          <button
                            type="button"
                            key={keyword}
                            className="search-chip"
                            onMouseDown={preventMouseDownBlur}
                            onClick={() => handleKeywordPick(keyword)}
                          >
                            {keyword}
                          </button>
                        ))
                      ) : (
                        <span className="search-panel__empty">최근 검색어가 없습니다.</span>
                      )}
                    </div>
                  </div>

                  {/* 실시간 입력으로 생성되는 연관 검색어 */}
                  {hasSuggestions && (
                    <>
                      <div className="search-panel__divider" />
                      <div className="search-panel__section search-panel__section--suggestions">
                        <div className="search-panel__subtitle">연관 검색어</div>
                        <ul className="search-panel__suggestions">
                          {searchSuggestions.map(item => (
                            <li key={item}>
                              <button
                                type="button"
                                onMouseDown={preventMouseDownBlur}
                                onClick={() => handleKeywordPick(item)}
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {/* 유사 피부 고객 추천 검색어 랭킹 */}
                  {hasSimilarSearches && (
                    <>
                      <div className="search-panel__divider" />
                      <div className="search-panel__section search-panel__section--similar">
                        <div className="search-panel__subtitle">피부 타입 유사 고객들이 가장 많이 본 제품 TOP</div>
                        <ol className="search-panel__ranking">
                          {similarSkinSearches.map((item, index) => (
                            <li key={item.keyword}>
                              <span className="search-panel__rank">{index + 1}</span>
                              <button
                                type="button"
                                onMouseDown={preventMouseDownBlur}
                                onClick={() => handleKeywordPick(item.keyword)}
                              >
                                {item.keyword}
                              </button>
                              {item.trend && (
                                <span
                                  className={`search-panel__trend search-panel__trend--${item.trend}`}
                                  aria-hidden="true"
                                >
                                  {item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '–'}
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="auth-area">
              {isLoggedIn ? (
                // ------------------------------
                // 로그인 상태: 알림/장바구니 아이콘 + 사용자 메뉴
                // ------------------------------
                <div className="user-actions">
                  <div className="icon-button-wrapper">
                    {/* 알림 벨 + 드롭다운 */}
                    <button
                      type="button"
                      ref={notificationButtonRef}
                      className="icon-button"
                      aria-label="알림 확인"
                      onClick={() => {
                        if (onNotificationsClick) {
                          onNotificationsClick();
                        }
                        setNotificationPanelOpen(prev => !prev);
                      }}
                    >
                      <Bell size={20} />
                      {effectiveNotificationCount > 0 && (
                        <span className="icon-badge icon-badge--alert">
                          {effectiveNotificationCount > 99 ? '99+' : effectiveNotificationCount}
                        </span>
                      )}
                    </button>
                    {notificationPanelOpen && (
                      <div ref={notificationPanelRef} className="notification-panel">
                        <div className="notification-panel__header">
                          <span>알림</span>
                          <button type="button" onClick={markAllNotificationsRead}>
                            모두 읽음
                          </button>
                        </div>
                        <ul className="notification-panel__list">
                          {notifications.map(item => {
                            const meta = notificationTypeMeta(item.type);
                            return (
                              <li key={item.id} className={`notification-item ${item.unread ? 'unread' : ''}`}>
                                <div
                                  className="notification-item__icon"
                                  style={{ background: meta.background }}
                                  aria-hidden="true"
                                >
                                  {meta.icon}
                                </div>
                                <div className="notification-item__content">
                                  <div className="notification-item__title">{item.title}</div>
                                  <div className="notification-item__message">{item.message}</div>
                                  <div className="notification-item__time">{item.timeAgo}</div>
                                </div>
                                {item.unread && <span className="notification-item__badge" aria-hidden="true" />}
                              </li>
                            );
                          })}
                        </ul>
                        <button
                          type="button"
                          className="notification-panel__footer"
                          onClick={() => {
                            setNotificationPanelOpen(false);
                            onNavigate?.('notifications');
                          }}
                        >
                          알림 전체보기
                        </button>
                      </div>
                    )}
                  </div>
                  {/* 장바구니 바로가기 */}
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="장바구니 이동"
                    onClick={() => {
                      if (onCartClick) {
                        onCartClick();
                        return;
                      }
                      onNavigate?.('cart');
                    }}
                  >
                    <ShoppingCart size={20} />
                    {effectiveCartCount > 0 && (
                      <span className="icon-badge icon-badge--cart">
                        {effectiveCartCount > 99 ? '99+' : effectiveCartCount}
                      </span>
                    )}
                  </button>
                  <div className="user-menu-wrapper" ref={userMenuRef}>
                    {/* 사용자 메뉴 토글 */}
                    <button
                      type="button"
                      ref={userMenuButtonRef}
                      className={`user-menu-button ${userMenuOpen ? 'open' : ''}`}
                      aria-haspopup="true"
                      aria-expanded={userMenuOpen}
                      onClick={() => setUserMenuOpen(prev => !prev)}
                    >
                      <User size={20} />
                      <ChevronDown size={16} className="user-menu-chevron" />
                    </button>
                    {userMenuOpen && (
                      // 사용자 드롭다운 메뉴
                      <div className="user-menu-dropdown">
                        <div className="user-menu-section-title">내 계정</div>
                        <button
                          type="button"
                          className="user-menu-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (onMyPageClick) {
                              onMyPageClick();
                              return;
                            }
                            onNavigate?.('mypage');
                          }}
                        >
                          마이페이지
                        </button>
                        <button
                          type="button"
                          className="user-menu-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (onOrdersClick) {
                              onOrdersClick();
                              return;
                            }
                            onNavigate?.('orders');
                          }}
                        >
                          주문 및 배송 조회
                        </button>
                        <button
                          type="button"
                          className="user-menu-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (onReviewManageClick) {
                              onReviewManageClick();
                              return;
                            }
                            onNavigate?.('reviews');
                          }}
                        >
                          리뷰 관리
                        </button>
                        <button
                          type="button"
                          className="user-menu-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (onSupportClick) {
                              onSupportClick();
                              return;
                            }
                            onNavigate?.('support');
                          }}
                        >
                          고객센터
                        </button>
                        <div className="user-menu-divider" />
                        <button
                          type="button"
                          className="user-menu-item user-menu-item--logout"
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (onLogoutClick) {
                              onLogoutClick();
                              return;
                            }
                            onLoginChange?.(false);
                            onNavigate?.('home');
                          }}
                        >
                          <LogOut size={16} />
                          로그아웃
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // ------------------------------
                // 비로그인 상태: 로그인 / 회원가입 CTA
                // ------------------------------
                <>
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                      // 추후 실제 로그인 다이얼로그를 연결할 수 있도록 콜백 우선 호출
                      if (onLoginClick) {
                        onLoginClick();
                        return;
                      }
                      // 임시 로그인 로직: 버튼만 눌러도 로그인 상태 전환 (알림 영역 테스트용)
                      onLoginChange?.(true);
                    }}
                  >
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

            {/* 상단 네비게이션: 인기 카테고리 바로가기 */}
            <div className="nav-scroll">
              {(categoryError ? FALLBACK_TOP : topCategories).map(item => (
                <button
                  type="button"
                  key={item}
                  className="nav-item"
                  // 상단 네비에서 별도 라우팅이 필요한 항목만 조건 처리
                  onClick={() => {
                    if (item === '랭킹') onNavigate?.('ranking');
                    // if (item == '마이루틴') onNavigate?.('myrouty'); // 추후 구현
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
        // 카테고리 드롭다운 패널
        <div ref={dropdownRef} className="category-panel" style={{ top: `${headerHeight}px` }}>
          <div className="category-inner">
            {categoryLoading && <div className="category-loading">카테고리를 불러오는 중...</div>}
            {!categoryLoading && (
              // 카테고리 2단 구조 (대분류 + 소분류)
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

export { ENDPOINTS } from './headerConstants';
