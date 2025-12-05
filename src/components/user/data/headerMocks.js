// 헤더 및 전역 레이아웃에서 재사용하는 더미 데이터 모음.
// 실제 API 연동 전까지 UI를 안정적으로 보여주기 위한 목적이다.

export const DEMO_TOP_CATEGORIES = ['랭킹', '멤버십/쿠폰', '이벤트', 'MyRouty'];

export const DEMO_CATEGORY_TREE = [
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

export const DEMO_NOTIFICATIONS = [];

export const DEMO_COUNTS = {
  notifications: DEMO_NOTIFICATIONS.filter(item => item.unread).length,
  cart: 2,
};

export const DEMO_RECENT_SEARCHES = ['덤패치', '니들패치', '코팩', '장벽크림'];

export const DEMO_SIMILAR_SKIN = [
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

export const DEMO_RECENT_ITEMS = [
  {
    id: 'demo-1',
    title: '히알루론산 앰플 세럼',
    image: 'https://images.unsplash.com/photo-1586495578044-4413f21062fa?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'demo-2',
    title: '비타민 C 토너',
    image: 'https://images.unsplash.com/photo-1583241800696-c55fea4c4125?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'demo-3',
    title: '세라마이드 에센스',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=160&q=80',
  },
];
