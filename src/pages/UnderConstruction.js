import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/UnderConstruction.css';

const UnderConstruction = () => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // 카운트다운
    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 3초 뒤 이동
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      const from = params.get('from');

      // 잘못된 상품 → 홈
      if (from === 'invalid-product') {
        navigate('/', { replace: true });
      } else {
        navigate(-1);
      }
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [navigate, location.search]);

  return (
    <div className="under-overlay">
      <div className="under-content">
        <h1>해당 기능은 현재 준비 중입니다.</h1>
        <p className="sub-text">더 나은 서비스로 곧 찾아뵙겠습니다.</p>

        <h2>
          {count > 0
            ? `${count}초 후 홈으로 이동합니다`
            : '이동 중...'}
        </h2>

        <h1 className="en-title">Under Construction</h1>
        <p className="en-text">This page is currently under construction.</p>
      </div>
    </div>
  );
};

export default UnderConstruction;
