import React, { useState } from 'react';
import { Plus, ChevronLeft, ThumbsUp, ThumbsDown, Search, FileText, AlertCircle, Droplets } from 'lucide-react';
import '../../../styles/MyPage.css';

const IngredientManagement = ({ ingredients, onAddClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const toggleSelection = id => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = () => {
    console.log('Deleting items:', [...selectedIds]);
    setIsEditing(false);
    setSelectedIds(new Set());
  };

  const renderDetailView = () => {
    if (!selectedIngredient) return null;

    return (
      <div className="ingredient-detail-view">
        <header className="detail-header">
          <button className="back-btn" onClick={() => setSelectedIngredient(null)}>
            <ChevronLeft size={24} />
          </button>
          <h2>성분 정보</h2>
          <div style={{ width: '24px' }}></div>
        </header>

        <div className="detail-content">
          <div className="detail-title-section">
            <h3>{selectedIngredient.name}</h3>
            <p className="eng-name">{selectedIngredient.engName || 'English Name'}</p>
          </div>

          <div className="detail-actions">
            <button className={`action-toggle-btn focus ${selectedIngredient.type === 'focus' ? 'active' : ''}`}>
              <ThumbsUp size={20} />
              <span>관심있어요</span>
            </button>
            <button className={`action-toggle-btn avoid ${selectedIngredient.type === 'avoid' ? 'active' : ''}`}>
              <ThumbsDown size={20} />
              <span>피할래요</span>
            </button>
          </div>

          <div className="find-product-banner">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Search size={18} className="banner-icon" />
              <span>이 성분이 포함된 제품 찾기</span>
            </div>
            <ChevronLeft size={16} className="banner-arrow" style={{ transform: 'rotate(180deg)' }} />
          </div>

          <div className="info-list">
            <div className="info-item">
              <div className="icon-box blue">
                <FileText size={20} />
              </div>
              <div className="info-text">
                <strong>배합목적</strong>
                <p>피부컨디셔닝제(기타), 점도증가제(수성)</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <FileText size={20} />
              </div>
              <div className="info-text">
                <strong>배합한도</strong>
                <p>해당 없음</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <FileText size={20} />
              </div>
              <div className="info-text">
                <strong>배합금지</strong>
                <p>해당 없음</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <AlertCircle size={20} />
              </div>
              <div className="info-text">
                <strong>20가지 주의성분</strong>
                <p>해당 없음</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <AlertCircle size={20} />
              </div>
              <div className="info-text">
                <strong>알레르기 유발 주의성분</strong>
                <p>해당 없음</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <Droplets size={20} />
              </div>
              <div className="info-text">
                <strong>피부타입별 특이성분</strong>
                <p>해당 없음</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const focusList = ingredients.focus || [];
    const avoidList = ingredients.avoid || [];

    const renderList = (list, type) => (
      <div
        className="ingredient-list"
        style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px', overflowX: 'hidden' }}
      >
        {list.map((item, index) => {
          const itemId = `${type}-${index}`;
          return (
            <div
              key={index}
              className={`ingredient-item clickable ${
                isEditing && selectedIds.has(itemId) ? 'selected-for-delete' : ''
              }`}
              onClick={() => {
                if (isEditing) {
                  toggleSelection(itemId);
                } else {
                  setSelectedIngredient({ ...item, type });
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className="ingredient-pill">{item.name}</span>
              <p>{item.desc}</p>
            </div>
          );
        })}
      </div>
    );

    return (
      <div className="ingredient-groups">
        <section className="ingredient-block focus" style={{ padding: '24px', background: '#f0f9ff' }}>
          <h3 style={{ marginBottom: '20px', justifyContent: 'space-between' }}>관심 성분</h3>
          {focusList.length > 0 ? (
            renderList(focusList, 'focus')
          ) : (
            <p className="empty-state-text">등록된 관심 성분이 없습니다.</p>
          )}
        </section>

        <section className="ingredient-block avoid" style={{ padding: '24px', background: '#fff5f5' }}>
          <h3 style={{ marginBottom: '20px', justifyContent: 'space-between' }}>피할 성분</h3>
          {avoidList.length > 0 ? (
            renderList(avoidList, 'avoid')
          ) : (
            <p className="empty-state-text">등록된 피할 성분이 없습니다.</p>
          )}
        </section>
      </div>
    );
  };

  if (selectedIngredient) {
    return renderDetailView();
  }

  return (
    <div className="ingredient-management-page">
      <header
        className="page-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>성분 관리</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isEditing ? (
            <>
              <button className="add-btn-outline" onClick={onAddClick}>
                <Plus size={16} />
                <span>성분 추가</span>
              </button>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                편집
              </button>
            </>
          ) : (
            <>
              <button
                className="delete-cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedIds(new Set());
                }}
              >
                취소
              </button>
              <button className="delete-confirm-btn" onClick={handleDelete}>
                삭제 {selectedIds.size > 0 && `(${selectedIds.size})`}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Tabs removed */}

      <div className="page-body">{renderContent()}</div>
    </div>
  );
};

export default IngredientManagement;
