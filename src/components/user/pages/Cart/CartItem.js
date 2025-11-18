import React from 'react';
import PropTypes from 'prop-types';
import './CartPage.css';
import { SkinAlertTooltip } from './SkinAlertTooltip';

// 장바구니 상품 카드

export function CartItem({ item, onToggle, onQuantityChange, onDelete }) {
  return (
    <div className="card cart-item-card">
      <div className="card-content">
        <div className="cart-item-inner">
          <input type="checkbox" className="cart-item-checkbox" checked={item.selected} onChange={onToggle} />
          <img src={item.imageUrl} alt={item.name} className="cart-item-image" loading="lazy" />

          <div className="cart-item-details">
            <div className="item-header">
              <div className="item-info">
                <p className="item-brand">{item.brand}</p>
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">{item.price.toLocaleString()}원</p>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={onDelete}>
                X
              </button>
            </div>

            <div className="item-footer">
              <div className="quantity-control">
                <button className="btn btn-icon btn-ghost" onClick={() => onQuantityChange(-1)}>
                  -
                </button>

                <span>{item.quantity}</span>

                <button className="btn btn-icon btn-ghost" onClick={() => onQuantityChange(1)}>
                  +
                </button>
              </div>
              <div className="item-total-price">합계: {(item.price * item.quantity).toLocaleString()}원</div>
            </div>

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
  onToggle: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
