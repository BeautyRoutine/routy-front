import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user/userSlice';

export default function KakaoCallback() {
  const executedRef = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 이미 실행됐으면 종료
    if (executedRef.current) return;
    executedRef.current = true;

    console.log('=== KakaoCallback 실행 ===');
    console.log('전체 URL:', window.location.href);
    console.log('searchParams:', searchParams.toString());

    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const userLevel = searchParams.get('userLevel');
    const userSkinStr = searchParams.get('userSkin') || '0';
    const userName = searchParams.get('userName') || '';
    const needsSkinProfileStr = searchParams.get('needsSkinProfile');

    console.log('needsSkinProfile (raw):', needsSkinProfileStr);

    // userName: already decoded by URLSearchParams
    const userSkin = Number(userSkinStr);
    const needsSkinProfile = needsSkinProfileStr === 'true';

    console.log('받은 데이터:', {
      token: token ? token.substring(0, 20) + '...' : null,
      userId,
      userName,
      userSkin,
      needsSkinProfile,
      needsSkinProfileStr,
    });

    // 토큰이나 userId가 없으면 로그인 페이지로
    if (!token || !userId) {
      alert('로그인 정보가 올바르지 않습니다.');
      navigate('/login', { replace: true });
      return;
    }

    // Redux & localStorage에 저장
    const user = {
      userId,
      userName,
      userLevel,
      userSkin,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch(setUser(user));

    // 조건에 따라 페이지 이동
    const timer = setTimeout(() => {
      console.log('라우팅 결정:', { needsSkinProfile, userSkin });

      if (needsSkinProfile || userSkin === 0) {
        alert(`${userName || '회원'}님 환영합니다! 피부 타입을 설정해주세요.`);
        navigate('/skin-profile', { replace: true });
      } else {
        alert(`${userName || '회원'}님 환영합니다!`);
        navigate('/', { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, navigate, searchParams]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2>로그인 중...</h2>
        <p style={{ marginTop: '10px', color: '#6c757d' }}>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
