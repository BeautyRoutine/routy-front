import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ko';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Sun,
  Wind,
  Droplet,
  Lightbulb,
  Bell,
  Sparkles,
  X,
  Plus,
  Save,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import './MyRoutyPage.css';

const RoutineModal = ({ isOpen, onClose, date, onSave, initialData }) => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setActivities(initialData.activities || []);
      setMemo(initialData.memo || '');
    } else if (isOpen) {
      setActivities([]);
      setMemo('');
    }
  }, [isOpen, initialData]);

  // 모달이 열려있을 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
    onSave(date.format('YYYY-MM-DD'), { activities, memo });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <Sparkles className="modal-header-icon" size={24} />
          <h2>{date.format('YYYY년 M월 D일 dddd')}</h2>
        </div>
        <p className="modal-subtitle">오늘의 스킨케어 루틴을 기록하세요.</p>

        <div className="modal-section">
          <label>스킨케어 활동 추가</label>
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
        </div>

        <div className="modal-section">
          <label>오늘의 루틴</label>
          <div className="routine-list-container">
            {activities.length === 0 ? (
              <div className="empty-state">
                <Sparkles size={48} className="empty-icon" />
                <p>아직 등록된 활동이 없습니다</p>
              </div>
            ) : (
              <ul className="routine-list">
                {activities.map((activity, index) => (
                  <li key={index} className="routine-item">
                    <span className="routine-bullet"></span>
                    {activity}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="modal-section">
          <label>메모</label>
          <textarea
            placeholder="오늘의 피부 상태나 느낌을 기록하세요..."
            value={memo}
            onChange={e => setMemo(e.target.value)}
            rows={4}
          />
        </div>

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSave}>
            <Save size={18} />
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

const MyRoutyPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routines, setRoutines] = useState({});
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [navigate]);

  const startOfMonth = currentDate.clone().startOf('month');
  const startDate = startOfMonth.clone().startOf('week');
  // 6주 고정 (6 * 7 = 42일)
  const endDate = startDate.clone().add(41, 'days');

  const calendarDays = [];
  let day = startDate.clone();

  while (day.isSameOrBefore(endDate, 'day')) {
    calendarDays.push(day.clone());
    day.add(1, 'day');
  }

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  const handleDateClick = date => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveRoutine = (dateStr, data) => {
    setRoutines(prev => ({
      ...prev,
      [dateStr]: data,
    }));
  };

  const isSelected = date => selectedDate && date.isSame(selectedDate, 'day');
  const isToday = date => date.isSame(moment(), 'day');
  const isCurrentMonth = date => date.isSame(currentDate, 'month');
  const hasRoutine = date => !!routines[date.format('YYYY-MM-DD')];

  return (
    <div className="my-routy-container">
      <RoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        onSave={handleSaveRoutine}
        initialData={routines[selectedDate.format('YYYY-MM-DD')]}
      />
      {/* Left Section: Calendar */}
      <div className="calendar-section">
        <div className="calendar-header">
          <CalendarIcon size={20} />
          <span>달력</span>
          <span className="calendar-header-desc">달력을 클릭해서 루틴을 기록해보세요</span>
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

          {calendarDays.map((date, index) => (
            <div
              key={index}
              className={`calendar-day 
                ${!isCurrentMonth(date) ? 'other-month' : ''}
                ${isSelected(date) ? 'selected' : ''}
                ${isToday(date) ? 'today' : ''}
                ${date.day() === 0 ? 'sunday' : date.day() === 6 ? 'saturday' : ''}
              `}
              onClick={() => handleDateClick(date)}
            >
              {date.format('D')}
              {hasRoutine(date) && <div className="routine-dot"></div>}
            </div>
          ))}
        </div>

        <div className="calendar-footer">
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-dot record"></div>
              <span>루틴 기록</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot today"></div>
              <span>오늘</span>
            </div>
          </div>

          <div className="selected-date-display">
            <div className="selected-date-label">선택된 날짜</div>
            <div className="selected-date-value">{selectedDate.format('YYYY년 M월 D일 dddd')}</div>
          </div>
        </div>
      </div>

      {/* Right Section: Info Cards */}
      <div className="info-section">
        {/* Weather Card */}
        <div className="info-card weather-card">
          <div className="weather-header">
            <Cloud size={18} />
            <span>오늘의 날씨</span>
          </div>
          <div className="weather-content">
            <div>
              <div className="weather-desc">서울</div>
              <div className="weather-temp">22°C</div>
              <div className="weather-desc">맑음</div>
            </div>
            <Sun size={64} className="weather-icon" />
          </div>
          <div className="weather-details">
            <div className="weather-detail-item">
              <Droplet size={20} color="#007bff" />
              <div className="weather-detail-text">
                <span className="weather-detail-label">습도</span>
                <span className="weather-detail-value">65%</span>
              </div>
            </div>
            <div className="weather-detail-item">
              <Wind size={20} color="#007bff" />
              <div className="weather-detail-text">
                <span className="weather-detail-label">풍속</span>
                <span className="weather-detail-value">12 m/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tip Card */}
        <div className="info-card tip-card">
          <div className="tip-header">
            <Lightbulb size={18} />
            <span>오늘의 스킨케어 팁</span>
          </div>
          <div className="tip-content">자외선이 강할 수 있어요. 선크림을 꼭 바르세요!</div>
        </div>

        {/* Notification Card */}
        <div className="info-card notification-card">
          <div className="notification-header">
            <Bell size={18} />
            <span>계절 변화 알림</span>
          </div>
          <div className="tip-content">
            곧 겨울 시즌이 다가옵니다. 건조해지는 피부를 위해 수분감 있는 제품으로 바꿔보세요!
          </div>
        </div>

        {/* Recommendations Card */}
        <div className="info-card recommendation-card">
          <div
            className="recommendation-header"
            onClick={() => setIsRecommendationOpen(!isRecommendationOpen)}
            style={{ cursor: 'pointer', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} />
              <span>추천 제품</span>
            </div>
            {isRecommendationOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {isRecommendationOpen && (
            <div className="product-list">
              <div className="product-item">
                <div className="product-icon">
                  <Droplet size={20} />
                </div>
                <div className="product-info">
                  <div className="product-name">수분 에센스</div>
                  <div className="product-desc">건조한 피부에 충분한 수분 공급</div>
                </div>
              </div>
              <div className="product-item">
                <div className="product-icon" style={{ backgroundColor: '#fff0f6', color: '#e64980' }}>
                  <Droplet size={20} />
                </div>
                <div className="product-info">
                  <div className="product-name">하이드레이팅 크림</div>
                  <div className="product-desc">겨울철 필수 보습 크림</div>
                </div>
              </div>
              <div className="product-item">
                <div className="product-icon" style={{ backgroundColor: '#ebfbee', color: '#40c057' }}>
                  <Droplet size={20} />
                </div>
                <div className="product-info">
                  <div className="product-name">진정 토너</div>
                  <div className="product-desc">예민한 피부 진정 효과</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRoutyPage;
