export const MYPAGE_ENDPOINTS = {
  profile: '/member/info',
  orders: '/member/orders',
  favoriteIngredients: '/member/ingredients/favorites',
};

export const FALLBACK_USER_PROFILE = {
  name: '',
  nickname: '',
  tier: 0,
  points: 0,
  reviews: 0,
  tags: [],
  skinConcerns: [],
};

export const FALLBACK_ORDER_STEPS = {
  주문접수: 0,
  결제완료: 0,
  배송준비중: 0,
  배송중: 0,
  배송완료: 0,
};

export const FALLBACK_INGREDIENT_GROUPS = {
  focus: [],
  avoid: [],
};

export const FALLBACK_INGREDIENT_BLOCK_META = [
  { key: 'focus', label: '관심 성분' },
  { key: 'avoid', label: '피해야 할 성분' },
];
