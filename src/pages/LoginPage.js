import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user/userSlice';
import api from '../lib/apiClient';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    userId: '',
    userPw: '',
  });

  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleSubmit = async e => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.userId.trim()) {
      newErrors.userId = '아이디를 입력해주세요';
    }

    if (!formData.userPw) {
      newErrors.userPw = '비밀번호를 입력해주세요';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api.post('/api/auth/login', {
        userId: formData.userId,
        userPw: formData.userPw,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        const user = {
          userId: response.data.userId,
          userName: response.data.userName,
          userLevel: response.data.userLevel,
        };
        localStorage.setItem('user', JSON.stringify(user));

        dispatch(setUser(user));

        alert('로그인 성공!');
        navigate('/');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('로그인 중 오류가 발생했습니다.');
      }
      console.error('Login error:', error);
    }
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
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '50px 60px',
          width: '100%',
          maxWidth: '500px',
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
            나만의 뷰티 루틴을 Routy와 함께 시작해보세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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

          {/* 로그인 상태 유지 & 비밀번호 찾기 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              padding: '0 5px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{
                  marginRight: '8px',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#42A5F5',
                }}
              />
              로그인 상태 유지
            </label>
            <button
              type="button"
              onClick={() => alert('비밀번호 찾기 기능은 준비중입니다.')}
              style={{
                background: 'none',
                border: 'none',
                color: '#42A5F5',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              비밀번호 찾기
            </button>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #42A5F5 0%, #66BB6A 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(66, 165, 245, 0.3)',
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(66, 165, 245, 0.4)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(66, 165, 245, 0.3)';
            }}
          >
            아이디로 로그인
          </button>

          {/* 회원가입 링크 */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>아직 계정이 없으신가요? </span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
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
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
