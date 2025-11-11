import {
  DEMO_USER_PROFILE,
  DEMO_ORDER_STEPS,
  DEMO_INGREDIENT_GROUPS,
  DEMO_INGREDIENT_BLOCK_META,
} from './mypageMocks';

export const MYPAGE_ENDPOINTS = {
  profile: '/member/info',
  orders: '/member/orders',
  favoriteIngredients: '/member/ingredients/favorites',
};

export {
  DEMO_USER_PROFILE as FALLBACK_USER_PROFILE,
  DEMO_ORDER_STEPS as FALLBACK_ORDER_STEPS,
  DEMO_INGREDIENT_GROUPS as FALLBACK_INGREDIENT_GROUPS,
  DEMO_INGREDIENT_BLOCK_META as FALLBACK_INGREDIENT_BLOCK_META,
};
