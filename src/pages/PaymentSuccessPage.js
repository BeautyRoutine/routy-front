import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [result, setResult] = useState(null);

  // Toss Payments가 리다이렉트 시 전달하는 쿼리 파라미터
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    async function confirmPayment() {
      try {
        // 1. 백엔드로 승인 요청 보내기
        const response = await fetch('http://localhost:8080/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount), // 숫자로 변환해서 전송
          }),
        });

        // 2. 응답 처리
        if (!response.ok) {
          // 백엔드에서 보낸 에러 메시지 읽기
          const errorMessage = await response.text();
          throw new Error(errorMessage || '결제 승인 실패');
        }

        // 3. 성공 시
        setResult({ type: 'SUCCESS', message: '결제가 정상적으로 완료되었습니다.' });
      } catch (error) {
        // 4. 실패 시
        console.error(error);
        setResult({ type: 'ERROR', message: error.message });
      } finally {
        setIsConfirming(false);
      }
    }

    if (paymentKey && orderId && amount) {
      confirmPayment();
    } else {
      setIsConfirming(false);
      setResult({ type: 'ERROR', message: '잘못된 접근입니다.' });
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

  return (
    <div className="result-container" style={{ textAlign: 'center', padding: '50px' }}>
      {result.type === 'SUCCESS' ? (
        <>
          <h1 style={{ color: 'blue' }}>🎉 결제 성공!</h1>
          <p>{result.message}</p>
          <div className="receipt">
            <p>주문번호: {orderId}</p>
            <p>결제금액: {Number(amount).toLocaleString()}원</p>
          </div>
          <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </>
      ) : (
        <>
          <h1 style={{ color: 'red' }}>😱 결제 실패</h1>
          <p>{result.message}</p>
          <button onClick={() => navigate('/cart')}>장바구니로 돌아가기</button>
        </>
      )}
    </div>
  );
}

export default PaymentSuccessPage;
