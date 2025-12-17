import React, { useState } from 'react';
import { Tabs, Tab, Button, Accordion } from 'react-bootstrap';
import './ProductDetailTabs.css';
import ReviewList from './ReviewList';
import ReviewWriteModal from 'components/user/review/ReviewWriteModal';
import api from 'lib/apiClient';
// 데이터 념겨받기
function ProductDetailTabs({
  productInfo,
  purchaseInfo,
  reviewInfo,
  ingredientInfo,
  activeTab,
  onTabSelect,
  onLikeToggle,
  onReviewUpdate,
  userInfo,
}) {
  // 기본값은 상품설명창, 현재 탭 기억용 state->상위페이지에서 관리
  //const [key, setKey] = useState('desc');
  //이미지 더보기
  const [isExpanded, setIsExpanded] = useState(false);

  const [showWriteModal, setShowWriteModal] = useState(false); //리뷰 모달 상태 관리

  //리뷰 새로고침
  const handleReviewSubmitted = () => {
    window.location.reload();
  };

  //리뷰 핸들러
  const handleWriteClick = () => {
    if (!userInfo) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    setShowWriteModal(true);
  };

  //리뷰 정렬
  const handleReviewFilterChange = async (page, sort, skin, color) => {
    try {
      const userNoParam = userInfo ? `&userNo=${userInfo.userNo}` : '';

      // sort 값이 이미 'new', 'recommended', 'rating', 'like' 중 하나이므로 그대로 전송
      //쿼리 분리
      let query = `/api/products/${productInfo.prdNo}/reviews?page=${page}&limit=10&sort=${sort}${userNoParam}`;
      if (skin) query += `&userSkin=${skin}`;
      if (color) query += `&userColor=${color}`;

      const response = await api.get(query);

      if (response.data && response.data.resultMsg === 'SUCCESS') {
        // 부모 컴포넌트(ProductDetail)의 상태 업데이트 함수 호출
        if (onReviewUpdate) {
          onReviewUpdate(response.data.data);
        }
      }
    } catch (error) {
      console.error('리뷰 정렬/페이징 실패', error);
    }
  };

  return (
    <div className="detail-tabs-container">
      <Tabs
        id="product-detail-tabs"
        activeKey={activeTab} //부모가 관리하는 state
        onSelect={k => onTabSelect(k)} //부모 state 변경 함수 호출
        className="mb-3" //아래 마진 3
        justify // 탭 버튼 너비를 균등하게 배분
      >
        {/*상품설명창 */}
        <Tab eventKey="desc" title="상품설명">
          <div className="tab-content-area p-0">
            {/* 프로모션용 긴 상세 이미지, 접힘표시 */}
            {/* ${} 사용해서 적용되는 css(잘려서, 전체 보여주기) 변경 */}
            {/*복습용 : {} 자바 스크립트 문법 사용, `` 특수 문자열, ${} 플레이스 홀더, ? : 삼항연산자 */}
            <div className={`detail-image-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
              {/* 이미지가 있으면 map 사용해서 전부 출력(아마 이미지는 1개일듯)*/}
              {productInfo.images.detail && productInfo.images.detail.length > 0 ? (
                productInfo.images.detail.map((imgSrc, index) => (
                  <img
                    key={index}
                    src={`${process.env.PUBLIC_URL}/images/product/${imgSrc}`}
                    alt={`상세 이미지 ${index + 1}`}
                    className="detail-image"
                  />
                ))
              ) : (
                <div className="py-5 text-muted bg-light text-center">상세 이미지가 없습니다.</div>
              )}

              {/* 가림막  */}
              {/* 접혀있으면 가림막 보여주기(기본값이 부정이니 ! 해서 true일때 가림막 보여줘(&&) */}
              {!isExpanded && <div className="fade-overlay"></div>}
            </div>

            {/* 더보기 버튼 */}
            <div className="text-center my-4">
              <Button variant="outline-secondary" className="w-100 py-3" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? '상품설명 접기 ∧' : '상품설명 더보기 ∨'}
              </Button>
            </div>

            {/* 접이식 정보 (아코디언) */}
            {/*기본값은 전부 닫기, 테두리 지우고 alwaysOpen으로 동시에 펼칠 수 있게. */}
            <Accordion flush alwaysOpen className="mt-5 product-info-accordion">
              {/* 상품정보 제공고시, 아코디언 넘버 0 */}
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
                        <th className="bg-light">용량 또는 중량</th>
                        <td>{productInfo.prdVolume_text}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">제품 주요 사양</th>
                        <td>{productInfo.prdSpec}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">사용기한</th>
                        <td>{productInfo.prdExpire}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">사용방법</th>
                        <td>{productInfo.prdUsage}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">제조자 및 제조판매업자</th>
                        <td>{productInfo.prdManuf}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">제조국</th>
                        <td>{productInfo.prdOrigin}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">식약처 심사 필 여부</th>
                        <td>{productInfo.prdFda}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">주요성분</th>
                        <td>{productInfo.prdIngredients}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">사용시 주의사항</th>
                        <td>{productInfo.prdCaution}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">품질보증기준</th>
                        <td>{productInfo.prdQuality}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">소비자 상담 전화번호</th>
                        <td>{productInfo.prdCs_phone}</td>
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
                    <li>배송비: 3,000원 (30,000원 이상 무료)</li>
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
            <div className="d-flex justify-content-end mb-3">
              {/* (임시) 버튼 UI */}
              <Button variant="dark" onClick={handleWriteClick}>
                리뷰 작성하기
              </Button>
            </div>
            <ReviewList reviewInfo={reviewInfo} onLikeToggle={onLikeToggle} onFilterChange={handleReviewFilterChange} />
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

      {/*리뷰 작성 모달 */}
      <ReviewWriteModal
        show={showWriteModal}
        onHide={() => setShowWriteModal(false)}
        prdNo={productInfo.prdNo}
        odNo={0} // 상세페이지이므로 0 (구매인증 X)
        userInfo={userInfo}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}

export default ProductDetailTabs;
