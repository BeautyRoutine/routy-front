import React, { useState, useEffect, useRef } from 'react';
import './OrderHistory.css';

const OrderHistory = ({ orders = [] }) => {
  const [period, setPeriod] = useState('3months'); // '1month', '3months', '6months', '12months'
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const ITEMS_PER_PAGE = 5;

  // 초기 데이터 로드 및 페이지네이션
  useEffect(() => {
    const loadMoreOrders = () => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      // orders가 undefined일 경우 대비
      const sourceData = orders || [];
      const newOrders = sourceData.slice(start, end);

      if (newOrders.length === 0) {
        setHasMore(false);
      } else {
        setVisibleOrders(prev => [...prev, ...newOrders]);
        if (end >= sourceData.length) {
          setHasMore(false);
        }
      }
    };

    loadMoreOrders();
  }, [page, orders]);

  // IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore]);

  return (
    <div className="order-history-container">
      <h2 className="page-title">주문/배송 조회</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-row">
          <span className="filter-label">구매기간</span>
          <div className="period-buttons">
            {['1개월', '3개월', '6개월', '12개월'].map((label, idx) => {
              const value = ['1month', '3months', '6months', '12months'][idx];
              return (
                <button
                  key={value}
                  className={`period-btn ${period === value ? 'active' : ''}`}
                  onClick={() => setPeriod(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="filter-row date-picker-row">
          <div className="date-inputs">
            <input type="date" className="date-input" defaultValue="2025-08-21" />
            <span className="tilde">~</span>
            <input type="date" className="date-input" defaultValue="2025-11-21" />
          </div>
          <button className="search-btn">조회</button>
        </div>
        <p className="filter-info">• 최근 1년 내역만 조회 가능합니다.</p>
      </div>

      {/* Order List */}
      <div className="order-list">
        <div className="list-header">
          <span className="col-date">주문일자</span>
          <span className="col-info">상품</span>
          <span className="col-qty">수량</span>
          <span className="col-price">주문금액</span>
          <span className="col-status">상태</span>
        </div>

        {visibleOrders.length === 0 ? (
          <div className="empty-list">
            <p>주문 내역이 없습니다.</p>
          </div>
        ) : (
          visibleOrders.map((order, idx) => (
            <div key={`${order.id}-${idx}`} className="order-table-row">
              {/* Left Column: Order Info (Spans all items) */}
              <div className="order-left-col">
                {/* Mock Tag - In real app, check order.tags */}
                <span className="order-date">{order.date}</span>
                <span className="order-id">{order.id}</span>
                <button className="detail-link">상세보기</button>
              </div>

              {/* Right Column: Items List */}
              <div className="order-right-col">
                {order.items.map((item, idx) => (
                  <div key={item.id} className={`order-item-row ${idx === order.items.length - 1 ? 'last' : ''}`}>
                    <div className="col-info">
                      <img src={item.image} alt={item.name} className="item-thumb" />
                      <div className="item-text">
                        <span className="item-brand">{item.brand}</span>
                        <span className="item-name">{item.name}</span>
                        <span className="item-option">옵션 | {item.option || '기본'}</span>
                      </div>
                    </div>
                    <div className="col-qty">{item.quantity}</div>
                    <div className="col-price">{item.price.toLocaleString()}원</div>
                    <div className="col-status">
                      <span className="status-text">{order.status}</span>
                      <div className="action-buttons">
                        <button className="action-btn">배송조회</button>
                        <button className="action-btn">리뷰작성</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        {hasMore && (
          <div ref={observerRef} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
