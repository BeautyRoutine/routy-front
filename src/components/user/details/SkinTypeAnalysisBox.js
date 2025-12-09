import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import 'styles/SkinTypeAnalysisBox.css';

const SkinTypeAnalysisBox = ({ prdNo }) => {
  const navigate = useNavigate();

  const apiBaseUrl = useSelector(state => state.userConfig.apiBaseUrl);

  // 유저 아이디/피부타입
  const userId = useSelector(state => state.user.currentUser?.userId);
  const userSkin = useSelector(state => state.user.currentUser?.userSkin);

  const [effects, setEffects] = useState({ good: [], bad: [] });
  const [loading, setLoading] = useState(false);
  const [hoverType, setHoverType] = useState(null); // 'good' or 'bad'

  // userId와 userSkin 둘 다 있을 때만 통신
  useEffect(() => {
    const fetchEffects = async () => {
      if (!userId || !userSkin || userSkin === 6) return;
      const params = {
        prdNo: prdNo,
        userSkin: userSkin,
      };
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/ingredient/effect/prd_skin`, { params });
        setEffects(response.data.data || { good: [], bad: [] });
      } catch (err) {
        console.error('효과 성분 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEffects();
  }, [userId, userSkin, prdNo, apiBaseUrl]);

  const renderBar = (type, list, color) => {
    const count = list.length;
    return (
      <div className="bar-graph" onMouseEnter={() => setHoverType(type)} onMouseLeave={() => setHoverType(null)}>
        {/* 막대 */}
        {count > 0 && <div className="bar-fill" style={{ width: `${count * 40}px`, backgroundColor: color }}></div>}
        {/* 숫자 */}
        <span className="bar-count">{count}</span>

        {/* hover 시 오버레이 */}
        {hoverType === type && count > 0 && (
          <div className="bar-overlay" style={{ width: '300px' }}>
            <ul>
              {list.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.EFFNAME}</strong> - {item.EFFAIM}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Col md={6}>
      <div className="analysis-box bg-blue-soft">
        <div className="box-title">
          <span>✅</span> 내 피부타입 분석
        </div>
        <div
          className={`box-content d-flex flex-column p-3 ${
            !userId || !userSkin || userSkin === 6 ? 'align-start' : ''
          }`}
          style={{ backgroundColor: !userId || !userSkin || userSkin === 6 ? 'rgba(255,255,255,0.7)' : '' }}
        >
          {/* 1. 로그인 안 된 경우 */}
          {!userId && (
            <>
              <p className="text-center" style={{ color: '#555', fontWeight: '600' }}>
                로그인하고, 내 피부에 좋은 성분을
                <br />
                확인해보세요!
              </p>
              <Button variant="dark" style={{ maxWidth: '100px' }} onClick={() => navigate('/login')}>
                로그인
              </Button>
            </>
          )}

          {/* 2. 로그인은 했지만 피부타입 없음 */}
          {userId && (!userSkin || userSkin === 6) && (
            <>
              <p className="text-center" style={{ color: '#555', fontWeight: '600' }}>
                내 피부를 등록하고
                <br />
                좋은 성분을 확인해보세요!
              </p>
              <Button variant="primary" onClick={() => navigate('/mypage')}>
                피부 등록하러 가기
              </Button>
            </>
          )}

          {/* 3. 로그인 + 피부타입 있음 */}
          {userId && userSkin && userSkin !== 6 && (
            <>
              {loading ? (
                <p className="text-muted">불러오는 중...</p>
              ) : (
                (() => {
                  const goodCount = effects.good?.length || 0;
                  const badCount = effects.bad?.length || 0;

                  if (goodCount === 0 && badCount === 0) {
                    return <p className="text-muted">피부에 특화된 성분이 없습니다.</p>;
                  }

                  return (
                    <>
                      <div className="d-flex flex-row align-items-center mb-2">
                        <span className="me-2">추천 성분:</span>
                        {renderBar('good', effects.good, '#2196f3')}
                      </div>
                      <div className="d-flex flex-row align-items-center">
                        <span className="me-2">주의 성분:</span>
                        {renderBar('bad', effects.bad, '#f44336')}
                      </div>
                    </>
                  );
                })()
              )}
            </>
          )}
        </div>
      </div>
    </Col>
  );
};

export default SkinTypeAnalysisBox;
