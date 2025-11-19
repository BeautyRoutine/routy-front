import React from 'react';
import './CartPage.css';

export function CartEmpty({ onNavigate }) {
  return (
    <div className="card empty-cart-card">
      <div className="card-content">
        <p className="text-muted mb-4">장바구니가 비어있습니다</p>
        <button onClick={() => onNavigate('/')} className="btn btn-primary btn-pill">
          쇼핑 시작하기
        </button>
      </div>
    </div>
  );
}
