import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/apiClient';
import moment from 'moment';
import 'moment/locale/ko';
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
import NotificationModal from './NotificationModal';
import logoImage from 'logo.svg';
import {
  ENDPOINTS,
  FALLBACK_TOP,
  FALLBACK_COUNTS,
  FALLBACK_RECENT_SEARCHES,
  FALLBACK_SIMILAR_SKIN,
} from './headerConstants';
import { CATEGORY_CODE } from './categoryCode';

// API 응답(Map<ID, {mainStr, sub: Map<ID, Name>}>)을 UI 포맷으로 변환
function transformCategoryData(data) {
  if (!data || typeof data !== 'object') return { top: [], tree: [] };

  // ID(키) 기준으로 정렬
  const sortedKeys = Object.keys(data).sort((a, b) => Number(a) - Number(b));

  const tree = sortedKeys.map(key => {
    const category = data[key];
    const title = category.mainStr;
    const subMap = category.sub || {};

    // 서브 카테고리도 ID 기준으로 정렬
    const subKeys = Object.keys(subMap).sort((a, b) => Number(a) - Number(b));
    const items = subKeys.map(subKey => subMap[subKey]);

    return { title, items };
  });

  const top = tree.map(t => t.title);

  return { top, tree };
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
  userId,
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
  const navigate = useNavigate();
  // ------------------------------
  // UI 상태(state) & DOM 참조(ref)
  // ------------------------------
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [topCategories, setTopCategories] = useState(FALLBACK_TOP);
  const [categoryTree, setCategoryTree] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [categoryError, setCategoryError] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(140);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // 알림 벨 드롭다운과 배지 숫자, 리스트 상태.
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [autoNotificationCount, setAutoNotificationCount] = useState(FALLBACK_COUNTS.notifications);
  const [autoCartCount, setAutoCartCount] = useState(FALLBACK_COUNTS.cart);
  const [notifications, setNotifications] = useState([]);
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
    if (!isLoggedIn) {
      setNotificationPanelOpen(false);
      setNotifications([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!notificationPanelOpen) return undefined;
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

      api
        .get(ENDPOINTS.searchSuggestions, {
          params: { keyword: trimmed },
          signal: controller.signal,
        })
        .then(response => {
          setSearchSuggestions(normalizeSearchSuggestions(response.data));
        })
        .catch(error => {
          if (error.name === 'CanceledError') return;
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
    () => () => {
      if (recentFetchController.current) recentFetchController.current.abort();
      if (similarFetchController.current) similarFetchController.current.abort();
      if (suggestionFetchController.current) suggestionFetchController.current.abort();
      if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);
    },
    [],
  );

  useEffect(() => {
    if (userMenuOpen) {
      setNotificationPanelOpen(false);
    }
  }, [userMenuOpen]);

  // 알림 패널 열릴 때 목록 조회
  useEffect(() => {
    if (!notificationPanelOpen || !isLoggedIn || !userId) return;

    api
      .get(`/api/users/${userId}/notifications`)
      .then(response => {
        const list = response.data?.data || [];
        const formattedList = list.map(item => ({
          id: item.notiId,
          title: item.title,
          message: item.message,
          type: item.type,
          // DB IS_READ='Y' -> API 'Y' (읽음). 따라서 'N'이어야 안 읽음.
          unread: (item.readYn || item.isRead || item.unread) === 'N',
          timeAgo: moment(item.createdAt).fromNow(),
          createdAt: item.createdAt,
        }));
        setNotifications(formattedList);
      })
      .catch(err => console.error('알림 목록 조회 실패:', err));
  }, [notificationPanelOpen, isLoggedIn, userId]);

  // 로그인 이후 알림/장바구니 카운트를 API에서 읽어온다
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setAutoNotificationCount(FALLBACK_COUNTS.notifications);
      setAutoCartCount(FALLBACK_COUNTS.cart);
      return undefined;
    }

    const aborters = [];

    if (typeof notificationCount !== 'number') {
      const controller = new AbortController();
      aborters.push(() => controller.abort());

      // /api/users/{userId}/notifications/count
      api
        .get(`/api/users/${userId}/notifications/count`, { signal: controller.signal })
        .then(response => {
          const result = response.data;
          // Spec: { resultCode: 200, data: { count: 2 } }
          const value = result?.data?.count ?? 0;
          setAutoNotificationCount(value);
        })
        .catch(error => {
          console.error('알림 수 불러오기 실패:', error);
          setAutoNotificationCount(0);
        });
    } else {
      setAutoNotificationCount(notificationCount);
    }

    if (typeof cartCount !== 'number') {
      const controller = new AbortController();
      aborters.push(() => controller.abort());

      // 장바구니는 보통 userId가 필요하거나 세션 기반일 수 있음.
      // 여기서는 userId를 사용하는 것으로 가정: /api/users/{userId}/cart/count
      // 만약 /api/cart/count가 세션 기반이라면 그대로 둬도 됨.
      // 하지만 일관성을 위해 userId를 사용하는 것이 좋음.
      // 기존 ENDPOINTS.cartCount가 '/api/cart/count' 였음.
      // 백엔드 스펙에 따라 다르지만, 일단 기존 유지하되 userId가 있으면 query param으로라도 보낼 수 있음.
      // 혹은 /api/users/{userId}/cart/count 로 변경.
      // 안전하게 기존 ENDPOINTS.cartCount를 사용하되, userId가 있으면 path를 변경하는 식으로.
      // 여기서는 /api/users/{userId}/cart/count 로 변경 시도.
      api
        .get(`/api/users/${userId}/cart/count`, { signal: controller.signal })
        .then(response => {
          // 응답 구조: { resultCode: 200, resultMsg: "SUCCESS", data: { count: 3 } }
          const result = response.data;
          let value = 0;

          if (result && result.data && typeof result.data.count === 'number') {
            value = result.data.count;
          } else if (typeof result === 'number') {
            value = result;
          } else {
            value = FALLBACK_COUNTS.cart;
          }
          setAutoCartCount(value);
        })
        .catch(error => {
          // 실패 시 기존 엔드포인트로 재시도 (혹시 세션 기반일 경우)
          api
            .get(ENDPOINTS.cartCount, { signal: controller.signal })
            .then(res => {
              const result = res.data;
              const value = typeof result === 'number' ? result : result?.count ?? FALLBACK_COUNTS.cart;
              setAutoCartCount(value);
            })
            .catch(() => {
              console.error('장바구니 수 불러오기 실패:', error);
              setAutoCartCount(FALLBACK_COUNTS.cart);
            });
        });
    } else {
      setAutoCartCount(cartCount);
    }

    return () => {
      aborters.forEach(abort => abort());
    };
  }, [isLoggedIn, userId, notificationCount, cartCount]);

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

    api
      .get(ENDPOINTS.categoryTree, { signal: controller.signal })
      .then(response => {
        // ApiResponse 구조 대응: response.data.data가 실제 데이터일 가능성 높음
        const rawData = response.data?.data || response.data;
        const { tree } = transformCategoryData(rawData);

        // topCategories는 정적 메뉴(랭킹, 이벤트 등)를 유지하고,
        // categoryTree만 API 데이터로 업데이트한다.
        setCategoryTree(tree);
      })
      .catch(error => {
        // 요청 취소된 경우는 무시 (컴포넌트 언마운트 또는 재렌더링 시)
        if (error.name === 'CanceledError' || error.message === 'canceled' || error.code === 'ERR_CANCELED') {
          return;
        }
        console.error('카테고리 불러오기 실패:', error);
        setCategoryError(error);
        // 에러 시에도 topCategories는 유지
        setCategoryTree([]);
      })
      .finally(() => setCategoryLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const abort = loadCategories();
    return () => abort && abort();
  }, [loadCategories]);

  /* markAllNotificationsRead removed - duplicate declaration */

  // ---------------------------------
  // 검색 패널 관련 헬퍼 및 핸들러
  // ---------------------------------
  const fetchRecentSearches = useCallback(() => {
    // userId가 없으면 검색 기록을 가져올 수 없음 (또는 로컬 스토리지 사용)
    if (!userId) return;

    if (recentFetchController.current) {
      recentFetchController.current.abort();
    }
    const controller = new AbortController();
    recentFetchController.current = controller;

    // /api/users/{userId}/search/history
    api
      .get(`/api/users/${userId}/search/history`, { signal: controller.signal })
      .then(response => {
        const normalized = normalizeRecentSearches(response.data);
        if (Array.isArray(normalized) && normalized.length) {
          setRecentSearches(normalized);
        }
      })
      .catch(error => {
        if (error.name === 'CanceledError') return;
        console.error('최근 검색어 불러오기 실패:', error);
      });
  }, [userId]);

  const fetchSimilarSkinSearches = useCallback(() => {
    if (!ENDPOINTS.searchSimilarSkin) return;
    if (similarFetchController.current) {
      similarFetchController.current.abort();
    }
    const controller = new AbortController();
    similarFetchController.current = controller;

    api
      .get(ENDPOINTS.searchSimilarSkin, { signal: controller.signal })
      .then(response => {
        const normalized = normalizeSimilarSkinSearches(response.data);
        if (Array.isArray(normalized) && normalized.length) {
          setSimilarSkinSearches(normalized);
        }
      })
      .catch(error => {
        if (error.name === 'CanceledError') return;
        console.error('비슷한 피부 검색어 불러오기 실패:', error);
        setSimilarSkinSearches(FALLBACK_SIMILAR_SKIN);
      });
  }, []);

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
    if (event.nativeEvent.isComposing) return; // IME 입력 중이면 무시

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

  // 알림 전체 읽음
  const markAllNotificationsRead = useCallback(async () => {
    if (!userId) return;

    // Optimistic update: UI 먼저 업데이트
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setAutoNotificationCount(0);

    try {
      await api.post(`/api/users/${userId}/notifications/read`);
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
    }
  }, [userId]);

  // 개별 알림 읽음
  const markNotificationRead = useCallback(
    async notiId => {
      if (!userId) return;

      // Optimistic update: UI 먼저 업데이트
      setNotifications(prev => prev.map(n => (n.id === notiId ? { ...n, unread: false } : n)));
      // useEffect가 notifications 변경을 감지하여 배지 카운트를 업데이트하므로 수동 업데이트 불필요

      try {
        await api.post(`/api/users/${userId}/notifications/${notiId}/read`);
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
      }
    },
    [userId],
  );

  // 개별 알림 삭제
  const deleteNotification = useCallback(
    async (e, notiId) => {
      e.stopPropagation();
      if (!userId) return;

      // Optimistic update: UI 먼저 업데이트
      setNotifications(prev => prev.filter(n => n.id !== notiId));

      try {
        await api.delete(`/api/users/${userId}/notifications/${notiId}`);
      } catch (error) {
        console.error('알림 삭제 실패:', error);
      }
    },
    [userId],
  );

  // 전체 알림 삭제
  const deleteAllNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      await api.delete(`/api/users/${userId}/notifications`);
      setNotifications([]);
      setAutoNotificationCount(0);
    } catch (error) {
      console.error('전체 알림 삭제 실패:', error);
    }
  }, [userId]);

  const preventMouseDownBlur = event => {
    event.preventDefault();
  };

  const hasRecentSearches = recentSearches.length > 0;
  const hasSimilarSearches = similarSkinSearches.length > 0;
  const hasSuggestions = searchQuery.trim().length > 0 && searchSuggestions.length > 0;

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
            <button type="button" className="logo-button" onClick={() => onNavigate?.('home')} aria-label="홈으로 이동">
              <img src={logoImage} alt="Routy" className="logo-mark" width={52} height={52} />
              <span className="logo-text">Routy</span>
            </button>

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
                <div className="user-actions">
                  <div className="icon-button-wrapper">
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
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="button" onClick={markAllNotificationsRead}>
                              모두 읽음
                            </button>
                            <button type="button" onClick={deleteAllNotifications}>
                              전체 삭제
                            </button>
                          </div>
                        </div>
                        <ul className="notification-panel__list">
                          {notifications.length > 0 ? (
                            notifications.map(item => {
                              const meta = notificationTypeMeta(item.type);
                              return (
                                <li
                                  key={item.id}
                                  className={`notification-item ${item.unread ? 'unread' : ''}`}
                                  onClick={() => markNotificationRead(item.id)}
                                  style={{ cursor: 'pointer' }}
                                >
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
                                  <div className="notification-item__actions">
                                    {item.unread && <span className="notification-item__badge" aria-hidden="true" />}
                                    <button
                                      type="button"
                                      onClick={e => deleteNotification(e, item.id)}
                                      className="notification-item__delete"
                                      aria-label="삭제"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </li>
                              );
                            })
                          ) : (
                            <li
                              className="notification-item"
                              style={{ justifyContent: 'center', padding: '20px', color: '#999' }}
                            >
                              알림이 없습니다.
                            </li>
                          )}
                        </ul>
                        <button
                          type="button"
                          className="notification-panel__footer"
                          onClick={() => {
                            setNotificationPanelOpen(false);
                            setNotificationModalOpen(true);
                          }}
                        >
                          알림 전체보기
                        </button>
                      </div>
                    )}
                  </div>
                  <NotificationModal
                    isOpen={notificationModalOpen}
                    onClose={() => setNotificationModalOpen(false)}
                    notifications={notifications}
                    onMarkRead={markNotificationRead}
                    onMarkAllRead={markAllNotificationsRead}
                    onDelete={deleteNotification}
                    onDeleteAll={deleteAllNotifications}
                  />
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
                            navigate('/mypage', { state: { view: 'defult' } });
                          }}
                        >
                          마이페이지
                        </button>
                        <button
                          type="button"
                          className="user-menu-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/mypage', { state: { view: 'order-history' } });
                          }}
                        >
                          주문 및 배송 조회
                        </button>
                        <button
                          type="button"
                          className="user-menu-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/mypage', { state: { view: 'reviews' } });
                          }}
                        >
                          리뷰 관리
                        </button>
                        {/* <button
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
                        </button> */}
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
                <>
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                      if (onLoginClick) {
                        onLoginClick();
                        return;
                      }
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

            <div className="nav-scroll">
              {topCategories.map(item => (
                <button
                  type="button"
                  key={item}
                  className="nav-item"
                  onClick={() => {
                    const routes = {
                      랭킹: 'ranking',
                      이벤트: 'event',
                      '멤버십/쿠폰': 'membership',
                      오특: 'oteuk',
                      '헬스+': 'health',
                      'LUXE EDIT': 'luxe',
                      기획전: 'exhibition',
                      세일: 'sale',
                      기프트카드: 'giftcard',
                      MyRouty: 'myrouty',
                    };
                    if (routes[item]) {
                      onNavigate?.(routes[item]);
                    }
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
                {categoryTree.map(category => (
                  <div key={category.title} className="category-column">
                    <button
                      type="button"
                      className="category-title"
                      onClick={() => {
                        setCategoryOpen(false);
                        onNavigate?.(`/products?maincate=${CATEGORY_CODE[category.title]}`);
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
                            onClick={() => {
                              setCategoryOpen(false);
                              onNavigate?.(`/products?subcate=${CATEGORY_CODE[name]}`);
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
