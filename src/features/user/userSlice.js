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
  likes: `/api/users/${userId}/likes`, // 좋아요 목록 엔드포인트 추가
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
    const [profileRes, ordersRes, ingredientsRes, likesRes] = await Promise.all([
      api.get(endpoints.profile).catch(err => {
        console.error('Profile API Load Failed:', err);
        return { data: FALLBACK_USER_PROFILE };
      }),
      api.get(endpoints.orders).catch(err => {
        console.error('Orders API Load Failed:', err);
        return { data: FALLBACK_ORDER_STEPS };
      }),
      api.get(endpoints.ingredients).catch(err => {
        console.error('Ingredients API Load Failed:', err);
        return { data: FALLBACK_INGREDIENT_GROUPS };
      }),
      api.get(endpoints.likes).catch(err => {
        console.error('Likes API Load Failed:', err);
        // 좋아요 API 실패 시 빈 배열 반환 (또는 DEMO 데이터)
        return { data: { products: [], brands: [] } };
      }),
    ]);

    // [DEBUG] 실제 받아온 데이터 구조 확인
    console.log('API Response - Profile:', profileRes.data);

    // 백엔드 응답 데이터를 프론트엔드 포맷으로 매핑
    const backendProfile = profileRes.data || {};
    const mappedProfile = {
      ...FALLBACK_USER_PROFILE, // 기본값 유지 (tags, skinConcerns 등 없는 필드 대비)
      ...backendProfile, // 덮어쓰기
      // 필드명 불일치 해결
      name: backendProfile.userName || backendProfile.name || FALLBACK_USER_PROFILE.name,
      nickname:
        backendProfile.nickName || backendProfile.nickname || backendProfile.userName || FALLBACK_USER_PROFILE.nickname,
      tier: backendProfile.userLevel || backendProfile.tier || FALLBACK_USER_PROFILE.tier,
      // id 필드 매핑 (필요 시)
      userId: backendProfile.userNo || backendProfile.userId,
      // 리뷰 카운트 매핑 (백엔드: reviewCount -> 프론트: reviews)
      reviews: backendProfile.reviewCount ?? FALLBACK_USER_PROFILE.reviews,
    };

    return {
      profile: mappedProfile,
      orderSteps: ordersRes.data || FALLBACK_ORDER_STEPS,
      ingredients: ingredientsRes.data || FALLBACK_INGREDIENT_GROUPS,
      likes: likesRes.data || { products: [], brands: [] },
    };
  } catch (error) {
    console.error('데이터 로드 실패, 폴백 데이터 사용', error);
    return {
      profile: FALLBACK_USER_PROFILE,
      orderSteps: FALLBACK_ORDER_STEPS,
      ingredients: FALLBACK_INGREDIENT_GROUPS,
      likes: { products: [], brands: [] },
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
      // 백엔드 API 스펙에 맞춰 필드명 변환 (프론트: name -> 백엔드: userName 등)
      const payload = {
        ...data,
        userName: data.name, // 백엔드가 userName을 쓴다면 매핑
        userLevel: data.tier, // (수정 가능한 필드인지 확인 필요)
        userNo: data.userId,
        // 필요하다면 skinType -> tags 등으로 역변환 로직 추가
      };

      const response = await api.put(getEndpoints(userId).profile, payload);

      // 응답 받은 후 Redux 상태 업데이트를 위해 리턴
      // 만약 백엔드가 수정된 객체 전체를 반환하지 않는다면 payload를 리턴해서 상태 업데이트
      return response.data || data;
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

/**
 * Async Thunk: 닉네임 중복 확인
 *
 * @param {string} nickname - 확인할 닉네임
 */
export const checkNickname = createAsyncThunk('user/checkNickname', async (nickname, { rejectWithValue }) => {
  try {
    // GET /api/users/check-nickname?nickname=...
    const response = await api.get('/api/users/check-nickname', {
      params: { nickname },
    });
    return response.data; // true(사용가능) or false(중복)
  } catch (error) {
    return rejectWithValue(error.response?.data || '닉네임 확인 중 오류가 발생했습니다.');
  }
});

const initialState = {
  profile: FALLBACK_USER_PROFILE,
  orderSteps: FALLBACK_ORDER_STEPS,
  ingredients: FALLBACK_INGREDIENT_GROUPS,
  likes: { products: [], brands: [] }, // 초기값 추가
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
        state.likes = action.payload.likes;
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
        // 백엔드 응답 데이터를 프론트엔드 구조에 맞게 매핑하여 업데이트
        const backendProfile = action.payload;
        const mappedProfile = {
          ...state.profile, // 기존 데이터 유지
          ...backendProfile, // 업데이트된 데이터 덮어쓰기
          name: backendProfile.userName || backendProfile.name || state.profile.name,
          nickname: backendProfile.nickName || backendProfile.nickname || state.profile.nickname,
          // skinType 등 다른 필드도 필요 시 매핑
        };
        state.profile = mappedProfile;
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
