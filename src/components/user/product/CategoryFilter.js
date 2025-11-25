import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = () => {
  return (
    <div className="left-filter-box p-3">
      <h6 className="fw-bold mb-3">필터</h6>

      <div className="filter-section mb-4">
        <h6 className="small fw-bold">가격대</h6>
        <ul className="list-unstyled small">
          <li>
            <input type="checkbox" /> 1만원 이하
          </li>
          <li>
            <input type="checkbox" /> 1만원 ~ 3만원
          </li>
          <li>
            <input type="checkbox" /> 3만원 ~ 5만원
          </li>
          <li>
            <input type="checkbox" /> 5만원 이상
          </li>
        </ul>
      </div>

      <div className="filter-section mb-4">
        <h6 className="small fw-bold">브랜드</h6>
        <ul className="list-unstyled small">
          <li>
            <input type="checkbox" /> 스킨푸드
          </li>
          <li>
            <input type="checkbox" /> 올리브영
          </li>
          <li>
            <input type="checkbox" /> 이니스프리
          </li>
          <li>
            <input type="checkbox" /> 닥터지
          </li>
        </ul>
      </div>

      <div className="filter-section mb-4">
        <h6 className="small fw-bold">피부 타입</h6>
        <ul className="list-unstyled small">
          <li>
            <input type="checkbox" /> 건성
          </li>
          <li>
            <input type="checkbox" /> 지성
          </li>
          <li>
            <input type="checkbox" /> 복합성
          </li>
          <li>
            <input type="checkbox" /> 민감성
          </li>
        </ul>
      </div>

      <div className="filter-section mb-3">
        <h6 className="small fw-bold">기능</h6>
        <ul className="list-unstyled small">
          <li>
            <input type="checkbox" /> 보습
          </li>
          <li>
            <input type="checkbox" /> 진정
          </li>
          <li>
            <input type="checkbox" /> 탄력
          </li>
          <li>
            <input type="checkbox" /> 주름개선
          </li>
        </ul>
      </div>

      <button className="btn btn-primary w-100 rounded-pill">필터 적용</button>
    </div>
  );
};

export default CategoryFilter;
