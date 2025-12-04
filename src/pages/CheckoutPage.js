import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import './CheckoutPage.css';

const CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY;

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tossPayments, setTossPayments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    receiverName: '',
    receiverPhone: '',
    address: '',
    detailAddress: '',
  });

  const { items, selectedItemIds } = useSelector(state => state.cart);

  // .filter는 렌더링마다 새로운 배열을 만듭니다.
  const selectedItems = items.filter(item => selectedItemIds[item.cartItemId]);

  const summary = location.state?.summary || { finalPaymentAmount: 0 };
  const amount = summary.finalPaymentAmount;

  // ▼▼▼ [수정 1] 상품 유효성 검사 (상품이 바뀔 때만 실행) ▼▼▼
  useEffect(() => {
    if (selectedItems.length === 0) {
      alert('주문할 상품이 없습니다.');
      navigate('/cart');
    }
  }, [selectedItems.length, navigate]); // length만 체크하거나 의존성 최소화

  // ▼▼▼ [수정 2] 토스 SDK 초기화 (맨 처음 한 번만 실행!) ▼▼▼
  useEffect(() => {
    // 여기 의존성 배열을 빈 배열 []로 비워야 무한루프가 안 돕니다.
    loadTossPayments(CLIENT_KEY).then(setTossPayments);
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handlePayment = async () => {
    if (!tossPayments) return;

    if (!shippingInfo.receiverName || !shippingInfo.address || !shippingInfo.receiverPhone) {
      alert('배송지 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const orderName =
        selectedItems.length > 1 ? `${selectedItems[0].name} 외 ${selectedItems.length - 1}건` : selectedItems[0].name;

      const orderData = {
        receiverName: shippingInfo.receiverName,
        receiverPhone: shippingInfo.receiverPhone,
        address: `${shippingInfo.address} ${shippingInfo.detailAddress}`,

        totalAmount: amount,
        orderName: orderName,
        items: selectedItems.map(item => ({
          prdNo: item.prdNo || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // 주문 생성 요청
      const response = await fetch('http://localhost:8080/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('주문서 생성에 실패했습니다.');
      }

      const realPayNo = await response.json();
      console.log('생성된 결제번호:', realPayNo);

      await tossPayments.requestPayment('카드', {
        amount: amount,
        orderId: String(realPayNo),
        orderName: orderName,
        customerName: shippingInfo.receiverName,
        customerEmail: 'test@example.com',
        successUrl: `${window.location.origin}/routy-front#/payment/success`,
        failUrl: `${window.location.origin}/routy-front#/payment/fail`,
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      if (error.code !== 'USER_CANCEL') {
        alert(error.message || '결제 진행 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>주문/결제</h1>

        <div className="checkout-layout">
          <div className="checkout-main">
            <div className="section-card">
              <h2>배송지 정보</h2>
              <div className="input-group">
                <label>받는 분</label>
                <input
                  type="text"
                  name="receiverName"
                  value={shippingInfo.receiverName}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div className="input-group">
                <label>연락처</label>
                <input
                  type="text"
                  name="receiverPhone"
                  value={shippingInfo.receiverPhone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                />
              </div>
              <div className="input-group">
                <label>주소</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="기본 주소"
                  style={{ marginBottom: '8px' }}
                />
                <input
                  type="text"
                  name="detailAddress"
                  value={shippingInfo.detailAddress}
                  onChange={handleInputChange}
                  placeholder="상세 주소"
                />
              </div>
            </div>

            <div className="section-card">
              <h2>주문 상품 ({selectedItems.length}개)</h2>
              {selectedItems.map(item => (
                <div key={item.cartItemId} className="order-item-row">
                  <div className="item-info">
                    <span className="item-name">
                      [{item.brand}] {item.name}
                    </span>
                    <span className="item-qty">{item.quantity}개</span>
                  </div>
                  <span className="item-price">{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-sidebar">
            <div className="summary-card">
              <h3>최종 결제 금액</h3>
              <div className="price-row">
                <span>상품 금액</span>
                <span>{amount.toLocaleString()}원</span>
              </div>
              <div className="price-row total">
                <span>총 결제금액</span>
                <span className="total-price">{amount.toLocaleString()}원</span>
              </div>
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
