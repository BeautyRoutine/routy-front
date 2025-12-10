import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecentViewedRecommend.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecentViewedRecommend = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cateName, setCateName] = useState('');
  const [subcate, setSubcate] = useState(null);

  // 최근 본 상품 (10~20개)
  const viewed = JSON.parse(localStorage.getItem('recentViewed') || '[]');

  useEffect(() => {
    // localStorage는 useEffect 안에서만 읽는다
    const viewed = JSON.parse(localStorage.getItem('recentViewed') || '[]');

    if (viewed.length === 0) {
      setProducts([]);
      return;
    }

    // -----------------------------
    // 1) 최근 본 subcate 계산
    // -----------------------------
    const countMap = {};
    const cateMap = {};

    viewed.forEach(v => {
      const sc = v.subcate;
      if (!sc) return;
      countMap[sc] = (countMap[sc] || 0) + 1;
      cateMap[sc] = v.cate;
    });

    const entries = Object.entries(countMap);
    if (entries.length === 0) {
      setProducts([]);
      return;
    }

    const topSubcate = entries.sort((a, b) => b[1] - a[1])[0][0];

    setSubcate(Number(topSubcate));
    setCateName(cateMap[topSubcate]);

    // -----------------------------
    // 2) 백엔드 호출
    // -----------------------------
    axios
      .get('http://localhost:8080/api/products/list/recent', {
        params: { subcates: [topSubcate] },
      })
      .then(res => {
        const data = res.data.data || {};
        const arr = data[topSubcate] || [];

        const converted = arr.map(p => ({
          id: p.prdNo,
          name: p.prdName,
          brand: p.prdCompany,
          rating: p.avgRating || 0,
          reviewText: `${p.reviewCount || 0}개의 리뷰`,
          img: `/images/${p.prdImg}`,
        }));

        setProducts(converted);
      })
      .catch(err => console.error('추천 상품 불러오기 실패:', err));
  }, []); // ← 변경: dependency 배열은 빈 배열로 고정

  // 추천 4개 고정 (없으면 빈 칸)
  const filledProducts =
    products.length > 0 ? [...products, ...Array(4 - products.length).fill(null)].slice(0, 4) : Array(4).fill(null);

  return (
    <div className="container my-5">
      <div className="mb-3" style={{ textAlign: 'left' }}>
        <h4 className="fw-bold mb-1">{subcate ? `이러한 “${cateName}” 은 어떠세요?` : '최근 본 카테고리 기반 추천'}</h4>
        <p className="text-muted small mb-0">
          {subcate ? `최근에 본 ${cateName} 제품을 기반으로 추천드려요` : '최근에 본 상품을 기반으로 추천드려요'}
        </p>
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
