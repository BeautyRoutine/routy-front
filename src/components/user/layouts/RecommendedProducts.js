import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecommendedProducts.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecommendedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
  axios.get("http://localhost:8080/api/products/")
    .then(res => {
      const list = res.data.map((p) => ({
        id: p.prdNo,
        name: p.prdName,
        brand: p.prdCompany,
        rating: p.avgRating,
        reviewText: `${p.reviewCount}개의 리뷰`,
        img: `/images/${p.prdImg}` 
      }));

      setProducts(list);
    })
    .catch(err => console.error("추천 상품 불러오기 실패:", err));
}, []);


  const filledProducts = [...products, ...Array(4 - products.length).fill(null)].slice(0, 4);

  return (
    <div className="container my-5">
      {/* 타이틀 영역 */}
      <div className="mb-3" style={{ textAlign: 'left' }}>
        <h4 className="fw-bold mb-1">당신을 위한 추천</h4>
        <p className="text-muted small mb-0">인기 있는 핫 꿀탬</p>
      </div>

      {/* 추천 상품 카드 */}
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
                    <p className="text-warning small mb-0">
                      ★ {p.rating} <span className="text-muted"> | {p.reviewText}</span>
                    </p>
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
