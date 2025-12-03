import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './ClaimHistory.css';

const ClaimHistory = () => {
  const { claims } = useSelector(state => state.user);
  const [period, setPeriod] = useState('3months');

  const filteredClaims = claims || [];

  return (
    <div className="claim-history-container">
      <h2 className="page-title">취소/반품/교환 내역</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-row">
          <span className="filter-label">구매유형</span>
          <div className="period-buttons">
            <button className="period-btn active">전체</button>
            <button className="period-btn">온라인몰 구매</button>
          </div>
        </div>
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
      </div>

      {/* Claim List */}
      <div className="claim-list">
        <div className="list-header">
          <span className="col-date">주문일자</span>
          <span className="col-info">상품</span>
          <span className="col-qty">수량</span>
          <span className="col-price">주문금액</span>
          <span className="col-status">상태</span>
        </div>

        {filteredClaims.length === 0 ? (
          <div className="empty-list">
            <p>취소/반품/교환 내역이 없습니다.</p>
          </div>
        ) : (
          filteredClaims.map(claim => (
            <div key={claim.id} className="claim-table-row">
              {/* Left Column: Claim Info */}
              <div className="claim-left-col">
                <span className="claim-date">{claim.date}</span>
                <span className="claim-id">{claim.id}</span>
                <button className="detail-link">상세보기</button>
              </div>

              {/* Right Column: Items List */}
              <div className="claim-right-col">
                {claim.items.map((item, idx) => (
                  <div key={item.id} className={`claim-item-row ${idx === claim.items.length - 1 ? 'last' : ''}`}>
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
                      <span className="status-text">{claim.status}</span>
                      <span className="status-date">{claim.date}</span>
                      <button className="action-btn">자세히 보기</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClaimHistory;
