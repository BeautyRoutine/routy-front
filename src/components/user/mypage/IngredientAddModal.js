import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  FileText,
  AlertCircle,
  Droplet,
  Ban,
  Check,
} from 'lucide-react';
import { searchIngredients } from '../../../lib/apiClient';
import './IngredientAddModal.css';

const IngredientAddModal = ({ isOpen, onClose, onAdd, onRemove, currentIngredients }) => {
  const [view, setView] = useState('search'); // 'search' | 'detail'
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [addedFocusIds, setAddedFocusIds] = useState([]);
  const [addedAvoidIds, setAddedAvoidIds] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // 모달이 열릴 때 기존 성분 목록을 로컬 상태에 반영
  useEffect(() => {
    if (isOpen && currentIngredients) {
      // id가 없는 경우를 대비해 ingredientId, ingNo 등도 확인하여 매핑
      const focusIds = (currentIngredients.focus || []).map(item => item.id || item.ingredientId || item.ingNo);
      const avoidIds = (currentIngredients.avoid || []).map(item => item.id || item.ingredientId || item.ingNo);
      setAddedFocusIds(focusIds);
      setAddedAvoidIds(avoidIds);
    }
  }, [isOpen, currentIngredients]);

  // 검색어 또는 페이지 변경 시 API 호출
  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const res = await searchIngredients({
          page: currentPage,
          size: pageSize,
          keyword: searchTerm,
        });

        // API 응답 처리
        // 예상 구조: { list: [...], totalPage: N, ... }
        const data = res.data || {};
        console.log('성분 검색 API 응답:', data); // 디버깅용 로그

        const list = data.list || [];

        // totalPage 필드명 확인 (totalPage, total_page, totalPages 등)
        // 또는 totalCount, count, total 등으로 전체 개수가 올 경우 페이지 수 계산
        let total = 1;
        if (data.totalPage || data.total_page || data.totalPages) {
          total = data.totalPage || data.total_page || data.totalPages;
        } else if (data.totalCount || data.total_count || data.count || data.total) {
          const count = data.totalCount || data.total_count || data.count || data.total;
          total = Math.ceil(count / pageSize);
        }

        // 최소 1페이지 보장
        total = Math.max(1, total);

        const mappedList = list.map(item => ({
          id: item.ingNo,
          name: item.ingName,
          engName: item.ingEnName === 'nan' ? '' : item.ingEnName,
          desc: item.ingDesc === 'nan' ? '' : item.ingDesc,
          // 상세 정보 매핑 (필요한 경우 추가 매핑)
          functional: item.ingFunctional === 'nan' ? '해당 없음' : item.ingFunctional,
          allergy: item.ingAllergen ? '주의 성분 포함' : '해당 없음',
          caution20: item.ingDanger ? '주의 성분' : '해당 없음',
          purpose: item.ingFunctional === 'nan' ? '정보 없음' : item.ingFunctional, // 임시 매핑
        }));

        setSearchResults(mappedList);
        setTotalPages(total);
      } catch (error) {
        console.error('성분 검색 실패:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // 검색어가 없어도 전체 목록 조회를 위해 호출 (또는 검색어가 있을 때만 호출하도록 조건 추가 가능)
    // 여기서는 검색어가 변경되면 1페이지로 리셋하는 로직이 필요하므로 분리하거나 의존성 관리 필요
    const timer = setTimeout(() => {
      fetchIngredients();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);

  // 검색어 변경 시 페이지 리셋
  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색어 변경 시 1페이지로 이동
  };

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!isOpen) return null;

  const handleItemClick = ingredient => {
    setSelectedIngredient(ingredient);
    setView('detail');
  };

  const handleBack = () => {
    setView('search');
    setSelectedIngredient(null);
  };

  const toggleFocus = id => {
    if (addedFocusIds.includes(id)) {
      setAddedFocusIds(addedFocusIds.filter(i => i !== id));
      if (onRemove && selectedIngredient) onRemove(selectedIngredient, 'FOCUS');
    } else {
      setAddedFocusIds([...addedFocusIds, id]);

      // 만약 피할 성분에 있었다면 제거 (서버에서도 제거 요청 필요)
      if (addedAvoidIds.includes(id)) {
        setAddedAvoidIds(addedAvoidIds.filter(i => i !== id));
        if (onRemove && selectedIngredient) onRemove(selectedIngredient, 'AVOID');
      }

      if (onAdd && selectedIngredient) onAdd(selectedIngredient, 'FOCUS');
    }
  };

  const toggleAvoid = id => {
    if (addedAvoidIds.includes(id)) {
      setAddedAvoidIds(addedAvoidIds.filter(i => i !== id));
      if (onRemove && selectedIngredient) onRemove(selectedIngredient, 'AVOID');
    } else {
      setAddedAvoidIds([...addedAvoidIds, id]);

      // 만약 관심 성분에 있었다면 제거
      if (addedFocusIds.includes(id)) {
        setAddedFocusIds(addedFocusIds.filter(i => i !== id));
        if (onRemove && selectedIngredient) onRemove(selectedIngredient, 'FOCUS');
      }

      if (onAdd && selectedIngredient) onAdd(selectedIngredient, 'AVOID');
    }
  };

  // Detail View Component
  const DetailView = ({ ingredient }) => {
    const isFocus = addedFocusIds.includes(ingredient.id);
    const isAvoid = addedAvoidIds.includes(ingredient.id);

    return (
      <div className="ingredient-detail-view">
        <div
          className="detail-header"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <button className="detail-back-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>

          <div style={{ width: '100%' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#333', marginBottom: '4px', margin: 0 }}>
              {ingredient.name}
            </h2>
            <p className="eng-name" style={{ fontSize: '14px', color: '#888', margin: 0 }}>
              {ingredient.engName}
            </p>
          </div>
        </div>

        <div className="detail-content" style={{ padding: '0 24px 16px' }}>
          {/* Actions */}
          <div className="detail-actions" style={{ marginTop: '16px' }}>
            <button
              className={`action-toggle-btn focus ${isFocus ? 'active' : ''}`}
              onClick={() => toggleFocus(ingredient.id)}
            >
              <ThumbsUp size={20} />
              <span>관심있어요</span>
            </button>
            <button
              className={`action-toggle-btn avoid ${isAvoid ? 'active' : ''}`}
              onClick={() => toggleAvoid(ingredient.id)}
            >
              <ThumbsDown size={20} />
              <span>피할래요</span>
            </button>
          </div>

          <div className="info-list">
            <div className="info-item">
              <div className="icon-box blue">
                <FileText size={20} />
              </div>
              <div className="info-text">
                <strong>배합목적</strong>
                <p>{ingredient.purpose || '정보 없음'}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <FileText size={20} />
              </div>
              <div className="info-text">
                <strong>배합한도</strong>
                <p>{ingredient.limit || '해당 없음'}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <FileText size={20} />
              </div>
              <div className="info-text">
                <strong>배합금지</strong>
                <p>{ingredient.ban || '해당 없음'}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <Ban size={20} />
              </div>
              <div className="info-text">
                <strong>20가지 주의성분</strong>
                <p>{ingredient.caution20 || '해당 없음'}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <AlertCircle size={20} />
              </div>
              <div className="info-text">
                <strong>알레르기 유발 주의성분</strong>
                <p>{ingredient.allergy || '해당 없음'}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <Droplet size={20} />
              </div>
              <div className="info-text">
                <strong>피부타입별 특이성분</strong>
                <p>{ingredient.skinType || '해당 없음'}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box gray">
                <Check size={20} />
              </div>
              <div className="info-text">
                <strong>기능성 성분 여부</strong>
                <p>{ingredient.functional || '해당 없음'}</p>
              </div>
            </div>
          </div>
          <div className="detail-footer">
            <p>성분 정보는 성분의 함량과 배합방식, 개개인의 피부 타입과 환경에 따라 다르게 적용될 수 있습니다.</p>
            <div className="source-box">
              <h4>성분 정보 출처</h4>
              <ul>
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

  return (
    <div className="ingredient-add-overlay" onClick={onClose}>
      <div className="ingredient-add-modal" onClick={e => e.stopPropagation()}>
        {view === 'search' ? (
          <>
            <header className="ingredient-add-header">
              <h2>성분 추가하기</h2>
              <button className="ing-modal-close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </header>

            <div className="ingredient-search-wrapper">
              <div className="search-input-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="성분명을 검색해보세요"
                  value={searchTerm}
                  onChange={handleSearch}
                  autoFocus
                />
              </div>
            </div>

            <div className="ingredient-list-area">
              {loading ? (
                <div className="empty-search">
                  <p>검색 중...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map(item => (
                    <div key={item.id} className="ingredient-item-card" onClick={() => handleItemClick(item)}>
                      <div className="card-content">
                        <strong>{item.name}</strong>
                        <p>{item.desc}</p>
                      </div>
                      <ChevronRight size={20} className="card-arrow" />
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-search">
                  <p>{searchTerm ? '검색 결과가 없습니다.' : '성분을 검색해보세요.'}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <DetailView ingredient={selectedIngredient} />
        )}
      </div>
    </div>
  );
};

export default IngredientAddModal;
