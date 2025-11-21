import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../lib/apiClient';
import {
  FALLBACK_USER_PROFILE,
  FALLBACK_ORDER_STEPS,
  FALLBACK_INGREDIENT_GROUPS,
  // MYPAGE_ENDPOINTS,
} from '../../components/user/data/mypageConstants';

/**
 * Async Thunk: 마이페이지 데이터 전체 로드
 *
 * 사용자 프로필, 주문 진행 상황, 선호 성분 등 마이페이지에 필요한 모든 데이터를 가져옵니다.
 * 실제로는 여러 API를 병렬로 호출하거나, 하나의 집계 API를 호출할 수 있습니다.
 */
export const fetchMyPageData = createAsyncThunk('user/fetchMyPageData', async (_, { rejectWithValue }) => {
  try {
    // TODO: 백엔드 API가 준비되면 아래 주석을 해제하고 실제 호출로 변경하세요.
    // const [profileRes, ordersRes, ingredientsRes] = await Promise.all([
    //   api.get(MYPAGE_ENDPOINTS.profile),
    //   api.get(MYPAGE_ENDPOINTS.orders),
    //   api.get(MYPAGE_ENDPOINTS.favoriteIngredients),
    // ]);

    // return {
    //   profile: profileRes.data,
    //   orderSteps: ordersRes.data,
    //   ingredients: ingredientsRes.data,
    // };

    // 현재는 더미 데이터를 반환하여 UI 개발을 진행합니다.
    // API 연동 시 이 부분을 제거하고 위 코드를 활성화하면 됩니다.
    await new Promise(resolve => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션
    return {
      profile: FALLBACK_USER_PROFILE,
      orderSteps: FALLBACK_ORDER_STEPS,
      ingredients: FALLBACK_INGREDIENT_GROUPS,
    };
  } catch (error) {
    return rejectWithValue(error.response?.data || '데이터를 불러오는데 실패했습니다.');
  }
});

/**
 * Async Thunk: 프로필 업데이트
 *
 * 사용자의 프로필 정보(이름, 전화번호, 피부 고민 등)를 수정합니다.
 */
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (updatedData, { rejectWithValue }) => {
    try {
      // const response = await api.put(MYPAGE_ENDPOINTS.profile, updatedData);
      // return response.data;

      await new Promise(resolve => setTimeout(resolve, 500));
      return updatedData;
    } catch (error) {
      return rejectWithValue(error.response?.data || '프로필 수정에 실패했습니다.');
    }
  },
);

/**
 * Async Thunk: 비밀번호 변경
 *
 * 현재 비밀번호와 새 비밀번호를 받아 서버에 변경 요청을 보냅니다.
 * @param {Object} payload - { currentPassword, newPassword }
 */
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      // const response = await api.put(MYPAGE_ENDPOINTS.password, { currentPassword, newPassword });
      // return response.data;

      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || '비밀번호 변경에 실패했습니다.');
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
    // 필요한 동기 액션이 있다면 여기에 추가
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
        // 부분 업데이트라고 가정하고 병합
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // changePassword 처리
      .addCase(changePassword.pending, state => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
