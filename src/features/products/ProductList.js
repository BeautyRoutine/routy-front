import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // API Base URL (관리자)
  const apiBaseUrl = 'http://localhost:8085/api/admin/products';

  // paging
  const page = Number(searchParams.get('page')) || 1;
  const pageGap = 10; // 한 페이지 개수
  const [rowTotal, setRowTotal] = useState(0);

  // data
  const [products, setProducts] = useState([]);

  // 검색 파라미터
  const prdName = searchParams.get('prd_name') || '';
  const prdCompany = searchParams.get('prd_company') || '';

  // form input
  const [prdNameInput, setPrdNameInput] = useState(prdName);
  const [prdCompanyInput, setPrdCompanyInput] = useState(prdCompany);

  const handleSearch = () => {
    setSearchParams({
      page: 1,
      prd_name: prdNameInput,
      prd_company: prdCompanyInput,
    });
  };

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      const params = {
        page,
        page_gap: pageGap,
        prd_name: prdName,
        prd_company: prdCompany,
      };

      try {
        const result = await axios.get(apiBaseUrl, { params });

        // 목록 + 총 개수 들어온다고 가정
        setProducts(result.data.list || []);
        setRowTotal(result.data.total || 0);
      } catch (err) {
        console.log('상품 목록 불러오기 실패:', err);
      }
    };
    loadData();
  }, [page, pageGap, prdName, prdCompany]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 text-center">🧴 상품 목록 관리</h3>

      {/* 검색 영역 */}
      <div className="card mb-4 shadow-sm" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-header bg-light fw-bold">🔍 상품 검색</div>
        <div className="card-body">
          <div className="row gy-3 align-items-center">
            <div className="col-md-6 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '100px' }}>
                상품명 :
              </label>
              <input
                type="text"
                className="form-control"
                value={prdNameInput}
                onChange={e => setPrdNameInput(e.target.value)}
                placeholder="상품명 검색"
              />
            </div>

            <div className="col-md-6 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '100px' }}>
                회사명 :
              </label>
              <input
                type="text"
                className="form-control"
                value={prdCompanyInput}
                onChange={e => setPrdCompanyInput(e.target.value)}
                placeholder="회사명 검색"
              />
            </div>

            <div className="col-md-12 text-center">
              <button className="btn btn-primary px-4" onClick={handleSearch}>
                🔎 검색
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 상품 추가 */}
      <div className="text-end mb-3">
        <button
          className='btn btn-success'
          onClick={() => navigate('/admin/products/add')}>
          ➕ 상품 추가
        </button>
      </div>
      {/* 테이블 */}
      <div className="table-responsive">
        <div className="d-flex justify-content-end mb-2">
          <span className="text-muted">총 {rowTotal}건</span>
        </div>

        <table className="table table-bordered table-hover align-middle text-center shadow-sm rounded">
          <thead className="table-dark align-middle">
            <tr>
              <th>상품번호</th>
              <th>이미지</th>
              <th>상품명</th>
              <th>회사</th>
              <th>가격</th>
              <th>재고</th>
              <th>상태</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.prdNo}>
                  <td
                    style={{ cursor: 'pointer', color: '#0d6efd', fontWeight: '500' }}
                    onClick={() => navigate(`/admin/products/detail/${p.prdNo}`)}
                  >
                    {p.prdNo}
                  </td>
                  <td>
                    <img
                      src={`/images/${p.prdImg}`}
                      alt="상품 이미지"
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </td>
                  <td
                    style={{ cursor: 'pointer', color: '#0d6efd', fontWeight: '500' }}
                    onClick={() => navigate(`/admin/products/detail/${p.prdNo}`)}
                  >
                    {p.prdName}
                  </td>
                  <td>{p.prdCompany}</td>
                  <td>{p.prdPrice?.toLocaleString()}원</td>
                  <td>{p.prdStock}</td>
                  <td>{p.prdStatus || '정상'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
      <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap">
        <div>
          <button
            className="btn btn-outline-secondary mx-3"
            disabled={page <= 1}
            onClick={() =>
              setSearchParams({
                page: page - 1,
                prd_name: prdName,
                prd_company: prdCompany,
              })
            }
          >
            ← 이전
          </button>

          {Array.from({ length: Math.ceil(rowTotal / pageGap) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`btn ${p === page ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
              onClick={() =>
                setSearchParams({
                  page: p,
                  prd_name: prdName,
                  prd_company: prdCompany,
                })
              }
            >
              {p}
            </button>
          ))}

          <button
            className="btn btn-outline-secondary mx-3"
            disabled={page >= Math.ceil(rowTotal / pageGap)}
            onClick={() =>
              setSearchParams({
                page: page + 1,
                prd_name: prdName,
                prd_company: prdCompany,
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

export default ProductList;
