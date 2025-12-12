import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecentViewedRecommend.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecentViewedRecommend = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // 로그인 정보 (localStorage)
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  // -----------------------------------------
  // 최근 본 상품 추천 API 호출 (userId 기반)
  // -----------------------------------------
  useEffect(() => {
    console.log("=== 최근 추천 컴포넌트 실행됨 ===");
    console.log("user:", user);

    if (!userId) {
      console.log("로그인 안됨 → 추천 숨김");
      setProducts([]);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products/list/recent`, {
        params: { userId }
      })
      .then(res => {
        console.log("추천 API 응답:", res.data);

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
      })
      .catch(err => {
        console.log("추천 API 오류:", err);
      });

  // ESLint 경고 제거: userId만 dependency로 둔다 (user는 넣으면 안 됨)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // -----------------------------------------
  // 추천 4칸 고정
  // -----------------------------------------
  const filledProducts =
    products.length > 0
      ? [...products, ...Array(4 - products.length).fill(null)].slice(0, 4)
      : Array(4).fill(null);

  return (
    <div className="container my-5">
      <div className="mb-3" style={{ textAlign: 'left' }}>
        <h4 className="fw-bold mb-1">최근 본 카테고리 기반 추천</h4>
        <p className="text-muted small mb-0">최근에 본 상품을 기반으로 추천드려요</p>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {filledProducts.map((p, idx) => (
          <div key={idx} className="col">
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
                      ★ {p.rating}
                      <span className="text-muted"> | {p.reviewText}</span>
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

export default RecentViewedRecommend;
