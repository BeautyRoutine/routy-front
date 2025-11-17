import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SimilarSkinProducts.css';
import { Heart } from 'lucide-react';
import axios from 'axios';

const SimilarSkinProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const prdNos = [101, 102, 103, 104];

    Promise.all(prdNos.map(no => axios.get(`http://localhost:8080/api/products/${no}`)))
      .then(responses => {
        const converted = responses.map((res, index) => {
          const p = res.data;

          return {
            id: p.prdNo,
            name: p.prdName,
            brand: p.prdCompany,
            rating: 4.7,
            tags: ['추천', '피부'],
            discount: null,
            price: p.prdPrice,
            original: null,
            img: `/images/product${index + 1}.jpg`, // 이미지 그대로 유지
          };
        });

        setProducts(converted);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container my-5 text-center similar-skin-section">
      <h5 className="fw-bold text-primary mb-1">비슷한 피부 타입 사용자들은 이걸 많이 선택했어요!</h5>
      <p className="text-muted small mb-4">건성·민감성 피부 사용자 12,440명이 선택</p>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map(p => (
          <div key={p.id} className="col">
            <div className="card h-100 border-0 shadow-sm product-card position-relative">
              {p.discount && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">{p.discount} OFF</span>
              )}

              <Heart size={20} className="position-absolute top-0 end-0 m-3 heart-icon" />

              <img src={p.img} className="card-img-top" alt={p.name} style={{ borderRadius: '10px' }} />

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

                <p className="small mb-2">⭐ {p.rating}</p>

                <h6 className="fw-bold text-dark">{p.price.toLocaleString()}원</h6>

                <button className="btn cart-btn w-100 mt-2">장바구니</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="btn btn-outline-primary rounded-pill px-4">더 많은 추천 상품 보기</button>
      </div>
    </div>
  );
};

export default SimilarSkinProducts;
