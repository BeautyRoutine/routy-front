import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeLike } from '../../../features/user/userSlice';
import api from 'app/api';
import './LikeList.css';

const LikeList = ({ likes = { products: [], brands: [] } }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.user);
  const userNo = profile?.userNo;

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'brands'

  const items = activeTab === 'products' ? likes.products || [] : likes.brands || [];

  const handleAddToCart = async productId => {
    try {
      await api.post('/api/cart/items', {
        productId: productId,
        quantity: 1,
      });
      alert('장바구니에 추가되었습니다.');
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  const handleDelete = async productId => {
    if (window.confirm('좋아요 목록에서 삭제하시겠습니까?')) {
      await dispatch(removeLike({ userNo, productId, type: 'PRODUCT' }));
    }
  };

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
          <span>
            전체 <span className="count">{items.length}개</span>
          </span>
          <span>
            | 좋아요 상품은 최대 <span className="highlight">120일간</span> 보관됩니다.
          </span>
        </div>{' '}
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
                      <button className="btn-cart" onClick={() => handleAddToCart(item.productId)}>
                        장바구니
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(item.productId)}>
                        삭제
                      </button>
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
