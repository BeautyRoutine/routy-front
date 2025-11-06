import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CategoryCircleButtons.css';
import { Percent, TrendingUp, Shuffle, Award, Gift, Store, Truck, Star, Zap, Package } from 'lucide-react';

const CategoryCircleButtons = () => {
  const categories = [
    { name: '할인특가', color: '#00c896', icon: <Percent size={24} color="white" /> },
    { name: '실시간랭킹', color: '#6c63ff', icon: <TrendingUp size={24} color="white" /> },
    { name: '보더이벤트', color: '#c050f1', icon: <Shuffle size={24} color="white" /> },
    { name: '워어드', color: '#222831', icon: <Award size={24} color="white" /> },
    { name: '핫브랜드', color: '#d948ef', icon: <Gift size={24} color="white" /> },
    { name: '스토어탐방', color: '#00b8d9', icon: <Store size={24} color="white" /> },
    { name: '지점배송', color: '#00c2b2', icon: <Truck size={24} color="white" /> },
    { name: '슈퍼리뷰', color: '#ffa000', icon: <Star size={24} color="white" /> },
    { name: '슈퍼특가', color: '#ff4b4b', icon: <Zap size={24} color="white" /> },
    { name: 'N혜택', color: '#00a8ff', icon: <Package size={24} color="white" /> },
  ];

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-center flex-wrap gap-3">
        {categories.map((cat, i) => (
          <div key={i} className="text-center">
            <div
              className="circle-icon d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon}
            </div>
            <small className="text-dark fw-semibold">{cat.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCircleButtons;
