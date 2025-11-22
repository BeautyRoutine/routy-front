import React from 'react';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map(p => (
        <div key={p.prdNo} className="product-card">
          <img
            src={p.prdImg ? `/images/${p.prdImg}` : '/images/no-img.png'}
            alt={p.prdName}
            className="product-img"
          />

          <div className="product-info">
            <p className="brand">{p.prdCompany}</p>
            <p className="name">{p.prdName}</p>
            <p className="price">
              {p.prdPrice.toLocaleString()}원
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

