// 더미/폴백 데이터 import
// 경로 정리: 레이아웃에서 사용하는 목업 데이터를 data 폴더로 분리했다.
export {
  DEMO_TOP_CATEGORIES as FALLBACK_TOP,
  DEMO_CATEGORY_TREE as FALLBACK_TREE,
  DEMO_NOTIFICATIONS as FALLBACK_NOTIFICATIONS,
  DEMO_COUNTS as FALLBACK_COUNTS,
  DEMO_RECENT_SEARCHES as FALLBACK_RECENT_SEARCHES,
  DEMO_SIMILAR_SKIN as FALLBACK_SIMILAR_SKIN,
  DEMO_RECENT_ITEMS,
} from '../data/headerMocks';

// 공통 API 루트: .env 없이 개발 시에도 동작하도록 기본값을 둔다.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// 헤더에서 참조하는 예시 엔드포인트 묶음.
// 실제 백엔드와 연결할 때는 문자열만 교체하면 된다.
export const ENDPOINTS = {
  // 카테고리 관련 (상단 네비, 드롭다운)
  topCategories: '/api/categories/main', // 메인 카테고리 (통합)
  categoryTree: '/api/categories/main', // 메인 카테고리 (통합)

  // 검색 패널 관련
  // userId가 필요한 경우 컴포넌트에서 replace 처리하거나 동적으로 생성해야 함.
  // 여기서는 'me'를 기본으로 사용
  searchRecent: '/api/users/me/search/history',
  // 피부 타입별 추천 검색어 (예시: 건성/민감성)
  searchSimilarSkin: '/api/search/recommendations/skin-type/DRY_SENSITIVE',
  searchSuggestions: '/api/search/suggestions', // ?keyword={val} 형태로 사용

  // 인증/세션 관련 (예시용)
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  session: '/api/auth/session',

  // 사용자 리소스 관련 (예시용)
  notificationCount: '/api/users/me/notifications/count',
  cartCount: '/api/cart/count',
  recentProducts: '/api/users/me/recent-products',
};
