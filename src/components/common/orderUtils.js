/**
 * ORDERS 테이블 관련 특정 필드값의 텍스트 변환값을 반환하는 용도.
 */

// 배송 출입방법 텍스트 변환
export const getDeliveryKeyText = (type, key) => {
  if (type === 2) return '자유출입가능';
  if (type === 1 && (key === null || key === undefined || key === '')) return '없음';
  return `공동현관번호: ${key ?? '-'}`;
};

// 접수 종류 텍스트 변환
export const getTypeText = value => {
  if (value === 11) return '배송';
  if (value === 12) return '재배송';
  if (value === 13) return '취소';
  if (value === 21) return '교환회수';
  if (value === 22) return '교환재발송';
  if (value === 31) return '반품회수';
  return '';
};

// 배송 상태 텍스트 변환
export const getStatusText = value => {
  if (value === 1) return '배송준비중';
  if (value === 2) return '집화완료';
  if (value === 3) return '배송중';
  if (value === 4) return '지점 도착';
  if (value === 5) return '배송출발';
  if (value === 6) return '배송 완료';
  return '';
};

// 날짜 안전하게 분리 (null 처리 포함)
export const formatDateParts = value => {
  if (!value) return { date: '-', time: '' };
  const parts = String(value).trim().split(/\s+/);
  return { date: parts[0] || '-', time: parts[1] || '' };
};
