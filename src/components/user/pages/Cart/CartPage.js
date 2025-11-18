import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCartView,
  updateCartItem,
  toggleAllCartItems,
  deleteCartItems,
} from '../../../../features/cart/cartSlice'; 
import { CartItemsList } from './CartItemsList'; 
import { CartSummary } from './CartSummary';


export function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, summary, loading, error } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCartView());
  }, [dispatch]);

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 0) return;
    dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
  };

  const handleToggleItem = (cartItemId, newSelected) => {
    dispatch(updateCartItem({ cartItemId, selected: newSelected }));
  };

  const handleToggleAll = newSelected => {
    dispatch(toggleAllCartItems(newSelected));
  };

  const handleDeleteItems = cartItemIds => {
    dispatch(deleteCartItems(cartItemIds));
  };

  const itemHandlers = {
    onToggle: handleToggleItem,
    onQuantityChange: handleQuantityChange,
    onDelete: handleDeleteItems,
  };

  const allSelected = items.length > 0 && items.every(item => item.selected);
  const selectedItems = items.filter(item => item.selected);

  if (loading === 'pending' || loading === 'idle') {
    return (
      <div className="cart-page">
        <div className="cart-container loading-container">
          <h2>
            <i className="bi bi-arrow-repeat spin-icon"></i> 장바구니를 불러오는 중입니다...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="cart-container error-container">
          <i className="bi bi-exclamation-triangle-fill error-icon"></i>
          <p>데이터 로딩에 실패했습니다. (에러: {error})</p>
          <button className="btn btn-outline btn-pill" onClick={() => dispatch(fetchCartView())}>
            <i className="bi bi-arrow-counterclockwise"></i> 재시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <button onClick={() => navigate('/')} className="btn btn-ghost btn-pill mb-4">
            <i className="bi bi-arrow-left"></i>
            쇼핑 계속하기
          </button>
          <div className="cart-title-group">
            <i className="bi bi-cart cart-title-icon"></i>
            <h1>장바구니</h1>
          </div>
          <p className="text-muted mt-2">총 {items.length}개의 상품이 담겨있습니다</p>
        </div>

        <div className="cart-layout-container">
          <main className="cart-items-list">
            {/* 전체 선택 바 */}
            <div className="card select-all-card">
              <div className="card-content">
                <div className="select-all-inner">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={allSelected}
                    onChange={() => handleToggleAll(!allSelected)}
                  />
                  <label htmlFor="select-all">
                    전체 선택 ({selectedItems.length}/{items.length})
                  </label>
                  <button
                    className="btn btn-ghost btn-sm text-muted"
                    onClick={() => {
                      const selectedIds = selectedItems.map(item => item.cartItemId);
                      handleDeleteItems(selectedIds);
                    }}
                    disabled={selectedItems.length === 0}
                  >
                    선택 삭제
                  </button>
                </div>
              </div>
            </div>

            {/* '아이템 리스트' 컴포넌트 호출 */}
            <CartItemsList items={items} itemHandlers={itemHandlers} onNavigate={navigate} />
          </main>

          {/* '결제 요약' 컴포넌트 호출 */}
          <CartSummary summary={summary} selectedCount={selectedItems.length} onNavigate={navigate} />
        </div>
      </div>
    </div>
  );
}
