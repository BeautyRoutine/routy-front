import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import './CheckoutPage.css';

// Toss Payments 클라이언트 키 (환경 변수에서 로드)
const CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY || 'test_ck_ZLKGPx4M3MP7W9RlGR678BaWypv1';

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tossPayments, setTossPayments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redux에서 선택된 장바구니 아이템 가져오기
  const { items, selectedItemIds } = useSelector(state => state.cart);
  const selectedItems = items.filter(item => selectedItemIds[item.cartItemId]);

  // CartPage에서 전달받은 계산된 금액
  const summary = location.state?.summary || {
    totalAmount: 0,
    deliveryFee: 0,
    finalPaymentAmount: 0,
  };

  const orderItems = selectedItems;
  const amount = summary.finalPaymentAmount;

  // 선택된 상품이 없으면 장바구니로 리다이렉트
  useEffect(() => {
    if (orderItems.length === 0) {
      alert('선택된 상품이 없습니다.');
      navigate('/cart');
    }
  }, [orderItems, navigate]);

  // Toss Payments SDK 초기화
  useEffect(() => {
    async function initializeTossPayments() {
      try {
        const tossPaymentsInstance = await loadTossPayments(CLIENT_KEY);
        setTossPayments(tossPaymentsInstance);
      } catch (error) {
        console.error('Toss Payments SDK 로드 실패:', error);
      }
    }

    initializeTossPayments();
  }, []);

  // 결제 요청 핸들러
  const handlePayment = async () => {
    if (!tossPayments) {
      alert('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 주문명 생성
      const orderName =
        orderItems.length > 1 ? `${orderItems[0].name} 외 ${orderItems.length - 1}건` : orderItems[0].name;

      // 백엔드 DTO 규격에 맞춰 데이터 변환
      const orderData = {
        totalAmount: amount,
        orderName: orderName,
        items: orderItems.map(item => ({
            productNo: item.prdNo,   
            quantity: item.quantity,
            price: item.price
        }))
      };

      // 백엔드에 주문 저장 요청
      const response = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('주문 생성(저장)에 실패했습니다.');
      }

      // 백엔드가 생성해준 진짜 주문번호(DB PK) 받기
      const realOrderId = await response.json();

      console.log('생성된 주문번호:', realOrderId);

      // 토스 결제창 띄우기
      // 오라클 시퀀스 번호(숫자)를 문자열로 변환해서 전달해야 함
      await tossPayments.requestPayment('카드', {
        amount,
        orderId: String(realOrderId), 
        orderName,
        customerName: '테스트', // 필요시 로그인 정보 사용
        customerEmail: 'test@example.com',
        successUrl: `${window.location.origin}/routy-front#/payment/success`,
        failUrl: `${window.location.origin}/routy-front#/payment/fail`,
      });

    } catch (error) {
      setIsLoading(false);

      if (error.code === 'USER_CANCEL') {
        // 사용자가 결제창을 닫은 경우
        return;
      }

      console.error('결제 요청 실패:', error);
      alert(error.message || '결제 요청에 실패했습니다.');
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>주문/결제</h1>
        <p style={{ color: '#666', marginTop: '8px' }}>테스트 결제는 실제로 청구되지 않습니다</p>

        <div className="checkout-layout">
          <div className="checkout-main">
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

          <div className="checkout-sidebar">
            <div className="summary-card">
              <h3>최종 결제 금액</h3>
              <p className="total-price">{amount.toLocaleString()}원</p>
              <button className="btn-pay" onClick={handlePayment} disabled={!tossPayments || isLoading}>
                {isLoading ? '처리 중...' : '결제하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
