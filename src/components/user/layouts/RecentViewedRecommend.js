import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecentViewedRecommend.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecentViewedRecommend = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [recentCate, setRecentCate] = useState(null);

  // 로그인 여부
  const isLoggedIn = !!localStorage.getItem('accessToken');

  // 최근 본 상품
  const viewed = JSON.parse(localStorage.getItem('recentViewed') || '[]');

  // useEffect는 항상 컴포넌트 최상단에서 호출되어야 함
  useEffect(() => {
    if (!isLoggedIn) return;
    if (viewed.length === 0) return;

    const recentItem = viewed[0];
    setRecentCate(recentItem.cate);

    const subcate = recentItem.subcate;
    const recentNos = viewed.map(v => v.prdNo);

    axios
      .get('http://localhost:8080/api/products/list/recent', {
        params: {
          subcate: subcate,
          recent: recentNos,
        },
      })
      .then(res => {
        const list = (res.data.data || []).map(p => ({
          id: p.prdNo,
          name: p.prdName,
          brand: p.prdCompany,
          rating: p.avgRating || 0,
          reviewText: `${p.reviewCount || 0}개의 리뷰`,
          img: `/images/${p.prdImg}`,
        }));
        setProducts(list);
      })
      .catch(err => console.error('추천 상품 불러오기 실패:', err));
  }, [isLoggedIn, viewed]);

  // 렌더링 조건은 useEffect 아래에 있어야 ESLint가 불만 없음
  if (!isLoggedIn) return null;
  if (viewed.length === 0) return null;

  // 카드 채우기
  const filledProducts = [...products, ...Array(4 - products.length).fill(null)].slice(0, 4);

  return (
    <div className="container my-5">
      <div className="mb-3" style={{ textAlign: 'left' }}>
        <h4 className="fw-bold mb-1">
          {recentCate ? `이러한 “${recentCate}” 상품은 어떠세요?` : '당신을 위한 추천'}
        </h4>
        <p className="text-muted small mb-0">
          {recentCate
            ? `최근에 본 ${recentCate} 제품을 기반으로 추천드려요`
            : '최근 본 제품을 기반으로 추천드려요'}
        </p>
      </div>

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

export default RecentViewedRecommend;
