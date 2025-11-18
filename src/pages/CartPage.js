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
import './CartPage.css';

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
  /**
   * items: 장바구니 상품 배열 (서버로부터 받은 전체 목록)
   * loading: API 요청 상태 (fetchCartView만 'pending' 상태로 전환)
   * error: 에러 메시지
   * selectedItemIds: 선택된 상품 ID 객체 (로컬 상태)
   */
  const { items, loading, error, selectedItemIds } = useSelector(state => state.cart);

  // 최초 렌더링 시 장바구니 데이터 로드 dispatch는 불변이므로 1회만 실행

  useEffect(() => {
    dispatch(fetchCartView());
  }, [dispatch]);

  // 이벤트 핸들러 정의

  /**
   * 수량 변경 핸들러
   * @param {number} cartItemId - 변경할 상품 ID
   * @param {number} newQuantity - 새로운 수량
   */
  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 0) return; // 음수 방지
    dispatch(updateCartItemQuantity({ cartItemId, quantity: newQuantity }));
  };

  /**
   * 개별 상품 선택/해제 핸들러
   * @param {number} cartItemId - 토글할 상품 ID
   */
  const handleToggleItem = cartItemId => {
    dispatch(toggleItemSelection(cartItemId));
  };

  /**
   * 전체 선택/해제 핸들러
   * @param {boolean} newSelected - true: 전체 선택, false: 전체 해제
   */
  const handleToggleAll = newSelected => {
    dispatch(toggleAllSelection(newSelected));
  };

  /**
   * 상품 삭제 핸들러
   * @param {number[]} cartItemIds - 삭제할 상품 ID 배열
   */
  const handleDeleteItems = cartItemIds => {
    dispatch(deleteCartItems(cartItemIds));
  };

  // 파생 데이터 계산 (Derived State)
  /**
   * 선택된 상품 필터링
   * - selectedItemIds 객체 기반 실제 선택된 상품 배열 생성
   */
  const selectedItems = items.filter(item => selectedItemIds[item.cartItemId]);

  /**
   * 전체 선택 여부 (체크박스 상태 결정)
   */
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  /**
   * 결제 금액 계산 (선택된 상품만 계산)
   * 서버의 summary를 사용 x
   * 프론트엔드에서 실시간 재계산
   *
   * 배송비 정책:
   * - 30,000원 이상: 무료
   * - 30,000원 미만: 3,000원
   * - 선택 상품 없음: 0원 (아무것도 선택 안 한 경우)
   */
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = totalAmount >= 30000 || totalAmount === 0 ? 0 : 3000;
  const finalPaymentAmount = totalAmount + deliveryFee;

  /**
   * CartSummary에 전달할 summary 객체
   */
  const summaryData = { totalAmount, deliveryFee, finalPaymentAmount };

  /**
   * CartItemsList에 전달할 핸들러 묶음
   * - 객체로 전달하여 props drilling 최소화
   */
  const itemHandlers = {
    onToggle: handleToggleItem,
    onQuantityChange: handleQuantityChange,
    onDelete: handleDeleteItems,
  };

  /**
   * 로딩 중일 때 (fetchCartView만 이 상태로 진입)
   *
   * 'idle': 초기 상태 (아직 fetchCartView 호출 전)
   * 'pending': fetchCartView 실행 중
   */
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

  /**
   * 에러 발생 시 (모든 Thunk의 rejected 상태)
   */
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
        {/* 헤더: 타이틀, 뒤로가기 버튼, 상품 개수 표시 */}
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
            {/* 전체 선택 바: 체크박스 + 선택 삭제 버튼 */}
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

            {/* 장바구니 상품 목록 컴포넌트 */}
            <CartItemsList
              items={items} // 전체 상품 배열
              selectedItemIds={selectedItemIds} // 선택 상태 객체
              itemHandlers={itemHandlers} // 이벤트 핸들러 묶음
              onNavigate={navigate}
            />
          </main>

          {/* 결제 요약 컴포넌트 (데스크톱: 우측 사이드바, 모바일: 하단 고정) */}
          <CartSummary
            summary={summaryData} // 프론트에서 계산한 결제 금액
            selectedCount={selectedItems.length} // 선택된 상품 개수
            onNavigate={navigate}
          />
        </div>
      </div>
    </div>
  );
}
