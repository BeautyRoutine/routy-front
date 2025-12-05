import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'app/api';

/**
 * 장바구니 전체 목록 조회 (GET /api/cart/list)
 * 변경점: URL 파라미터에서 userId 제거
 */
export const fetchCartView = createAsyncThunk('cart/fetchCartView', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/cart/list');
    return response.data;
  } catch (e) {
    // 에러 객체가 아닌 메시지 문자열만 반환하도록 처리
    const message = e.response?.data?.message || e.message || '장바구니 조회 실패';
    return rejectWithValue(message);
  }
});

/**
 * 장바구니 상품 수량 변경 (PATCH /api/cart/items/:cartItemId)
 * 변경점: payload에서 userId 제거
 */
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      // body에 userId를 보낼 필요가 없습니다. (백엔드가 토큰 보고 알아서 처리)
      await api.patch(`/api/cart/items/${cartItemId}`, { quantity });

      // 로컬 상태 업데이트를 위해 파라미터 그대로 반환
      return { cartItemId, quantity };
    } catch (e) {
      const message = e.response?.data?.message || e.message || '수량 변경 실패';
      return rejectWithValue(message);
    }
  },
);

/**
 * 장바구니 상품 일괄 삭제 (DELETE /api/cart/items)
 * 변경점: payload에서 userId 제거
 */
export const deleteCartItems = createAsyncThunk('cart/deleteItems', async ({ cartItemIds }, { rejectWithValue }) => {
  try {
    // body에 userId를 보낼 필요가 없습니다.
    await api.delete('/api/cart/items', { data: { cartItemIds } });

    // 삭제된 ID 목록 반환
    return cartItemIds;
  } catch (e) {
    const message = e.response?.data?.message || e.message || '상품 삭제 실패';
    return rejectWithValue(message);
  }
});

// Redux State 정의
const initialState = {
  items: [],
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
  selectedItemIds: {},
};

// Redux Slice 정의
const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    // 개별 상품 선택/해제
    toggleItemSelection: (state, action) => {
      const cartItemId = action.payload;
      if (state.selectedItemIds[cartItemId]) {
        delete state.selectedItemIds[cartItemId];
      } else {
        state.selectedItemIds[cartItemId] = true;
      }
    },

    // 전체 선택/해제
    toggleAllSelection: (state, action) => {
      const shouldSelectAll = action.payload;
      state.selectedItemIds = shouldSelectAll
        ? state.items.reduce((acc, item) => {
            acc[item.cartItemId] = true;
            return acc;
          }, {})
        : {};
    },
  },

  extraReducers: builder => {
    builder
      // --- 조회 ---
      .addCase(fetchCartView.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCartView.fulfilled, (state, action) => {
        const { resultCode, data } = action.payload; // ApiResponse 구조에 맞춤

        if (resultCode === 200 && data) {
          state.items = data.items;
          // 초기 로드시 전체 선택 상태로
          state.selectedItemIds = state.items.reduce((acc, item) => {
            acc[item.cartItemId] = true;
            return acc;
          }, {});
          state.loading = 'succeeded';
        } else {
          state.loading = 'failed';
          state.error = action.payload.resultMsg || 'API 응답 형식 오류';
        }
      })
      .addCase(fetchCartView.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload; // 이제 문자열이 들어옴
      })

      // --- 수량 변경 ---
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { cartItemId, quantity } = action.payload;

        if (quantity === 0) {
          state.items = state.items.filter(item => item.cartItemId !== cartItemId);
          delete state.selectedItemIds[cartItemId];
        } else {
          const itemToUpdate = state.items.find(item => item.cartItemId === cartItemId);
          if (itemToUpdate) {
            itemToUpdate.quantity = quantity;
          }
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        // 수량 변경 실패 시 에러만 기록하거나 알림 표시 (현재는 콘솔만)
        console.error('수량 변경 실패:', action.payload);
      })

      // --- 삭제 ---
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        const deletedIds = new Set(action.payload);
        state.items = state.items.filter(item => !deletedIds.has(item.cartItemId));
        deletedIds.forEach(id => {
          delete state.selectedItemIds[id];
        });
      })
      .addCase(deleteCartItems.rejected, (state, action) => {
        console.error('삭제 실패:', action.payload);
      });
  },
});

export const { toggleItemSelection, toggleAllSelection } = cartSlice.actions;
export default cartSlice.reducer;
