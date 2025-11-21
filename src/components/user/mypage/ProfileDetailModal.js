import React from 'react';
import { X, BarChart2, ChevronRight } from 'lucide-react';
import './ProfileDetailModal.css';

const ProfileDetailModal = ({ isOpen, onClose, userProfile, onEditProfile }) => {
  if (!isOpen) return null;

  return (
    <div className="profile-detail-overlay" onClick={onClose}>
      <div className="profile-detail-container" onClick={e => e.stopPropagation()}>
        <button className="detail-close-btn" onClick={onClose}>
          <X size={24} color="#666" />
        </button>

        <div className="profile-detail-content">
          {/* Left Column: Profile Card */}
          <div className="profile-card-section">
            <div className="profile-card">
              <div className="profile-avatar-large" />

              <div className="profile-identity">
                <div className="profile-nickname-row">
                  <span className="nickname">{userProfile?.name ? userProfile.name : '닉네임을 설정해주세요'}</span>
                  <span className="badge-p">P</span>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>

                <div className="profile-skintype-row">
                  <span className="skintype-text">
                    {userProfile?.tags && userProfile.tags.length > 0
                      ? userProfile.tags.join(', ')
                      : '피부타입을 설정해주세요'}
                  </span>
                  <ChevronRight size={14} color="#94a3b8" />
                </div>
              </div>

              <div className="profile-stats-row">
                <div className="stat-box">
                  <strong className="stat-num">0</strong>
                  <span className="stat-label">도움</span>
                </div>
                <div className="stat-box">
                  <strong className="stat-num">0</strong>
                  <span className="stat-label">팔로워</span>
                </div>
                <div className="stat-box">
                  <strong className="stat-num">0</strong>
                  <span className="stat-label">팔로잉</span>
                </div>
              </div>
            </div>

            <div className="profile-actions-row">
              <button className="action-btn edit-profile-btn" onClick={onEditProfile}>
                프로필 수정
              </button>
              <button className="action-btn chart-btn">
                <BarChart2 size={20} />
              </button>
            </div>
          </div>

          {/* Right Column: Reviews */}
          <div className="profile-reviews-section">
            <div className="reviews-header">
              <h2>누적 리뷰 -</h2>
              <div className="sort-dropdown">
                <span>최근작성순</span>
                <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
            <div className="reviews-body">{/* Empty state or list would go here */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailModal;
