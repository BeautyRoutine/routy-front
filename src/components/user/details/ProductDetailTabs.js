import React, { useState } from 'react';
import { Tabs, Tab, Button, Accordion } from 'react-bootstrap';
import './ProductDetailTabs.css';
import ReviewList from './ReviewList';

// 데이터 념겨받기
function ProductDetailTabs({ productInfo, purchaseInfo, reviewInfo, ingredientInfo }) {
  // 기본값은 상품설명창, 현재 탭 기억용 state
  const [key, setKey] = useState('desc');
  //이미지 더보기
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="detail-tabs-container">
      <Tabs
        id="product-detail-tabs"
        activeKey={key} //현재 선택된 탭
        onSelect={k => setKey(k)} //setKey로 state 변경, k는 클릭된 탭 키
        className="mb-3" //아래 마진 3
        justify // 탭 버튼 너비를 균등하게 배분
      >
        {/*상품설명창 */}
        <Tab eventKey="desc" title="상품설명">
          <div className="tab-content-area p-0">
            {/* 프로모션용 긴 상세 이미지, 접힘표시 */}
            <div className={`detail-image-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
              {productInfo.images.detail && productInfo.images.detail.length > 0 ? (
                productInfo.images.detail.map((imgSrc, index) => (
                  <img key={index} src={imgSrc} alt={`상세 이미지 ${index + 1}`} className="detail-image" />
                ))
              ) : (
                <div className="py-5 text-muted bg-light text-center">상세 이미지가 없습니다.</div>
              )}

              {/* 가림막  */}
              {!isExpanded && <div className="fade-overlay"></div>}
            </div>

            {/* 더보기 버튼 */}
            <div className="text-center my-4">
              <Button variant="outline-secondary" className="w-100 py-3" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? '상품설명 접기 ∧' : '상품설명 더보기 ∨'}
              </Button>
            </div>

            {/* 접이식 정보 (아코디언) */}
            <Accordion defaultActiveKey={['0']} flush alwaysOpen className="mt-5 product-info-accordion">
              {/* 상품정보 제공고시 */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>상품정보 제공고시</Accordion.Header>
                <Accordion.Body>
                  <table className="table table-bordered" style={{ fontSize: '13px', marginBottom: 0 }}>
                    <colgroup>
                      <col style={{ width: '30%', backgroundColor: '#f8f9fa' }} />
                      <col style={{ width: '70%' }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>용량 또는 중량</th>
                        <td>{productInfo.prdVolume}ml</td>
                      </tr>
                      <tr>
                        <th>제품 주요 사양</th>
                        <td>모든 피부용</td>
                      </tr>
                      <tr>
                        <th>사용기한</th>
                        <td>제조일로부터 36개월</td>
                      </tr>
                      <tr>
                        <th>사용방법</th>
                        <td>상세페이지 참조</td>
                      </tr>
                      <tr>
                        <th>제조국</th>
                        <td>대한민국</td>
                      </tr>
                      <tr>
                        <th>제조사</th>
                        <td>{productInfo.prdCompany}</td>
                      </tr>
                      <tr>
                        <th>주요성분</th>
                        <td>상세페이지 참조</td>
                      </tr>
                      <tr>
                        <th>품질보증기준</th>
                        <td>공정거래위원회 고시 소비자분쟁해결기준에 의거 보상</td>
                      </tr>
                    </tbody>
                  </table>
                </Accordion.Body>
              </Accordion.Item>

              {/* 배송 안내 */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>배송 안내</Accordion.Header>
                <Accordion.Body>
                  <ul className="text-muted small" style={{ lineHeight: '1.8', paddingLeft: '20px', marginBottom: 0 }}>
                    <li>평균 배송 기간: 2-3일 (주말/공휴일 제외)</li>
                    <li>배송비: 3,000원 (50,000원 이상 무료)</li>
                    <li>제주/도서산간 지역은 추가 배송비가 발생할 수 있습니다.</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              {/* 교환/반품 안내 */}
              <Accordion.Item eventKey="2">
                <Accordion.Header>교환/반품/환불 안내</Accordion.Header>
                <Accordion.Body>
                  <ul className="text-muted small" style={{ lineHeight: '1.8', paddingLeft: '20px', marginBottom: 0 }}>
                    <li>상품 수령 후 7일 이내 교환/반품 가능</li>
                    <li>단, 제품 포장을 개봉하였거나 훼손된 경우 불가</li>
                    <li>단순 변심으로 인한 반품 시 왕복 배송비 고객 부담</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Tab>

        {/* 리뷰*/}
        <Tab eventKey="review" title={`리뷰 (${reviewInfo.summary.totalCount})`}>
          <div className="tab-content-area">
            <ReviewList reviewInfo={reviewInfo} />
          </div>
        </Tab>

        {/* Q&A */}
        <Tab eventKey="qna" title="Q&A">
          <div className="tab-content-area">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>상품 Q&A</h4>
              <button className="btn btn-dark btn-sm">문의하기</button>
            </div>
            <p className="text-muted text-center py-5">등록된 문의가 없습니다.</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default ProductDetailTabs;
