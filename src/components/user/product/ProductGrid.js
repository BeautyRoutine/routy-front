import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProductGrid.css';

const ProductGrid = ({ products, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleCardClick = prdNo => {
    navigate(`/products/${prdNo}`);
  };

  return (
    <div className="product-grid container my-4">
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map(p => (
          <div key={p.prdNo} className="col">
            <div
              className="card h-100 border-0 shadow-sm product-card position-relative"
              onClick={() => handleCardClick(p.prdNo)}
              style={{ cursor: 'pointer' }}
            >
              {/* 하트 버튼 */}
              <Heart
                size={20}
                className="position-absolute top-0 end-0 m-3 heart-icon"
              />

              {/* 상품 이미지 */}
              <img
                src={p.prdImg ? `/images/${p.prdImg}` : '/images/no-img.png'}
                alt={p.prdName}
                className="card-img-top product-img"
              />

              <div className="card-body text-start">

                {/* 브랜드 */}
                <p className="text-muted small mb-1">{p.prdCompany}</p>

                {/* 상품명 */}
                <h6 className="fw-bold mb-2">{p.prdName}</h6>

                {/* ★ 평점 + 리뷰수 */}
                <div className="d-flex align-items-center mb-2">
                  <Star size={16} color="#f4c150" fill="#f4c150" className="me-1" />
                  <span className="fw-semibold">{p.avgRating?.toFixed(1)}</span>
                  <span className="text-muted small ms-1">
                    ({p.reviewCount})
                  </span>
                </div>

                {/* 가격 */}
                <h6 className="fw-bold text-dark">{p.prdPrice.toLocaleString()}원</h6>

                {/* 장바구니 버튼 */}
                <button
                  className="btn cart-btn w-100 mt-2"
                  onClick={e => {
                    e.stopPropagation();
                    alert('장바구니 기능은 나중에 연결될 예정입니다.');
                  }}
                >
                  장바구니
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
