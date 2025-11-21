import React, { useState } from 'react';
import { DEMO_LIKES } from '../data/mypageMocks';
import './LikeList.css';

const LikeList = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'brands'

  const items = activeTab === 'products' ? DEMO_LIKES.products : DEMO_LIKES.brands;

  return (
    <div className="like-list-container">
      <h2 className="page-title">좋아요</h2>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          상품
        </button>
        <button className={`tab-btn ${activeTab === 'brands' ? 'active' : ''}`} onClick={() => setActiveTab('brands')}>
          브랜드
        </button>
      </div>

      <div className="like-content">
        <div className="list-info">
          전체 <span className="count">{items.length}개</span> | 좋아요 상품은 최대{' '}
          <span className="highlight">120일간</span> 보관됩니다.
        </div>

        <div className="like-table-header">
          {activeTab === 'products' ? (
            <>
              <span className="col-product">상품</span>
              <span className="col-price">가격</span>
              <span className="col-manage">관리</span>
            </>
          ) : (
            <>
              <span className="col-brand">브랜드</span>
              <span className="col-desc">설명</span>
              <span className="col-manage">관리</span>
            </>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-list">
            <div className="empty-icon">!</div>
            <p>좋아요 {activeTab === 'products' ? '상품이' : '브랜드가'} 없습니다.</p>
          </div>
        ) : (
          <div className="like-items">
            {items.map(item => (
              <div key={item.id} className="like-item">
                {activeTab === 'products' ? (
                  <>
                    <div className="col-product">
                      <img src={item.image} alt={item.name} className="item-thumb" />
                      <div className="item-text">
                        <span className="item-brand">{item.brand}</span>
                        <span className="item-name">{item.name}</span>
                        <div className="item-tags">
                          {item.tags &&
                            item.tags.map(tag => (
                              <span key={tag} className="tag">
                                #{tag}
                              </span>
                            ))}
                        </div>
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
                    <div className="col-manage">
                      <button className="btn-cart">장바구니</button>
                      <button className="btn-delete">삭제</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-brand">
                      <img src={item.image} alt={item.name} className="brand-thumb" />
                      <span className="brand-name">{item.name}</span>
                    </div>
                    <div className="col-desc">{item.desc}</div>
                    <div className="col-manage">
                      <button className="btn-delete">삭제</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeList;
