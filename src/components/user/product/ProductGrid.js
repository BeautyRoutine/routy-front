import React from 'react';
import { Heart } from 'lucide-react';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid container my-4">
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map(p => (
          <div key={p.prdNo} className="col">
            <div className="card h-100 border-0 shadow-sm product-card position-relative">
              {/* 할인 배지(필요시) */}
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

                <button className="btn cart-btn w-100 mt-2">장바구니</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
