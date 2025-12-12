import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../lib/apiClient'; // ★ 반드시 수정 필요: 네 프로젝트 경로에 맞게
import './CategoryFilter.css';

const CategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 가격 상태
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  // 브랜드 상태
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [brandList, setBrandList] = useState([]); // ★ DB 브랜드 목록
  const [selectedBrands, setSelectedBrands] = useState((searchParams.get('brand') || '').split(',').filter(Boolean));

  // ★ 브랜드 목록을 DB에서 가져옴
  useEffect(() => {
    api
      .get('/api/products/brand/list')
      .then(res => {
        setBrandList(res.data.data || []);
      })
      .catch(err => console.error(err));
  }, []);

  // 브랜드 검색 필터링
  const filteredBrands = brandList.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

  const toggleBrand = brand => {
    let updated = [];

    if (selectedBrands.includes(brand)) {
      updated = selectedBrands.filter(b => b !== brand);
    } else {
      updated = [...selectedBrands, brand];
    }

    setSelectedBrands(updated);
  };

  // 피부 타입 (단일 선택)
  const [skinType, setSkinType] = useState(searchParams.get('skin') || null);

  const skinOptions = [
    { key: 'oily', label: '지성' },
    { key: 'dry', label: '건성' },
    { key: 'sensitive', label: '민감성' },
  ];

  // 필터 적용 (기존 파라미터 유지)
  const applyFilter = () => {
    const params = new URLSearchParams(searchParams);

    // 가격
    if (minPrice) params.set('min_price', minPrice);
    else params.delete('min_price');

    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');

    // 브랜드
    if (selectedBrands.length > 0) {
      params.set('brand', selectedBrands.join(','));
    } else {
      params.delete('brand');
    }

    // 피부 타입
    if (skinType) params.set('skin', skinType);
    else params.delete('skin');

    setSearchParams(params);
  };

  return (
    <div className="left-filter-box">
      {/* 필터 헤더 */}
      <div className="filter-header">
        <h6 className="fw-bold">필터</h6>
      </div>

      <div className="filter-content">
        {/* 가격대 */}
        <h6 className="small fw-bold mt-2">가격대</h6>
        <div className="d-flex align-items-center gap-2 mt-2 mb-4">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="최소가격"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <span>~</span>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="최대가격"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>

        {/* 브랜드 */}
        <h6 className="small fw-bold">브랜드</h6>
        <div className="brand-dropdown-header mt-2" onClick={() => setBrandOpen(!brandOpen)}>
          브랜드 선택 ▼
        </div>

        {brandOpen && (
          <div className="brand-dropdown p-2 mt-2 mb-4">
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="브랜드 검색"
              value={brandSearch}
              onChange={e => setBrandSearch(e.target.value)}
            />

            <ul className="list-unstyled small brand-list">
              {filteredBrands.map(brand => (
                <li key={brand} onClick={() => toggleBrand(brand)}>
                  <input type="checkbox" checked={selectedBrands.includes(brand)} readOnly /> {brand}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 피부 타입 */}
        <h6 className="small fw-bold mt-3">피부 타입</h6>
        <ul className="list-unstyled small mt-2 mb-2">
          {skinOptions.map(opt => (
            <li
              key={opt.key}
              onClick={() => setSkinType(prev => (prev === opt.key ? '' : opt.key))}
              style={{ cursor: 'pointer' }}
            >
              <input type="checkbox" readOnly checked={skinType === opt.key} /> {opt.label}
            </li>
          ))}
        </ul>

        {/* 초기화 버튼 */}
        <button
          className="filter-reset-btn w-100 mt-1 mb-2"
          onClick={() => {
            // 상태 초기화
            setMinPrice('');
            setMaxPrice('');
            setSelectedBrands([]);
            setSkinType('');

            // URL 파라미터 초기화
            const params = new URLSearchParams(searchParams);

            params.delete('min_price');
            params.delete('max_price');
            params.delete('brand');
            params.delete('skin');

            setSearchParams(params);
          }}
        >
          필터 초기화
        </button>
        {/* 적용 버튼 */}
        <button className="filter-apply-btn w-100 mt-1" onClick={applyFilter}>
          필터 적용
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;
