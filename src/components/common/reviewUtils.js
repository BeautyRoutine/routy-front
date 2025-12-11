export const getUserColorName = code => {
  switch (code) {
    case 1:
      return '봄웜톤';
    case 2:
      return '여름쿨톤';
    case 3:
      return '가을웜톤';
    case 4:
      return '겨울쿨톤';
    default:
      return '';
  }
};

/**
 * 피부 타입 코드(Int)를 텍스트로 변환
 */
export const getUserSkinName = code => {
  if (code === 1) return '건성';
  if (code === 2) return '중성';
  if (code === 3) return '지성';
  if (code === 4) return '복합성';
  if (code === 5) return '수부지';
  if (code === 6) return '선택안함'; // 혹은 빈 문자열
  return '';
};

/**
 * 피부 타입과 퍼스널 컬러를 "건성 · 봄웜톤" 형태로 포맷팅
 */
export const formatUserInfo = (skin, color) => {
  const parts = [];
  const skinName = getUserSkinName(skin);
  const colorName = getUserColorName(color);

  if (skinName) parts.push(skinName);
  if (colorName) parts.push(colorName);

  return parts.join(' · ');
};
