import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import './IngredientAnalysis.css';

//ingredientInfo 받아옴
const IngredientAnalysis = ({ ingredientInfo }) => {
  //전체 성분표 체크
  const [isOpen, setIsOpen] = useState(false);

  //성분 없으면 null
  if (!ingredientInfo) return null;

  //ingredientInfo 내부 ingredients, totalcount 꺼내놓기.
  const { ingredients, totalCount } = ingredientInfo;

  // 알레르기 유발 성분 있으면 1이니까 필터에 걸림.
  const allergens = ingredients.filter(ing => ing.ingAllergen === 1);

  // 20가지 주의 성분 (위험 성분)
  const dangers = ingredients.filter(ing => ing.ingDanger === 1);

  // 좋은 성분 (기능성 성분)  기능성 칸에 내용이 있으면 필터
  const goodIngredients = ingredients.filter(ing => ing.ingFunctional !== null);

  return (
    //성분분석 전체 구조, 제목
    <div className="ingredient-section my-5">
      <h3 className="mb-4" style={{ fontWeight: 'bold' }}>
        성분 분석
      </h3>

      <Row className="g-4">
        {/* 피부타입 분석*/}
        <Col md={6}>
          <div className="analysis-box bg-blue-soft">
            <div className="box-title">
              <span>✅</span> 내 피부타입 분석
            </div>

            {/* 좋은 성분 */}
            <div className="sub-label">좋은 성분</div>
            <div className="badge-group">
              {/* 좋은 성분 배열 길이가 0 보다 길면,map으로 ing에 주르륵 담고 */}
              {goodIngredients.length > 0 ? (
                goodIngredients.map(ing => (
                  <span key={ing.ingNo} className="custom-badge badge-green">
                    {/*그 번호에 맞는 이름 출력.*/}
                    <span style={{ fontSize: '10px' }}>✔️</span> {ing.ingName}
                  </span>
                ))
              ) : (
                //아니면 기능성이 없대요
                <span style={{ color: '#aaa', fontSize: '13px' }}>특별한 기능성 성분이 없습니다.</span>
              )}
            </div>

            {/* 주의 성분 (있는 경우에만 표시) */}
            {dangers.length > 0 && (
              <>
                {/* 포장지로 묶어주기 */}{' '}
                <div className="sub-label" style={{ marginTop: '20px' }}>
                  주의 성분
                </div>
                {/*주의성분 있으면 map으로 주의성분 나열 */}
                <div className="badge-group">
                  {dangers.map(ing => (
                    <span key={ing.ingNo} className="custom-badge badge-orange">
                      ⚠️ {ing.ingName}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </Col>

        {/*즐겨찾는 성분*/}
        <Col md={6}>
          <div className="analysis-box bg-pink-soft">
            <div className="box-title">
              <span>💜</span> 내가 즐겨찾는 성분
            </div>

            <div className="sub-label">포함된 성분</div>
            <div className="badge-group">
              {/* 기능성 2개를 현재 즐겨찾는 성분으로 가정. 추후 수정필요 */}
              {goodIngredients.slice(0, 2).map(ing => (
                <span key={ing.ingNo} className="custom-badge badge-purple">
                  ♥ {ing.ingName}
                </span>
              ))}
              {/* 즐겨찾기 성분없으면(0이라면) 없다고 출력 */}
              {goodIngredients.length === 0 && (
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
                <small className="text-muted">{allergens.length}개 포함됨</small>
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
                <small className="text-muted">{dangers.length}개 포함</small>
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
      {isOpen && <div className="full-list-container">{ingredients.map(ing => ing.ingName).join(', ')}</div>}
    </div>
  );
};

export default IngredientAnalysis;
