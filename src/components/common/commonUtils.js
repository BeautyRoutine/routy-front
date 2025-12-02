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
