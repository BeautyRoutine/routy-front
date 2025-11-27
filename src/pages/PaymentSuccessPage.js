import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [error, setError] = useState(null);

  // Toss Payments가 리다이렉트 시 전달하는 쿼리 파라미터
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  // 결제 승인 API 호출 (실제 환경에서는 백엔드에서 처리해야 함)
  useEffect(() => {
    async function confirmPayment() {
      // TODO: 실제로는 백엔드 API를 통해 결제 승인 처리
      // const response = await fetch('/api/payments/confirm', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paymentKey, orderId, amount })
      // });

      // 테스트 환경에서는 바로 성공 처리
      setTimeout(() => {
        setIsConfirming(false);
      }, 1000);
    }

    if (paymentKey && orderId && amount) {
      confirmPayment();
    } else {
      setError('잘못된 결제 정보입니다.');
      setIsConfirming(false);
    }
  }, [paymentKey, orderId, amount]);

  if (isConfirming) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>결제 승인 처리 중...</h2>
        <p style={{ color: '#666' }}>잠시만 기다려주세요</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#dc3545' }}>❌ 오류</h1>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          홈으로 가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#0284c7' }}>🎉 결제 성공!</h1>
      <p>테스트 결제가 정상적으로 완료되었습니다.</p>

      <div
        style={{
          background: '#f8fafc',
          padding: '20px',
          margin: '20px auto',
          maxWidth: '500px',
          borderRadius: '8px',
          textAlign: 'left',
        }}
      >
        <p>
          <b>주문번호:</b> {orderId}
        </p>
        <p>
          <b>결제금액:</b> {Number(amount).toLocaleString()}원
        </p>
        <p>
          <b>Payment Key:</b> {paymentKey}
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          background: '#0284c7',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        홈으로 가기
      </button>
    </div>
  );
}
