import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ko';
import { X, ChevronLeft, ClipboardCheck, Check, Clock, Plus, Save } from 'lucide-react';
import './MyRoutyPage.css'; // Reusing the CSS

const REACTION_OPTIONS = [
  { id: 'oily', label: '유분 증가' },
  { id: 'dry', label: '건조함' },
  { id: 'redness', label: '붉어짐' },
  { id: 'stinging', label: '따가움' },
  { id: 'trouble', label: '트러블 의심' },
  { id: 'none', label: '반응 없음' },
];

const RoutineEditPage = () => {
  const navigate = useNavigate();
  const { date: dateParam } = useParams();
  const date = moment(dateParam);

  const [myProducts, setMyProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productReactions, setProductReactions] = useState({});
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [dailyMemo, setDailyMemo] = useState('');

  useEffect(() => {
    // Load data from localStorage
    const storedProducts = localStorage.getItem('myProducts');
    if (storedProducts) {
      setMyProducts(JSON.parse(storedProducts));
    } else {
      // Fallback or empty if not set
      setMyProducts([]);
    }

    const storedRoutines = localStorage.getItem('routines');
    if (storedRoutines) {
      const routines = JSON.parse(storedRoutines);
      const initialData = routines[dateParam];

      if (initialData) {
        setSelectedProductIds(initialData.usedProducts?.map(p => p.productId) || []);
        const reactions = {};
        initialData.usedProducts?.forEach(p => {
          reactions[p.productId] = {
            reactions: p.reactions || [],
            memo: p.memo || '',
            notificationTime: p.notificationTime || '',
          };
        });
        setProductReactions(reactions);
        setActivities(initialData.activities || []);
        setDailyMemo(initialData.dailyMemo || '');
      }
    }
  }, [dateParam]);

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
      const current = prev[productId] || { reactions: [], memo: '', notificationTime: '' };
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

  const updateNotificationTime = (productId, time) => {
    setProductReactions(prev => ({
      ...prev,
      [productId]: { ...(prev[productId] || { reactions: [] }), notificationTime: time },
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

  const handleSave = () => {
    const usedProducts = selectedProductIds.map(id => ({
      productId: id,
      productName: myProducts.find(p => p.id === id)?.name,
      reactions: productReactions[id]?.reactions || [],
      memo: productReactions[id]?.memo || '',
      notificationTime: productReactions[id]?.notificationTime || '',
    }));

    const newData = {
      date: dateParam,
      usedProducts,
      activities,
      dailyMemo,
    };

    // Save to localStorage
    const storedRoutines = localStorage.getItem('routines');
    const routines = storedRoutines ? JSON.parse(storedRoutines) : {};
    routines[dateParam] = newData;
    localStorage.setItem('routines', JSON.stringify(routines));

    navigate('/myrouty');
  };

  const handleBack = () => {
    navigate('/myrouty');
  };

  return (
    <div className="my-routy-container" style={{ display: 'block' }}>
      <div className="routine-edit-page">
        <div className="page-header">
          <button className="back-btn" onClick={handleBack}>
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="edit-content-wrapper">
          <div className="routine-header-card">
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
            {myProducts.length === 0 ? (
              <div className="empty-products-msg">등록된 제품이 없습니다. '내 제품 관리'에서 제품을 추가해주세요.</div>
            ) : (
              <div className="product-select-grid">
                {myProducts.map(product => (
                  <div
                    key={product.id}
                    className={`product-select-item ${selectedProductIds.includes(product.id) ? 'selected' : ''}`}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <div className="checkbox-circle">
                      {selectedProductIds.includes(product.id) && <Check size={12} color="white" />}
                    </div>
                    <span>{product.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. 피부 반응 기록 */}
          {selectedProductIds.length > 0 && (
            <div className="modal-section">
              <label>제품별 피부 반응 기록</label>
              <div className="reaction-list">
                {selectedProductIds.map(id => {
                  const product = myProducts.find(p => p.id === id);
                  const reactionData = productReactions[id] || { reactions: [], memo: '', notificationTime: '' };

                  return (
                    <div key={id} className="reaction-card">
                      <div className="reaction-card-header">
                        <span className="reaction-product-name">{product?.name}</span>
                        <div className="alarm-wrapper">
                          <div
                            className={`alarm-btn ${reactionData.notificationTime ? 'active' : ''}`}
                            style={{ position: 'relative', padding: 0 }}
                          >
                            <Clock
                              size={14}
                              style={{
                                position: 'absolute',
                                left: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                pointerEvents: 'none',
                              }}
                            />
                            <select
                              value={reactionData.notificationTime || ''}
                              onChange={e => updateNotificationTime(id, e.target.value)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: '12px',
                                color: 'inherit',
                                padding: '4px 8px 4px 26px',
                                cursor: 'pointer',
                                appearance: 'none',
                                outline: 'none',
                                height: '100%',
                              }}
                            >
                              <option value="" disabled hidden>
                                알림 설정
                              </option>
                              <option value="1일 후">1일 후</option>
                              <option value="2일 후">2일 후</option>
                              <option value="3일 후">3일 후</option>
                              <option value="7일 후">7일 후</option>
                              <option value="14일 후">14일 후</option>
                              <option value="30일 후">30일 후</option>
                            </select>
                          </div>
                          {reactionData.notificationTime && (
                            <button
                              className="alarm-clear-btn"
                              onClick={e => {
                                e.preventDefault();
                                updateNotificationTime(id, '');
                              }}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
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
            <button className="save-btn" onClick={handleSave}>
              <Save size={18} />
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineEditPage;
