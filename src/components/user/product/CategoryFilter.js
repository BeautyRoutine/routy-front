import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryFilter.css";

const CategoryFilter = () => {
  const navigate = useNavigate();

  // 가격 상태
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 브랜드 상태
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  const allBrands = ["이니스프리", "닥터지", "라네즈", "더샘", "토니모리"];
  const filteredBrands = allBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // 피부 타입 (단일 선택)
  const [skinType, setSkinType] = useState(null);

  const skinOptions = [
    { key: "dry", label: "건성" },
    { key: "oily", label: "지성" },
    { key: "complex", label: "복합성" },
    { key: "sensitive", label: "민감성" },
  ];

  // 필터 적용 → QueryString 반영
  const applyFilter = () => {
    const params = new URLSearchParams();

    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);

    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="left-filter-box">
      {/* 필터 헤더 */}
      <div className="filter-header">
        <h6 className="fw-bold">필터</h6>
      </div>

      {/* 필터 내용 */}
      <div className="filter-content">

        {/* 가격대 */}
        <h6 className="small fw-bold mt-2">가격대</h6>
        <div className="d-flex align-items-center gap-2 mt-2 mb-4">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="최소가격"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>~</span>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="최대가격"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* 브랜드 */}
        <h6 className="small fw-bold">브랜드</h6>

        <div
          className="brand-dropdown-header mt-2"
          onClick={() => setBrandOpen(!brandOpen)}
        >
          브랜드 선택 ▼
        </div>

        {brandOpen && (
          <div className="brand-dropdown p-2 mt-2 mb-4">
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="브랜드 검색"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
            />

            <ul className="list-unstyled small brand-list">
              {filteredBrands.map((brand) => (
                <li
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    readOnly
                  />{" "}
                  {brand}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 피부 타입 */}
        <h6 className="small fw-bold mt-3">피부 타입</h6>
        <ul className="list-unstyled small mt-2 mb-2">
          {skinOptions.map((opt) => (
            <li
              key={opt.key}
              onClick={() => setSkinType(opt.key)}
              style={{ cursor: "pointer" }}
            >
              <input
                type="checkbox"
                readOnly
                checked={skinType === opt.key}
              />{" "}
              {opt.label}
            </li>
          ))}
        </ul>

        {/* 필터 적용 버튼 */}
        <button className="filter-apply-btn w-100 mt-3" onClick={applyFilter}>
          필터 적용
        </button>

      </div>
    </div>
  );
};

export default CategoryFilter;
