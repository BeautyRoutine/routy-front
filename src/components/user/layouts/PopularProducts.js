import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './PopularProducts.css';

const PopularProducts = () => {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);

  const userNo = useSelector(state => state.user.currentUser?.userNo);
  const apiBaseUrl = useSelector(state => state.userConfig.apiBaseUrl);

  useEffect(() => {
    const commendProducts = async () => {
      const params = userNo ? { user_no: userNo } : undefined;
      try {
        const result = await axios.get(`${apiBaseUrl}/products/list/skin_commend`, { params });
        setItemList(Array.isArray(result.data.data) ? result.data.data : []);
      } catch (err) {
        console.log('❌ 목록 불러오기 실패', err);
      }
    };
    commendProducts();
  }, [userNo, apiBaseUrl]);

  const items = [...itemList, ...Array(Math.max(0, 4 - itemList.length)).fill(null)].slice(0, 4);

  return (
    <div className="container my-5">
      <div className="mb-3" style={{ textAlign: 'left' }}>
        <h4 className="fw-bold mb-1">당신을 위한 추천</h4>
        <p className="text-muted small mb-0">
          {userNo ? '피부타입과 행동을 기반으로 추천해드려요' : '인기 순위 기반으로 추천해드려요'}
        </p>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {items.map((item, index) => (
          <div key={index} className="col">
            <div
              className="card h-100 border-0 shadow-sm product-card"
              style={{ cursor: item ? 'pointer' : 'default' }}
              onClick={() => item && navigate(`/products/${item.prdNo}`)}
            >
              {item ? (
                <>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/product/${item.prdImg}`}
                    className="card-img-top"
                    alt={item.prdName}
                  />
                  <div className="card-body">
                    <h6 className="fw-semibold mb-1">{item.prdName}</h6>
                    <p className="text-muted small mb-1">{item.prdCompany}</p>
                    <p className="text-warning small mb-0">
                      {item.avgRating ? `★ ${item.avgRating} ` : ' '}
                      <span className="text-muted"> {item.reviewCount ? `${item.reviewCount}개의 리뷰` : ''}</span>
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

export default PopularProducts;
