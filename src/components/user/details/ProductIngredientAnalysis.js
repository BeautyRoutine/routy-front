import React, { useState } from 'react';

import { Row, Col } from 'react-bootstrap';
import './ProductIngredientAnalysis.css';

import SkinTypeAnalysisBox from './SkinTypeAnalysisBox';

//ingredientInfo 받아옴
const IngredientAnalysis = ({ ingredientInfo, productInfo }) => {
  //전체 성분표 체크
  const [isOpen, setIsOpen] = useState(false);

  //성분 없으면 null
  if (!ingredientInfo) return null;

  const prdNo = productInfo.prdNo;

  const {
    // goodEffects, // 내 피부타입에 좋은 효과
    myFavoriteIngredients, // 내가 즐겨찾는 성분 이름
    // myAvoidIngredients, //싫어하는 성분 이름
    allergenIngredients, // 알레르기 성분 이름
    dangerIngredients, // 주의 성분 이름
    allIngredients, // 전체 성분 리스트
    totalCount, // 총 성분 수
  } = ingredientInfo;
  //에러방지용
  const allergens = allergenIngredients || [];
  const dangers = dangerIngredients || [];
  // const avoidIngredients = myAvoidIngredients || [];
  return (
    //성분분석 전체 구조, 제목
    <div className="ingredient-section my-5">
      <h3 className="mb-4" style={{ fontWeight: 'bold' }}>
        성분 분석
      </h3>

      <Row className="g-4">
        {/* 피부타입 분석*/}
        <SkinTypeAnalysisBox prdNo={prdNo} />

        {/*즐겨찾는 성분*/}
        <Col md={6}>
          <div className="analysis-box bg-pink-soft">
            <div className="box-title">
              <span>💜</span> 내가 즐겨찾는 성분
            </div>

            <div className="sub-label">포함된 성분</div>
            <div className="badge-group">
              {/*내가 좋아하는 성분 있으면 */}
              {myFavoriteIngredients && myFavoriteIngredients.length > 0 ? (
                myFavoriteIngredients.map((ingName, index) => (
                  <span key={index} className="custom-badge badge-purple">
                    ♥ {ingName}
                  </span>
                ))
              ) : (
                <span style={{ color: '#aaa', fontSize: '13px' }}>즐겨찾는 성분이 없습니다.</span>
              )}
            </div>
          </div>
        </Col>

        {/*하단 요악박스 3개*/}

        {/* 알레르기 안전/주의 */}
        <Col md={4}>
          {/* 필터링된 알레르기 성분이 0개면 초록박스, 있으면 노란박스 */}
          {/* 이름도 알레르기 성분 유무로 전환 */}
          <div className={`box-status ${allergens.length === 0 ? 'status-safe' : 'status-warning'}`}>
            {allergens.length === 0 ? (
              <>
                <h6 className="text-success fw-bold mb-2">✅ 알레르기 안전</h6>
                <small className="text-muted">알레르기 유발 성분 없음</small>
              </>
            ) : (
              <>
                <h6 className="text-danger fw-bold mb-2">⚠️ 알레르기 주의</h6>
                <small className="text-muted">{allergenIngredients.length}개 포함됨</small>
              </>
            )}
          </div>
        </Col>

        {/* 20가지 주의성분 */}
        <Col md={4}>
          {/* 주의 성분이 0개면 초록박스, 있으면 노란박스 */}
          <div className={`box-status ${dangers.length === 0 ? 'status-safe' : 'status-warning'}`}>
            {dangers.length === 0 ? (
              <>
                <h6 className="text-success fw-bold mb-2">✅ 주의성분 없음</h6>
                <small className="text-muted">20가지 주의성분 미포함</small>
              </>
            ) : (
              <>
                <h6 className="text-warning fw-bold mb-2" style={{ color: '#e67700' }}>
                  ⚠️ 20대 주의성분
                </h6>
                <small className="text-muted">{dangerIngredients.length}개 포함</small>
              </>
            )}
          </div>
        </Col>

        {/* 총 성분 수 */}
        <Col md={4}>
          <div className="box-status status-info">
            <h6 className="text-primary fw-bold mb-2">ℹ️ 총 성분 수</h6>
            {/*토탈카운트 보여주기 */}
            <small className="text-muted">{totalCount}가지 성분 배합</small>
          </div>
        </Col>
      </Row>

      {/*전체 성분 펼치기 버튼  */}
      <div className="full-ingredient-toggle">
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '전체 성분표 접기 ∧' : '전체 성분표 자세히 보기 ∨'}
        </button>
      </div>
      {/*전체 내역 출력, join(', ')로 전부 쉼표넣어서 한 문장으로 만들어줌 */}
      {isOpen && <div className="full-list-container">{allIngredients.map(ing => ing.ingName).join(', ')}</div>}
    </div>
  );
};

export default IngredientAnalysis;
