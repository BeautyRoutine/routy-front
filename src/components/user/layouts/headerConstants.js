// 공통 API 루트: .env 없이 개발 시에도 동작하도록 기본값을 둔다.
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 헤더에서 참조하는 예시 엔드포인트 묶음.
// 실제 백엔드와 연결할 때는 문자열만 교체하면 된다.
export const ENDPOINTS = {
  // 카테고리 관련 (상단 네비, 드롭다운)
  topCategories: '/api/categories/top',
  categoryTree: '/api/categories/tree',

  // 검색 패널 관련
  searchRecent: '/api/search/recent',
  searchSimilarSkin: '/api/search/similar-skin',
  searchSuggestions: '/api/search/suggestions',

  // 인증/세션 관련 (예시용)
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  session: '/api/auth/session',

  // 사용자 리소스 관련 (예시용)
  notificationCount: '/api/users/me/notifications/count',
  cartCount: '/api/cart/count',
};

// API 실패 시에도 상단 네비가 비지 않도록 하는 기본 카테고리 값.
export const FALLBACK_TOP = ['랭킹', '멤버십/쿠폰', '이벤트', 'MyRouty'];

// 2단 카테고리 드롭다운에 사용되는 구조화된 목업 데이터.
export const FALLBACK_TREE = [
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

// 알림 패널을 테스트하기 위한 더미 알림 목록.
// type 필드는 UI에서 아이콘/컬러를 결정할 때 사용한다.
export const FALLBACK_NOTIFICATIONS = [
  {
    id: 'delivery',
    title: '배송 완료',
    message: '하이드레이팅 세럼이 배송 완료되었습니다.',
    timeAgo: '5분 전',
    type: 'delivery',
    unread: true,
  },
  {
    id: 'like',
    title: '좋아요 알림',
    message: '15명의 회원님이 리뷰를 좋아합니다.',
    timeAgo: '1시간 전',
    type: 'like',
    unread: true,
  },
  {
    id: 'comment',
    title: '새 댓글',
    message: '회원님의 리뷰에 댓글이 달렸습니다.',
    timeAgo: '2시간 전',
    type: 'comment',
    unread: false,
  },
  {
    id: 'promotion',
    title: '특별 할인',
    message: '좋아하는 제품이 20% 할인 중입니다!',
    timeAgo: '1일 전',
    type: 'promotion',
    unread: true,
  },
];

// 종합 배지 수를 계산해두면 헤더에서 바로 사용할 수 있다.
export const FALLBACK_COUNTS = {
  notifications: FALLBACK_NOTIFICATIONS.filter(item => item.unread).length,
  cart: 2,
};

// 검색 패널 UI를 즉시 확인할 수 있도록 더미 데이터 제공
export const FALLBACK_RECENT_SEARCHES = ['덤패치', '니들패치', '코팩', '장벽크림'];

export const FALLBACK_SIMILAR_SKIN = [
  { keyword: '라스트핑', trend: 'up' },
  { keyword: '블프특가', trend: 'up' },
  { keyword: '마스크팩', trend: 'steady' },
  { keyword: '앰플', trend: 'up' },
  { keyword: '퍼프', trend: 'down' },
  { keyword: '마스카라', trend: 'up' },
  { keyword: '토너패드', trend: 'down' },
  { keyword: '요철', trend: 'down' },
  { keyword: '립', trend: 'steady' },
  { keyword: '립밤', trend: 'steady' },
];
