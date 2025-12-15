import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setItems, setItemsCount } from 'features/orders/admDeliveriesSlice';

import { RenderingStateHandler } from 'components/common/commonUtils';
import SearchForm from 'components/common/SearchForm';

import ListItem from './OrderClaimListItem';

// ========================================
// 🔧 검색 필드 설정
// ========================================
const SEARCH_FIELDS = [
  {
    key: 'startRegDate',
    label: '접수 시작일',
    type: 'date',
    urlParam: 's_regdate',
    apiParam: 's_regdate',
    gridCol: 'half',
  },
  {
    key: 'endRegDate',
    label: '접수 종료일',
    type: 'date',
    urlParam: 'e_regdate',
    apiParam: 'e_regdate',
    gridCol: 'half',
  },
  {
    key: 'claimType',
    label: '요청 종류',
    type: 'select',
    options: [
      { value: 7, label: '환불요청' },
      { value: 8, label: '교환요청' },
    ],
    urlParam: 'claim_type',
    apiParam: 'claim_type',
    gridCol: 'half',
  },
  {
    key: 'claimStatus',
    label: '요청 상태',
    type: 'select',
    options: [
      { value: 1, label: '등록' },
      { value: 2, label: '진행중' },
      { value: 3, label: '완료' },
    ],
    urlParam: 'claim_status',
    apiParam: 'claim_status',
    gridCol: 'half',
  },
  {
    key: 'memberName',
    label: '요청자 성명',
    type: 'text',
    urlParam: 'm_name',
    apiParam: 'm_name',
    gridCol: 'full',
    placeholder: '요청자 성명 검색',
  },
];

const PAGE_PARAM = { key: 'page', urlParam: 'page' };

const OrderClaimList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  // ========================================
  // 🔧 redux slice 설정
  // ========================================
  const rowTotal = useSelector(state => state.admDeliveries.rowTotal);
  const pageGap = useSelector(state => state.admDeliveries.pageGap);
  const items = useSelector(state => state.admDeliveries.list);

  // URL에서 파라미터 읽기
  const getParamValue = useCallback(field => searchParams.get(field.urlParam) || '', [searchParams]);
  const currentPage = Number(searchParams.get(PAGE_PARAM.urlParam)) || 1;

  // Form 상태
  const [formValues, setFormValues] = useState(() => {
    const initial = {};
    SEARCH_FIELDS.forEach(field => {
      initial[field.key] = getParamValue(field);
    });
    return initial;
  });

  // Form 입력 핸들러
  const handleInputChange = (key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  // URL 파라미터 빌드
  const buildSearchParams = (overrides = {}) => {
    const params = {
      [PAGE_PARAM.urlParam]: overrides.page || 1,
    };

    SEARCH_FIELDS.forEach(field => {
      params[field.urlParam] = overrides[field.key] ?? formValues[field.key];
    });

    return params;
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setSearchParams(buildSearchParams());
  };

  // URL 파라미터 변경 시 Form 동기화 & 데이터 로드
  useEffect(() => {
    // URL → Form 동기화
    const newFormValues = {};
    SEARCH_FIELDS.forEach(field => {
      newFormValues[field.key] = getParamValue(field);
    });
    setFormValues(newFormValues);

    // API 호출
    const loadData = async () => {
      const apiParams = {
        page: currentPage,
        page_gap: pageGap,
      };

      SEARCH_FIELDS.forEach(field => {
        const value = getParamValue(field);
        if (value) {
          apiParams[field.apiParam] = value;
        }
      });

      setLoading(true);
      setError('');
      try {
        const result = await axios.get(`${apiBaseUrl}/orders/claim/list`, { params: apiParams });
        dispatch(setItems(result.data.data.list));
        dispatch(setItemsCount(result.data.data.total));
      } catch (err) {
        setError('❌ 목록 불러오기 실패');
        dispatch(setItems([]));
        dispatch(setItemsCount(0));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams, currentPage, pageGap, getParamValue, apiBaseUrl, dispatch]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 text-center">♻️ 환불&교환 목록 조회</h3>

      {/* ✨ 검색 폼 - 공통 컴포넌트 사용 */}
      <SearchForm
        fields={SEARCH_FIELDS}
        values={formValues}
        onChange={handleInputChange}
        onSubmit={handleSearch}
        title="환불&교환요청 검색"
      />

      {/* 테이블 */}
      <div className="table-responsive">
        <div className="d-flex justify-content-end align-items-center mb-2">
          <span className="text-muted">총 {rowTotal}건</span>
        </div>
        <table className="table table-bordered table-hover align-middle text-center shadow-sm rounded">
          <thead className="table-dark align-middle">
            <tr>
              <th>요청 번호</th>
              <th>
                요청자 성명(닉네임)
                <br />
                <small className="opacity-75">ID</small>
              </th>
              <th>요청 종류</th>
              <th className="text-warning fw-bold">상태</th>
              <th>요청일</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <RenderingStateHandler loading={loading} error={error} data={items.length > 0 ? items : null} />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="text-center text-danger fw-bold py-5">
                  {error}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted py-5">
                  조회된 요청이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((item, i) => <ListItem key={i} item={item} />)
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
      <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap">
        <div>
          <button
            className="btn btn-outline-secondary mx-3"
            disabled={currentPage <= 1}
            onClick={() => setSearchParams(buildSearchParams({ page: currentPage - 1 }))}
          >
            ← 이전
          </button>

          {Array.from({ length: Math.ceil(rowTotal / pageGap) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`btn ${p === currentPage ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
              onClick={() => setSearchParams(buildSearchParams({ page: p }))}
            >
              {p}
            </button>
          ))}

          <button
            className="btn btn-outline-secondary mx-3"
            disabled={currentPage >= Math.ceil(rowTotal / pageGap)}
            onClick={() => setSearchParams(buildSearchParams({ page: currentPage + 1 }))}
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderClaimList;
