import React, { useState, useEffect } from 'react';
import { X, Camera, Edit2, Check } from 'lucide-react';
import './ProfileEditModal.css';

const SOCIAL_PROVIDERS = [{ id: 'kakao', name: '카카오', icon: 'K', connected: true }];

const SKIN_TYPES = ['건성', '민감성', '지성', '복합성'];
const SKIN_CONCERNS = ['수분 부족', '모공 케어', '탄력 개선', '미백', '트러블', '주름'];

const ProfileEditModal = ({ isOpen, onClose, userProfile, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    phone: '010-1234-5678', // Dummy default
    address: '서울시 강남구 테헤란로 123', // Dummy default
    skinType: [],
    skinConcerns: [],
    serviceNotification: true,
    marketingConsent: false,
    routineNotification: true,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        nickname: userProfile.nickname || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '010-1234-5678',
        zipCode: userProfile.zipCode || '',
        address: userProfile.address || '',
        detailAddress: userProfile.detailAddress || '',
        extraAddress: userProfile.extraAddress || '',
        skinType: userProfile.tags ? userProfile.tags.filter(t => SKIN_TYPES.includes(t)) : [],
        skinConcerns: userProfile.skinConcerns || [],
        serviceNotification: userProfile.serviceNotification ?? true,
        marketingConsent: userProfile.marketingConsent ?? false,
        routineNotification: userProfile.routineNotification ?? true,
      });
    }
  }, [userProfile]);

  if (!isOpen) return null;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkinType = type => {
    setFormData(prev => {
      const current = prev.skinType;
      if (current.includes(type)) {
        return { ...prev, skinType: current.filter(t => t !== type) };
      } else {
        return { ...prev, skinType: [...current, type] };
      }
    });
  };

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

  const toggleNotification = key => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckNickname = () => {
    if (!formData.nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    // TODO: API call to check nickname availability
    alert('사용 가능한 닉네임입니다.');
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
            <label>피부 타입</label>
            <div className="chip-group">
              {SKIN_TYPES.map(type => (
                <button
                  key={type}
                  className={`chip-btn skin-type ${formData.skinType.includes(type) ? 'active' : ''}`}
                  onClick={() => toggleSkinType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Concerns */}
          <div className="form-group">
            <label>피부 고민</label>
            <div className="chip-group">
              {SKIN_CONCERNS.map(concern => (
                <button
                  key={concern}
                  className={`chip-btn skin-concern ${formData.skinConcerns.includes(concern) ? 'active' : ''}`}
                  onClick={() => toggleSkinConcern(concern)}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

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
