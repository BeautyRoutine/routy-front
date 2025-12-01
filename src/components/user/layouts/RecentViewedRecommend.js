import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecentViewedRecommend.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecentViewedRecommend = () => {
  const navigate = useNavigate();

  const [recommendData, setRecommendData] = useState({});
  const [subcateNames, setSubcateNames] = useState({});

  // 최근 본 상품
  const viewed = JSON.parse(localStorage.getItem('recentViewed') || '[]');

  useEffect(() => {
    if (viewed.length === 0) return;

    // 최근 본 subcate 추출 (최대 3개)
    const uniqueSubcates = [...new Set(viewed.map(v => v.subcate))].slice(0, 3);

    // subcate 번호 → 이름 매핑
    const subcateNameMap = {};
    viewed.forEach(v => {
      if (!subcateNameMap[v.subcate]) {
        subcateNameMap[v.subcate] = v.cate;
      }
    });
    setSubcateNames(subcateNameMap);

    // BE 요청
    axios
      .get('http://localhost:8080/api/products/list/recent', {
        params: { subcates: uniqueSubcates },
      })
      .then(res => {
        const data = res.data.data || {};

        const converted = {};
        for (const cate of Object.keys(data)) {
          converted[cate] = data[cate].map(p => ({
            id: p.prdNo,
            name: p.prdName,
            brand: p.prdCompany,
            rating: p.avgRating || 0,
            reviewText: `${p.reviewCount || 0}개의 리뷰`,
            img: `/images/${p.prdImg}`,
          }));
        }
        setRecommendData(converted);
      })
      .catch(err => console.error('추천 상품 불러오기 실패:', err));
  }, [viewed]);

  // 최근 본 상품이 없으면 숨김
  if (viewed.length === 0) return null;

  return (
    <div className="container my-5">
      {Object.keys(recommendData).map((subcateKey, index) => {
        const products = recommendData[subcateKey] || [];
        const cateName = subcateNames[subcateKey] || '추천';

        const filledProducts = [...products, ...Array(4 - products.length).fill(null)].slice(0, 4);

        return (
          <div key={index} className="mb-5">
            <div className="mb-3" style={{ textAlign: 'left' }}>
              <h4 className="fw-bold mb-1">이러한 “{cateName}” 상품은 어떠세요?</h4>
              <p className="text-muted small mb-0">최근에 본 {cateName} 제품을 기반으로 추천드려요</p>
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
      })}
    </div>
  );
};

export default RecentViewedRecommend;
