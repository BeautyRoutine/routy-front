import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080/api';

// createAsyncThunk를 사용, 비동기 작업 처리
// 각 Thunk는 자동으로 pending, fulfilled, rejected 액션을 생성

/**
 * 장바구니 전체 목록 조회 (GET /api/cart)
 * 최초 페이지 로드 시 또는 명시적 새로고침 시에만 호출
 *
 * 반환값: 서버로부터 받은 전체 장바구니 데이터
 * - items: 장바구니 상품 배열
 * - summary: 배송비 정책 등의 메타 정보
 */
export const fetchCartView = createAsyncThunk('cart/fetchCartView', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`);
    if (!response.ok) throw new Error('서버 응답 오류');
    return await response.json();
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

/**
 * 장바구니 상품 수량 변경 (PATCH /api/cart/items/:cartItemId)
 *
 * @param {number} cartItemId - 수량을 변경할 장바구니 아이템 ID
 * @param {number} quantity - 변경할 수량 (0이면 삭제 처리)
 * @returns {Object} { cartItemId, quantity } - 로컬 업데이트에 사용할 데이터
 */
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('서버 응답 오류');

      // 서버 응답(response.json())을 무시하고 요청 파라미터를 반환
      // 이를 통해 로컬 state와 서버 state의 동기화를 클라이언트가 주도
      return { cartItemId, quantity };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

/**
 * 장바구니 상품 일괄 삭제 (DELETE /api/cart/items)
 *
 * @param {number[]} cartItemIds - 삭제할 장바구니 아이템 ID 배열
 * @returns {number[]} cartItemIds - 삭제된 ID 목록
 */
export const deleteCartItems = createAsyncThunk('cart/deleteItems', async (cartItemIds, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItemIds }),
    });
    if (!response.ok) throw new Error('서버 응답 오류');

    // 삭제 성공 시 삭제된 ID 목록을 반환하여 로컬에서 필터링
    return cartItemIds;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// Redux State 정의

/**
 * 장바구니 State 구조
 *
 * items: 장바구니 상품 배열 (서버에서 받은 전체 목록)
 * summary: 배송비 정책 등의 메타 정보 (서버에서 제공하는 기본값)
 * selectedItemIds: 선택된 상품의 ID를 키로 하는 객체 (클라이언트 관리)
 *   - 예: { 1: true, 3: true } → ID 1, 3번 상품이 선택됨
 *   - API 호출 없이 프론트엔드에서만 관리
 * loading: API 요청 상태 ('idle' | 'pending' | 'succeeded' | 'failed')
 *   - 중요: fetchCartView만 'pending' 상태로 전환하여 로딩 UI 표시
 *   - updateCartItemQuantity, deleteCartItems는 로딩 상태 변경 없이 즉시 반영
 * error: 에러 메시지
 */
const initialState = {
  items: [],
  summary: {
    deliveryFee: 3000, // 기본 배송비 값
  },
  selectedItemIds: {}, // 체크박스 선택 상태 (로컬 관리)
  loading: 'idle',
  error: null,
};

/**
 * fetchCartView 성공 시 호출되는 핸들러
 *
 * 처리 로직:
 * 1. 서버로부터 받은 전체 장바구니 데이터를 state에 저장
 * 2. summary 업데이트
 * 3. 모든 상품을 기본 선택 상태로 설정
 *
 * 비즈니스 로직: 장바구니 진입 시 전체 선택이 기본값
 */
const handleFetchSuccess = (state, action) => {
  if (action.payload && action.payload.resultCode === 200 && action.payload.data) {
    state.items = action.payload.data.items;
    state.summary = action.payload.data.summary;
    state.loading = 'succeeded';

    // reduce를 사용하여 모든 cartItemId를 키로 하는 객체 생성
    state.selectedItemIds = state.items.reduce((acc, item) => {
      acc[item.cartItemId] = true;
      return acc;
    }, {});
  } else {
    state.loading = 'failed';
    state.error = action.payload ? action.payload.resultMsg : 'API 응답 형식이 잘못되었습니다.';
  }
};

// Redux Slice 정의

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  // 동기 Reducer: API 호출 없이 로컬 state만 변경
  // 선택/해제는 서버에 저장할 필요가 없으므로 클라이언트에서만 관리
  reducers: {
    /**
     * 개별 상품 선택/해제 토글
     * @param {number} action.payload - cartItemId
     */
    toggleItemSelection: (state, action) => {
      const cartItemId = action.payload;
      if (state.selectedItemIds[cartItemId]) {
        // 이미 선택된 경우 → 선택 해제 (객체에서 삭제)
        delete state.selectedItemIds[cartItemId];
      } else {
        // 선택되지 않은 경우 → 선택 (객체에 추가)
        state.selectedItemIds[cartItemId] = true;
      }
    },

    /**
     * 전체 선택/해제
     *
     * @param {boolean} action.payload - true: 전체 선택, false: 전체 해제
     */
    toggleAllSelection: (state, action) => {
      const shouldSelectAll = action.payload;
      state.selectedItemIds = shouldSelectAll
        ? state.items.reduce((acc, item) => {
            acc[item.cartItemId] = true;
            return acc;
          }, {})
        : {}; // 전체 해제 시 빈 객체
    },
  },
  // 비동기 Thunk 처리 (extraReducers)
  // createAsyncThunk가 생성한 pending, fulfilled, rejected 액션을 처리

  extraReducers: builder => {
    builder
      /**
       * [fetchCartView.fulfilled] 장바구니 조회 성공
       *
       * 전체 목록을 서버로부터 받아와 state를 초기화
       * 페이지 첫 로드 또는 명시적 새로고침 시에만 발생
       */
      .addCase(fetchCartView.fulfilled, handleFetchSuccess)

      /**
       * [updateCartItemQuantity.fulfilled] 수량 변경 API 성공
       *
       * 처리 로직:
       * 1. quantity === 0 → 장바구니에서 완전 삭제
       * 2. quantity >= 1 → 해당 아이템의 수량만 업데이트
       */
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { cartItemId, quantity } = action.payload;

        if (quantity === 0) {
          // 수량 0 → 장바구니에서 제거
          state.items = state.items.filter(item => item.cartItemId !== cartItemId);
          // 선택 상태도 함께 제거
          delete state.selectedItemIds[cartItemId];
        } else {
          // 수량 1 이상 → 로컬 수량 업데이트
          const itemToUpdate = state.items.find(item => item.cartItemId === cartItemId);
          if (itemToUpdate) {
            // Redux Toolkit의 Immer 덕분에 직접 수정 가능
            itemToUpdate.quantity = quantity;
          }
        }

        // 'succeeded' 상태 유지 (loading UI 표시 안 함)
        state.loading = 'succeeded';
      })

      /**
       * [deleteCartItems.fulfilled] 상품 삭제 API 성공
       *
       * 처리 로직:
       * 1. items 배열에서 삭제된 ID 제거
       * 2. selectedItemIds에서도 해당 ID 제거
       *
       * 성능 최적화: Set 자료구조 사용으로 O(1) 검색
       */
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        const deletedIds = new Set(action.payload); // 배열을 Set으로 변환

        // items 배열에서 삭제된 아이템 필터링
        state.items = state.items.filter(item => !deletedIds.has(item.cartItemId));

        // 선택 상태에서도 삭제된 아이템 제거
        deletedIds.forEach(id => {
          delete state.selectedItemIds[id];
        });

        state.loading = 'succeeded';
      })

      /**
       * [fetchCartView.pending] 장바구니 조회 로딩 중
       *
       * 중요: fetchCartView만 loading = 'pending'으로 변경
       * - updateCartItemQuantity, deleteCartItems는 pending 상태를 무시
       * - 이를 통해 수량 변경/삭제 시 로딩 UI가 표시되지 않음
       */
      .addCase(fetchCartView.pending, state => {
        state.loading = 'pending';
      })

      /**
       * [모든 Thunk의 실패 처리]
       * addMatcher를 사용하여 모든 '/rejected' 액션을 한 번에 처리
       * - fetchCartView, updateCartItemQuantity, deleteCartItems 모두 포함
       * - 에러 메시지를 state에 저장하여 UI에 표시
       */
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = 'failed';
          state.error = action.payload;
        },
      );
  },
});

export const { toggleItemSelection, toggleAllSelection } = cartSlice.actions;

export default cartSlice.reducer;
