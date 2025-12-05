/**
 * 장바구니 결제 요약 컴포넌트
 * - 선택된 상품의 결제 정보 표시 (상품 금액, 배송비, 총 결제 금액)
 * - 구매하기 버튼 (선택된 상품이 없으면 비활성화)
 * - 무료배송 안내 메시지
 * - 데스크톱: 우측 고정 사이드바
 * - 모바일: 하단 고정 바
 *
 * Props:
 * - summary: 결제 금액 정보 { totalAmount, deliveryFee, finalPaymentAmount }
 * - selectedCount: 선택된 상품 개수
 * - onNavigate: 라우팅 함수
 *
 * 설계 특징:
 * - summary는 CartPage에서 계산된 값 (선택된 상품 기준)
 * - 반응형 디자인 (데스크톱 / 모바일 분기)
 */

import React from 'react';
import PropTypes from 'prop-types';
import './CartPage.css';

export function CartSummary({ summary, selectedCount, onNavigate }) {
  // 결제 금액 정보 추출
  const deliveryFee = summary.deliveryFee;
  const finalAmount = summary.finalPaymentAmount;
  const totalAmount = summary.totalAmount;

  // 구매 버튼 핸들러
  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert('상품을 선택해주세요.');
      return;
    }
    onNavigate('/checkout', { state: { summary } });
  };

  // 구매 버튼
  const CheckoutButton = () => (
    <button className="btn btn-primary btn-pill btn-lg" disabled={selectedCount === 0} onClick={handleCheckout}>
      상품 구매하기
    </button>
  );

  return (
    <>
      {/* 데스크톱: 우측 고정 사이드바 */}
      <aside className="order-summary-sidebar">
        <div className="order-summary-sticky">
          <div className="card shadow-lg">
            <div className="card-content">
              <h3 className="mb-4">결제 정보</h3>

              {/* 결제 금액 상세 */}
              <div className="summary-details">
                {/* 상품 금액 (선택된 상품만) */}
                <div className="summary-row">
                  <span className="text-muted">상품 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>

                {/* 배송비 */}
                <div className="summary-row">
                  <span className="text-muted">배송비</span>
                  <span>{deliveryFee === 0 ? '무료' : `${deliveryFee.toLocaleString()}원`}</span>
                </div>

                {/* 무료배송까지 남은 금액 안내 */}
                {deliveryFee > 0 && (
                  <p className="alert-message">{(30000 - totalAmount).toLocaleString()}원 더 구매하시면 무료배송!</p>
                )}

                <hr className="hr-separator" />

                {/* 최종 결제 금액 */}
                <div className="summary-row summary-total">
                  <span>총 결제 금액</span>
                  <span className="total-price">{finalAmount.toLocaleString()}원</span>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="summary-buttons">
                <CheckoutButton />
                <button className="btn btn-outline btn-pill" onClick={() => onNavigate('/')}>
                  쇼핑 계속하기
                </button>
              </div>

              {/* 추가 정보 */}
              <div className="summary-info">
                <p>• 30,000원 이상 구매 시 무료배송</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일: 하단 고정 바 */}
      <div className="mobile-summary-footer">
        <div className="mobile-summary-content">
          <div className="mobile-price-section">
            <p className="text-muted">총 결제 금액</p>
            <p className="total-price">{finalAmount.toLocaleString()}원</p>
          </div>
          <CheckoutButton />
        </div>
        {/* 무료배송 안내 (모바일) */}
        {deliveryFee > 0 && (
          <p className="alert-message">{(30000 - totalAmount).toLocaleString()}원 더 구매하시면 무료배송!</p>
        )}
      </div>
    </>
  );
}

CartSummary.propTypes = {
  summary: PropTypes.shape({
    totalAmount: PropTypes.number.isRequired,
    deliveryFee: PropTypes.number.isRequired,
    finalPaymentAmount: PropTypes.number.isRequired,
  }).isRequired,
  selectedCount: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
