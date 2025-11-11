import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders, setOrdersCount } from '../store';

import OrderListItem from './OrderListItem';

const OrderList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const apiBaseUrl = useSelector(state => state.config.apiBaseUrl);

  // paging
  const rowTotal = useSelector(state => state.orders.rowTotal);
  const pageGap = useSelector(state => state.orders.pageGap);
  const page = Number(searchParams.get('page')) || 1;
  const orders = useSelector(state => state.orders.list);

  // get params
  const memberName = searchParams.get('m_name') || '';
  const startDate = searchParams.get('s_date') || '';
  const endDate = searchParams.get('e_date') || '';

  // form
  const [memberNameInput, setMemberNameInput] = useState(memberName);
  const [startDateInput, setStartDateInput] = useState(startDate);
  const [endDateInput, setEndDateInput] = useState(endDate);
  const handleSearch = () => {
    setSearchParams({
      page: 1,
      m_name: memberNameInput,
      s_date: startDateInput,
      e_date: endDateInput,
    });
  };

  useEffect(() => {
    // 컴포넌트 첫 렌더링 시 실행 hook
    const loadData = async () => {
      const params = {
        page: page,
        page_gap: pageGap,
        mem_name: memberName,
        od_start_day: startDate,
        od_end_day: endDate,
      };

      console.log(`${apiBaseUrl}/orders/list`);
      console.log(params);
      try {
        const result = await axios.get(`${apiBaseUrl}/orders/list`, { params });
        console.log(result);
        dispatch(setOrders(result.data.list));
        dispatch(setOrdersCount(result.data.total));
      } catch (err) {
        console.log('주문목록 불러오기 실패: ', err);
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
          <form>
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
                  이름 :
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
                <button className="btn btn-primary px-4" onClick={handleSearch}>
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
                주문 회원ID
                <br />
                <small className="opacity-75">(회원번호)</small>
              </th>
              <th>
                주문 회원명
                <br />
                <small className="opacity-75">(닉네임)</small>
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
            {orders.map((order, i) => (
              <OrderListItem key={i} order={order} />
            ))}
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
                m_name: memberName,
                s_date: startDate,
                e_date: endDate,
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
                  m_name: memberName,
                  s_date: startDate,
                  e_date: endDate,
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
                m_name: memberName,
                s_date: startDate,
                e_date: endDate,
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

export default OrderList;
