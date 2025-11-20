import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './ProductDetailTabs.css';

// 데이터 념겨받기
function ProductDetailTabs({ productInfo, purchaseInfo, reviewInfo, ingredientInfo }) {
  // 기본값은 상품설명창, 현재 탭 기억용 state
  const [key, setKey] = useState('desc');

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
          <div className="tab-content-area">
            <h4>제품 특징</h4>
            {/* HTML로 된 상품 설명을 렌더링 */}
            <div dangerouslySetInnerHTML={{ __html: productInfo.prdDesc }} />

            {/* 사용방법, 주요설명 추가 */}
          </div>
        </Tab>

        {/* 구매정보 -현재 전부 하드코딩임*/}
        <Tab eventKey="purchase" title="구매정보">
          <div className="tab-content-area">
            {/* 배송 및 교환/반품 안내 (2단 레이아웃) */}
            <div className="row mb-5">
              <div className="col-md-6">
                <h5 className="text-primary fw-bold mb-3">배송 안내</h5>
                <ul className="text-muted small" style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li>평균 배송 기간: 2-3일 (주말/공휴일 제외)</li>
                  <li>배송비: 3,000원 (50,000원 이상 무료)</li>
                  <li>제주/도서산간 지역은 추가 배송비가 발생할 수 있습니다.</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h5 className="text-primary fw-bold mb-3">교환/반품 안내</h5>
                <ul className="text-muted small" style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li>상품 수령 후 7일 이내 교환/반품 가능</li>
                  <li>단, 제품 포장을 개봉하였거나 훼손된 경우 불가</li>
                  <li>단순 변심으로 인한 반품 시 왕복 배송비 고객 부담</li>
                </ul>
              </div>
            </div>

            {/* 2. 제품 정보 제공 고시 (테이블 스타일) */}
            <h5 className="fw-bold mb-3">제품 정보</h5>
            <table className="table table-bordered" style={{ fontSize: '14px' }}>
              <colgroup>
                <col style={{ width: '20%', backgroundColor: '#f8f9fa' }} />
                <col style={{ width: '80%' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th className="bg-light align-middle">용량 또는 중량</th>
                  <td>{productInfo.prdVolume}ml</td>
                </tr>
                <tr>
                  <th className="bg-light align-middle">제품 주요 사양</th>
                  <td>모든 피부용</td>
                </tr>
                <tr>
                  <th className="bg-light align-middle">사용기한</th>
                  <td>제조일로부터 36개월 / 개봉 후 12개월</td>
                </tr>
                <tr>
                  <th className="bg-light align-middle">사용방법</th>
                  <td>상품 상세페이지 참조</td>
                </tr>
                <tr>
                  <th className="bg-light align-middle">제조국</th>
                  <td>대한민국</td>
                </tr>
                <tr>
                  <th className="bg-light align-middle">제조사</th>
                  <td>{productInfo.prdCompany}</td>
                </tr>
                <tr>
                  <th className="bg-light align-middle">주요성분</th>
                  <td>정제수, 부틸렌글라이콜, 나이아신아마이드</td>
                </tr>
                <tr>
                  <th className="bg-light align-middle">사용 시 주의사항</th>
                  <td>상품 상세페이지 참조</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Tab>

        {/* 리뷰*/}
        <Tab eventKey="review" title={`리뷰 (${reviewInfo.summary.totalCount})`}>
          <div className="tab-content-area">
            {/* 추후 ReviewList 컴포넌트가 들어갈 자리 */}
            <h4>리뷰 리스트 영역</h4>
            <p>평균 별점: {reviewInfo.summary.averageRating}점</p>
            <p>여기에는 나중에 리뷰 목록 컴포넌트를 import해서 넣을 것입니다.</p>
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

        {/* 상세이미지 */}
        <Tab eventKey="detailImg" title="상세이미지">
          <div className="tab-content-area text-center">
            {/* detailImages 배열 있으면 map 사용*/}
            {productInfo.images.detail && productInfo.images.detail.length > 0 ? (
              productInfo.images.detail.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`상세 설명 이미지 ${index + 1}`} className="detail-image" />
              ))
            ) : (
              <p>상세 이미지가 없습니다.</p>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default ProductDetailTabs;
