import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import { ChevronLeft, ClipboardCheck, Check, Plus, Save } from 'lucide-react';
import api from 'app/api';
import './MyRoutyPage.css';

// DB에 저장할 reaction 값 (영어 대문자로 통일)
export const REACTION_VALUES = {
  NORMAL: 'NORMAL', // 반응 없음
  OILY: 'OILY', // 유분 증가
  DRY: 'DRY', // 건조함
  REDNESS: 'REDNESS', // 붉어짐
  STINGING: 'STINGING', // 따가움
  TROUBLE: 'TROUBLE', // 트러블 의심
};

const REACTION_OPTIONS = [
  { id: 'oily', label: '유분 증가', apiValue: REACTION_VALUES.OILY },
  { id: 'dry', label: '건조함', apiValue: REACTION_VALUES.DRY },
  { id: 'redness', label: '붉어짐', apiValue: REACTION_VALUES.REDNESS },
  { id: 'stinging', label: '따가움', apiValue: REACTION_VALUES.STINGING },
  { id: 'trouble', label: '트러블 의심', apiValue: REACTION_VALUES.TROUBLE },
  { id: 'none', label: '반응 없음', apiValue: REACTION_VALUES.NORMAL },
];

// FE reaction 배열을 BE reaction 단일 값으로 변환 (DB에 영어 대문자로 전송)
const getReactionForAPI = reactions => {
  if (!reactions || reactions.length === 0) return REACTION_VALUES.NORMAL;
  // 첫 번째 반응을 우선 사용 (또는 가장 심각한 반응)
  const firstReaction = reactions[0];
  const option = REACTION_OPTIONS.find(opt => opt.id === firstReaction);
  return option?.apiValue || REACTION_VALUES.NORMAL;
};

// BE reaction 값을 FE reaction 배열로 변환
const getReactionsFromAPI = apiReaction => {
  if (!apiReaction || apiReaction === REACTION_VALUES.NORMAL) return [];
  const option = REACTION_OPTIONS.find(opt => opt.apiValue === apiReaction);
  return option ? [option.id] : [];
};

// Helper to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// mainCategory 값에 따른 카테고리 이름 매핑
const getCategoryName = mainCategory => {
  const categoryMap = {
    11: '스킨케어',
    21: '메이크업',
    31: '마스크팩',
    41: '클렌징',
    51: '선케어',
    61: '맨즈케어',
  };
  return categoryMap[mainCategory] || '기타';
};

const RoutineEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const userId = currentUser?.userId ? currentUser.userId.trim() : '';
  const { date: dateParam } = useParams();
  const date = moment(dateParam);
  const isToday = date.isSame(moment(), 'day'); // 오늘 날짜인지 확인

  const DRAFT_KEY = 'ALL';
  const draftSelectedIds = useSelector(state => state.routineDraft?.byDate?.[DRAFT_KEY] || []);

  const [myProducts, setMyProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productReactions, setProductReactions] = useState({});
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [dailyMemo, setDailyMemo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 내 제품 목록 조회
  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/users/${userId}/my-products`);
        if (res?.data && res.data.resultCode === 200) {
          const products = (res.data.data || []).map(p => ({
            id: p.prdNo,
            prdNo: p.prdNo,
            name: p.prdName,
            prdName: p.prdName,
            prdImg: p.prdImg,
            regDate: p.regDate,
            mainCategory: p.mainCategory,
          }));
          setMyProducts(products);
        } else {
          setMyProducts([]);
        }
      } catch (err) {
        console.error('fetchMyProducts failed', err);
        setMyProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [userId]);

  // 루틴 조회 및 제품 자동 선택 처리
  useEffect(() => {
    const fetchRoutine = async () => {
      if (!userId) return;

      try {
        const res = await api.get(`/api/users/${userId}/routines/${dateParam}`);
        if (res?.data && res.data.resultCode === 200 && res.data.data) {
          const routine = res.data.data;
          const routineProductsList = routine.products || [];

          // 제품 선택 상태 설정
          const productIds = routineProductsList.map(p => p.prdNo);
          setSelectedProductIds(productIds);

          // 제품별 반응 및 메모 설정
          const reactions = {};
          routineProductsList.forEach(p => {
            reactions[p.prdNo] = {
              reactions: getReactionsFromAPI(p.reaction),
              memo: p.memo || '',
            };
          });
          setProductReactions(reactions);

          // 추가 활동 및 총평 설정
          setActivities(routine.extraActivities || []);
          setDailyMemo(routine.summary || routine.dailyReview || '');
        } else {
          // 루틴이 없으면 초기화
          setSelectedProductIds([]);
          setProductReactions({});
          setActivities([]);
          setDailyMemo('');
        }
      } catch (err) {
        console.error('fetchRoutine failed', err);
        // 에러 발생 시 초기화
        setSelectedProductIds([]);
        setProductReactions({});
        setActivities([]);
        setDailyMemo('');
      }
    };

    if (dateParam && userId) {
      fetchRoutine();
    }
  }, [dateParam, userId]);

  // 내 제품 관리에서 전달된 제품 자동 선택
  useEffect(() => {
    const selectedProductId = location.state?.selectedProductId;
    if (selectedProductId && myProducts.length > 0) {
      // 제품 목록이 로드된 후에만 선택
      const product = myProducts.find(p => (p.prdNo || p.id) === selectedProductId);
      if (product && !selectedProductIds.includes(selectedProductId)) {
        setSelectedProductIds(prev => [...prev, selectedProductId]);
        // location.state 초기화 (한 번만 실행되도록)
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [myProducts, location.state, selectedProductIds, navigate, location.pathname]);

  const toggleProduct = id => {
    setSelectedProductIds(prev => {
      if (prev.includes(id)) {
        const newIds = prev.filter(pid => pid !== id);
        const newReactions = { ...productReactions };
        delete newReactions[id];
        setProductReactions(newReactions);
        return newIds;
      } else {
        return [...prev, id];
      }
    });
  };

  const updateReaction = (productId, reactionType) => {
    setProductReactions(prev => {
      const current = prev[productId] || { reactions: [], memo: '' };
      const hasReaction = current.reactions.includes(reactionType);
      const newReactionsList = hasReaction
        ? current.reactions.filter(r => r !== reactionType)
        : [...current.reactions, reactionType];

      return {
        ...prev,
        [productId]: { ...current, reactions: newReactionsList },
      };
    });
  };

  const updateProductMemo = (productId, text) => {
    setProductReactions(prev => ({
      ...prev,
      [productId]: { ...(prev[productId] || { reactions: [] }), memo: text },
    }));
  };

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleAddActivity();
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 디버깅: 토큰 및 userId 확인
    const token = localStorage.getItem('token');
    console.log('=== handleSave Debug ===');
    console.log('userId:', userId);
    console.log('dateParam:', dateParam);
    console.log('token exists:', !!token);
    console.log('token value:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      alert('토큰이 없습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      // API 명세에 맞는 형식으로 변환 (DB에 영어 대문자로 전송)
      const payload = {
        products: selectedProductIds.map(prdNo => {
          const reactionData = productReactions[prdNo] || { reactions: [], memo: '' };
          // getReactionForAPI는 항상 영어 대문자 값 반환 (NORMAL, OILY, DRY, REDNESS, STINGING, TROUBLE)
          const dbReaction = getReactionForAPI(reactionData.reactions);
          return {
            prdNo: prdNo,
            reaction: dbReaction, // DB에 영어 대문자로 통일된 값 전송
            memo: reactionData.memo || '',
            alertDate: null,
          };
        }),
        extraActivities: activities,
        summary: truncateText(dailyMemo, 50) || '',
        dailyReview: dailyMemo || '',
      };

      console.log(`POST /api/users/${userId}/routines/${dateParam}`);
      console.log('Payload:', payload);
      await api.post(`/api/users/${userId}/routines/${dateParam}`, payload);
      alert('루틴이 저장되었습니다.');
      navigate('/myrouty');
    } catch (err) {
      console.error('saveRoutine failed', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      if (err.response?.status === 403) {
        alert('권한이 없습니다. 로그인 상태를 확인해주세요.');
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
        }
      } else if (err.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        alert('루틴 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/myrouty');
  };

  return (
    <div className="my-routy-container" style={{ display: 'block' }}>
      <div className="routine-edit-page">
        <div className="edit-content-wrapper">
          <div className="routine-header-card">
            <button className="header-back-btn" onClick={handleBack}>
              <ChevronLeft size={28} color="white" />
            </button>
            <div className="routine-header-left">
              <div className="routine-icon-wrapper">
                <ClipboardCheck size={24} color="white" />
              </div>
              <div className="routine-header-text">
                <div className="routine-header-year">{date.format('YYYY년')}</div>
                <h2>{date.format('M월 D일 dddd')}</h2>
                <span>오늘의 스킨케어 루틴을 기록하세요</span>
              </div>
            </div>
          </div>

          {/* 1. 오늘 사용한 제품 선택 */}
          <div className="modal-section">
            <label>오늘 사용한 제품</label>
            {loading ? (
              <div className="empty-products-msg">제품 목록을 불러오는 중...</div>
            ) : (
              (() => {
                // "내 제품 관리"에서 +로 공통 선택된 제품(draftSelectedIds)을 기본으로 노출
                // + 이미 저장된 루틴에 포함된 제품(selectedProductIds)은 draft에 없더라도 편집을 위해 노출
                const draftSet = new Set(draftSelectedIds || []);
                const selectedSet = new Set(selectedProductIds || []);
                const displayProducts = myProducts.filter(p => {
                  const id = p.prdNo || p.id;
                  return draftSet.has(id) || selectedSet.has(id);
                });

                if (displayProducts.length === 0) {
                  return (
                    <div className="empty-products-msg">
                      {isToday
                        ? '오늘 선택된 제품이 없습니다. 마이루틴 > 내 제품 관리에서 +로 추가해주세요.'
                        : '이 날짜에 선택된 제품이 없습니다. 마이루틴 > 내 제품 관리에서 +로 추가해주세요.'}
                    </div>
                  );
                }

                return (
                  <div className="product-select-grid">
                    {displayProducts.map(product => {
                      const productId = product.prdNo || product.id;
                      const productName = product.prdName || product.name;
                      const displayCategory = getCategoryName(product.mainCategory);
                      return (
                        <div
                          key={productId}
                          className={`product-select-item ${selectedProductIds.includes(productId) ? 'selected' : ''}`}
                          onClick={() => toggleProduct(productId)}
                        >
                          <span className="product-category">{displayCategory}</span>
                          <div className="checkbox-circle">
                            {selectedProductIds.includes(productId) && <Check size={12} color="white" />}
                          </div>
                          <span className="product-name" title={productName}>
                            {truncateText(productName, 7)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </div>

          {/* 2. 피부 반응 기록 */}
          {selectedProductIds.length > 0 && (
            <div className="modal-section">
              <label>제품별 피부 반응 기록</label>
              <div className="reaction-list">
                {selectedProductIds.map(id => {
                  const product = myProducts.find(p => (p.prdNo || p.id) === id);
                  const reactionData = productReactions[id] || { reactions: [], memo: '' };

                  return (
                    <div key={id} className="reaction-card">
                      <div className="reaction-card-header">
                        <span className="reaction-product-name">{product?.prdName || product?.name}</span>
                      </div>

                      <div className="reaction-tags">
                        {REACTION_OPTIONS.map(option => (
                          <div
                            key={option.id}
                            className={`reaction-tag ${reactionData.reactions.includes(option.id) ? 'active' : ''}`}
                            onClick={() => updateReaction(id, option.id)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>

                      <input
                        type="text"
                        className="reaction-memo"
                        placeholder="이 제품에 대한 메모를 남겨주세요"
                        value={reactionData.memo}
                        onChange={e => updateProductMemo(id, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. 추가 활동 */}
          <div className="modal-section">
            <label>추가 활동</label>
            <div className="routine-input-group">
              <input
                type="text"
                placeholder="활동 입력 (예: 각질 제거, 마스크 팩)"
                value={newActivity}
                onChange={e => setNewActivity(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="add-btn" onClick={handleAddActivity}>
                <Plus size={18} />
                추가
              </button>
            </div>
            {activities.length > 0 && (
              <ul className="routine-list mt-2">
                {activities.map((activity, index) => (
                  <li key={index} className="routine-item">
                    <span className="routine-bullet"></span>
                    {activity}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 4. 전체 메모 */}
          <div className="modal-section">
            <label>오늘의 총평</label>
            <textarea
              placeholder="오늘의 피부 상태나 느낌을 기록하세요..."
              value={dailyMemo}
              onChange={e => setDailyMemo(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', padding: '20px 0' }}>
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              <Save size={18} />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineEditPage;
