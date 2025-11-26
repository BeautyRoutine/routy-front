import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiClient';
import {
  FALLBACK_USER_PROFILE,
  FALLBACK_ORDER_STEPS,
  FALLBACK_INGREDIENT_GROUPS,
} from '../../components/user/data/mypageConstants';

// API 엔드포인트 생성 함수 (RESTful Path Variable 지원)
const getEndpoints = (userId = 'me') => ({
  profile: `/api/users/${userId}/profile`,
  orders: `/api/users/${userId}/orders/status-summary`,
  ingredients: `/api/users/${userId}/ingredients`,
  password: `/api/users/${userId}/password`,
});

/**
 * Async Thunk: 마이페이지 데이터 전체 로드
 *
 * 사용자 프로필, 주문 진행 상황, 선호 성분 등 마이페이지에 필요한 모든 데이터를 가져옵니다.
 * @param {string} userId - 조회할 사용자 ID (기본값: 'me')
 */
export const fetchMyPageData = createAsyncThunk('user/fetchMyPageData', async (userId = 'me', { rejectWithValue }) => {
  const endpoints = getEndpoints(userId);
  try {
    // API 호출 시도
    const [profileRes, ordersRes, ingredientsRes] = await Promise.all([
      api.get(endpoints.profile).catch(() => ({ data: FALLBACK_USER_PROFILE })),
      api.get(endpoints.orders).catch(() => ({ data: FALLBACK_ORDER_STEPS })),
      api.get(endpoints.ingredients).catch(() => ({ data: FALLBACK_INGREDIENT_GROUPS })),
    ]);

    return {
      profile: profileRes.data || FALLBACK_USER_PROFILE,
      orderSteps: ordersRes.data || FALLBACK_ORDER_STEPS,
      ingredients: ingredientsRes.data || FALLBACK_INGREDIENT_GROUPS,
    };
  } catch (error) {
    console.error('데이터 로드 실패, 폴백 데이터 사용', error);
    return {
      profile: FALLBACK_USER_PROFILE,
      orderSteps: FALLBACK_ORDER_STEPS,
      ingredients: FALLBACK_INGREDIENT_GROUPS,
    };
  }
});

/**
 * Async Thunk: 프로필 업데이트
 *
 * 사용자의 프로필 정보(이름, 전화번호, 피부 고민 등)를 수정합니다.
 */
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId = 'me', data }, { rejectWithValue }) => {
    try {
      const response = await api.put(getEndpoints(userId).profile, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '프로필 수정에 실패했습니다.');
    }
  },
);

/**
 * Async Thunk: 비밀번호 변경
 *
 * 현재 비밀번호와 새 비밀번호를 받아 서버에 변경 요청을 보냅니다.
 * @param {Object} payload - { userId, currentPassword, newPassword }
 */
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ userId = 'me', currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.put(getEndpoints(userId).password, { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '비밀번호 변경에 실패했습니다.');
    }
  },
);

/**
 * Async Thunk: 성분 추가 (선호/기피)
 *
 * @param {Object} payload - { userId, ingredientId, type: 'FOCUS' | 'AVOID' }
 */
export const addIngredient = createAsyncThunk(
  'user/addIngredient',
  async ({ userId = 'me', ingredientId, type }, { rejectWithValue }) => {
    try {
      await api.post(getEndpoints(userId).ingredients, { ingredientId, type });
      // 성공 시 최신 목록 다시 조회
      const response = await api.get(getEndpoints(userId).ingredients);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '성분 추가에 실패했습니다.');
    }
  },
);

/**
 * Async Thunk: 성분 삭제
 *
 * @param {Object} payload - { userId, ingredientId, type }
 */
export const removeIngredient = createAsyncThunk(
  'user/removeIngredient',
  async ({ userId = 'me', ingredientId, type }, { rejectWithValue }) => {
    try {
      // DELETE /api/users/{userId}/ingredients/{ingredientId}
      await api.delete(`${getEndpoints(userId).ingredients}/${ingredientId}`, { params: { type } });
      // 성공 시 최신 목록 다시 조회
      const response = await api.get(getEndpoints(userId).ingredients);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '성분 삭제에 실패했습니다.');
    }
  },
);

const initialState = {
  profile: FALLBACK_USER_PROFILE,
  orderSteps: FALLBACK_ORDER_STEPS,
  ingredients: FALLBACK_INGREDIENT_GROUPS,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchMyPageData
      .addCase(fetchMyPageData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.orderSteps = action.payload.orderSteps;
        state.ingredients = action.payload.ingredients;
      })
      .addCase(fetchMyPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateUserProfile
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // changePassword
      .addCase(changePassword.pending, state => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addIngredient
      .addCase(addIngredient.fulfilled, (state, action) => {
        state.ingredients = action.payload;
      })
      // removeIngredient
      .addCase(removeIngredient.fulfilled, (state, action) => {
        state.ingredients = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
