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
  ChevronDown,
  ChevronUp,
  Settings,
  Trash2,
  Package,
  Plus,
} from 'lucide-react';
import './MyRoutyPage.css';

const MOCK_MY_PRODUCTS = [
  { id: 1, name: '그린 마일드 업 선 플러스' },
  { id: 2, name: '히알루론산 앰플 세럼' },
  { id: 3, name: '시카 리페어 크림' },
  { id: 4, name: '약산성 클렌징 폼' },
  { id: 5, name: '비타민 C 브라이트닝 세럼' },
];

const MyRoutyPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [routines, setRoutines] = useState({});

  // My Products State
  const [myProducts, setMyProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [isProductListOpen, setIsProductListOpen] = useState(false);

  const [weatherLocation, setWeatherLocation] = useState('서울');
  const [isEditingWeather, setIsEditingWeather] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }

    // Load data from localStorage
    const storedProducts = localStorage.getItem('myProducts');
    if (storedProducts) {
      setMyProducts(JSON.parse(storedProducts));
    } else {
      setMyProducts(MOCK_MY_PRODUCTS);
      localStorage.setItem('myProducts', JSON.stringify(MOCK_MY_PRODUCTS));
    }

    const storedRoutines = localStorage.getItem('routines');
    if (storedRoutines) {
      setRoutines(JSON.parse(storedRoutines));
    }
  }, [navigate]);

  const startOfMonth = currentDate.clone().startOf('month');
  const startDate = startOfMonth.clone().startOf('week');
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
    navigate(`/my-routy/edit/${date.format('YYYY-MM-DD')}`);
  };

  const isSelected = date => selectedDate && date.isSame(selectedDate, 'day');
  const isToday = date => date.isSame(moment(), 'day');
  const isCurrentMonth = date => date.isSame(currentDate, 'month');

  const getRoutineStatus = date => {
    const dateStr = date.format('YYYY-MM-DD');
    const routine = routines[dateStr];
    if (!routine) return null;

    const hasReaction = routine.usedProducts?.some(
      p => p.reactions && p.reactions.length > 0 && !p.reactions.includes('none'),
    );

    return { hasRoutine: true, hasReaction };
  };

  const handleAddProduct = () => {
    if (newProductName.trim()) {
      const newId = Math.max(...myProducts.map(p => p.id), 0) + 1;
      const updatedProducts = [...myProducts, { id: newId, name: newProductName.trim() }];
      setMyProducts(updatedProducts);
      localStorage.setItem('myProducts', JSON.stringify(updatedProducts));
      setNewProductName('');
    }
  };

  const handleRemoveProduct = id => {
    if (window.confirm('이 제품을 삭제하시겠습니까?')) {
      const updatedProducts = myProducts.filter(p => p.id !== id);
      setMyProducts(updatedProducts);
      localStorage.setItem('myProducts', JSON.stringify(updatedProducts));
    }
  };

  return (
    <div className="my-routy-container">
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

          {calendarDays.map((date, index) => {
            const status = getRoutineStatus(date);
            return (
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
                {status?.hasRoutine && <div className={`routine-dot ${status.hasReaction ? 'reaction' : ''}`}></div>}
              </div>
            );
          })}
        </div>

        <div className="calendar-footer">
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-dot record"></div>
              <span>루틴 기록</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot reaction"></div>
              <span>피부 반응</span>
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
          <div className="weather-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Cloud size={18} style={{ marginRight: '8px' }} />
              <span>오늘의 날씨</span>
            </div>
            <Settings
              size={16}
              style={{ cursor: 'pointer', opacity: 0.6 }}
              onClick={() => setIsEditingWeather(!isEditingWeather)}
            />
          </div>
          <div className="weather-content">
            <div>
              {isEditingWeather ? (
                <input
                  type="text"
                  value={weatherLocation}
                  onChange={e => setWeatherLocation(e.target.value)}
                  onBlur={() => setIsEditingWeather(false)}
                  onKeyPress={e => e.key === 'Enter' && setIsEditingWeather(false)}
                  autoFocus
                  className="weather-location-input"
                />
              ) : (
                <div className="weather-desc">{weatherLocation}</div>
              )}
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

        {/* My Products Management Card */}
        <div className="info-card product-manage-card">
          <div
            className="recommendation-header"
            onClick={() => setIsProductListOpen(!isProductListOpen)}
            style={{ cursor: 'pointer', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} />
              <span>내 제품 관리</span>
            </div>
            {isProductListOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {isProductListOpen && (
            <div className="product-manage-content">
              <div className="product-add-row">
                <input
                  type="text"
                  placeholder="제품명 입력"
                  value={newProductName}
                  onChange={e => setNewProductName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddProduct()}
                  className="product-add-input"
                />
                <button onClick={handleAddProduct} className="product-add-btn">
                  <Plus size={16} />
                </button>
              </div>
              <div className="product-list-manage">
                {myProducts.map(product => (
                  <div key={product.id} className="product-manage-item">
                    <span className="product-manage-name">{product.name}</span>
                    <button onClick={() => handleRemoveProduct(product.id)} className="product-delete-btn">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRoutyPage;
