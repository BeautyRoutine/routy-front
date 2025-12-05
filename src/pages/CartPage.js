/**
 * 장바구니 페이지 메인 컴포넌트
 * - Redux store와 연결하여 장바구니 데이터 관리
 * - 자식 컴포넌트에 props 전달
 * - 사용자 액션 핸들러 정의 및 Redux 액션 dispatch
 *
 * 설계 특징:
 * 1. 낙관적 업데이트
 * 2. 로컬 상태 동기화
 * 3. 계산 로직 분리
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/user/Cart/CartPage.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCartView, // 장바구니 전체 조회 (최초 로드 시)
  updateCartItemQuantity, // 수량 변경 (낙관적 업데이트)
  deleteCartItems, // 상품 삭제 (낙관적 업데이트)
  toggleItemSelection, // 개별 선택/해제 (동기)
  toggleAllSelection, // 전체 선택/해제 (동기)
} from '../features/cart/cartSlice';

import { CartItemsList } from '../components/user/Cart/CartItemsList';
import { CartSummary } from '../components/user/Cart/CartSummary';

export function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State 구독
  const { items, loading, error, selectedItemIds } = useSelector(state => state.cart);

  // ★ currentUser가 있든 없든 신경 안 씁니다. 토큰이 알아서 합니다.

  // [useEffect] 화면 진입 시 장바구니 조회
  useEffect(() => {
    // 인자 없이 호출! (헤더 토큰 사용)
    dispatch(fetchCartView());
  }, [dispatch]);

  // --- 이벤트 핸들러 ---

  // 수량 변경
  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 0) return;
    // userId 필요 없음
    dispatch(updateCartItemQuantity({ cartItemId, quantity: newQuantity }));
  };

  // 개별 선택/해제
  const handleToggleItem = cartItemId => {
    dispatch(toggleItemSelection(cartItemId));
  };

  // 전체 선택/해제
  const handleToggleAll = newSelected => {
    dispatch(toggleAllSelection(newSelected));
  };

  // 상품 삭제
  const handleDeleteItems = cartItemIds => {
    // userId 필요 없음
    dispatch(deleteCartItems({ cartItemIds }));
  };

  // --- 파생 데이터 계산 (기존 로직 유지) ---
  const selectedItems = items.filter(item => selectedItemIds[item.cartItemId]);
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = totalAmount >= 30000 || totalAmount === 0 ? 0 : 3000;
  const finalPaymentAmount = totalAmount + deliveryFee;

  const summaryData = { totalAmount, deliveryFee, finalPaymentAmount };

  const itemHandlers = {
    onToggle: handleToggleItem,
    onQuantityChange: handleQuantityChange,
    onDelete: handleDeleteItems,
  };

  // --- 렌더링 ---

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
          {/* 에러 메시지 렌더링 */}
          <p>
            데이터 로딩에 실패했습니다.
            <br />({error})
          </p>
          {/* ★ 재시도 버튼: 인자 없이 호출 */}
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
        <div className="cart-header">
          <button onClick={() => navigate('/')} className="btn btn-ghost btn-pill mb-4">
            <i className="bi bi-arrow-left"></i> 쇼핑 계속하기
          </button>
          <div className="cart-title-group">
            <i className="bi bi-cart cart-title-icon"></i> <h1>장바구니</h1>
          </div>
          <p className="text-muted mt-2">총 {items.length}개의 상품이 담겨있습니다</p>
        </div>

        <div className="cart-layout-container">
          <main className="cart-items-list">
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

            <CartItemsList
              items={items}
              selectedItemIds={selectedItemIds}
              itemHandlers={itemHandlers}
              onNavigate={navigate}
            />
          </main>

          <CartSummary summary={summaryData} selectedCount={selectedItems.length} onNavigate={navigate} />
        </div>
      </div>
    </div>
  );
}
