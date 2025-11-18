import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. API 기본 URL (백엔드 서버 주소)
const API_BASE_URL = 'http://localhost:8080/api';

// --- (A) 비동기 API 호출 Thunk 정의 ---

// 4.1 장바구니 목록 조회
export const fetchCartView = createAsyncThunk(
  'cart/fetchCartView',
  async (_, { rejectWithValue }) => {
    try {
      // (TODO: 나중에 인증 토큰을 헤더에 추가해야 합니다)
      const response = await fetch(`${API_BASE_URL}/cart`);
      if (!response.ok) throw new Error('서버 응답 오류');
      return await response.json(); // ApiResponse<CartResponseDTO> 반환
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

// 4.3 상품 속성 변경 (수량/선택)
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartItemId, quantity, selected }, { rejectWithValue }) => {
    try {
      const body = quantity !== undefined ? { quantity } : { selected };
      const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('서버 응답 오류');
      return await response.json();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

// 4.4 '전체' 상품 선택/해제
export const toggleAllCartItems = createAsyncThunk(
  'cart/toggleAll',
  async (selected, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected }),
      });
      if (!response.ok) throw new Error('서버 응답 오류');
      return await response.json();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

// 4.5 상품 일괄 삭제
export const deleteCartItems = createAsyncThunk(
  'cart/deleteItems',
  async (cartItemIds, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemIds }),
      });
      if (!response.ok) throw new Error('서버 응답 오류');
      return await response.json();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

// (참고: 4.2 상품 추가(addItemToCart) Thunk도 필요시 여기에 추가)

// --- (B) Redux State 정의 및 로직 연결 ---

const initialState = {
  items: [],
  summary: {
    totalProductAmount: 0,
    deliveryFee: 0,
    finalPaymentAmount: 0,
  },
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

// API 응답 성공 시 state를 덮어쓰는 공통 핸들러
const handleApiSuccess = (state, action) => {
  if (action.payload && action.payload.resultCode === 200 && action.payload.data) {
    state.items = action.payload.data.items;
    state.summary = action.payload.data.summary;
    state.loading = 'succeeded';
  } else {
    state.loading = 'failed';
    state.error = action.payload ? action.payload.resultMsg : 'API 응답 형식이 잘못되었습니다.';
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {}, // 동기 로직은 없음
  // 비동기 로직(Thunk)의 '상태'에 따라 state를 변경
  extraReducers: builder => {
    builder
      // [성공] (fulfilled)
      // 모든 API가 성공하면 '동일한' 로직(handleApiSuccess)을 수행합니다.
      .addCase(fetchCartView.fulfilled, handleApiSuccess)
      .addCase(updateCartItem.fulfilled, handleApiSuccess)
      .addCase(toggleAllCartItems.fulfilled, handleApiSuccess)
      .addCase(deleteCartItems.fulfilled, handleApiSuccess)
      // .addCase(addItemToCart.fulfilled, handleApiSuccess) // (상품 추가)

      // [로딩 중] (pending)
      .addMatcher(
        action => action.type.endsWith('/pending'),
        state => {
          state.loading = 'pending';
        },
      )
      // [실패] (rejected)
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = 'failed';
          state.error = action.payload; // rejectWithValue(e.message)가 여기 담김
        },
      );
  },
});

export default cartSlice.reducer;