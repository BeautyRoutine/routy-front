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

export const DEMO_ORDERS = [
  {
    id: 'ORD-20251120-001',
    date: '2025.11.20',
    status: '배송중',
    items: [
      {
        id: 101,
        name: '퓨어 히알루론산 앰플 50ml',
        brand: '루티',
        price: 28000,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
      },
      {
        id: 102,
        name: '시카 카밍 토너 200ml',
        brand: '루티',
        price: 18000,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
      },
    ],
    totalAmount: 46000,
  },
  {
    id: 'ORD-20251015-002',
    date: '2025.10.15',
    status: '배송완료',
    items: [
      {
        id: 103,
        name: '비타민 C 세럼 30ml',
        brand: '루티',
        price: 32000,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
      },
    ],
    totalAmount: 32000,
  },
];

export const DEMO_CLAIMS = [
  {
    id: 'CLM-20250910-001',
    date: '2025.09.10',
    type: '취소',
    status: '취소완료',
    items: [
      {
        id: 104,
        name: '데일리 모이스처 크림 100ml',
        brand: '루티',
        price: 25000,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
      },
    ],
    reason: '단순변심',
  },
];

export const DEMO_LIKES = {
  products: [
    {
      id: 201,
      name: '그린티 밸런싱 로션',
      brand: '이니스프리',
      price: 18000,
      salePrice: 14400,
      discount: 20,
      image: 'https://via.placeholder.com/150',
      tags: ['진정', '수분'],
    },
    {
      id: 202,
      name: '어성초 진정 토너',
      brand: '아누아',
      price: 25000,
      salePrice: null,
      discount: 0,
      image: 'https://via.placeholder.com/150',
      tags: ['트러블케어'],
    },
  ],
  brands: [
    {
      id: 301,
      name: '루티 (Routy)',
      desc: '나만의 루틴을 찾아주는 스킨케어',
      image: 'https://via.placeholder.com/100',
    },
  ],
};

export const DEMO_MY_REVIEWS = [
  {
    id: 1,
    productName: '퓨어 히알루론산 앰플 50ml',
    productImage: 'https://via.placeholder.com/80',
    rating: 5,
    date: '2025.11.25',
    content: '촉촉하고 너무 좋아요. 재구매 의사 있습니다!',
    images: ['https://via.placeholder.com/150'],
    likes: 12,
  },
  {
    id: 2,
    productName: '시카 카밍 토너 200ml',
    productImage: 'https://via.placeholder.com/80',
    rating: 4,
    date: '2025.10.20',
    content: '진정 효과가 있는 것 같아요. 향도 무난합니다.',
    images: [],
    likes: 5,
  },
  // ... 무한 스크롤 테스트를 위한 추가 데이터 생성
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: 3 + i,
    productName: `테스트 상품 ${i + 1}`,
    productImage: 'https://via.placeholder.com/80',
    rating: 3 + (i % 3),
    date: '2025.09.15',
    content: `무한 스크롤 테스트용 리뷰 내용입니다. 번호: ${i + 1}`,
    images: [],
    likes: i,
  })),
];
