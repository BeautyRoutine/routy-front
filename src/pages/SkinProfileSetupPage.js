import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Step1SkinType from '../components/user/skinprofile/Step1SkinType';
import '../styles/SkinProfileSetup.css';

const SkinProfileSetupPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ skinType: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSkinTypeSelect = (skinType) => {
    setProfile({ skinType });
  };

  const handleSave = async () => {
    if (!profile.skinType) {
      setError('피부 타입을 선택해주세요');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 변경: access_token → token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await axios.post(
        'http://localhost:8080/api/user/skin-profile',
        { skinType: profile.skinType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.resultCode === 200) {
        // localStorage의 user 객체 업데이트
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            user.userSkin = profile.skinType;
            localStorage.setItem('user', JSON.stringify(user));
          } catch (e) {
            console.error('user 업데이트 실패:', e);
          }
        }
        
        alert('피부 타입이 저장되었습니다!');
        navigate('/');
      } else {
        setError(response.data.resultMsg || '저장 실패');
      }
    } catch (err) {
      setError(err.message || '오류가 발생했습니다');
      console.error('피부 타입 저장 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="skin-profile-container">
      <div className="skin-profile-wrapper">
        <Step1SkinType selectedValue={profile.skinType} onSelect={handleSkinTypeSelect} />

        {error && <div className="error-message">{error}</div>}

        <div className="button-group">
          <button
            className="btn-skip"
            onClick={handleSkip}
            disabled={loading}
          >
            나중에
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={loading || !profile.skinType}
          >
            {loading ? '저장 중...' : '저장하고 계속'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinProfileSetupPage;