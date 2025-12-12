import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user/userSlice';
import api from '../lib/apiClient';
import SmsVerification from '../components/user/auth/SmsVerification';
import { LoadingOverlay } from 'components/common/commonUtils';

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    userId: '',
    userPw: '',
    confirmPassword: '',
    userName: '',
    userHp: '',
    userEmail: '',
    userZip: '',
    userJibunAddr: '',
    userRoadAddr: '',
    userDetailAddr: '',
    userBirth: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData(prev => ({
          ...prev,
          userZip: data.zonecode,
          userJibunAddr: data.jibunAddress || data.autoJibunAddress,
          userRoadAddr: data.roadAddress,
        }));
      },
    }).open();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId.trim()) {
      newErrors.userId = '아이디를 입력해주세요';
    }

    if (!formData.userPw) {
      newErrors.userPw = '비밀번호를 입력해주세요';
    } else if (formData.userPw.length < 8) {
      newErrors.userPw = '비밀번호는 8자 이상이어야 합니다';
    }

    if (formData.userPw !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.userName.trim()) {
      newErrors.userName = '이름을 입력해주세요';
    }

    if (!formData.userHp.trim()) {
      newErrors.userHp = '휴대폰 번호를 입력해주세요';
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      newErrors.userEmail = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.userZip || !formData.userJibunAddr || !formData.userRoadAddr) {
      newErrors.address = '주소를 검색해주세요';
    }

    if (!formData.userDetailAddr.trim()) {
      newErrors.userDetailAddr = '상세 주소를 입력해주세요';
    }

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }

      return;
    }

    try {
      setLoading(true);

      const signupData = {
        userId: formData.userId,
        userPw: formData.userPw,
        userName: formData.userName,
        userHp: formData.userHp,
        userEmail: formData.userEmail,
        userZip: parseInt(formData.userZip),
        userJibunAddr: formData.userJibunAddr,
        userRoadAddr: formData.userRoadAddr,
        userDetailAddr: formData.userDetailAddr,
        userBirth: formData.userBirth || null,
        phoneVerified: isPhoneVerified,
      };

      const response = await api.post('/api/auth/signup', signupData);

      if (response.data.token) {
        // localStorage에 저장
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('userLevel', response.data.userLevel || '1');

        // user 객체 생성
        const user = {
          userId: response.data.userId,
          userName: response.data.userName,
          userLevel: response.data.userLevel || 1,
          userSkin: response.data.userSkin || 0,
        };

        // localStorage에 user 객체도 저장
        localStorage.setItem('user', JSON.stringify(user));

        // Redux 상태 업데이트
        dispatch(setUser(user));

        alert('회원가입이 완료되었습니다!');
        navigate('/skin-profile');
      }
    } catch (error) {
      if (error.message) {
        alert(error.message);
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoSignup = () => {
    window.location.href = "http://localhost:8080/auth/kakao/login";
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%)',
        padding: '40px 20px',
      }}
    >
      <LoadingOverlay show={loading} />

      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '50px 60px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #81D4FA 0%, #80CBC4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '36px',
              fontWeight: '700',
              color: 'white',
            }}
          >
            R
          </div>
          <h1
            style={{
              color: '#42A5F5',
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 10px 0',
            }}
          >
            Routy
          </h1>
          <p
            style={{
              color: '#666',
              fontSize: '14px',
              margin: 0,
            }}
          >
            나만을 위한 맞춤형 뷰티 루틴을 시작하세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 이름 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              이름
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="이름을 입력해주세요"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#F3E5F5',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
            />
            {errors.userName && (
              <p style={{ color: '#E57373', fontSize: '12px', marginTop: '5px', marginLeft: '15px' }}>
                {errors.userName}
              </p>
            )}
          </div>

          {/* 아이디 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              아이디
            </label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="아이디를 입력해주세요"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#F3E5F5',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
            />
            {errors.userId && (
              <p style={{ color: '#E57373', fontSize: '12px', marginTop: '5px', marginLeft: '15px' }}>
                {errors.userId}
              </p>
            )}
          </div>

          {/* 이메일 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              이메일
            </label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="example@email.com"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#F3E5F5',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
            />
            {errors.userEmail && (
              <p style={{ color: '#E57373', fontSize: '12px', marginTop: '5px', marginLeft: '15px' }}>
                {errors.userEmail}
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              비밀번호
            </label>
            <input
              type="password"
              name="userPw"
              value={formData.userPw}
              onChange={handleChange}
              placeholder="8자 이상 입력해주세요"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#F3E5F5',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
            />
            {errors.userPw && (
              <p style={{ color: '#E57373', fontSize: '12px', marginTop: '5px', marginLeft: '15px' }}>
                {errors.userPw}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#F3E5F5',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#E57373', fontSize: '12px', marginTop: '5px', marginLeft: '15px' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* 휴대폰 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              전화번호
            </label>
            <input
              type="tel"
              name="userHp"
              value={formData.userHp}
              onChange={handleChange}
              placeholder="01012345678"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#F3E5F5',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
            />
            {errors.userHp && (
              <p style={{ color: '#E57373', fontSize: '12px', marginTop: '5px', marginLeft: '15px' }}>
                {errors.userHp}
              </p>
            )}
          </div>

          {/* SMS 인증 */}
          {formData.userHp && (
            <SmsVerification
              phoneNumber={formData.userHp}
              onVerified={setIsPhoneVerified}
            />
          )}

          {/* 생년월일 (선택) */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              생년월일 <span style={{ color: '#999', fontWeight: '400' }}>(선택)</span>
            </label>
            <input
              type="date"
              name="userBirth"
              value={formData.userBirth}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#F3E5F5',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
                colorScheme: 'light',
              }}
            />
          </div>

          {/* 주소 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              배송 주소
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                name="userZip"
                value={formData.userZip}
                readOnly
                placeholder="01234"
                style={{
                  flex: '1',
                  padding: '16px 20px',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '15px',
                  backgroundColor: '#F3E5F5',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={handlePostcode}
                style={{
                  padding: '16px 32px',
                  background: '#263238',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => (e.target.style.background = '#37474F')}
                onMouseLeave={e => (e.target.style.background = '#263238')}
              >
                주소 찾기
              </button>
            </div>
            <input
              type="text"
              name="userRoadAddr"
              value={formData.userRoadAddr}
              readOnly
              placeholder="00시 00구 00동 12-345"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                marginBottom: '10px',
                backgroundColor: '#F3E5F5',
                boxSizing: 'border-box',
              }}
            />
            <input
              type="text"
              name="userDetailAddr"
              value={formData.userDetailAddr}
              onChange={handleChange}
              placeholder="000호"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#F3E5F5',
                boxSizing: 'border-box',
              }}
            />
            {errors.address && (
              <p style={{ color: '#E57373', fontSize: '12px', marginTop: '5px', marginLeft: '15px' }}>
                {errors.address}
              </p>
            )}
            {errors.userDetailAddr && (
              <p style={{ color: '#E57373', fontSize: '12px', marginTop: '5px', marginLeft: '15px' }}>
                {errors.userDetailAddr}
              </p>
            )}
          </div>

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            disabled={loading || !isPhoneVerified}
            style={{
              width: '100%',
              padding: '18px',
              background: loading || !isPhoneVerified ? '#ccc' : 'linear-gradient(135deg, #42A5F5 0%, #66BB6A 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading || !isPhoneVerified ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              marginTop: '30px',
              boxShadow: loading || !isPhoneVerified ? 'none' : '0 4px 15px rgba(66, 165, 245, 0.3)',
            }}
            onMouseEnter={e => {
              if (!loading && isPhoneVerified) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(66, 165, 245, 0.4)';
              }
            }}
            onMouseLeave={e => {
              if (!loading && isPhoneVerified) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(66, 165, 245, 0.3)';
              }
            }}
          >
            {loading ? '가입 중...' : !isPhoneVerified ? '휴대폰 인증을 완료해주세요' : '가입하기'}
          </button>
        </form>

        {/* 카카오 회원가입 버튼 */}
        <button
          type="button"
          onClick={handleKakaoSignup}
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            marginTop: '15px',
            background: loading ? '#ddd' : '#FEE500',
            color: '#3C1E1E',
            borderRadius: '50px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          카카오로 회원가입 / 로그인
        </button>

        {/* 로그인 이동 */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>이미 계정이 있으신가요? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#42A5F5',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;