import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProductGrid.css';

const ProductGrid = ({ products, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleCardClick = prdNo => {
    if (!isLoggedIn) {
      navigate(`/products/${prdNo}`); // 제품 상세 페이지 확인용 코드
      // 비로그인 → 로그인 페이지로 이동
      // window.location.href = 'http://localhost:3000/routy-front#/login';
      return;
    }

    // 로그인 상태 → 상품 상세 페이지로 이동
    navigate(`/product/${prdNo}`);
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
              {/* 할인 배지 */}
              {p.discount && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">{p.discount} OFF</span>
              )}

              {/* 하트 버튼 */}
              <Heart size={20} className="position-absolute top-0 end-0 m-3 heart-icon" />

              {/* 상품 이미지 */}
              <img
                src={p.prdImg ? `/images/${p.prdImg}` : '/images/no-img.png'}
                alt={p.prdName}
                className="card-img-top product-img"
              />

              <div className="card-body text-start">
                <h6 className="fw-bold mb-1">{p.prdName}</h6>
                <p className="text-muted small mb-1">{p.prdCompany}</p>
                <h6 className="fw-bold text-dark">{p.prdPrice.toLocaleString()}원</h6>

                {/* 장바구니 버튼 (카드 클릭과 분리) */}
                <button
                  className="btn cart-btn w-100 mt-2"
                  onClick={e => {
                    e.stopPropagation(); // 카드 클릭 막기(임시 처리)
                    if (!isLoggedIn) {
                      alert('장바구니에 담겼습니다.');
                      return;
                    }
                    // 로그인 상태에서 장바구니 기능 넣고 싶으면 여기에
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
