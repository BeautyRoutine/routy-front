import React, { useState, useEffect, useRef } from 'react';
import api from '../../../lib/apiClient';
import { getStatusText } from '../../common/orderUtils';
import ReviewWriteModal from './ReviewWriteModal';
import './OrderHistory.css';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState('3months'); // '1month', '3months', '6months', '12months'
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const observerRef = useRef();
  const ITEMS_PER_PAGE = 5;

  // 주문 목록 조회 API 호출
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const response = await api.get(`/api/users/${userId}/orders`);
        // 응답 구조 처리: { resultCode: 200, data: [...] } 또는 [...]
        const responseData = response.data;
        const ordersList = responseData.data || responseData;
        setOrders(Array.isArray(ordersList) ? ordersList : []);

        // 데이터가 로드되면 visibleOrders 초기화 및 첫 페이지 로드 트리거를 위해 page를 1로 설정
        setVisibleOrders([]);
        setPage(1);
        setHasMore(true);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  // 초기 데이터 로드 및 페이지네이션
  useEffect(() => {
    const loadMoreOrders = () => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      // orders가 undefined일 경우 대비
      const sourceData = orders || [];
      const newOrders = sourceData.slice(start, end);

      if (newOrders.length === 0) {
        if (page > 1) setHasMore(false); // 첫 페이지가 아닐 때만 hasMore false
        // 첫 페이지인데 데이터가 없는 경우는 아래 렌더링에서 처리
      } else {
        setVisibleOrders(prev => {
          // 페이지 1일 경우 덮어쓰기, 아니면 추가하기
          if (page === 1) return newOrders;
          return [...prev, ...newOrders];
        });
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

  const handleDetailClick = async orderNo => {
    if (!userId) return;
    try {
      const response = await api.get(`/api/users/${userId}/orders/${orderNo}`);
      console.log('Order Detail:', response.data);
      const detailData = response.data.data || response.data;
      alert(`주문 상세 정보:\n${JSON.stringify(detailData, null, 2)}`);
    } catch (error) {
      console.error('Failed to fetch order detail:', error);
      alert('주문 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleReviewClick = product => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async reviewData => {
    console.log('Review Submit:', reviewData);
    // TODO: Implement actual API call to save review
    // Example: await api.post('/api/reviews', reviewData);

    // For now just close the modal and show success
    alert('리뷰가 등록되었습니다!');
    setIsReviewModalOpen(false);
  };

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
            <div key={`${order.orderNo}-${idx}`} className="order-table-row">
              {/* Left Column: Order Info */}
              <div className="order-left-col">
                <span className="order-date">{order.orderDate}</span>
                <span className="order-id">{order.orderNo}</span>
                <button className="detail-link" onClick={() => handleDetailClick(order.orderNo)}>
                  상세보기
                </button>
              </div>

              {/* Right Column: Items List (Flat structure from API) */}
              <div className="order-right-col">
                <div className="order-item-row last">
                  <div className="col-info">
                    {/* 이미지 경로가 전체 URL이 아니면 public 경로나 서버 경로 추가 필요할 수 있음 */}
                    <img
                      src={
                        order.productImage
                          ? `${process.env.PUBLIC_URL}/images/product/${order.productImage}`
                          : `${process.env.PUBLIC_URL}/images/product/default.png`
                      }
                      alt={order.productName}
                      className="item-thumb"
                      onError={e => (e.target.src = `${process.env.PUBLIC_URL}/images/product/default.png`)}
                    />
                    <div className="item-text">
                      {/* 브랜드 정보가 API에 없으면 생략하거나 추가 요청 필요 */}
                      {/* <span className="item-brand">{order.brand}</span> */}
                      <span className="item-name">{order.productName}</span>
                      {/* 옵션 정보도 현재 API에는 없음 */}
                      {/* <span className="item-option">옵션 | {order.option || '기본'}</span> */}
                    </div>
                  </div>
                  <div className="col-qty">{order.itemCount}</div>
                  <div className="col-price">{order.totalPrice ? order.totalPrice.toLocaleString() : 0}원</div>
                  <div className="col-status">
                    <span className="status-text">{getStatusText(order.orderStatus)}</span>
                    <div className="action-buttons">
                      <button className="action-btn">배송조회</button>
                      <button className="action-btn review-btn" onClick={() => handleReviewClick(order)}>
                        리뷰작성
                      </button>
                    </div>
                  </div>
                </div>
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

      {/* Review Write Modal */}
      <ReviewWriteModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default OrderHistory;
