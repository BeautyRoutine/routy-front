import React from 'react';
import PropTypes from 'prop-types';
import './CartPage.css';

export function CartSummary({ summary, selectedCount, onNavigate }) {
  const deliveryFee = summary.deliveryFee;
  const finalAmount = summary.finalPaymentAmount;
  const totalAmount = summary.totalProductAmount;

  const CheckoutButton = () => (
    <button
      className="btn btn-primary btn-pill btn-lg"
      disabled={selectedCount === 0}
      onClick={() => onNavigate('/checkout')}
    >
      {selectedCount}개 상품 구매하기
    </button>
  );

  return (
    <>
      <aside className="order-summary-sidebar">
        <div className="order-summary-sticky">
          <div className="card shadow-lg">
            <div className="card-content">
              <h3 className="mb-4">결제 정보</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span className="text-muted">상품 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="summary-row">
                  <span className="text-muted">배송비</span>
                  <span>{deliveryFee === 0 ? '무료' : `${deliveryFee.toLocaleString()}원`}</span>
                </div>
                {deliveryFee > 0 && (
                  <p className="alert-message">{(30000 - totalAmount).toLocaleString()}원 더 구매하시면 무료배송!</p>
                )}
                <hr className="hr-separator" />
                <div className="summary-row summary-total">
                  <span>총 결제 금액</span>
                  <span className="total-price">{finalAmount.toLocaleString()}원</span>
                </div>
              </div>
              <div className="summary-buttons">
                <CheckoutButton />
                <button className="btn btn-outline btn-pill" onClick={() => onNavigate('/')}>
                  쇼핑 계속하기
                </button>
              </div>
              <div className="summary-info">
                <p>• 30,000원 이상 구매 시 무료배송</p>
                {/* (기타 정보) */}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 하단 바 */}
      <div className="mobile-summary-footer">
        <div className="mobile-summary-content">
          <div className="mobile-price-section">
            <p className="text-muted">총 결제 금액</p>
            <p className="total-price">{finalAmount.toLocaleString()}원</p>
          </div>
          <CheckoutButton />
        </div>
        {deliveryFee > 0 && (
          <p className="alert-message">{(30000 - totalAmount).toLocaleString()}원 더 구매하시면 무료배송!</p>
        )}
      </div>
    </>
  );
}

CartSummary.propTypes = {
  summary: PropTypes.shape({
    totalProductAmount: PropTypes.number.isRequired,
    deliveryFee: PropTypes.number.isRequired,
    finalPaymentAmount: PropTypes.number.isRequired,
  }).isRequired,
  selectedCount: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
