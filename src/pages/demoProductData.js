export const dummyProductData = {
  // --- [GET] /api/products/{prdNo} ---
  productInfo: {
    prdNo: 101,
    prdName: '히알루론산 앰플 세럼',
    prdPrice: 45000,
    prdVolume: 50,
    prdCompany: '이니스프리',
    prdMainCate: '스킨/케어',
    prdSubCate: '세럼',
    prdDesc:
      '<p>5가지 분자 크기의 복합 히알루론산으로 깊은 보습을 선사하는 프리미엄 세럼입니다. 상세한 설명은 상품정보 탭을 확인해주세요.</p>',
    //이미지 여러장 받아야 함 백엔드 수정 필수
    images: {
      gallery: ['/images/product-main.jpg', '/images/product-thumb-1.jpg', '/images/product-thumb-2.jpg'],
      detail: ['/images/product-long-description.jpg'],
    },
  },

  // --- [GET] /api/products/{prdNo}/reviews ---
  reviewInfo: {
    summary: {
      totalCount: 702,
      averageRating: 4.9,
      // 별점 분포 이거도 구현해야함.
      distribution: { 5: 650, 4: 40, 3: 10, 2: 1, 1: 1 },
    },
    reviews: [
      {
        revNo: 201,
        userName: '뷰티마스터',
        revRank: 'A',
        revStar: 5,
        revGood: '3N년 수부지 인생템 등극입니다. 속건조를 완벽하게 잡아줘요.',
        revBad: '용량이 조금 아쉬워요. 대용량 만들어주세요!',
        revImg: '/images/review-1.jpg',
        revDate: '2025-10-29',
        likeCount: 158,
        isLiked: true, // 좋아요 눌렀는지 체크하려면 필요
        feedback: ['보습력', '흡수력', '저자극'], // 피드백 어떻게 받아올지
      },
      {
        revNo: 202,
        userName: '코덕입문',
        revRank: 'C',
        revStar: 4,
        revGood: '피부과 추천으로 써봤는데 왜 이제 알았을까요? 트러블도 안나고 좋아요.',
        revBad: '향이 조금 제 취향은 아니에요.',
        revImg: null,
        revDate: '2025-10-27',
        likeCount: 92,
        isLiked: false,
        feedback: ['보습력', '피부결개선'],
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      totalCount: 702,
      totalPages: 71,
    },
  },

  // --- [GET] /api/products/{prdNo}/ingredients ---
  ingredientInfo: {
    totalCount: 3,
    ingredients: [
      {
        ingNo: 101,
        ingName: '정제수',
        ingEngName: 'Water',
        ingAllergen: 0,
        ingDanger: 0,
        ingFunctional: null,
      },
      {
        ingNo: 102,
        ingName: '부틸렌글라이콜',
        ingEngName: 'Butylene Glycol',
        ingAllergen: 1,
        ingDanger: 0,
        ingFunctional: '각질 제거',
      },
      {
        ingNo: 103,
        ingName: '나이아신아마이드',
        ingEngName: 'Niacinamide',
        ingAllergen: 0,
        ingDanger: 0,
        ingFunctional: '미백',
      },
    ],
  },

  // --- 기타 정적 데이터 ---
  purchaseInfo: {
    shipping: '배송비 3,000원 (50,000원 이상 구매 시 무료)',
    refund: '단순 변심으로 인한 교환/환불은 상품 수령 후 7일 이내에 가능합니다.',
  },
};
