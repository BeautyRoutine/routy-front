import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from 'app/api';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [result, setResult] = useState(null);

  const hasCalledRef = useRef(false);

  const getParam = key => {
    return searchParams.get(key) || new URLSearchParams(window.location.search).get(key);
  };

  const paymentKey = getParam('paymentKey');
  const orderId = getParam('orderId');
  const amount = getParam('amount');

  useEffect(() => {
    if (hasCalledRef.current) return;
    async function confirmPayment() {
      try {
        hasCalledRef.current = true;
        // 백엔드로 승인 요청
        await api.post('/api/payments/confirm', {
          paymentKey,
          orderId,
          amount: Number(amount),
        });

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
          <h1 style={{ color: 'blue' }}>결제 완료!</h1>
          <p>주문이 정상적으로 완료되었습니다.</p>
          <div
            style={{
              background: '#f8f9fa',
              padding: '20px',
              display: 'inline-block',
              borderRadius: '10px',
              marginTop: '20px',
            }}
          >
            <p>결제금액: {Number(amount).toLocaleString()}원</p>
          </div>
          <br />
          <br />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/mypage')}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                backgroundColor: '#0d6efd',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              마이 페이지
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              홈으로
            </button>
          </div>
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
