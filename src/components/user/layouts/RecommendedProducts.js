import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecommendedProducts.css';
import { useNavigate } from 'react-router-dom';

// 범용 추천 상품 컴포넌트 이를 수정하여 기능 추가할 것
const RecommendedProducts = ({ title, subtitle, products }) => {
  const navigate = useNavigate();

  // 항상 4칸 유지 (상품 부족 시 null로 채움)
  const filledProducts = [...(products || []), ...Array(4 - (products?.length || 0)).fill(null)].slice(0, 4);

  return (
    <div className="container my-5">
      {/* 타이틀 */}
      <div className="mb-3" style={{ textAlign: 'left' }}>
        <h4 className="fw-bold mb-1">{title || '추천 상품'}</h4>
        {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
      </div>

      {/* 카드 목록 */}
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {filledProducts.map((p, index) => (
          <div key={index} className="col">
            <div
              className="card h-100 border-0 shadow-sm product-card"
              style={{ cursor: p ? 'pointer' : 'default' }}
              onClick={() => p && navigate(`/products/${p.id}`)}
            >
              {p ? (
                <>
                  <img src={p.img} className="card-img-top" alt={p.name} />
                  <div className="card-body">
                    <h6 className="fw-semibold mb-1">{p.name}</h6>
                    <p className="text-muted small mb-1">{p.brand}</p>
                    {p.rating && (
                      <p className="text-warning small mb-0">
                        ★ {p.rating}
                        {p.reviewText && <span className="text-muted"> | {p.reviewText}</span>}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="empty-card-img"></div>
                  <div className="card-body">
                    <h6 className="fw-semibold mb-1 text-muted">상품 없음</h6>
                    <p className="text-muted small mb-0">추천 준비중</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
