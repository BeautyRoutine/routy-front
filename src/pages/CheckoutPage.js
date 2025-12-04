import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import './CheckoutPage.css';

const CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [tossPayments, setTossPayments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    receiverName: '',
    receiverPhone: '',
    zipCode: '', 
    roadAddress: '',
    detailAddress: '',
    deliveryMsg: '',
  });

  const { items, selectedItemIds } = useSelector(state => state.cart);
  const selectedItems = items.filter(item => selectedItemIds[item.cartItemId]);

  // 금액 계산 로직
  const productTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = productTotal >= 30000 ? 0 : 3000;
  const totalAmount = productTotal + deliveryFee; 

  // 토스 SDK 초기화
  useEffect(() => {
    loadTossPayments(CLIENT_KEY).then(setTossPayments);
  }, []);

  // 상품 검증
  useEffect(() => {
    if (selectedItems.length === 0) {
      alert('주문할 상품이 없습니다.');
      navigate('/cart');
    }
  }, [selectedItems.length, navigate]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handlePayment = async () => {
    if (!tossPayments) return;

    // 유효성 검사
    if (!shippingInfo.receiverName || !shippingInfo.roadAddress || !shippingInfo.receiverPhone) {
      alert('필수 배송 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const orderName =
        selectedItems.length > 1 ? `${selectedItems[0].name} 외 ${selectedItems.length - 1}건` : selectedItems[0].name;

      // OrderSaveRequestDTO 규격에 맞춘 데이터
      const orderData = {
        userNo: 1, // 나중에 로그인 정보에서 가져와야 함
        receiverName: shippingInfo.receiverName,
        receiverPhone: shippingInfo.receiverPhone,
        zipCode: parseInt(shippingInfo.zipCode) || 0, // 숫자로 변환
        roadAddress: shippingInfo.roadAddress,
        detailAddress: shippingInfo.detailAddress,
        deliveryMsg: shippingInfo.deliveryMsg,

        totalAmount: totalAmount, 
        deliveryFee: deliveryFee, 
        orderName: orderName,

        items: selectedItems.map(item => ({
          prdNo: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // 1. 주문 생성 요청
      const response = await fetch('http://localhost:8080/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('주문서 생성에 실패했습니다.');
      }

      // 주문번호(odNo) 받기
      const odNo = await response.json();
      console.log('생성된 주문번호:', odNo);

      // 주문번호를 최소 8자리 문자열로 변환 (예: 1 -> "00000001")
      // 토스 요구사항(6자 이상) 충족 + 백엔드 호환(숫자로 파싱 가능)
      const orderIdVal = String(odNo).padStart(8, '0');

      //  토스 결제창 띄우기 (orderId = odNo)
      await tossPayments.requestPayment('카드', {
        amount: totalAmount,
        orderId: orderIdVal, // 주문번호를 문자열로 변환
        orderName: orderName,
        customerName: shippingInfo.receiverName,
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
            {/* 배송지 정보 입력 */}
            <div className="section-card">
              <h2>배송지 정보</h2>
              <div className="input-group">
                <label>받는 분</label>
                <input
                  type="text"
                  name="receiverName"
                  value={shippingInfo.receiverName}
                  onChange={handleInputChange}
                  placeholder="이름"
                />
              </div>
              <div className="input-group">
                <label>연락처</label>
                <input
                  type="text"
                  name="receiverPhone"
                  value={shippingInfo.receiverPhone}
                  onChange={handleInputChange}
                  placeholder="- 없이 숫자만 입력"
                />
              </div>
              <div className="input-group">
                <label>주소</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    placeholder="우편번호"
                    style={{ width: '120px' }}
                  />
                </div>
                <input
                  type="text"
                  name="roadAddress"
                  value={shippingInfo.roadAddress}
                  onChange={handleInputChange}
                  placeholder="도로명 주소"
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
              <div className="input-group">
                <label>배송 요청사항</label>
                <input
                  type="text"
                  name="deliveryMsg"
                  value={shippingInfo.deliveryMsg}
                  onChange={handleInputChange}
                  placeholder="예: 문 앞에 놔주세요"
                />
              </div>
            </div>

            {/* 상품 정보 */}
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

          {/* 결제 요약 사이드바 */}
          <div className="checkout-sidebar">
            <div className="summary-card">
              <h3>최종 결제 금액</h3>
              <div className="price-row">
                <span>총 상품금액</span>
                <span>{productTotal.toLocaleString()}원</span>
              </div>
              <div className="price-row">
                <span>배송비</span>
                <span>{deliveryFee.toLocaleString()}원</span>
              </div>
              <div className="price-row total">
                <span>총 결제금액</span>
                <span className="total-price">{totalAmount.toLocaleString()}원</span>
              </div>
              <button className="btn-pay" onClick={handlePayment} disabled={!tossPayments || isLoading}>
                {isLoading ? '처리 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
