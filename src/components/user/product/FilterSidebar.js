import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = () => {
  return (
    <div className="filter-sidebar">
      <h5>필터</h5>

      <div className="filter-section">
        <p>가격대</p>
        <label>
          <input type="checkbox" /> 1만원 이하
        </label>
        <label>
          <input type="checkbox" /> 1만원 - 3만원
        </label>
        <label>
          <input type="checkbox" /> 3만원 - 5만원
        </label>
        <label>
          <input type="checkbox" /> 5만원 이상
        </label>
      </div>

      <div className="filter-section">
        <p>브랜드</p>
        <label>
          <input type="checkbox" /> 설화수
        </label>
        <label>
          <input type="checkbox" /> 에스트라
        </label>
        <label>
          <input type="checkbox" /> 라네즈
        </label>
        <label>
          <input type="checkbox" /> 헤라
        </label>
      </div>

      <div className="filter-section">
        <p>피부 타입</p>
        <label>
          <input type="checkbox" /> 건성
        </label>
        <label>
          <input type="checkbox" /> 지성
        </label>
        <label>
          <input type="checkbox" /> 중성
        </label>
        <label>
          <input type="checkbox" /> 민감성
        </label>
      </div>

      <button className="filter-apply-btn">필터 적용</button>
    </div>
  );
};

export default FilterSidebar;
