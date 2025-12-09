import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ko';
import { X, ChevronLeft, ChevronRight, ClipboardCheck, Check, Clock, Plus, Save } from 'lucide-react';
import './MyRoutyPage.css';

const REACTION_OPTIONS = [
  { id: 'oily', label: '유분 증가' },
  { id: 'dry', label: '건조함' },
  { id: 'redness', label: '붉어짐' },
  { id: 'stinging', label: '따가움' },
  { id: 'trouble', label: '트러블 의심' },
  { id: 'none', label: '반응 없음' },
];

// Helper to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Simple Calendar Modal Component
const CalendarModal = ({ isOpen, onClose, onSelectDate, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(moment());

  useEffect(() => {
    if (isOpen && selectedDate) {
      setCurrentDate(moment(selectedDate));
    } else if (isOpen) {
      setCurrentDate(moment());
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const startOfMonth = currentDate.clone().startOf('month');
  const startDate = startOfMonth.clone().startOf('week');
  const endDate = startDate.clone().add(41, 'days');

  const calendarDays = [];
  let day = startDate.clone();
  while (day.isSameOrBefore(endDate, 'day')) {
    calendarDays.push(day.clone());
    day.add(1, 'day');
  }

  const handlePrevMonth = () => setCurrentDate(currentDate.clone().subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(currentDate.clone().add(1, 'month'));

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-popup" onClick={e => e.stopPropagation()}>
        <div className="calendar-popup-header">
          <div className="calendar-popup-title">
            <Clock size={20} color="#007bff" />
            <span>알림 날짜 설정</span>
            <span className="calendar-popup-subtitle">재사용알림 받기</span>
          </div>
          <button className="calendar-popup-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="calendar-nav">
          <button onClick={handlePrevMonth}>
            <ChevronLeft size={24} />
          </button>
          <span className="calendar-title">{currentDate.format('YYYY년 M월')}</span>
          <button onClick={handleNextMonth}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="calendar-grid">
          {['일', '월', '화', '수', '목', '금', '토'].map((dayName, index) => (
            <div
              key={dayName}
              className={`calendar-day-name ${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''}`}
            >
              {dayName}
            </div>
          ))}
          {calendarDays.map((date, index) => {
            const isSelected = selectedDate && date.isSame(selectedDate, 'day');
            const isToday = date.isSame(moment(), 'day');
            const isCurrentMonth = date.isSame(currentDate, 'month');

            return (
              <div
                key={index}
                className={`calendar-day 
                  ${!isCurrentMonth ? 'other-month' : ''}
                  ${isSelected ? 'selected' : ''}
                  ${isToday ? 'today' : ''}
                  ${date.day() === 0 ? 'sunday' : date.day() === 6 ? 'saturday' : ''}
                `}
                onClick={() => {
                  onSelectDate(date.format('YYYY-MM-DD'));
                  onClose();
                }}
              >
                {date.format('D')}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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

  // Calendar Modal State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentAlarmProduct, setCurrentAlarmProduct] = useState(null);

  useEffect(() => {
    // Load data from localStorage
    const storedProducts = localStorage.getItem('myProducts');
    if (storedProducts) {
      setMyProducts(JSON.parse(storedProducts));
    } else {
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

  const openCalendar = productId => {
    setCurrentAlarmProduct(productId);
    setIsCalendarOpen(true);
  };

  const handleDateSelect = dateString => {
    if (currentAlarmProduct) {
      setProductReactions(prev => ({
        ...prev,
        [currentAlarmProduct]: {
          ...(prev[currentAlarmProduct] || { reactions: [] }),
          notificationTime: dateString,
        },
      }));
    }
  };

  const clearNotification = (e, productId) => {
    e.stopPropagation();
    setProductReactions(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { reactions: [] }),
        notificationTime: '',
      },
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

    const storedRoutines = localStorage.getItem('routines');
    const routines = storedRoutines ? JSON.parse(storedRoutines) : {};
    routines[dateParam] = newData;
    localStorage.setItem('routines', JSON.stringify(routines));

    navigate('/myrouty');
  };

  const handleBack = () => {
    navigate('/myrouty');
  };

  const formatNotificationDate = dateString => {
    if (!dateString) return '';
    if (dateString.includes('후')) return dateString;

    const m = moment(dateString);
    if (!m.isValid()) return dateString;
    return m.format('M월 D일');
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
            {myProducts.length === 0 ? (
              <div className="empty-products-msg">등록된 제품이 없습니다. '내 제품 관리'에서 제품을 추가해주세요.</div>
            ) : (
              <div className="product-select-grid">
                {myProducts.map(product => {
                  const categoryMap = {
                    '그린 마일드 업 선 플러스': '선케어',
                    '히알루론산 앰플 세럼': '앰플',
                    '시카 리페어 크림': '크림',
                    '약산성 클렌징 폼': '클렌징',
                    '비타민 C 브라이트닝 세럼': '앰플',
                  };
                  const displayCategory = product.category || categoryMap[product.name] || '기타';
                  return (
                    <div
                      key={product.id}
                      className={`product-select-item ${selectedProductIds.includes(product.id) ? 'selected' : ''}`}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <span className="product-category">{displayCategory}</span>
                      <div className="checkbox-circle">
                        {selectedProductIds.includes(product.id) && <Check size={12} color="white" />}
                      </div>
                      <span className="product-name" title={product.name}>
                        {truncateText(product.name, 7)}
                      </span>
                    </div>
                  );
                })}
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
                          <button
                            className={`alarm-btn ${reactionData.notificationTime ? 'active' : ''}`}
                            onClick={() => openCalendar(id)}
                          >
                            <Clock size={14} />
                            {reactionData.notificationTime
                              ? `${formatNotificationDate(reactionData.notificationTime)} 알림`
                              : '알림 설정'}
                            {reactionData.notificationTime && (
                              <div className="alarm-clear-btn" onClick={e => clearNotification(e, id)}>
                                <X size={12} />
                              </div>
                            )}
                          </button>
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

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={handleDateSelect}
        selectedDate={
          currentAlarmProduct && productReactions[currentAlarmProduct]?.notificationTime
            ? productReactions[currentAlarmProduct].notificationTime
            : null
        }
      />
    </div>
  );
};

export default RoutineEditPage;
