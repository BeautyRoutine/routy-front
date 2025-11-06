import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SimilarSkinProducts.css';
import { Heart } from 'lucide-react';

const SimilarSkinProducts = () => {
  const products = [
    {
      id: 1,
      name: '히알루론산 앰플 세럼',
      brand: '메디큐브',
      rating: 4.9,
      tags: ['수분', '진정'],
      discount: '22%',
      price: 35000,
      original: 45000,
      img: '/images/product1.jpg',
    },
    {
      id: 2,
      name: '센텔라 진정 크림',
      brand: '닥터지',
      rating: 4.7,
      tags: ['진정', '장벽'],
      discount: null,
      price: 28000,
      original: null,
      img: '/images/product2.jpg',
    },
    {
      id: 3,
      name: '비타민 C 토너',
      brand: '라로슈포제',
      rating: 4.8,
      tags: ['광채', '진정'],
      discount: '20%',
      price: 32000,
      original: 40000,
      img: '/images/product3.jpg',
    },
    {
      id: 4,
      name: '약산성 클렌징 폼',
      brand: '코스알엑스',
      rating: 4.6,
      tags: ['진정', '약산성'],
      discount: null,
      price: 18000,
      original: null,
      img: '/images/product4.jpg',
    },
  ];

  return (
    <div className="container my-5 text-center similar-skin-section">
      {/* 타이틀 */}
      <h5 className="fw-bold text-primary mb-1">비슷한 피부 타입 사용자들은 이걸 많이 선택했어요!</h5>
      <p className="text-muted small mb-4">건성·민감성 피부 사용자 12,440명이 선택</p>

      {/* 상품 카드 */}
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map(p => (
          <div key={p.id} className="col">
            <div className="card h-100 border-0 shadow-sm product-card position-relative">
              {/* 할인 뱃지 */}
              {p.discount && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">{p.discount} OFF</span>
              )}
              {/* 하트 아이콘 */}
              <Heart size={20} className="position-absolute top-0 end-0 m-3 heart-icon" />

              {/* 이미지 */}
              <img src={p.img} className="card-img-top" alt={p.name} style={{ borderRadius: '10px' }} />

              {/* 카드 본문 */}
              <div className="card-body text-start">
                <h6 className="fw-bold mb-1">{p.name}</h6>
                <p className="text-muted small mb-1">{p.brand}</p>

                <div className="mb-2">
                  {p.tags.map((tag, i) => (
                    <span key={i} className="badge bg-light text-primary me-1">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="small mb-2">
                  ⭐ {p.rating}{' '}
                  {p.original && (
                    <span className="text-muted text-decoration-line-through ms-2">
                      {p.original.toLocaleString()}원
                    </span>
                  )}
                </p>

                <h6 className="fw-bold text-dark">{p.price.toLocaleString()}원</h6>

                <button className="btn cart-btn w-100 mt-2">장바구니</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="mt-4">
        <button className="btn btn-outline-primary rounded-pill px-4">더 많은 추천 상품 보기</button>
      </div>
    </div>
  );
};

export default SimilarSkinProducts;
