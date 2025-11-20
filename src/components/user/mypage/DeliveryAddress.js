import React, { useState } from 'react';
import './DeliveryAddress.css';

const MOCK_ADDRESSES = [
  {
    id: 1,
    name: '집',
    recipient: '홍길동',
    zipCode: '06234',
    address1: '서울 강남구 테헤란로 123 (역삼동) ****',
    address2: '서울 강남구 역삼동 123-45 ****',
    phone: '010-****-1234',
    isDefault: true,
    tags: [],
    accessMethod: '비밀번호 (1*2*#)',
  },
  {
    id: 2,
    name: '회사',
    recipient: '홍길동',
    zipCode: '13529',
    address1: '경기 성남시 분당구 판교역로 123 (백현동) ****',
    address2: '경기 성남시 분당구 백현동 543-21 ****',
    phone: '010-****-1234',
    isDefault: false,
    tags: [],
    accessMethod: '자유출입가능',
  },
];

const DeliveryAddress = () => {
  const [activeTab, setActiveTab] = useState('delivery'); // 'delivery' | 'refund'

  return (
    <div className="delivery-container">
      <h2 className="page-title">배송지/환불계좌</h2>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivery')}
        >
          배송지
        </button>
        <button className={`tab-btn ${activeTab === 'refund' ? 'active' : ''}`} onClick={() => setActiveTab('refund')}>
          환불계좌
        </button>
      </div>

      {activeTab === 'delivery' && (
        <div className="tab-content">
          <p className="info-text">
            ▪ 배송지는 최대 <strong>20개</strong>까지 등록 가능합니다.
          </p>

          <div className="address-table-header">
            <span className="col-name">배송지명</span>
            <span className="col-recipient">받는사람</span>
            <span className="col-address">주소</span>
            <span className="col-phone">연락처</span>
            <span className="col-manage">관리</span>
          </div>

          <div className="address-list">
            {MOCK_ADDRESSES.map(addr => (
              <div key={addr.id} className="address-item">
                <div className="col-name">{addr.name}</div>
                <div className="col-recipient">{addr.recipient}</div>
                <div className="col-address">
                  <div className="badges">
                    {addr.isDefault && <span className="badge default">기본배송지</span>}
                    {addr.tags.map(tag => (
                      <span key={tag} className="badge tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="addr-text">({addr.zipCode})</div>
                  <div className="addr-text">도로명 : {addr.address1}</div>
                  <div className="addr-text sub">지 번 : {addr.address2}</div>
                  {addr.accessMethod && (
                    <div className="access-method">
                      <span className="label">공동현관 출입방법</span>
                      <span className="value">{addr.accessMethod}</span>
                    </div>
                  )}
                </div>
                <div className="col-phone">{addr.phone}</div>
                <div className="col-manage">
                  {addr.isDefault ? (
                    <button className="btn-outline">수정</button>
                  ) : (
                    <>
                      <button className="btn-outline">기본 배송지 설정</button>
                      <div className="btn-row">
                        <button className="btn-outline">삭제</button>
                        <button className="btn-outline">수정</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="action-area">
            <button className="btn-primary-large">배송지 등록</button>
          </div>
        </div>
      )}

      {activeTab === 'refund' && (
        <div className="tab-content refund-content">
          <div className="refund-header">
            <span className="col-bank">은행</span>
            <span className="col-account">계좌번호</span>
            <span className="col-manage">관리</span>
          </div>
          <div className="empty-state-refund">
            <div className="empty-icon-circle">!</div>
            <p>등록된 계좌 정보가 없습니다.</p>
          </div>

          <div className="refund-actions">
            <button className="btn-primary-large">환불계좌 등록</button>
          </div>

          <div className="refund-notice">
            <p>· 계좌를 변경하시려면 기존 계좌를 삭제한 후 새로 등록해 주시기 바랍니다.</p>
            <p>
              · 결제취소에 대해 현금으로 환불 받아야 하는 경우 등록하신 계좌로 환불되오니 정확히 기입해 주시기 바랍니다.
            </p>
            <p>· 본인 명의 계좌만 등록 가능합니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
