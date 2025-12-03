// src/components/common/commonUtils.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from './LoadingSpinner';

// 날짜 안전하게 분리
export const formatDateParts = value => {
  if (!value || value === '0000-00-00 00:00:00') {
    return { date: '-', time: '' };
  }
  const parts = String(value).trim().split(/\s+/);
  return { date: parts[0] || '-', time: parts[1] || '' };
};

// 뒤로가기 훅
export const useHandleBack = () => {
  const navigate = useNavigate();
  return () => navigate(-1);
};

// 렌더링 분기 처리
export const RenderingStateHandler = ({ loading, error, data }) => {
  if (loading) return <LoadingSpinner message="로딩 중입니다..." />;
  if (error) return <div className="text-danger text-center my-5">{error}</div>;
  if (!data) return <div className="text-center my-5">데이터를 찾을 수 없습니다.</div>;
  return null;
};

// 로딩 오버레이
export const LoadingOverlay = ({ show }) => {
  if (!show) return null;

  return (
    <div
      className="loading-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
