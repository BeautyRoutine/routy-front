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

//반응
export const FEEDBACK_OPTIONS = [
  // 긍정 (POSITIVE) - 100번대
  { code: 101, label: '촉촉함', type: 'POSITIVE' },
  { code: 102, label: '산뜻함', type: 'POSITIVE' },
  { code: 103, label: '부드러움', type: 'POSITIVE' },
  { code: 104, label: '향기로움', type: 'POSITIVE' },
  { code: 105, label: '깔끔한 사용감', type: 'POSITIVE' },
  { code: 106, label: '매끄러운 피부결', type: 'POSITIVE' },
  { code: 107, label: '은은한 향', type: 'POSITIVE' },
  { code: 108, label: '가벼운 질감', type: 'POSITIVE' },
  { code: 109, label: '편안한 향', type: 'POSITIVE' },
  { code: 110, label: '윤기있는', type: 'POSITIVE' },
  { code: 111, label: '자연스러운', type: 'POSITIVE' },
  { code: 112, label: '톤업', type: 'POSITIVE' },
  { code: 113, label: '만족스러운', type: 'POSITIVE' },
  { code: 114, label: '발림성', type: 'POSITIVE' },
  { code: 115, label: '수분감', type: 'POSITIVE' },
  { code: 116, label: '깨끗한 마무리감', type: 'POSITIVE' },

  // 부정 (NEGATIVE) - 500번대
  { code: 501, label: '건조함', type: 'NEGATIVE' },
  { code: 502, label: '트러블', type: 'NEGATIVE' },
  { code: 503, label: '가려움', type: 'NEGATIVE' },
  { code: 504, label: '붉은기', type: 'NEGATIVE' },
  { code: 505, label: '끈적임', type: 'NEGATIVE' },
  { code: 506, label: '번들거림', type: 'NEGATIVE' },
  { code: 507, label: '미끌거림', type: 'NEGATIVE' },
  { code: 508, label: '건조함', type: 'NEGATIVE' },
  { code: 509, label: '번들거림', type: 'NEGATIVE' },
  { code: 510, label: '따가움', type: 'NEGATIVE' },
  { code: 511, label: '알레르기', type: 'NEGATIVE' },
  { code: 512, label: '답답한', type: 'NEGATIVE' },
  { code: 513, label: '무거운 질감', type: 'NEGATIVE' },
  { code: 514, label: '자극적인 향', type: 'NEGATIVE' },
  { code: 515, label: '피부 자극', type: 'NEGATIVE' },
  { code: 516, label: '들뜸', type: 'NEGATIVE' },
  { code: 517, label: '밀림', type: 'NEGATIVE' },
  { code: 518, label: '불편한', type: 'NEGATIVE' },
  { code: 519, label: '비싼', type: 'NEGATIVE' },
  { code: 520, label: '지속력 부족', type: 'NEGATIVE' },
];

//리뷰 태그 이름 리스트 받아서 긍정 부정 나누기
export const classifyFeedback = feedbackNames => {
  const positive = [];
  const negative = [];

  if (!feedbackNames || feedbackNames.length === 0) {
    return { positive, negative };
  }

  feedbackNames.forEach(name => {
    // 배열에서 라벨 이름으로 찾기
    const found = FEEDBACK_OPTIONS.find(opt => opt.label === name);

    // 찾았는데 타입이 NEGATIVE면 부정, 아니면(못 찾았거나 POSITIVE면) 긍정
    if (found && found.type === 'NEGATIVE') {
      negative.push(name);
    } else {
      positive.push(name);
    }
  });

  return { positive, negative };
};
