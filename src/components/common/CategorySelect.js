import React, { useState, useEffect } from 'react';
import api from '../../lib/apiClient';

/**
 * 카테고리 선택 컴포넌트
 *
 * @param {string|number} mainCate - 현재 선택된 메인 카테고리 번호
 * @param {string|number} subCate - 현재 선택된 서브 카테고리 번호
 * @param {function} onChange - 변경 시 호출될 콜백 ({ mainCate, subCate }) => void
 */
const CategorySelect = ({ mainCate, subCate, onChange }) => {
  const [categories, setCategories] = useState({});
  const [subOptions, setSubOptions] = useState({});

  // 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 메인 카테고리 조회 (서브 카테고리 정보도 포함되어 있다고 가정)
        const response = await api.get('/api/categories/main');
        setCategories(response.data || {});
      } catch (error) {
        console.error('카테고리 목록을 불러오는데 실패했습니다:', error);
      }
    };

    fetchCategories();
  }, []);

  // 메인 카테고리가 변경되거나 초기 로드 시 서브 카테고리 옵션 설정
  useEffect(() => {
    if (mainCate && categories[mainCate]) {
      setSubOptions(categories[mainCate].sub || {});
    } else {
      setSubOptions({});
    }
  }, [mainCate, categories]);

  const handleMainChange = e => {
    const newMain = e.target.value;
    // 메인이 바뀌면 서브는 초기화
    onChange({
      mainCate: newMain,
      subCate: '',
    });
  };

  const handleSubChange = e => {
    const newSub = e.target.value;
    onChange({
      mainCate: mainCate,
      subCate: newSub,
    });
  };

  return (
    <div className="d-flex gap-2">
      <select className="form-select" value={mainCate || ''} onChange={handleMainChange} name="prdMainCate">
        <option value="">대분류 선택</option>
        {Object.entries(categories).map(([id, category]) => (
          <option key={id} value={id}>
            {category.mainStr}
          </option>
        ))}
      </select>

      <select
        className="form-select"
        value={subCate || ''}
        onChange={handleSubChange}
        name="prdSubCate"
        disabled={!mainCate}
      >
        <option value="">소분류 선택</option>
        {Object.entries(subOptions).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
