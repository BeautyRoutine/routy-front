// 마이페이지 UI에서 공통으로 사용하는 더미 데이터/폴백 값.
// 실제 API 연동 전, UI 개발을 빠르게 하기 위한 용도다.

export const DEMO_USER_PROFILE = {
  name: '감루타',
  tier: 'VIP',
  email: 'routy@example.com',
  tags: ['건성', '민감성'],
  points: 1250,
  reviews: 12,
  orders: 8,
  favorites: 24,
  skinConcerns: ['수분 부족', '유효 케어', '탄력 개선', '미백'],
};

export const DEMO_ORDER_STEPS = [
  { label: '주문접수', value: 0 },
  { label: '결제완료', value: 0 },
  { label: '배송준비중', value: 0 },
  { label: '배송중', value: 0 },
  { label: '배송완료', value: 1 },
];

export const DEMO_INGREDIENT_GROUPS = {
  focus: [
    { name: '히알루론산', desc: '수분을 오래 붙잡아 촉촉하게 유지', type: 'focus' },
    { name: '나이아신아마이드', desc: '톤 개선과 유수분 밸런스 케어', type: 'focus' },
    { name: '판테놀', desc: '민감 피부 진정', type: 'focus' },
    { name: '세라마이드', desc: '장벽 강화에 도움', type: 'focus' },
    { name: '비타민 C', desc: '투명도 개선', type: 'focus' },
  ],
  avoid: [
    { name: '알코올', desc: '건조/자극 유발 가능', type: 'avoid' },
    { name: '합성 향료', desc: '민감 시 트러블 주의', type: 'avoid' },
    { name: '과도한 각질제거 성분', desc: '자극으로 붉어짐 유발', type: 'avoid' },
  ],
};

export const DEMO_INGREDIENT_BLOCK_META = [
  { key: 'focus', label: '관심 성분' },
  { key: 'avoid', label: '피할 성분' },
];
