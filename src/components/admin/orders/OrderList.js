import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setItems, setItemsCount } from 'features/orders/admOrdersSlice';

import LoadingSpinner from 'components/common/LoadingSpinner';
import OrderListItem from './OrderListItem';

const paramKeys = {
  page: 'page',
  memberName: 'm_name',
  startDate: 's_date',
  endDate: 'e_date',
};

const OrderList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const rowTotal = useSelector(state => state.admOrders.rowTotal);
  const pageGap = useSelector(state => state.admOrders.pageGap);
  const items = useSelector(state => state.admOrders.list);

  const getParamsFromSearch = () => ({
    page: Number(searchParams.get(paramKeys.page)) || 1,
    memberName: searchParams.get(paramKeys.memberName) || '',
    startDate: searchParams.get(paramKeys.startDate) || '',
    endDate: searchParams.get(paramKeys.endDate) || '',
  });

  const { page, memberName, startDate, endDate } = getParamsFromSearch();

  // form
  const [memberNameInput, setMemberNameInput] = useState(memberName);
  const [startDateInput, setStartDateInput] = useState(startDate);
  const [endDateInput, setEndDateInput] = useState(endDate);

  const buildSearchParams = (overrides = {}) => ({
    [paramKeys.page]: overrides.page || 1,
    [paramKeys.memberName]: overrides.memberName ?? memberNameInput,
    [paramKeys.startDate]: overrides.startDate ?? startDateInput,
    [paramKeys.endDate]: overrides.endDate ?? endDateInput,
  });

  const handleSearch = e => {
    e.preventDefault();
    setSearchParams(buildSearchParams());
  };

  useEffect(() => {
    setMemberNameInput(memberName);
    setStartDateInput(startDate);
    setEndDateInput(endDate);

    // 컴포넌트 첫 렌더링 시 실행 hook
    const loadData = async () => {
      const params = {
        page: page,
        page_gap: pageGap,
        mem_name: memberName,
        od_start_day: startDate,
        od_end_day: endDate,
      };

      // console.log(`${apiBaseUrl}/orders/list`);
      // console.log(params);
      setLoading(true);
      setError('');
      try {
        const result = await axios.get(`${apiBaseUrl}/orders/list`, { params });
        // console.log(result);
        dispatch(setItems(result.data.data.list));
        dispatch(setItemsCount(result.data.data.total));
      } catch (err) {
        console.error('주문목록 불러오기 실패: ', err);
        setError('❌ 목록 불러오기 실패');
        dispatch(setItems([]));
        dispatch(setItemsCount(0));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, pageGap, memberName, startDate, endDate, apiBaseUrl, dispatch]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 text-center">📜 주문 목록 조회</h3>

      <div className="card mb-4 shadow-sm" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-header bg-light fw-bold">🔍 주문 검색</div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row gy-3 align-items-center">
              <div className="col-md-6 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '100px' }}>
                  주문 시작일 :
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={startDateInput}
                  onChange={e => setStartDateInput(e.target.value)}
                />
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '100px' }}>
                  주문 종료일 :
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={endDateInput}
                  onChange={e => setEndDateInput(e.target.value)}
                />
              </div>
              <div className="col-md-12 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '100px' }}>
                  결제자 성명 :
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="회원명 검색"
                  value={memberNameInput}
                  onChange={e => setMemberNameInput(e.target.value)}
                />
              </div>

              {/* 검색 버튼 */}
              <div className="col-md-12 text-center">
                <button type="submit" className="btn btn-primary px-4">
                  🔎 검색
                </button>
              </div>
            </div>
          </form>
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
              <th>주문번호</th>
              <th>
                결제자 성명(닉네임)
                <br />
                <small className="opacity-75">ID</small>
              </th>
              <th>수취인 정보</th>
              <th>
                상품금액
                <br />
                <small className="opacity-75">배송비</small>
              </th>
              <th className="text-warning fw-bold">총금액</th>
              <th>주문일시</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <LoadingSpinner />
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
                  조회된 주문이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((item, i) => <OrderListItem key={i} item={item} />)
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
            onClick={() => setSearchParams(buildSearchParams({ page: page - 1 }))}
          >
            ← 이전
          </button>

          {Array.from({ length: Math.ceil(rowTotal / pageGap) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`btn ${p === page ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
              onClick={() => setSearchParams(buildSearchParams({ page: p }))}
            >
              {p}
            </button>
          ))}

          <button
            className="btn btn-outline-secondary mx-3"
            disabled={page >= Math.ceil(rowTotal / pageGap)}
            onClick={() => setSearchParams(buildSearchParams({ page: page + 1 }))}
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
