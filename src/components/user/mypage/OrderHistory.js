import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { fetchMyPageData, fetchOrdersByDate } from 'features/user/userSlice';

import { Table } from 'react-bootstrap';
import './OrderHistory.css';
import { API_BASE_URL } from '../layouts/headerConstants';

import ReviewWriteModal from 'components/user/review/ReviewWriteModal';

const OrderHistory = ({ orderList }) => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.currentUser?.userId);
  const userNo = useSelector(state => state.user.currentUser?.userNo);
  const userInfo = useSelector(state => state.user.currentUser);

  // 페이지 상태
  const PAGE_GAP = 5;
  const [page, setPage] = useState(1);
  // 페이지 변경 시 상세보기 초기화
  const handlePageChange = newPage => {
    setPage(newPage);
  };
  // 전체 데이터를 PAGE_GAP 단위로 분할
  const { pageGroups, totalPages } = useMemo(() => {
    const groups = [];
    for (let i = 0; i < orderList.length; i += PAGE_GAP) {
      groups.push(orderList.slice(i, i + PAGE_GAP));
    }
    return {
      pageGroups: groups,
      totalPages: groups.length,
    };
  }, [orderList]);
  // 페이지 초기화
  useEffect(() => {
    setPage(1);
  }, [orderList]);
  // ==============================================
  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'return' | 'exchange'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, setReason] = useState('');
  //모달 열기/닫기
  const openModal = (order, mode) => {
    setSelectedOrder({
      orderNo: order.orderNo,
      qnaType: mode === 'return' ? 7 : 8, // 7=환불, 8=교환
    });
    setModalMode(mode);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalMode(null);
    setSelectedOrder(null);
  };
  // 교환&환불 api post
  const submitClaim = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/orders/${selectedOrder.orderNo}/claims`,
        {
          qnaType: selectedOrder.qnaType,
          userNo: userNo,
          qnaQ: reason,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      alert('요청이 접수되었습니다.');
      closeModal();
    } catch (err) {
      console.error(err);
      alert('요청 중 오류가 발생했습니다.');
    } finally {
      dispatch(fetchMyPageData(userId));
    }
  };
  // ==============================================
  // 날짜 상태
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [period, setPeriod] = useState(1); // 기본 1개월 선택
  // 오늘 날짜 초기화
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setEndDate(today);

    const past = new Date();
    past.setMonth(past.getMonth() - 1);
    setStartDate(past.toISOString().split('T')[0]);
  }, []);
  // 기간 버튼 클릭 시 시작 날짜 변경 (endDate 기준)
  const handlePeriodClick = months => {
    setPeriod(months);

    if (!endDate) return;

    const end = new Date(endDate);
    const past = new Date(end);
    past.setMonth(end.getMonth() - months);
    setStartDate(past.toISOString().split('T')[0]);
  };
  // endDate를 사용자가 바꿀 때, 선택된 period가 있으면 startDate도 다시 계산
  const handleEndDateChange = e => {
    const value = e.target.value;
    setEndDate(value);

    if (!value || !period) return;

    const end = new Date(value);
    const past = new Date(end);
    past.setMonth(end.getMonth() - period);
    setStartDate(past.toISOString().split('T')[0]);
  };
  // 날짜 조회 핸들러
  const handleSearch = () => {
    dispatch(
      fetchOrdersByDate({
        userId,
        startDate,
        endDate,
      }),
    );
  };
  // ==============================================
  // 리뷰 쓰기 상태
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);
  // 리뷰 쓰기 버튼 핸들러
  const openReviewModal = order => {
    setSelectedReviewOrder(order);
    setReviewModalOpen(true);
  };
  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedReviewOrder(null);
  };

  return (
    <div className="order-history-container">
      <h2 className="page-title">주문/배송 조회</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-row">
          <span className="filter-label">구매기간</span>
          <div className="period-buttons">
            {[1, 3, 6, 12].map(month => (
              <button
                key={month}
                className={`period-btn ${period === month ? 'active' : ''}`}
                onClick={() => handlePeriodClick(month)}
              >
                {month}개월
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <div className="date-inputs date-picker-row">
            <input type="date" className="date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className="tilde">~</span>
            <input type="date" className="date-input" value={endDate} onChange={handleEndDateChange} />
          </div>
          <button style={{ marginLeft: '37px' }} className="search-btn" onClick={handleSearch}>
            조회
          </button>
        </div>
        <p className="filter-info">• 최근 1년 내역만 조회 가능합니다.</p>
      </div>

      {/* 주문 테이블 */}
      <Table hover size="sm" className="align-middle text-center" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '120px' }} />
          <col style={{ width: 'auto' }} />
          <col style={{ width: '70px' }} />
          <col style={{ width: '110px' }} />
          <col style={{ width: '70px' }} />
        </colgroup>

        <thead className="table-light">
          <tr style={{ borderTop: '1px solid black' }}>
            <th className="p-3">주문일자</th>
            <th className="p-3">상품</th>
            <th className="p-3">수량</th>
            <th className="p-3">주문금액</th>
            <th className="p-3">상태</th>
          </tr>
        </thead>

        {/* 각 페이지별 tbody를 미리 생성 */}
        {pageGroups.map((pageOrders, pageIndex) => (
          <tbody
            key={`page-${pageIndex}-${orderList.length}`}
            style={{ display: page === pageIndex + 1 ? 'table-row-group' : 'none' }}
          >
            {pageOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-5 text-muted">
                  주문 내역이 없습니다.
                </td>
              </tr>
            ) : (
              pageOrders.map(order => (
                <tr key={order.orderNo}>
                  <td>{order.orderDate}</td>
                  <td style={{ borderLeft: '1px solid #C6C7C8' }} className="text-start d-flex flex-column">
                    <div className="d-flex flex-row align-items-center gap-1">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/product/${order.productImage}`}
                        alt={order.productName}
                      />
                      <p>{order.productName}</p>
                    </div>
                    <div className="action-button-group p-1">
                      {order.orderStatus >= 5 && order.reviewCnt === 0 && (
                        <button className="action-button confirm" onClick={() => openReviewModal(order)}>
                          리뷰쓰기
                        </button>
                      )}

                      {order.orderStatus >= 5 && order.returnCnt === 0 && order.swapCnt === 0 && (
                        <button className="action-button return" onClick={() => openModal(order, 'return')}>
                          반품요청
                        </button>
                      )}

                      {order.orderStatus >= 5 && order.returnCnt === 0 && order.swapCnt === 0 && (
                        <button className="action-button exchange" onClick={() => openModal(order, 'exchange')}>
                          교환요청
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ borderLeft: '1px solid #C6C7C8' }}>{order.prodcutStock}</td>
                  <td style={{ borderLeft: '1px solid #C6C7C8' }}>
                    {(order.productPrice * order.prodcutStock).toLocaleString()}원
                  </td>
                  <td style={{ borderLeft: '1px solid #C6C7C8' }}>{order.orderStatusStr}</td>
                </tr>
              ))
            )}
          </tbody>
        ))}

        {/* 데이터가 아예 없을 때 */}
        {orderList.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={5} className="py-5 text-muted">
                주문 내역이 없습니다.
              </td>
            </tr>
          </tbody>
        )}
      </Table>

      {/* 페이지네이션 UI */}
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              className={`page-btn ${page === num ? 'active' : ''}`}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {/* 환불&교환 요청 모달 컴포넌트 */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h5 className="mb-3">{modalMode === 'return' ? '반품 요청' : '교환 요청'}</h5>
            <p className="text-muted mb-2">주문번호: {selectedOrder?.orderNo}</p>
            <textarea
              className="form-control mb-3"
              rows={4}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={modalMode === 'return' ? '반품 사유를 입력해주세요...' : '교환 사유를 입력해주세요...'}
            />

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="btn btn-secondary" onClick={closeModal}>
                취소
              </button>
              <button className="btn btn-primary" onClick={submitClaim}>
                제출하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 쓰기 모달 컴포넌트 */}
      {reviewModalOpen && selectedReviewOrder && (
        <ReviewWriteModal
          show={reviewModalOpen}
          onHide={closeReviewModal}
          prdNo={selectedReviewOrder.productNo}
          odNo={selectedReviewOrder.orderNo}
          userInfo={userInfo}
          onReviewSubmitted={() => dispatch(fetchMyPageData(userId))}
        />
      )}
    </div>
  );
};

export default OrderHistory;
