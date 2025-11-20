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

        {/* 구매정보 */}
        <Tab eventKey="purchase" title="구매정보">
          <div className="tab-content-area">
            <h5>배송 안내</h5>
            <p>{purchaseInfo.shipping}</p>
            <br />
            <h5>교환 및 반품 안내</h5>
            <p>{purchaseInfo.refund}</p>
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
