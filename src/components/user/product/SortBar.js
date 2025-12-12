import React from 'react';

const SortBar = ({ total, sort, onSortChange }) => {
  return (
    <div className="sortbar-container d-flex justify-content-between align-items-center mb-3">
      <select className="form-select w-auto" value={sort} onChange={e => onSortChange(e.target.value)}>
        <option value="popular">인기순</option>
        <option value="latest">최신순</option>
        <option value="lowprice">낮은 가격순</option>
        <option value="highprice">높은 가격순</option>
      </select>
    </div>
  );
};

export default SortBar;
