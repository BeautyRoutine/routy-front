import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import api from 'app/api';
import { addDraftProduct, removeDraftProduct } from '../features/routine/routineDraftSlice';
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
  Package,
  Plus,
  Trash2,
} from 'lucide-react';
import './MyRoutyPage.css';

// NOTE: 내 제품은 서버의 주문 이력을 기반으로 생성됩니다. FE에서 생성/삭제하지 않습니다.

const MyRoutyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const userId = currentUser?.userId ? currentUser.userId.trim() : '';

  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [routineData, setRoutineData] = useState(undefined); // undefined = not fetched yet, null = no routine
  const [loadingRoutine, setLoadingRoutine] = useState(false);
  const [routineError, setRoutineError] = useState(null);
  const [monthlyRoutines, setMonthlyRoutines] = useState(new Set()); // 현재 달의 루틴 기록된 날짜 Set

  // My Products State
  const [myProducts, setMyProducts] = useState([]);
  const [isProductListOpen, setIsProductListOpen] = useState(false);

  // 사용자가 직접 편집하는 도시값은 `cityPref`를 사용합니다.
  const [isEditingWeather, setIsEditingWeather] = useState(false);
  const [cityPref, setCityPref] = useState('Seoul');
  const [dashboardWeather, setDashboardWeather] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [savingCity, setSavingCity] = useState(false);

  const DRAFT_KEY = 'ALL'; // 내 제품 관리에서 +로 "공통 선택"된 제품 목록
  const draftSelectedPrdNos = useSelector(state => state.routineDraft?.byDate?.[DRAFT_KEY] || []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    // Fetch my-products and used-products from API and merge isUsed flag
    const fetchMyProductsAndUsed = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/api/users/${userId}/my-products`);
        let products = [];
        if (res?.data && res.data.resultCode === 200) {
          products = (res.data.data || []).map(p => ({
            prdNo: p.prdNo,
            prdName: p.prdName,
            prdImg: p.prdImg,
            regDate: p.regDate,
            mainCategory: p.mainCategory,
            isUsed: false,
          }));
        } else {
          // no fallback; if API doesn't return, treat as empty
          products = [];
        }

        // fetch used-products
        try {
          const usedRes = await api.get(`/api/users/${userId}/used-products`);
          const usedList = usedRes?.data && usedRes.data.resultCode === 200 ? usedRes.data.data || [] : [];
          const usedSet = new Set(usedList);
          products = products.map(p => ({
            ...p,
            isUsed: usedSet.has(p.prdNo),
          }));
        } catch (err) {
          console.warn('used-products fetch failed', err);
        }

        setMyProducts(products);
      } catch (err) {
        console.warn('fetchMyProducts failed', err);
        // If API fails, show empty list (no local mock persistence)
        setMyProducts([]);
      }
    };

    fetchMyProductsAndUsed();
  }, [navigate, userId]);

  // --- Weather preference & dashboard fetch ---
  useEffect(() => {
    const fetchCityPref = async () => {
      if (!userId) return; // 로그인 흐름에서 처리됨
      try {
        const res = await api.get(`/api/users/${userId}/preferences/weather`);
        if (res?.data && res.data.resultCode === 200) {
          setCityPref(res.data.data || 'Seoul');
        } else {
          // 기본값 설정 후 대시보드 호출
          setCityPref('Seoul');
        }
      } catch (err) {
        console.warn('fetchCityPref failed', err);
        // 에러 발생 시에도 기본값 설정 후 대시보드 호출
        setCityPref('Seoul');
      }
    };

    if (userId) {
      fetchCityPref();
    }
  }, [userId]);

  // 대시보드 조회 API (날씨 정보 포함)
  const fetchDashboard = useCallback(async () => {
    if (!userId) {
      console.warn('fetchDashboard: userId is empty');
      return;
    }
    setLoadingDashboard(true);
    try {
      const res = await api.get(`/api/users/${userId}/dashboard`);

      if (res?.data && res.data.resultCode === 200) {
        const dashboardData = res.data.data || null;
        // console.log('Dashboard API Response:', dashboardData);

        // 응답 구조: data.weather 안에 날씨 정보가 있음
        if (dashboardData?.weather) {
          setDashboardWeather(dashboardData.weather);
        } else {
          console.warn('Dashboard data.weather is missing:', dashboardData);
          setDashboardWeather(null);
        }
      } else {
        console.warn('Dashboard API returned non-200 resultCode:', res?.data);
        setDashboardWeather(null);
      }
    } catch (err) {
      console.error('fetchDashboard failed', err);
      if (err.response) {
        console.error('Error response status:', err.response.status);
        console.error('Error response data:', err.response.data);
      } else {
        console.error('Error message:', err.message);
      }
      setDashboardWeather(null);
    } finally {
      setLoadingDashboard(false);
    }
  }, [userId]);

  // cityPref 변경 시 대시보드 조회
  useEffect(() => {
    if (userId) {
      fetchDashboard();
    }
  }, [cityPref, userId, fetchDashboard]);

  const saveCityPref = async newCity => {
    if (!userId) return false;
    setSavingCity(true);
    try {
      await api.post(`/api/users/${userId}/preferences/weather`, { cityName: newCity });
      setCityPref(newCity);
      // 대시보드 조회는 cityPref 변경으로 자동 호출됨
      return true;
    } catch (err) {
      console.error('saveCityPref failed', err);
      return false;
    } finally {
      setSavingCity(false);
    }
  };

  // selectedDate가 바뀔 때마다 백엔드에서 해당 날짜 루틴 상세를 조회합니다.
  useEffect(() => {
    const fetchRoutine = async dateMoment => {
      if (!userId) {
        setRoutineData(null);
        return;
      }

      const dateStr = dateMoment.format('YYYY-MM-DD');
      setLoadingRoutine(true);
      setRoutineError(null);
      try {
        const res = await api.get(`/api/users/${userId}/routines/${dateStr}`);
        if (res?.data && res.data.resultCode === 200) {
          setRoutineData(res.data.data); // object or null
        } else {
          setRoutineData(null);
        }
      } catch (err) {
        console.error('fetchRoutine error', err);
        setRoutineError(err);
        setRoutineData(null);
      } finally {
        setLoadingRoutine(false);
      }
    };

    fetchRoutine(selectedDate);
  }, [selectedDate, userId]);

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

  // 날짜 클릭 시: selectedDate만 변경, 기록 보기 버튼 노출
  const handleDateClick = date => {
    setSelectedDate(date);
  };

  // 루틴 기록하러 가기 버튼 클릭 시 기록 페이지 이동
  const handleGoToRoutineRecord = () => {
    if (selectedDate) {
      navigate(`/my-routy/edit/${selectedDate.format('YYYY-MM-DD')}`);
    }
  };

  // 루틴 기록 삭제
  const handleDeleteRoutine = async () => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!routineData) {
      alert('삭제할 루틴 기록이 없습니다.');
      return;
    }

    const dateStr = selectedDate.format('YYYY-MM-DD');
    const confirmDelete = window.confirm(`${dateStr}의 루틴 기록을 삭제하시겠습니까?`);

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/users/${userId}/routines/${dateStr}`);

      // 삭제 성공 후 상태 업데이트
      setRoutineData(null);

      // 월간 루틴 목록에서도 해당 날짜 제거
      setMonthlyRoutines(prev => {
        const newSet = new Set(prev);
        newSet.delete(dateStr);
        return newSet;
      });

      alert('루틴 기록이 삭제되었습니다.');
    } catch (err) {
      console.error('deleteRoutine failed', err);
      if (err.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        alert('삭제 권한이 없습니다.');
      } else {
        alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  // 내 제품 관리에서 제품 + / 휴지통은 "임시 선택(draft)"만 바꿉니다. (페이지 이동/루틴 생성 금지)
  const handleAddProductToRoutine = product => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    dispatch(addDraftProduct({ date: DRAFT_KEY, prdNo: product.prdNo }));
  };

  const isProductInDraft = prdNo => draftSelectedPrdNos.includes(prdNo);

  const handleRemoveProductFromRoutine = product => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
    dispatch(removeDraftProduct({ date: DRAFT_KEY, prdNo: product.prdNo }));
  };

  const isSelected = date => selectedDate && date.isSame(selectedDate, 'day');
  const isToday = date => date.isSame(moment(), 'day');
  const isCurrentMonth = date => date.isSame(currentDate, 'month');

  // 월간 루틴 조회 (달력 표시용)
  useEffect(() => {
    const fetchMonthlyRoutines = async () => {
      if (!userId) {
        setMonthlyRoutines(new Set());
        return;
      }

      const year = currentDate.year();
      const month = currentDate.month() + 1; // moment는 0-based, API는 1-based

      try {
        const res = await api.get(`/api/users/${userId}/routines/monthly`, {
          params: { year, month },
        });

        console.log(`[월간 루틴 API] ${year}-${month} 응답:`, res?.data);
        console.log(`[월간 루틴 API] routines 배열 상세:`, res?.data?.data?.routines);

        if (res?.data && res.data.resultCode === 200 && res.data.data?.routines) {
          const routinesArray = res.data.data.routines;
          console.log(`[월간 루틴] routines 배열 길이:`, routinesArray.length);
          console.log(`[월간 루틴] 첫 번째 항목 예시:`, routinesArray[0]);

          // API 응답 구조: routines 배열에 있는 항목 자체가 루틴이 기록된 날짜를 의미
          // hasRoutine 필드가 없거나 false여도, 루틴 객체가 존재하면 기록된 것으로 간주
          const routineDates = new Set(
            routinesArray
              .filter(r => {
                // date 필드가 있으면 루틴이 기록된 것으로 간주
                // hasRoutine 필드가 명시적으로 false가 아니면 모두 포함
                const hasDate = r.date || r.dateStr || r.routineDate;
                const shouldInclude = hasDate && r.hasRoutine !== false;
                return shouldInclude;
              })
              .map(r => {
                // date 필드에서 날짜 부분만 추출 (시간 부분 제거)
                const dateValue = r.date || r.dateStr || r.routineDate;
                // '2025-12-12 00:00:00.0' 형식에서 '2025-12-12'만 추출
                if (dateValue && typeof dateValue === 'string') {
                  return dateValue.split(' ')[0]; // 공백 기준으로 첫 번째 부분만 (YYYY-MM-DD)
                }
                return dateValue;
              })
              .filter(date => date), // null/undefined 제거
          );
          console.log(`[월간 루틴] 루틴 기록된 날짜 (${routineDates.size}개):`, Array.from(routineDates));
          setMonthlyRoutines(routineDates);
        } else {
          console.log('[월간 루틴] 루틴 데이터 없음');
          setMonthlyRoutines(new Set());
        }
      } catch (err) {
        console.error('[월간 루틴 API] 호출 실패:', err);
        setMonthlyRoutines(new Set());
      }
    };

    fetchMonthlyRoutines();
  }, [userId, currentDate]);

  const getRoutineStatus = date => {
    // 월간 루틴 데이터에서 해당 날짜에 루틴이 있는지 확인
    const dateStr = date.format('YYYY-MM-DD');
    const hasRoutine = monthlyRoutines.has(dateStr);

    // 디버깅: 특정 날짜에 대해 로그 출력 (필요시 주석 해제)
    // if (dateStr === '2025-01-15') {
    //   console.log(`[getRoutineStatus] ${dateStr}: hasRoutine=${hasRoutine}, monthlyRoutines.size=${monthlyRoutines.size}`);
    // }

    return hasRoutine ? { hasRoutine: true } : null;
  };

  // Note: FE is not allowed to create/delete `my-products`.
  // Only used-products (toggle) is supported by the FE.

  // DB의 영어 reaction 값을 한글로 변환 (FE 표시용)
  const getReactionLabel = reactionValue => {
    const reactionMap = {
      NORMAL: '반응 없음',
      OILY: '유분 증가',
      DRY: '건조함',
      REDNESS: '붉어짐',
      STINGING: '따가움',
      TROUBLE: '트러블 의심',
    };
    return reactionMap[reactionValue] || reactionValue;
  };

  return (
    <div className="my-routy-container">
      {/* Unified Dashboard Card (Calendar + Record) */}
      <div className="dashboard-main-card">
        {/* 1. Left Section: Calendar */}
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
                  {status?.hasRoutine && <div className="routine-dot record"></div>}
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
                <div className="legend-dot today"></div>
                <span>오늘</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Right Section: Selected Date Record (Scrollable) */}
        <div className="record-section">
          {/* Header */}
          <div className="record-header-compact">
            <div className="record-date-label">선택된 날짜</div>
            <div className="record-date-title-wrapper">
              <div className="record-date-title">{selectedDate.format('YYYY년 M월 D일 dddd')}</div>
              {routineData && (
                <button className="delete-routine-btn" onClick={handleDeleteRoutine} title="루틴 기록 삭제">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="record-scroll-area">
            {(() => {
              if (loadingRoutine || routineData === undefined) {
                return (
                  <div className="record-card no-record-card">
                    <span>불러오는 중...</span>
                  </div>
                );
              }

              if (routineError) {
                return (
                  <div className="record-card no-record-card">
                    <span>데이터를 불러오는 중 오류가 발생했습니다.</span>
                  </div>
                );
              }

              if (routineData === null) {
                return (
                  <div className="record-card no-record-card">
                    <span>기록이 없습니다.</span>
                  </div>
                );
              }

              // routineData 존재 시 렌더
              const routine = routineData || {};
              return (
                <>
                  <div className="record-card-list">
                    {(routine.products || []).map((p, idx) => (
                      <div key={idx} className="record-card">
                        <div className="record-product-name">{p.prdName}</div>
                        {p.reaction && p.reaction !== 'NORMAL' && (
                          <div className="record-reaction">
                            <span>반응: </span>
                            <span className="reaction-tag">{getReactionLabel(p.reaction)}</span>
                          </div>
                        )}
                        {p.memo && (
                          <div className="record-memo">
                            <span className="memo-label">메모:</span> {p.memo}
                          </div>
                        )}
                        {/* 알림 표시는 제거 */}
                      </div>
                    ))}
                  </div>
                  {/* 추가 활동 */}
                  <div className="record-extra-section">
                    <div className="extra-title">추가 활동</div>
                    <ul className="extra-list">
                      {(routine.extraActivities || []).map((act, i) => (
                        <li key={i} className="extra-item">
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* 오늘의 총평 */}
                  <div className="record-summary-section">
                    <div className="summary-title">오늘의 총평</div>
                    <div className="summary-content">{routine.summary || routine.dailyReview}</div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Fixed Footer */}
          <div className="record-footer-fixed">
            <button className="view-record-btn improved-view-btn" onClick={handleGoToRoutineRecord}>
              <span>루틴 기록하러 가기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Right Sidebar: Info Cards */}
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
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={cityPref}
                    onChange={e => setCityPref(e.target.value)}
                    className="weather-location-input"
                    autoFocus
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={async () => {
                      const ok = await saveCityPref(cityPref);
                      if (ok) setIsEditingWeather(false);
                      else alert('도시 저장에 실패했습니다.');
                    }}
                    disabled={savingCity}
                  >
                    저장
                  </button>
                </div>
              ) : (
                <div className="weather-desc">{cityPref}</div>
              )}

              <div className="weather-temp">
                {loadingDashboard || !dashboardWeather || dashboardWeather.temperature == null
                  ? '--°C'
                  : `${Number(dashboardWeather.temperature).toFixed(1)}°C`}
              </div>
              <div className="weather-desc" />
            </div>
            {/* icon mapping: use simple heuristic */}
            {(() => {
              if (loadingDashboard || !dashboardWeather) return <Sun size={64} className="weather-icon" />;
              const t = Number(dashboardWeather.temperature ?? 0);
              const h = Number(dashboardWeather.humidity ?? 0);
              const w = Number(dashboardWeather.windSpeed ?? 0);
              if (w > 8) return <Wind size={64} className="weather-icon" />;
              if (h > 70) return <Droplet size={64} className="weather-icon" />;
              if (t >= 25) return <Sun size={64} className="weather-icon" />;
              return <Cloud size={64} className="weather-icon" />;
            })()}
          </div>
          <div className="weather-details">
            <div className="weather-detail-item">
              <Droplet size={20} color="#007bff" />
              <div className="weather-detail-text">
                <span className="weather-detail-label">습도</span>
                <span className="weather-detail-value">
                  {loadingDashboard || !dashboardWeather || dashboardWeather.humidity == null
                    ? '--%'
                    : `${Number(dashboardWeather.humidity).toFixed(0)}%`}
                </span>
              </div>
            </div>
            <div className="weather-detail-item">
              <Wind size={20} color="#007bff" />
              <div className="weather-detail-text">
                <span className="weather-detail-label">풍속</span>
                <span className="weather-detail-value">
                  {loadingDashboard || !dashboardWeather || dashboardWeather.windSpeed == null
                    ? '-- m/s'
                    : `${Number(dashboardWeather.windSpeed).toFixed(1)} m/s`}
                </span>
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
              <div className="product-list-manage">
                {myProducts.map(product => {
                  const isInSelectedDateDraft = isProductInDraft(product.prdNo);
                  return (
                    <div
                      key={product.prdNo}
                      className="product-manage-item"
                      style={{
                        backgroundColor: isInSelectedDateDraft ? '#e8f5e9' : 'transparent',
                        padding: '8px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <span
                        className="product-manage-name"
                        style={{
                          color: isInSelectedDateDraft ? '#2e7d32' : 'inherit',
                          fontWeight: isInSelectedDateDraft ? '600' : 'normal',
                        }}
                      >
                        {product.prdName}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isInSelectedDateDraft ? (
                          <button
                            onClick={() => handleRemoveProductFromRoutine(product)}
                            style={{
                              padding: '6px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#d32f2f',
                            }}
                            title="선택된 날짜에서 제거"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddProductToRoutine(product)}
                            style={{
                              padding: '6px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#007bff',
                            }}
                            title="선택된 날짜에 추가"
                          >
                            <Plus size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRoutyPage;
