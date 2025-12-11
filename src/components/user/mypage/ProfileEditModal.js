import React, { useState, useEffect } from 'react'; // React hooks 복구
import { useDispatch } from 'react-redux';
import { checkNickname } from '../../../features/user/userSlice';
import { X, Camera, Edit2, Check } from 'lucide-react';
import './ProfileEditModal.css';

const SOCIAL_PROVIDERS = [{ id: 'kakao', name: '카카오', icon: 'K', connected: true }];

const SKIN_TYPES = ['건성', '지성', '민감성', '선택안함'];
// const SKIN_CONCERNS = ['수분 부족', '모공 케어', '탄력 개선', '미백', '트러블', '주름']; // 삭제

const ProfileEditModal = ({ isOpen, onClose, userProfile, onSave }) => {
  const dispatch = useDispatch(); // dispatch 훅 사용
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    phone: '010-1234-5678', // Dummy default
    address: '서울시 강남구 테헤란로 123', // Dummy default
    skinType: '', // 단일 문자열로 변경
    // skinConcerns: [], // 삭제
    serviceNotification: true,
    marketingConsent: false,
    routineNotification: true,
  });

  useEffect(() => {
    if (isOpen && userProfile) {
      // [DEBUG] 모달이 열릴 때 전달받은 프로필 데이터 확인
      console.log('ProfileEditModal received:', userProfile);

      setFormData({
        name: userProfile.name || '',
        nickname: userProfile.nickname || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '010-1234-5678',
        zipCode: userProfile.zipCode || '',
        address: userProfile.address || '',
        detailAddress: userProfile.detailAddress || '',
        extraAddress: userProfile.extraAddress || '',
        skinType: userProfile.tags ? userProfile.tags.find(t => SKIN_TYPES.includes(t)) || '' : '', // 첫 번째 매칭되는 값만 사용
        // skinConcerns: userProfile.skinConcerns || [], // 삭제
        serviceNotification: userProfile.serviceNotification ?? true,
        marketingConsent: userProfile.marketingConsent ?? false,
        routineNotification: userProfile.routineNotification ?? true,
      });
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkinTypeChange = type => {
    setFormData(prev => ({ ...prev, skinType: type }));
  };

  /*
  const toggleSkinConcern = concern => {
    setFormData(prev => {
      const current = prev.skinConcerns;
      if (current.includes(concern)) {
        return { ...prev, skinConcerns: current.filter(c => c !== concern) };
      } else {
        return { ...prev, skinConcerns: [...current, concern] };
      }
    });
  };
  */

  const toggleNotification = key => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckNickname = async () => {
    if (!formData.nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      const resultAction = await dispatch(checkNickname(formData.nickname));
      if (checkNickname.fulfilled.match(resultAction)) {
        const isAvailable = resultAction.payload; // true or false
        if (isAvailable) {
          alert('사용 가능한 닉네임입니다.');
        } else {
          alert('이미 사용 중인 닉네임입니다.');
        }
      } else {
        // 에러 발생 시
        alert(resultAction.payload || '닉네임 확인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Nickname check failed:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-container">
        <div className="modal-header">
          <div className="header-left">
            <div className="header-title-row">
              <Edit2 size={24} className="header-icon" />
              <h2>프로필 수정</h2>
            </div>
            <span className="header-desc">회원님의 프로필 정보를 수정할 수 있습니다.</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} color="#666" />
          </button>
        </div>

        <div className="modal-body">
          {/* Profile Image */}
          <div className="profile-image-section">
            <div className="profile-image-wrapper">
              <div className="profile-image-placeholder" />
            </div>
            <button className="photo-change-btn">
              <Camera size={16} /> 사진 변경
            </button>
          </div>

          {/* Basic Info */}
          <div className="form-group">
            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="modal-input" />
          </div>

          <div className="form-group">
            <label>닉네임</label>
            <div className="input-with-button">
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="닉네임을 입력해주세요"
              />
              <button type="button" className="check-btn" onClick={handleCheckNickname}>
                중복확인
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="modal-input"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>전화번호</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="modal-input"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>기본주소</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="input-with-button">
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="우편번호"
                />
                <button type="button" className="check-btn">
                  우편번호 찾기
                </button>
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="주소"
              />
              <div className="input-with-button">
                <input
                  type="text"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="상세주소"
                />
                <input
                  type="text"
                  name="extraAddress"
                  value={formData.extraAddress}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="참고항목"
                />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Skin Type */}
          <div className="form-group">
            <label>
              피부 타입 <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal' }}>(1개 선택)</span>
            </label>
            <div className="chip-group">
              {SKIN_TYPES.map(type => (
                <button
                  key={type}
                  className={`chip-btn skin-type ${formData.skinType === type ? 'active' : ''}`}
                  onClick={() => handleSkinTypeChange(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Concerns Removed */}

          <div className="divider" />

          {/* Social Accounts */}
          <div className="form-group">
            <h3 className="section-title">소셜 계정 연결</h3>
            <p className="helper-text">여러 소셜 계정을 연결하여 다양한 방법으로 로그인할 수 있습니다.</p>

            <div className="social-list">
              {SOCIAL_PROVIDERS.map(provider => (
                <div key={provider.id} className="social-item">
                  <div className="social-info">
                    <div className={`social-icon ${provider.id}`}>
                      {/* Simple text icon for now, can be replaced with SVGs */}
                      {provider.icon}
                    </div>
                    <div className="social-text">
                      <span className="social-name">{provider.name}</span>
                      <span className="social-status">{provider.connected ? '연결됨' : '연결되지 않음'}</span>
                    </div>
                  </div>
                  <button className={`social-action-btn ${provider.connected ? 'disconnect' : 'connect'}`}>
                    {provider.connected ? (
                      <>
                        <X size={14} /> 연결 해제
                      </>
                    ) : (
                      <>
                        <Check size={14} /> 연결하기
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Notification Settings */}
          <div className="form-group">
            <h3 className="section-title">알림 설정</h3>
            <div className="notification-list">
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-name">서비스 이용 알림</span>
                  <span className="notification-desc">주문 및 배송 진행 상황, 1:1 문의 답변 등 필수 알림</span>
                </div>
                <button
                  type="button"
                  className={`toggle-switch ${formData.serviceNotification ? 'active' : ''}`}
                  onClick={() => toggleNotification('serviceNotification')}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-name">혜택 및 이벤트 알림</span>
                  <span className="notification-desc">다양한 할인 혜택과 이벤트 소식을 받아보세요.</span>
                </div>
                <button
                  type="button"
                  className={`toggle-switch ${formData.marketingConsent ? 'active' : ''}`}
                  onClick={() => toggleNotification('marketingConsent')}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-name">마이 루틴 알림</span>
                  <span className="notification-desc">설정한 루틴 시간에 맞춰 알림을 보내드립니다.</span>
                </div>
                <button
                  type="button"
                  className={`toggle-switch ${formData.routineNotification ? 'active' : ''}`}
                  onClick={() => toggleNotification('routineNotification')}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="save-btn" onClick={handleSubmit}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
