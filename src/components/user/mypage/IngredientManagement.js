import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, ChevronLeft, ThumbsUp, ThumbsDown, Search, FileText, AlertCircle, Droplets } from 'lucide-react';
import { removeIngredient, addIngredient } from '../../../features/user/userSlice';
import '../../../styles/MyPage.css';

const IngredientManagement = ({ ingredients, onAddClick }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.user);
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

  const handleDelete = async () => {
    if (!profile?.userNo) {
      console.error('UserNo is missing');
      return;
    }

    const itemsToDelete = [];
    selectedIds.forEach(idStr => {
      const [type, indexStr] = idStr.split('-');
      const index = parseInt(indexStr, 10);
      const list = ingredients[type];
      if (list && list[index]) {
        const item = list[index];
        // id 필드 확인 (id, ingredientId, ingNo 등)
        const ingredientId = item.id || item.ingredientId || item.ingNo;

        if (ingredientId) {
          itemsToDelete.push({
            ingredientId,
            type: type === 'focus' ? 'FOCUS' : 'AVOID',
          });
        } else {
          console.warn('Ingredient ID missing for item:', item);
        }
      }
    });

    if (itemsToDelete.length === 0) {
      console.log('No items to delete');
      setIsEditing(false);
      return;
    }

    try {
      // 일괄 삭제 처리
      await Promise.all(
        itemsToDelete.map(item => dispatch(removeIngredient({ userNo: profile.userNo, ...item })).unwrap()),
      );

      // 성공 시 편집 모드 종료
      setIsEditing(false);
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to delete ingredients:', error);
      alert('성분 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleToggleInterest = async targetType => {
    if (!selectedIngredient) return;

    const currentType = selectedIngredient.type; // 'focus' or 'avoid'
    const targetTypeUpper = targetType === 'focus' ? 'FOCUS' : 'AVOID';
    const currentTypeUpper = currentType === 'focus' ? 'FOCUS' : 'AVOID';

    // 1. 이미 해당 상태라면 -> 삭제 (토글 해제)
    if (currentType === targetType) {
      await dispatch(
        removeIngredient({
          userNo: profile.userNo,
          ingredientId: selectedIngredient.id,
          type: currentTypeUpper,
        }),
      );
      setSelectedIngredient(null); // 목록으로 복귀
    }
    // 2. 다른 상태라면 -> 기존 상태 삭제 후 새로운 상태 추가 (상태 변경)
    else {
      // 기존 상태 삭제
      await dispatch(
        removeIngredient({
          userNo: profile.userNo,
          ingredientId: selectedIngredient.id,
          type: currentTypeUpper,
        }),
      );
      // 새로운 상태 추가
      await dispatch(
        addIngredient({
          userNo: profile.userNo,
          ingredientId: selectedIngredient.id,
          type: targetTypeUpper,
        }),
      );
      // 상세 뷰 상태 업데이트
      setSelectedIngredient({ ...selectedIngredient, type: targetType });
    }
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
            <button
              className={`action-toggle-btn focus ${selectedIngredient.type === 'focus' ? 'active' : ''}`}
              onClick={() => handleToggleInterest('focus')}
            >
              <ThumbsUp size={20} />
              <span>관심있어요</span>
            </button>
            <button
              className={`action-toggle-btn avoid ${selectedIngredient.type === 'avoid' ? 'active' : ''}`}
              onClick={() => handleToggleInterest('avoid')}
            >
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

          <div className="detail-footer">
            <p>성분 정보는 성분의 함량과 배합방식, 개개인의 피부 타입과 환경에 따라 다르게 적용될 수 있습니다.</p>
            <div className="source-box" style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>성분 정보 출처</h4>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '11px', color: '#999', lineHeight: '1.6' }}>
                <li>배합목적, 배합한도, 배합금지, 알레르기 유발 주의 성분, 기능성 성분: 식품 의약품 안전처</li>
                <li>20가지 주의성분: 도서 '대한민국 화장품의 비밀'</li>
                <li>피부타입별 특이성분: 대한피부과의사회발표자료</li>
              </ul>
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
