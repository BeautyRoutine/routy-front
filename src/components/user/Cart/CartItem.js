/**
 * 장바구니 개별 상품 카드 컴포넌트
 * - 상품 정보 표시 (이미지, 브랜드, 이름, 가격)
 * - 선택 체크박스
 * - 수량 증감 버튼 (+ / -)
 * - 삭제 버튼
 * - 피부 알림 툴팁 (SkinAlertTooltip)
 *
 * Props:
 * - item: 상품 객체 { cartItemId, name, brand, price, quantity, imageUrl, ... }
 * - isSelected: 선택 상태 (boolean)
 * - onToggle: 체크박스 토글 핸들러
 * - onQuantityChange: 수량 변경 핸들러 (delta: +1 or -1)
 * - onDelete: 삭제 핸들러
 *
 * 설계 특징:
 * - Presentational Component: 상태 관리 없이 props만 받아 렌더링
 * - 단방향 데이터 흐름
 */

import React from 'react';
import PropTypes from 'prop-types';
import './CartPage.css';
import { SkinAlertTooltip } from './SkinAlertTooltip';

export function CartItem({ item, isSelected, onToggle, onQuantityChange, onDelete }) {
  return (
    <div className="card cart-item-card">
      <div className="card-content">
        <div className="cart-item-inner">
          {/* 선택 체크박스 */}
          <input type="checkbox" className="cart-item-checkbox" checked={isSelected} onChange={onToggle} />

          {/* 상품 이미지 */}
          <img src={item.imageUrl} alt={item.name} className="cart-item-image" loading="lazy" />

          <div className="cart-item-details">
            {/* 상품 정보 헤더 */}
            <div className="item-header">
              <div className="item-info">
                <p className="item-brand">{item.brand}</p>
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">{item.price.toLocaleString()}원</p>
              </div>
              {/* 삭제 버튼 */}
              <button className="btn btn-icon btn-ghost" onClick={onDelete}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* 수량 컨트롤 & 합계 */}
            <div className="item-footer">
              <div className="quantity-control">
                {/* 수량 감소 버튼 */}
                <button className="btn btn-icon btn-ghost" onClick={() => onQuantityChange(-1)}>
                  -
                </button>

                {/* 현재 수량 표시 */}
                <span>{item.quantity}</span>

                {/* 수량 증가 버튼 */}
                <button className="btn btn-icon btn-ghost" onClick={() => onQuantityChange(1)}>
                  +
                </button>
              </div>

              {/* 상품 합계 금액 (단가 × 수량) */}
              <div className="item-total-price">합계: {(item.price * item.quantity).toLocaleString()}원</div>
            </div>

            {/* 성분 알림 툴팁 */}
            <div className="skin-alert-container">
              <SkinAlertTooltip item={item} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
