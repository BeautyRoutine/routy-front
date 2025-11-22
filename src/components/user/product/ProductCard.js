import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.prdImg} alt={product.prdName} className="product-img" />

      <h6 className="product-name">{product.prdName}</h6>
      <p className="product-price">{product.prdPrice.toLocaleString()}원</p>

      <div className="product-tags">
        <span>리뷰 {product.reviewCnt}</span>
        <span>⭐ {product.rating}</span>
      </div>
    </div>
  );
};

export default ProductCard;
