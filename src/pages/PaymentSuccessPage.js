import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [result, setResult] = useState(null);

  const getParam = key => {
    return searchParams.get(key) || new URLSearchParams(window.location.search).get(key);
  };

  const paymentKey = getParam('paymentKey');
  const orderId = getParam('orderId');
  const amount = getParam('amount');

  useEffect(() => {
    async function confirmPayment() {
      try {
        // 백엔드로 승인 요청
        const response = await fetch('http://localhost:8080/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        // 응답 처리
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || '결제 승인 API 호출 실패');
        }

        // 성공 시
        setResult({
          type: 'SUCCESS',
          message: '토스 결제 승인 및 DB 저장이 완료되었습니다.',
        });
      } catch (error) {
        console.error(error);
        setResult({
          type: 'ERROR',
          message: `[인증 실패] ${error.message}`,
        });
      } finally {
        setIsConfirming(false);
      }
    }

    // 파라미터가 있는지 확인
    if (paymentKey && orderId && amount) {
      confirmPayment();
    } else {
      setIsConfirming(false);
      // 어떤 파라미터가 없는지 디버깅용 표시
      setResult({
        type: 'ERROR',
        message: `파라미터 누락: Key=${paymentKey}, Order=${orderId}, Amt=${amount}`,
      });
    }
  }, [paymentKey, orderId, amount]);

  if (isConfirming) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>⏳ 결제 확인 중...</h2>
        <p>토스에서 결과가 도착했습니다. 저장 중입니다.</p>
      </div>
    );
  }

  return (
    <div className="result-container" style={{ textAlign: 'center', padding: '50px' }}>
      {result.type === 'SUCCESS' ? (
        <>
          <div style={{ fontSize: '50px' }}>🎉</div>
          <h1 style={{ color: 'blue' }}>인증 성공!</h1>
          <p>{result.message}</p>
          <div
            style={{
              background: '#f8f9fa',
              padding: '20px',
              display: 'inline-block',
              borderRadius: '10px',
              marginTop: '20px',
            }}
          >
            <p>주문번호: {orderId}</p>
            <p>결제금액: {Number(amount).toLocaleString()}원</p>
          </div>
          <br />
          <br />
          <button onClick={() => navigate('/')}>홈으로</button>
        </>
      ) : (
        <>
          <h1 style={{ color: 'red' }}>🚫 처리 실패</h1>
          <p>{result.message}</p>
          <button onClick={() => navigate('/cart')}>돌아가기</button>
        </>
      )}
    </div>
  );
}

export default PaymentSuccessPage;
