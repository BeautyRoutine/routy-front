import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecentViewedRecommend.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecentViewedRecommend = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // 로그인 정보
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  // =================================================
  // 최근 본 상품 추천 API 호출
  // =================================================
  useEffect(() => {
    // case 1: 로그인 안 한 사용자 → 조회 안 함
    if (!userId) {
      setLoaded(true);
      setProducts([]);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products/list/recent`, {
        params: { userId },
      })
      .then(res => {
        const list = res.data.data || [];

        const converted = list.map(p => ({
          id: p.prdNo,
          name: p.prdName,
          brand: p.prdCompany,
          rating: p.avgRating || 0,
          reviewText: `${p.reviewCount || 0}개의 리뷰`,
          img: `/images/${p.prdImg}`,
        }));

        setProducts(converted);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
        setProducts([]);
      });
  }, [userId]);

  // =================================================
  // case 1: 로그인 안 한 사용자 → 숨김
  // =================================================
  if (!userId) {
    return null;
  }

  // =================================================
  // case 2: 로그인 O + 최근 본 상품 DB 없음 → 숨김
  // =================================================
  if (loaded && products.length === 0) {
    return null;
  }

  // =================================================
  // case 3: 로그인 O + 최근 본 상품 O → 보여줌
  // =================================================
  return (
    <div className="container my-5">
      <div className="mb-3" style={{ textAlign: 'left' }}>
        <h4 className="fw-bold mb-1">최근 본 카테고리 기반 추천</h4>
        <p className="text-muted small mb-0">
          최근에 본 상품을 기반으로 추천드려요
        </p>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.slice(0, 4).map(p => (
          <div key={p.id} className="col">
            <div
              className="card h-100 border-0 shadow-sm product-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <img src={p.img} className="card-img-top" alt={p.name} />
              <div className="card-body">
                <h6 className="fw-semibold mb-1">{p.name}</h6>
                <p className="text-muted small mb-1">{p.brand}</p>
                <p className="text-warning small mb-0">
                  ★ {p.rating}
                  <span className="text-muted"> | {p.reviewText}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentViewedRecommend;
