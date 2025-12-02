import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setItems, setItemsCount } from 'features/orders/admDeliveriesSlice';

import { RenderingStateHandler } from 'components/common/commonUtils';

import ListItem from './OrderDeliveryListItem';

const paramKeys = {
  page: 'page',
  memberName: 'm_name',
  startRegDate: 's_regdate',
  endRegDate: 'e_regdate',
  startEndDate: 's_enddate',
  endEndDate: 'e_enddate',
};

const OrderDeliveryList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const rowTotal = useSelector(state => state.admDeliveries.rowTotal);
  const pageGap = useSelector(state => state.admDeliveries.pageGap);
  const items = useSelector(state => state.admDeliveries.list);

  const getParamsFromSearch = () => ({
    page: Number(searchParams.get(paramKeys.page)) || 1,
    memberName: searchParams.get(paramKeys.memberName) || '',
    startRegDate: searchParams.get(paramKeys.startRegDate) || '',
    endRegDate: searchParams.get(paramKeys.endRegDate) || '',
    startEndDate: searchParams.get(paramKeys.startEndDate) || '',
    endEndDate: searchParams.get(paramKeys.endEndDate) || '',
  });

  const { page, memberName, startRegDate, endRegDate, startEndDate, endEndDate } = getParamsFromSearch();

  // form
  const [memberNameInput, setMemberNameInput] = useState(memberName);
  const [startRegDateInput, setStartRegDateInput] = useState(startRegDate);
  const [endRegDateInput, setEndRegDateInput] = useState(endRegDate);
  const [startEndDateInput, setStartEndDateInput] = useState(startEndDate);
  const [endEndDateInput, setEndEndDateInput] = useState(endEndDate);

  const buildSearchParams = (overrides = {}) => ({
    [paramKeys.page]: overrides.page || 1,
    [paramKeys.memberName]: overrides.memberName ?? memberNameInput,
    [paramKeys.startRegDate]: overrides.startRegDate ?? startRegDateInput,
    [paramKeys.endRegDate]: overrides.endRegDate ?? endRegDateInput,
    [paramKeys.startEndDate]: overrides.startEndDate ?? startEndDateInput,
    [paramKeys.endEndDate]: overrides.endEndDate ?? endEndDateInput,
  });

  const handleSearch = e => {
    e.preventDefault();
    setSearchParams(buildSearchParams());
  };

  useEffect(() => {
    setMemberNameInput(memberName);
    setStartRegDateInput(startRegDate);
    setEndRegDateInput(endRegDate);
    setStartEndDateInput(startEndDate);
    setEndEndDateInput(endEndDate);

    // 컴포넌트 첫 렌더링 시 실행 hook
    const loadData = async () => {
      const params = {
        page: page,
        page_gap: pageGap,
        mem_name: memberName,
        delv_s_start_day: startRegDate,
        delv_s_end_day: endRegDate,
        delv_e_start_day: startEndDate,
        delv_e_end_day: endEndDate,
      };

      setLoading(true);
      setError('');
      try {
        const result = await axios.get(`${apiBaseUrl}/orders/delivery/list`, { params });
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
  }, [page, pageGap, memberName, startRegDate, endRegDate, startEndDate, endEndDate, apiBaseUrl, dispatch]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 text-center">📦 택배 목록 조회</h3>

      <div className="card mb-4 shadow-sm" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-header bg-light fw-bold">🔍 택배 검색</div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="w-100 d-flex flex-column align-items-center">
              <dl className="w-100 row align-items-center">
                <dt className="col-2 text-end" style={{ margin: '0px', padding: '0px' }}>
                  접수 시작일 :
                </dt>
                <dd className="col-4 justify-content-end" style={{ margin: '0px', padding: '0px 15px' }}>
                  <input
                    type="date"
                    className="form-control"
                    value={startRegDateInput}
                    onChange={e => setStartRegDateInput(e.target.value)}
                  />
                </dd>
                <dt className="col-2 text-end" style={{ margin: '0px', padding: '0px' }}>
                  접수 종료일 :
                </dt>
                <dd className="col-4 justify-content-end" style={{ margin: '0px', padding: '0px 15px' }}>
                  <input
                    type="date"
                    className="form-control"
                    value={endRegDateInput}
                    onChange={e => setEndRegDateInput(e.target.value)}
                  />
                </dd>
              </dl>
              <dl className="w-100 row align-items-center">
                <dt className="col-2 text-end" style={{ margin: '0px', padding: '0px' }}>
                  완료 시작일 :
                </dt>
                <dd className="col-4 justify-content-end" style={{ margin: '0px', padding: '0px 15px' }}>
                  <input
                    type="date"
                    className="form-control"
                    value={startEndDateInput}
                    onChange={e => setStartEndDateInput(e.target.value)}
                  />
                </dd>
                <dt className="col-2 text-end" style={{ margin: '0px', padding: '0px' }}>
                  완료 종료일 :
                </dt>
                <dd className="col-4 justify-content-end" style={{ margin: '0px', padding: '0px 15px' }}>
                  <input
                    type="date"
                    className="form-control"
                    value={endEndDateInput}
                    onChange={e => setEndEndDateInput(e.target.value)}
                  />
                </dd>
              </dl>
              <dl className="w-100 row align-items-center">
                <dt className="col-2 text-end" style={{ margin: '0px', padding: '0px' }}>
                  결제자 성명 :
                </dt>
                <dd className="col-10 justify-content-end" style={{ margin: '0px', padding: '0px 15px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="결제자 성명 검색"
                    value={memberNameInput}
                    onChange={e => setMemberNameInput(e.target.value)}
                  />
                </dd>
              </dl>

              {/* 검색 버튼 */}
              <div className="col-12 text-center mt-3">
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
              <th>택배 번호</th>
              <th>
                결제자 성명(닉네임)
                <br />
                <small className="opacity-75">ID</small>
              </th>
              <th>수령인 정보</th>
              <th>지번 주소</th>
              <th className="text-warning fw-bold">
                택배사
                <br />
                <small className="opacity-75">송장번호</small>
              </th>
              <th>완료일</th>
              <th>접수일</th>
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
                  조회된 택배가 없습니다.
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

export default OrderDeliveryList;
