import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecommendedProducts.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecommendedProducts = () => {
  const categories = ['전체', '스킨', '로션', '에센스', '크림', '클렌징'];

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('전체');
  const categoriesLocal = ['전체', '스킨', '로션', '에센스', '크림', '클렌징'];

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
            review: p.prdDesc,
            img: `/images/product-${index + 1}.jpg`,
            category: categoriesLocal[index + 1] || '기타',
          };
        });

        setAllProducts(converted);
        setProducts(converted);
      })
      .catch(err => console.error('상품 불러오기 실패:', err));
  }, []);

  const filterByCategory = cat => {
    setActiveCategory(cat);
    if (cat === '전체') {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter(p => p.category === cat));
    }
  };

  const filledProducts = [...products, ...Array(4 - products.length).fill(null)].slice(0, 4);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">당신을 위한 맞춤 추천</h4>
          <p className="text-muted small mb-0">당신의 피부 타입에 맞는 제품을 찾아보세요</p>
        </div>
        <Link to="/products" className="text-decoration-none small text-muted">
          전체보기 &gt;
        </Link>
      </div>

      <div className="d-flex gap-2 flex-wrap mb-4">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`btn btn-sm rounded-pill px-3 ${
              activeCategory === cat ? 'btn-dark text-white' : 'btn-outline-secondary'
            }`}
            onClick={() => filterByCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {filledProducts.map((p, index) => (
          <div key={index} className="col">
            <div className="card h-100 border-0 shadow-sm product-card">
              {p ? (
                <>
                  <img src={p.img} className="card-img-top" alt={p.name} />
                  <div className="card-body">
                    <h6 className="fw-semibold mb-1">{p.name}</h6>
                    <p className="text-muted small mb-1">{p.brand}</p>
                    <p className="text-warning small mb-0">
                      ★ {p.rating} <span className="text-muted"> | {p.review}</span>
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
