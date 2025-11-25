import React, { useState } from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    price: [],
    brand: [],
    skin: [],
    func: []
  });

  const handleCheckbox = (category, value) => {
    const updated = filters[category].includes(value)
      ? filters[category].filter(v => v !== value)
      : [...filters[category], value];

    const newFilters = { ...filters, [category]: updated };
    setFilters(newFilters);
    onFilterChange(newFilters); // 부모에게 전달
  };

  return (
    <div className="left-filter-box p-3">
      <h6 className="fw-bold mb-3">필터</h6>

      {/* 가격대 */}
      <div className="filter-section mb-4">
        <h6 className="small fw-bold">가격대</h6>
        <ul className="list-unstyled small">
          <li><input type="checkbox" onChange={() => handleCheckbox('price', 'under1')} /> 1만원 이하</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('price', '1to3')} /> 1만원 ~ 3만원</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('price', '3to5')} /> 3만원 ~ 5만원</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('price', 'over5')} /> 5만원 이상</li>
        </ul>
      </div>

      {/* 브랜드 */}
      <div className="filter-section mb-4">
        <h6 className="small fw-bold">브랜드</h6>
        <ul className="list-unstyled small">
          <li><input type="checkbox" onChange={() => handleCheckbox('brand', '스킨푸드')} /> 스킨푸드</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('brand', '올리브영')} /> 올리브영</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('brand', '이니스프리')} /> 이니스프리</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('brand', '닥터지')} /> 닥터지</li>
        </ul>
      </div>

      {/* 피부타입 */}
      <div className="filter-section mb-4">
        <h6 className="small fw-bold">피부 타입</h6>
        <ul className="list-unstyled small">
          <li><input type="checkbox" onChange={() => handleCheckbox('skin', '건성')} /> 건성</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('skin', '지성')} /> 지성</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('skin', '복합성')} /> 복합성</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('skin', '민감성')} /> 민감성</li>
        </ul>
      </div>

      {/* 기능 */}
      <div className="filter-section mb-3">
        <h6 className="small fw-bold">기능</h6>
        <ul className="list-unstyled small">
          <li><input type="checkbox" onChange={() => handleCheckbox('func', '보습')} /> 보습</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('func', '진정')} /> 진정</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('func', '탄력')} /> 탄력</li>
          <li><input type="checkbox" onChange={() => handleCheckbox('func', '주름개선')} /> 주름개선</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryFilter;
