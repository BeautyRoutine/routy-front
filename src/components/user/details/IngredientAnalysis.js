import React, { useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import './IngredientAnalysis.css';

//ingredientInfo 받아옴
const IngredientAnalysis = ({ ingredientInfo }) => {
  //전체 성분표 모달 상태
  const [isOpen, setIsOpen] = useState(false);
  // 모달 내부 탭 상태 ('all', 'good', 'bad')
  const [activeTab, setActiveTab] = useState('all');

  //성분 없으면 null
  if (!ingredientInfo) return null;

  //ingredientInfo 내부 ingredients, totalcount 꺼내놓기.
  const { ingredients } = ingredientInfo;

  // 알레르기 유발 성분 있으면 1이니까 필터에 걸림.
  const allergens = ingredients.filter(ing => ing.ingAllergen === 1);

  // 20가지 주의 성분 (위험 성분)
  const dangers = ingredients.filter(ing => ing.ingDanger === 1);

  // 좋은 성분 (기능성 성분)  기능성 칸에 내용이 있으면 필터
  const goodIngredients = ingredients.filter(ing => ing.ingFunctional !== null);

  // 피할 성분 (주의 성분 + 알레르기 성분)
  const avoidIngredients = [...dangers, ...allergens];

  // 모달 닫기 핸들러
  const handleClose = () => {
    setIsOpen(false);
    setActiveTab('all');
  };

  return (
    <div className="ingredient-section my-5">
      {/* 헤더 영역 */}
      <div className="section-header">
        <h3 className="section-title">즐겨 찾는 성분</h3>
        <button className="view-all-btn" onClick={() => setIsOpen(true)}>
          전체 보기 &gt;
        </button>
      </div>

      <Row className="g-4">
        {/* 관심 성분 */}
        <Col md={6}>
          <div className="analysis-box bg-blue-soft">
            <div className="box-header">
              <div className="box-title-text">관심 성분</div>
              <button
                className="more-btn"
                onClick={() => {
                  setIsOpen(true);
                  setActiveTab('good');
                }}
              >
                더보기
              </button>
            </div>

            <div className="ingredient-list-vertical">
              {goodIngredients.length > 0 ? (
                goodIngredients.slice(0, 3).map(ing => (
                  <div key={ing.ingNo} className="ingredient-item">
                    <span className="ing-pill blue">{ing.ingName}</span>
                    <span className="ing-desc">{ing.ingFunctional}</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">관심 성분이 없습니다.</div>
              )}
            </div>
          </div>
        </Col>

        {/* 피할 성분 */}
        <Col md={6}>
          <div className="analysis-box bg-pink-soft">
            <div className="box-header">
              <div className="box-title-text text-red">피할 성분</div>
              <button
                className="more-btn"
                onClick={() => {
                  setIsOpen(true);
                  setActiveTab('bad');
                }}
              >
                더보기
              </button>
            </div>

            <div className="ingredient-list-vertical">
              {avoidIngredients.length > 0 ? (
                avoidIngredients.slice(0, 3).map((ing, index) => (
                  <div key={index} className="ingredient-item">
                    <span className="ing-pill red">{ing.ingName}</span>
                    <span className="ing-desc">{ing.ingDanger === 1 ? '주의 성분' : '알레르기 유발'}</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">피할 성분이 없습니다.</div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* 상세 보기 모달 */}
      <Modal show={isOpen} onHide={handleClose} size="lg" centered className="ingredient-modal">
        <Modal.Header closeButton>
          <div className="modal-header-content">
            <Modal.Title className="fw-bold">즐겨 찾는 성분</Modal.Title>
            <button className="add-ingredient-btn">+ 추가</button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {/* 탭 메뉴 */}
          <div className="modal-tabs">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              전체
            </button>
            <button className={`tab-btn ${activeTab === 'good' ? 'active' : ''}`} onClick={() => setActiveTab('good')}>
              관심 성분
            </button>
            <button className={`tab-btn ${activeTab === 'bad' ? 'active' : ''}`} onClick={() => setActiveTab('bad')}>
              피할 성분
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="modal-scroll-content">
            {/* 관심 성분 섹션 */}
            {(activeTab === 'all' || activeTab === 'good') && (
              <div className="modal-section">
                <h5 className="modal-section-title blue">
                  관심 성분 <span className="count-badge">{goodIngredients.length}</span>
                </h5>
                <div className="modal-card-list">
                  {goodIngredients.length > 0 ? (
                    goodIngredients.map(ing => (
                      <div key={ing.ingNo} className="modal-ing-card blue-border">
                        <div className="card-ing-name">{ing.ingName}</div>
                        <div className="card-ing-desc">{ing.ingFunctional}</div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state-modal">등록된 관심 성분이 없습니다.</div>
                  )}
                </div>
              </div>
            )}

            {/* 피할 성분 섹션 */}
            {(activeTab === 'all' || activeTab === 'bad') && (
              <div className="modal-section">
                <h5 className="modal-section-title red">
                  피할 성분 <span className="count-badge">{avoidIngredients.length}</span>
                </h5>
                <div className="modal-card-list">
                  {avoidIngredients.length > 0 ? (
                    avoidIngredients.map((ing, index) => (
                      <div key={index} className="modal-ing-card red-border">
                        <div className="card-ing-name">{ing.ingName}</div>
                        <div className="card-ing-desc">
                          {ing.ingDanger === 1 ? '20가지 주의 성분' : '알레르기 유발 성분'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state-modal">발견된 피할 성분이 없습니다.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default IngredientAnalysis;
