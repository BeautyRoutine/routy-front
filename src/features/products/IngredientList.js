import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const IngredientList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // 나중에 사용 예정
  //const navigate = useNavigate();

  const apiBaseUrl = 'http://localhost:8085/api/admin/ingredients';

  // paging
  const page = Number(searchParams.get('page')) || 1;
  const pageGap = 10; // 한 페이지 개수
  const [rowTotal, setRowTotal] = useState(0);

  // 검색 파라미터
  const ingName = searchParams.get('ing_name') || '';
  const ingAllergen = searchParams.get('ing_allergen') || '';

  // form input
  const [ingNameInput, setIngNameInput] = useState(ingName);
  const [ingAllergenInput, setIngAllergenInput] = useState(ingAllergen);

  // 데이터
  const [ingredients, setIngredients] = useState([]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    setSearchParams({
      page: 1,
      ing_name: ingNameInput,
      ing_allergen: ingAllergenInput,
    });
  };

  // 데이터 조회
  useEffect(() => {
    const loadData = async () => {
      const params = {
        page,
        page_gap: pageGap,
        ing_name: ingName,
        ing_allergen: ingAllergen,
      };

      try {
        const result = await axios.get(apiBaseUrl, { params });

        setIngredients(result.data.list || []);
        setRowTotal(result.data.total || 0);
      } catch (err) {
        console.error('성분 목록 불러오기 실패:', err);
      }
    };

    loadData();
  }, [page, pageGap, ingName, ingAllergen]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 text-center">🧪 성분 목록 관리</h3>

      {/* 검색 영역 */}
      <div className="card mb-4 shadow-sm" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-header bg-light fw-bold">🔍 성분 검색</div>
        <div className="card-body">
          <div className="row gy-3 align-items-center">
            {/* 성분명 검색 */}
            <div className="col-md-6 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '100px' }}>
                성분명 :
              </label>
              <input
                type="text"
                className="form-control"
                value={ingNameInput}
                onChange={e => setIngNameInput(e.target.value)}
                placeholder="성분명 검색"
              />
            </div>

            {/* 알러지 검색 */}
            <div className="col-md-6 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '100px' }}>
                알러지 :
              </label>
              <input
                type="text"
                className="form-control"
                value={ingAllergenInput}
                onChange={e => setIngAllergenInput(e.target.value)}
                placeholder="알러지명 검색"
              />
            </div>

            {/* 검색 버튼 */}
            <div className="col-md-12 text-center">
              <button className="btn btn-primary px-4" onClick={handleSearch}>
                🔎 검색
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-responsive">
        <div className="d-flex justify-content-end mb-2">
          <span className="text-muted">총 {rowTotal}건</span>
        </div>

        <table className="table table-bordered table-hover align-middle text-center shadow-sm rounded">
          <thead className="table-dark align-middle">
            <tr>
              <th>번호</th>
              <th>성분명</th>
              <th>알러지</th>
              <th>설명</th>
            </tr>
          </thead>

          <tbody>
            {ingredients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              ingredients.map(ing => (
                <tr key={ing.ingNo}>
                  <td>{ing.ingNo}</td>
                  <td>{ing.ingName}</td>
                  <td>{ing.ingAllergen}</td>
                  <td>{ing.ingDesc}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
      <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap">
        <div>
          {/* 이전 */}
          <button
            className="btn btn-outline-secondary mx-3"
            disabled={page <= 1}
            onClick={() =>
              setSearchParams({
                page: page - 1,
                ing_name: ingName,
                ing_allergen: ingAllergen,
              })
            }
          >
            ← 이전
          </button>

          {/* 페이지 번호 */}
          {Array.from({ length: Math.ceil(rowTotal / pageGap) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`btn ${p === page ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
              onClick={() =>
                setSearchParams({
                  page: p,
                  ing_name: ingName,
                  ing_allergen: ingAllergen,
                })
              }
            >
              {p}
            </button>
          ))}

          {/* 다음 */}
          <button
            className="btn btn-outline-secondary mx-3"
            disabled={page >= Math.ceil(rowTotal / pageGap)}
            onClick={() =>
              setSearchParams({
                page: page + 1,
                ing_name: ingName,
                ing_allergen: ingAllergen,
              })
            }
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientList;
