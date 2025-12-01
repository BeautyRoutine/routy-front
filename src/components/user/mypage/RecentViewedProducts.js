import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_RECENT_VIEWS } from '../data/mypageMocks';
import './RecentViewedProducts.css';

const RecentViewedProducts = ({ products = DEMO_RECENT_VIEWS }) => {
  const navigate = useNavigate();

  const handleProductClick = id => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="recent-viewed-container">
      <h2 className="page-title">최근 본 상품</h2>

      <div className="list-info">
        <div>
          전체 <span className="count">{products.length}개</span>
        </div>
        <div>최근 본 상품은 최대 10개, 3일간 보관됩니다.</div>
      </div>

      <div className="recent-table-header">
        <span className="col-product">상품정보</span>
        <span className="col-price">판매가</span>
        <span className="col-date">본 날짜</span>
        <span className="col-manage">관리</span>
      </div>

      {products.length === 0 ? (
        <div className="empty-list">
          <div className="empty-icon">!</div>
          <p>최근 본 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="recent-items">
          {products.map(item => (
            <div key={item.id} className="recent-item">
              <div className="col-product" onClick={() => handleProductClick(item.id)} style={{ cursor: 'pointer' }}>
                <img src={item.image} alt={item.name} className="item-thumb" />
                <div className="item-text">
                  <span className="item-brand">{item.brand}</span>
                  <span className="item-name">{item.name}</span>
                </div>
              </div>
              <div className="col-price">
                {item.salePrice ? (
                  <div className="price-box">
                    <span className="original-price">{item.price.toLocaleString()}원</span>
                    <span className="sale-price">{item.salePrice.toLocaleString()}원</span>
                    <span className="discount-rate">{item.discount}%</span>
                  </div>
                ) : (
                  <span className="normal-price">{item.price.toLocaleString()}원</span>
                )}
              </div>
              <div className="col-date">{item.viewedDate}</div>
              <div className="col-manage">
                <button className="btn-cart">장바구니</button>
                <button className="btn-delete">삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentViewedProducts;
