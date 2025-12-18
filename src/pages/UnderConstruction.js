import React, { useEffect, useRef, useState } from 'react';
import '../styles/UnderConstruction.css';

const UnderConstruction = () => {
  const [count, setCount] = useState(3);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const startCountdown = () => {
      // hash가 underconstruction이 아닐 때는 무시
      if (window.location.hash !== '#underconstruction') return;

      // 초기화
      setCount(3);

      // 혹시 남아있을 타이머 정리
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

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

      // 3초 뒤 이전 페이지로 이동
      timeoutRef.current = setTimeout(() => {
        window.history.back();
      }, 3000);
    };

    // 최초 진입 시 1회 체크
    startCountdown();

    // hash 변경 감지
    window.addEventListener('hashchange', startCountdown);

    return () => {
      window.removeEventListener('hashchange', startCountdown);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div id="underconstruction" className="under-overlay">
      <div className="under-content">
        <h1>해당 기능은 현재 준비 중입니다.</h1>

        <p className="sub-text">
          더 나은 서비스로 곧 찾아뵙겠습니다.
        </p>

        <h2>
          {count > 0
            ? `${count}초 후 이전 페이지로 이동합니다`
            : '이전 페이지로 이동 중...'}
        </h2>

        <h1 className="en-title">Under Construction</h1>
        <p className="en-text">
          This page is currently under construction.
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
