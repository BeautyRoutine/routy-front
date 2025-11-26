import React, { useEffect, useRef } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import './CheckoutPage.css';

// 1. 토스 공용 테스트 키 (누구나 사용 가능)
const widgetClientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
const customerKey = 'test_customer_key_1234';

export function CheckoutPage() {
  // const location = useLocation(); // (사용 안 함)
  // const navigate = useNavigate(); // (사용 안 함)

  // ▼▼▼ [핵심] 가짜 데이터 (DB 없이 테스트하기 위함) ▼▼▼
  const mockData = {
    orderItems: [
      {
        cartItemId: 999,
        name: '[테스트] 하이드레이팅 세럼',
        quantity: 2,
        price: 25000,
        brand: '글로우랩',
      },
      {
        cartItemId: 888,
        name: '[테스트] 비타민 C 토너',
        quantity: 1,
        price: 30000,
        brand: '퓨어스킨',
      },
    ],
    // 총액: (25000*2 + 30000) = 80000원
    finalPaymentAmount: 80000,
  };

  const { orderItems, finalPaymentAmount: price } = mockData;
  const paymentWidgetRef = useRef(null);

  // 2. 결제 위젯 렌더링 (페이지 로드 시 1회)
  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(widgetClientKey, customerKey);

      // 결제 수단 위젯 그리기
      paymentWidget.renderPaymentMethods('#payment-widget', { value: price }, { variantKey: 'DEFAULT' });

      // 약관 동의 위젯 그리기
      paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

      paymentWidgetRef.current = paymentWidget;
    })();
  }, [price]);

  // 3. '결제하기' 버튼 핸들러
  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;

    try {
      // ★ 토스 결제창 띄우기 (팝업/모달)
      await paymentWidget.requestPayment({
        orderId: 'ORDER_' + new Date().getTime(), // 고유 주문번호 생성
        orderName: `${orderItems[0].name} 외 ${orderItems.length - 1}건`,
        customerName: '김토스',
        customerEmail: 'customer@example.com',
        // (중요) 결제 성공/실패 시 이동할 URL (프론트엔드 주소)
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error('결제 에러:', err);
      if (err.code === 'USER_CANCEL') {
        // 사용자가 취소함 (에러 아님)
      } else {
        alert('결제 요청 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>주문/결제 (테스트 모드)</h1>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* 결제 위젯 영역 */}
            <div className="section-card">
              <h2>결제 수단</h2>
              <div id="payment-widget" />
              <div id="agreement" />
            </div>

            {/* 주문 상품 목록 (가짜 데이터) */}
            <div className="section-card">
              <h2>주문 상품 ({orderItems.length}개)</h2>
              {orderItems.map(item => (
                <div key={item.cartItemId} className="order-item-row">
                  <span>
                    [{item.brand}] {item.name}
                  </span>
                  <span>{item.quantity}개</span>
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 버튼 사이드바 */}
          <div className="checkout-sidebar">
            <div className="summary-card">
              <h3>최종 결제 금액</h3>
              <p className="total-price">{price.toLocaleString()}원</p>
              <button className="btn-pay" onClick={handlePayment}>
                결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
