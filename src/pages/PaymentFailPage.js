import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Toss Payments가 전달하는 실패 정보
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#dc3545' }}>❌ 결제 실패</h1>
      <p style={{ fontSize: '16px', margin: '20px 0' }}>{message || '결제 처리 중 오류가 발생했습니다.'}</p>

      <div
        style={{
          background: '#f8f9fa',
          padding: '20px',
          margin: '20px auto',
          maxWidth: '500px',
          borderRadius: '8px',
          textAlign: 'left',
        }}
      >
        {code && (
          <p style={{ margin: '8px 0' }}>
            <b>에러 코드:</b> {code}
          </p>
        )}
        {orderId && (
          <p style={{ margin: '8px 0' }}>
            <b>주문번호:</b> {orderId}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
        <button
          onClick={() => navigate('/checkout')}
          style={{
            padding: '12px 24px',
            background: '#0284c7',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          다시 결제하기
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
}

export default PaymentFailPage;
