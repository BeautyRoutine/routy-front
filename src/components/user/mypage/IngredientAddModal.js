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
import '../../../styles/MyPage.css';

// Mock data for search results with detailed info (Fallback)
const MOCK_INGREDIENTS = [
  {
    id: 1,
    name: '히알루론산',
    engName: 'Hyaluronic Acid',
    desc: '수분 공급 및 보습 유지',
    ewg: { grade: 1, label: '낮은 위험도', data: '적당함(Fair)' },
    purpose: '피부컨디셔닝제(기타), 점도증가제(수성)',
    limit: '해당 없음',
    ban: '해당 없음',
    caution20: '해당 없음',
    allergy: '해당 없음',
    skinType: '해당 없음',
    functional: '해당 없음',
  },
  {
    id: 2,
    name: '티트리 오일',
    engName: 'Tea Tree Leaf Oil',
    desc: '피부 진정 및 트러블 케어',
    ewg: { grade: 1, label: '낮은 위험도', data: '적당함(Fair)' },
    purpose: '향료, 피부컨디셔닝제',
    limit: '해당 없음',
    ban: '해당 없음',
    caution20: '해당 없음',
    allergy: '리모넨 (자연유래)',
    skinType: '지성 피부 추천',
    functional: '해당 없음',
  },
  {
    id: 3,
    name: '파라벤',
    engName: 'Paraben',
    desc: '보존제, 피부 자극 가능성',
    ewg: { grade: 7, label: '높은 위험도', data: '제한적(Limited)' },
    purpose: '살균보존제',
    limit: '단일 0.4%, 혼합 0.8%',
    ban: '일부 종류 금지',
    caution20: '파라벤류',
    allergy: '해당 없음',
    skinType: '민감성 주의',
    functional: '해당 없음',
  },
  {
    id: 4,
    name: '알코올',
    engName: 'Alcohol',
    desc: '수분 증발, 건조 유발 가능',
    ewg: { grade: 2, label: '낮은 위험도', data: '적당함(Fair)' },
    purpose: '기포방지제, 수렴제, 향료, 용제',
    limit: '해당 없음',
    ban: '해당 없음',
    caution20: '해당 없음',
    allergy: '해당 없음',
    skinType: '건성/민감성 주의',
    functional: '해당 없음',
  },
  {
    id: 5,
    name: '세라마이드',
    engName: 'Ceramide NP',
    desc: '피부 장벽 강화',
    ewg: { grade: 1, label: '낮은 위험도', data: '좋음(Good)' },
    purpose: '피부교질화제, 헤어컨디셔닝제',
    limit: '해당 없음',
    ban: '해당 없음',
    caution20: '해당 없음',
    allergy: '해당 없음',
    skinType: '건성 추천',
    functional: '해당 없음',
  },
  {
    id: 6,
    name: '나이아신아마이드',
    engName: 'Niacinamide',
    desc: '미백 및 피지 조절',
    ewg: { grade: 1, label: '낮은 위험도', data: '좋음(Good)' },
    purpose: '피부컨디셔닝제',
    limit: '해당 없음',
    ban: '해당 없음',
    caution20: '해당 없음',
    allergy: '해당 없음',
    skinType: '모든 피부',
    functional: '미백 기능성',
  },
];

const IngredientAddModal = ({ isOpen, onClose, onAdd }) => {
  const [view, setView] = useState('search'); // 'search' | 'detail'
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [addedFocusIds, setAddedFocusIds] = useState([]);
  const [addedAvoidIds, setAddedAvoidIds] = useState([]);

  // 검색어가 변경될 때마다 API 호출 (Debounce 적용 권장)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await searchIngredients(searchTerm);
        // API 응답 구조에 따라 조정 필요 (여기서는 res.data가 배열이라고 가정)
        setSearchResults(res.data || []);
      } catch (error) {
        console.error('성분 검색 실패:', error);
        // API 실패 시 Mock 데이터로 폴백 (개발용)
        const fallback = MOCK_INGREDIENTS.filter(
          item => item.name.includes(searchTerm) || item.engName.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setSearchResults(fallback);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms Debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

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
      // TODO: Dispatch remove action
    } else {
      setAddedFocusIds([...addedFocusIds, id]);
      setAddedAvoidIds(addedAvoidIds.filter(i => i !== id)); // Remove from avoid if adding to focus
      if (onAdd && selectedIngredient) onAdd(selectedIngredient, 'FOCUS');
    }
  };

  const toggleAvoid = id => {
    if (addedAvoidIds.includes(id)) {
      setAddedAvoidIds(addedAvoidIds.filter(i => i !== id));
      // TODO: Dispatch remove action
    } else {
      setAddedAvoidIds([...addedAvoidIds, id]);
      setAddedFocusIds(addedFocusIds.filter(i => i !== id)); // Remove from focus if adding to avoid
      if (onAdd && selectedIngredient) onAdd(selectedIngredient, 'AVOID');
    }
  };

  // Detail View Component
  const DetailView = ({ ingredient }) => {
    const isFocus = addedFocusIds.includes(ingredient.id);
    const isAvoid = addedAvoidIds.includes(ingredient.id);

    return (
      <div className="ingredient-detail-view">
        <header className="detail-header">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
          <h2>성분 정보</h2>
          <div style={{ width: 24 }}></div> {/* Spacer for centering */}
        </header>

        <div className="detail-content">
          <div className="detail-title-section">
            <h3>{ingredient.name}</h3>
            <p className="eng-name">{ingredient.engName}</p>
          </div>

          <div className="detail-actions">
            <button
              className={`action-toggle-btn focus ${isFocus ? 'active' : ''}`}
              onClick={() => toggleFocus(ingredient.id)}
            >
              <ThumbsUp size={18} />
              <span>관심있어요</span>
            </button>
            <button
              className={`action-toggle-btn avoid ${isAvoid ? 'active' : ''}`}
              onClick={() => toggleAvoid(ingredient.id)}
            >
              <ThumbsDown size={18} />
              <span>피할래요</span>
            </button>
          </div>

          <div className="find-product-banner">
            <Search size={18} className="banner-icon" />
            <span>이 성분이 포함된 제품 찾기</span>
            <ChevronRight size={18} className="banner-arrow" />
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ingredient-modal add-mode" onClick={e => e.stopPropagation()}>
        {view === 'search' ? (
          <>
            <header className="modal-header">
              <h2>성분 추가하기</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </header>

            <div className="modal-body">
              <div className="search-bar-container">
                <div className="search-input-wrapper">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="성분명을 검색해보세요"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                    autoFocus
                  />
                </div>
              </div>

              <div className="search-results">
                {loading ? (
                  <div className="empty-search">
                    <p>검색 중...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="ingredient-grid">
                    {searchResults.map(item => (
                      <div
                        key={item.id}
                        className="ingredient-card search-result clickable"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="card-content">
                          <span className="ingredient-name">{item.name}</span>
                          <p className="ingredient-desc">{item.desc}</p>
                        </div>
                        <ChevronRight size={20} color="#ccc" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-search">
                    <p>{searchTerm ? '검색 결과가 없습니다.' : '성분을 검색해보세요.'}</p>
                  </div>
                )}
              </div>
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
