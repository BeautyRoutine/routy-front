import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiClient';
import {
  FALLBACK_USER_PROFILE,
  FALLBACK_ORDER_STEPS,
  FALLBACK_INGREDIENT_GROUPS,
} from '../../components/user/data/mypageConstants';

// 피부 타입 매핑 (DB Code <-> UI Label)
// 1:건성 / 2:지성 / 3:민감성 / 6:선택안함
const SKIN_TYPE_MAP = {
  1: '건성',
  2: '지성',
  3: '민감성',
  6: '선택안함',
};

const getSkinTypeCode = label => {
  const entry = Object.entries(SKIN_TYPE_MAP).find(([key, value]) => value === label);
  return entry ? parseInt(entry[0], 10) : null;
};

// API 엔드포인트 생성 함수 (RESTful Path Variable 지원)
const getEndpoints = userId => ({
  profile: `/api/users/${userId}/profile`,
  orders: `/api/users/${userId}/orders/status-summary`, // 미구현
  ingredients: `/api/users/${userId}/ingredients`,
  likes: `/api/users/${userId}/likes`,
  reviews: `/api/users/${userId}/reviews`,
  recentProducts: `/api/users/${userId}/recent-products`,
  claims: `/api/users/${userId}/claims`,
  password: `/api/users/${userId}/password`,
  withdrawal: `/api/users/${userId}`,
});

// 성분 리스트를 focus/avoid로 분류하는 헬퍼 함수
const transformIngredients = list => {
  if (!Array.isArray(list)) return FALLBACK_INGREDIENT_GROUPS;

  // 데이터 매핑: id, name 등 필수 필드 보장
  const mappedList = list.map(item => ({
    ...item,
    // 백엔드 필드명(ingredientId, ingNo 등)을 프론트엔드 표준(id)으로 매핑
    id: item.id || item.ingredientId || item.ingNo,
    name: item.name || item.ingredientName || item.ingName,
    desc: item.desc || item.description || item.ingDesc,
  }));

  return {
    focus: mappedList.filter(i => i.type === 'FOCUS'),
    avoid: mappedList.filter(i => i.type === 'AVOID'),
  };
};

/**
 * Async Thunk: 마이페이지 데이터 전체 로드
 *
 * 사용자 프로필, 주문 진행 상황, 선호 성분 등 마이페이지에 필요한 모든 데이터를 가져옵니다.
 * @param {string} userId - 조회할 사용자 ID
 */
export const fetchMyPageData = createAsyncThunk('user/fetchMyPageData', async (userId, { rejectWithValue }) => {
  const endpoints = getEndpoints(userId);
  try {
    // API 호출 시도
    const [profileRes, ordersRes, ingredientsRes, likesRes, reviewsRes, recentRes, claimsRes] = await Promise.all([
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
      api.get(endpoints.likes, { params: { type: 'PRODUCT' } }).catch(err => {
        console.error('Likes API Load Failed:', err);
        return { data: [] };
      }),
      api.get(endpoints.reviews).catch(err => {
        console.error('Reviews API Load Failed:', err);
        return { data: [] };
      }),
      api.get(endpoints.recentProducts).catch(err => {
        console.error('Recent Products API Load Failed:', err);
        return { data: [] };
      }),
      api.get(endpoints.claims).catch(err => {
        console.error('Claims API Load Failed:', err);
        return { data: [] };
      }),
    ]);

    // [DEBUG] 실제 받아온 데이터 구조 확인
    console.log('API Response - Profile:', profileRes.data);
    console.log('API Response - Ingredients:', ingredientsRes.data);

    // 백엔드 응답 데이터를 프론트엔드 포맷으로 매핑
    // ApiResponse 구조(data 필드) 처리
    const rawProfile = profileRes.data || {};
    const backendProfile = rawProfile.data || rawProfile;

    const mappedProfile = {
      ...FALLBACK_USER_PROFILE, // 기본값 유지
      ...backendProfile, // 덮어쓰기
      // 필드명 불일치 해결
      name: backendProfile.userName || backendProfile.name || FALLBACK_USER_PROFILE.name,
      nickname:
        backendProfile.nickName || backendProfile.nickname || backendProfile.userName || FALLBACK_USER_PROFILE.nickname,
      tier: backendProfile.userLevel || backendProfile.tier || FALLBACK_USER_PROFILE.tier,
      // id 필드 매핑
      // "me" 문자열이 들어오는 경우를 방지하기 위해 숫자 변환 가능 여부 체크
      userNo:
        backendProfile.userNo && !isNaN(Number(backendProfile.userNo))
          ? backendProfile.userNo
          : backendProfile.userId && !isNaN(Number(backendProfile.userId))
          ? backendProfile.userId
          : null,
      // 리뷰 카운트 매핑 (백엔드: reviewCount -> 프론트: reviews)
      reviews: backendProfile.reviewCount ?? FALLBACK_USER_PROFILE.reviews,
      // skinType -> tags 변환 (UI가 tags 배열을 사용함)
      tags: backendProfile.skinType ? [SKIN_TYPE_MAP[backendProfile.skinType] || backendProfile.skinType] : [],
      skinConcerns: [],
    };

    // 성분 데이터 매핑
    const rawIngredients = ingredientsRes.data || {};
    const ingredientsData = rawIngredients.data || rawIngredients;
    const mappedIngredients = Array.isArray(ingredientsData) ? transformIngredients(ingredientsData) : ingredientsData;

    // 좋아요 데이터 매핑
    const rawLikes = likesRes.data || {};
    const likeList = rawLikes.data || rawLikes || [];
    const safeLikeList = Array.isArray(likeList) ? likeList : [];

    const mappedLikes = {
      products: safeLikeList.map(item => ({
        id: item.likeId,
        productId: item.productId,
        name: item.productName,
        brand: item.productCompany,
        price: item.price,
        image: item.imageUrl,
        date: item.regDate,
      })),
      brands: [], // 브랜드 좋아요는 아직 API 명세에 없음
    };

    // 리뷰 데이터 매핑
    const rawReviews = reviewsRes.data || {};
    const reviewList = rawReviews.data || rawReviews || [];
    const mappedReviews = Array.isArray(reviewList) ? reviewList : [];

    // 최근 본 상품 매핑
    const rawRecent = recentRes.data || {};
    const recentList = rawRecent.data || rawRecent || [];

    let mappedRecent = [];
    if (Array.isArray(recentList) && recentList.length > 0) {
      const detailPromises = recentList.map(async item => {
        const id = item.prdNo;
        if (!id) return null;

        const listTitle = item.prdName;
        const listImage = item.prdImg;

        try {
          const detailRes = await api.get(`/api/products/${id}`);
          const p = detailRes.data.data || detailRes.data;

          const detailImage = p.prdImg || listImage;

          return {
            id: p.prdNo,
            prdNo: p.prdNo,
            name: p.prdName,
            brand: p.prdCompany,
            price: p.prdPrice,
            salePrice: p.salePrice,
            discount: p.discountRate || p.discount,
            image: detailImage ? `${process.env.PUBLIC_URL}/images/product/${detailImage}` : null,
            viewedDate: item.viewedAt || new Date().toISOString(),
          };
        } catch (err) {
          console.warn(`Failed to fetch detail for product ${id}, using list data`, err);
          return {
            id: id,
            prdNo: id,
            name: listTitle,
            brand: '',
            price: 0,
            salePrice: 0,
            discount: 0,
            image: listImage ? `${process.env.PUBLIC_URL}/images/product/${listImage}` : null,
            viewedDate: item.viewedAt || new Date().toISOString(),
          };
        }
      });
      const details = await Promise.all(detailPromises);
      // 최신순 정렬 (API가 최신순으로 준다고 가정하고 reverse 제거)
      mappedRecent = details.filter(d => d !== null);
    }

    // 클레임 데이터 매핑
    const rawClaims = claimsRes.data || {};
    const claimList = rawClaims.data || rawClaims || [];
    const mappedClaims = Array.isArray(claimList) ? claimList : [];

    // 주문 데이터 매핑
    const rawOrders = ordersRes.data || {};
    const orderSteps = rawOrders.data || rawOrders;

    return {
      profile: mappedProfile,
      orderSteps: orderSteps || FALLBACK_ORDER_STEPS,
      ingredients: mappedIngredients || FALLBACK_INGREDIENT_GROUPS,
      likes: mappedLikes,
      myReviews: mappedReviews,
      recentProducts: mappedRecent,
      claims: mappedClaims,
    };
  } catch (error) {
    console.error('데이터 로드 실패, 폴백 데이터 사용', error);
    return {
      profile: FALLBACK_USER_PROFILE,
      orderSteps: FALLBACK_ORDER_STEPS,
      ingredients: FALLBACK_INGREDIENT_GROUPS,
      likes: { products: [], brands: [] },
      myReviews: [],
      recentProducts: [],
      claims: [],
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
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      // 백엔드 API 스펙에 맞춰 필드명 변환
      // UserProfileUpdateRequest: userName, nickName, email, phone, address, zipCode, skinType, profileImageUrl
      const payload = {
        userName: data.name,
        nickName: data.nickname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        zipCode: data.zipCode,
        skinType: data.skinType
          ? getSkinTypeCode(data.skinType)
          : data.tags && data.tags.length > 0
          ? getSkinTypeCode(data.tags[0])
          : null,
        profileImageUrl: data.profileImageUrl,
      };

      const response = await api.put(getEndpoints(userId).profile, payload);

      // 응답 받은 후 Redux 상태 업데이트를 위해 리턴
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
  async ({ userId, currentPassword, newPassword }, { rejectWithValue }) => {
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
  async ({ userId, ingredientId, type }, { rejectWithValue }) => {
    try {
      await api.post(getEndpoints(userId).ingredients, { ingredientId, type });
      // 성공 시 최신 목록 다시 조회
      const response = await api.get(getEndpoints(userId).ingredients);
      const rawData = response.data || {};
      const list = rawData.data || rawData;
      return Array.isArray(list) ? transformIngredients(list) : list;
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
  async ({ userId, ingredientId, type }, { rejectWithValue }) => {
    try {
      // DELETE /api/users/{userId}/ingredients/{ingredientId}
      await api.delete(`${getEndpoints(userId).ingredients}/${ingredientId}`, { params: { type } });
      // 성공 시 최신 목록 다시 조회
      const response = await api.get(getEndpoints(userId).ingredients);
      const rawData = response.data || {};
      const list = rawData.data || rawData;
      return Array.isArray(list) ? transformIngredients(list) : list;
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
    return response.data.data; // true(사용가능) or false(중복)
  } catch (error) {
    return rejectWithValue(error.response?.data || '닉네임 확인 중 오류가 발생했습니다.');
  }
});

/**
 * Async Thunk: 나의 리뷰 목록 조회
 */
export const fetchMyReviews = createAsyncThunk('user/fetchMyReviews', async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(getEndpoints(userId).reviews);
    const rawData = response.data || {};
    return rawData.data || rawData || [];
  } catch (error) {
    return rejectWithValue(error.response?.data || '리뷰 목록을 불러오는데 실패했습니다.');
  }
});

/**
 * Async Thunk: 리뷰 삭제
 */
export const deleteReview = createAsyncThunk('user/deleteReview', async ({ userId, reviewId }, { rejectWithValue }) => {
  try {
    await api.delete(`${getEndpoints(userId).reviews}/${reviewId}`);
    return reviewId; // 삭제된 ID 반환
  } catch (error) {
    return rejectWithValue(error.response?.data || '리뷰 삭제에 실패했습니다.');
  }
});

/**
 * Async Thunk: 회원 탈퇴
 */
export const withdrawUser = createAsyncThunk('user/withdrawUser', async ({ userId, password }, { rejectWithValue }) => {
  try {
    // DELETE 요청에 body를 실을 때는 config.data에 넣어야 함
    await api.delete(getEndpoints(userId).withdrawal, {
      data: { password },
    });
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data || '회원 탈퇴에 실패했습니다.');
  }
});

/**
 * Async Thunk: 좋아요 추가
 */
export const addLike = createAsyncThunk(
  'user/addLike',
  async ({ userId, productId, type = 'PRODUCT' }, { rejectWithValue }) => {
    try {
      await api.post(`${getEndpoints(userId).likes}/${productId}`, null, { params: { type } });
      return { productId, type };
    } catch (error) {
      return rejectWithValue(error.response?.data || '좋아요 추가에 실패했습니다.');
    }
  },
);

/**
 * Async Thunk: 좋아요 삭제
 */
export const removeLike = createAsyncThunk(
  'user/removeLike',
  async ({ userId, productId, type = 'PRODUCT' }, { rejectWithValue }) => {
    try {
      await api.delete(`${getEndpoints(userId).likes}/${productId}`, { params: { type } });
      return { productId, type };
    } catch (error) {
      return rejectWithValue(error.response?.data || '좋아요 삭제에 실패했습니다.');
    }
  },
);

/**
 * Async Thunk: 최근 본 상품 저장
 *
 * @param {Object} payload - { userId, prdNo, prdSubCate, productDetails }
 * productDetails: UI 업데이트를 위한 상품 상세 정보 (선택)
 */
export const saveRecentProduct = createAsyncThunk(
  'user/saveRecentProduct',
  async ({ userId, prdNo, prdSubCate, productDetails }, { rejectWithValue }) => {
    // 프론트에서 prdSubCate 없이 호출하는 실수를 방지
    if (!prdSubCate) {
      console.warn('[saveRecentProduct] prdSubCate가 없음 — 상품 상세 로드 이후에 호출해야 합니다.');
      return rejectWithValue('prdSubCate is required');
    }

    try {
      await api.post(getEndpoints(userId).recentProducts, null, {
        params: { prdNo, prdSubCate },
      });
      // 성공 시 productDetails가 있으면 리턴하여 리듀서에서 상태 업데이트
      return { prdNo, productDetails };
    } catch (error) {
      console.error('최근 본 상품 저장 실패:', error);
      return rejectWithValue(error.response?.data || '최근 본 상품 저장 실패');
    }
  },
);

/**
 * Async Thunk: 클레임 신청
 */
export const createClaim = createAsyncThunk('user/createClaim', async ({ userId, data }, { rejectWithValue }) => {
  try {
    await api.post(getEndpoints(userId).claims, data);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || '클레임 신청에 실패했습니다.');
  }
});

const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser.userId) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
    return parsedUser;
  } catch (e) {
    localStorage.removeItem('user');
    return null;
  }
};

const initialState = {
  profile: FALLBACK_USER_PROFILE,
  orderSteps: FALLBACK_ORDER_STEPS,
  ingredients: FALLBACK_INGREDIENT_GROUPS,
  likes: { products: [], brands: [] },
  myReviews: [],
  recentProducts: [],
  loading: false,
  error: null,
  // 회원가입/로그인 후 사용자 정보
  currentUser: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    // 🔥 회원가입/로그인 후 사용자 정보 설정
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    // 로그아웃
    logout: state => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
        state.myReviews = action.payload.myReviews;
        state.recentProducts = action.payload.recentProducts;
        state.claims = action.payload.claims;
      })
      .addCase(fetchMyPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // saveRecentProduct
      .addCase(saveRecentProduct.fulfilled, (state, action) => {
        const { prdNo, productDetails } = action.payload;
        if (productDetails) {
          // 이미 목록에 있으면 제거 (최상단으로 이동하기 위해)
          const filtered = state.recentProducts.filter(p => p.prdNo !== prdNo && p.id !== prdNo);
          // 새 상품 추가
          state.recentProducts = [productDetails, ...filtered];
        }
      })
      // createClaim
      .addCase(createClaim.fulfilled, (state, action) => {
        // 클레임 신청 성공 시 목록을 다시 불러오거나, 임시로 추가할 수 있음
        // 여기서는 간단히 로딩 상태만 해제 (실제로는 fetchMyPageData를 다시 호출하는 것이 좋음)
        state.loading = false;
      })
      // fetchMyReviews
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myReviews = action.payload;
      })
      // deleteReview
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.myReviews = state.myReviews.filter(review => review.reviewId !== action.payload);
      })
      // withdrawUser
      .addCase(withdrawUser.fulfilled, state => {
        state.currentUser = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      // removeLike
      .addCase(removeLike.fulfilled, (state, action) => {
        const { productId, type } = action.payload;
        if (type === 'PRODUCT') {
          state.likes.products = state.likes.products.filter(item => item.productId !== productId);
        } else {
          // 브랜드 좋아요 삭제 로직 (추후 구현 시)
        }
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

        // currentUser 정보도 업데이트 (localStorage 동기화)
        if (state.currentUser) {
          const updatedUser = {
            ...state.currentUser,
            userName: mappedProfile.name,
            // 필요한 경우 다른 필드도 업데이트
          };
          state.currentUser = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
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

export const { clearError, setUser, logout } = userSlice.actions;
export default userSlice.reducer;
