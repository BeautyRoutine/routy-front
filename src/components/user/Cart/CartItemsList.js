/**
 * 장바구니 상품 목록 컴포넌트
 * - 장바구니 상품 배열을 순회하며 CartItem 컴포넌트 렌더링
 * - 빈 장바구니 처리 (CartEmpty 컴포넌트)
 * - 각 아이템의 선택 상태를 계산하여 전달
 *
 * Props:
 * - items: 전체 상품 배열
 * - selectedItemIds: 선택된 상품 ID 객체 { cartItemId: true, ... }
 * - itemHandlers: 이벤트 핸들러 묶음 (onToggle, onQuantityChange, onDelete)
 * - onNavigate: 라우팅 함수
 */

import React from 'react';
import PropTypes from 'prop-types';
import './CartPage.css';

import { CartItem } from './CartItem';
import { CartEmpty } from './CartEmpty';

export function CartItemsList({ items, selectedItemIds, itemHandlers, onNavigate }) {
  // 빈 장바구니 처리
  if (items.length === 0) {
    return <CartEmpty onNavigate={onNavigate} />;
  }

  return (
    <div className="cart-items-stack">
      {items.map(item => {
        // 각 아이템의 선택 상태 계산
        const isSelected = !!selectedItemIds[item.cartItemId];

        return (
          <CartItem
            key={item.cartItemId}
            item={item}
            isSelected={isSelected}
            // 체크박스 토글: cartItemId만 전달
            onToggle={() => itemHandlers.onToggle(item.cartItemId)}
            // 수량 변경: delta(+1 or -1)를 받아 새 수량 계산 후 API 호출
            onQuantityChange={delta => itemHandlers.onQuantityChange(item.cartItemId, item.quantity + delta)}
            // 삭제: 해당 아이템의 ID를 배열로 전달
            onDelete={() => itemHandlers.onDelete([item.cartItemId])}
          />
        );
      })}
    </div>
  );
}

CartItemsList.propTypes = {
  items: PropTypes.array.isRequired,
  selectedItemIds: PropTypes.object.isRequired,
  itemHandlers: PropTypes.object.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
