import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import './ProfileDetail.css';

const ProfileDetail = ({ userProfile, onEditProfile, onBack }) => {
  return (
    <div className="profile-detail-container-page">
      <button className="back-btn-page" onClick={onBack}>
        <ArrowLeft size={24} color="#333" />
      </button>
      <div className="profile-detail-content-page">
        {/* Left Column: Profile Card */}
        <div className="profile-card-section-page">
          <div className="profile-card-page">
            <div className="profile-avatar-large-page" />

            <div className="profile-identity-page">
              <div className="profile-nickname-row-page">
                <span className="nickname-page">{userProfile?.name ? userProfile.name : '닉네임을 설정해주세요'}</span>
              </div>

              <div className="profile-skintype-row-page">
                <span className="skintype-text-page">
                  {userProfile?.tags && userProfile.tags.length > 0
                    ? userProfile.tags.join(', ')
                    : '피부타입을 설정해주세요'}
                </span>
                {/* Removed ChevronRight as requested */}
              </div>
            </div>

            <div className="profile-stats-row-page">
              <div className="stat-box-page">
                <strong className="stat-num-page">0</strong>
                <span className="stat-label-page">도움</span>
              </div>
              <div className="stat-box-page">
                <strong className="stat-num-page">0</strong>
                <span className="stat-label-page">팔로워</span>
              </div>
              <div className="stat-box-page">
                <strong className="stat-num-page">0</strong>
                <span className="stat-label-page">팔로잉</span>
              </div>
            </div>
          </div>

          <div className="profile-actions-row-page">
            <button className="action-btn-page edit-profile-btn-page" onClick={onEditProfile}>
              프로필 수정
            </button>
            {/* Removed chart-btn as requested */}
          </div>
        </div>

        {/* Right Column: Reviews */}
        <div className="profile-reviews-section-page">
          <div className="reviews-header-page">
            <h2>누적 리뷰 -</h2>
            <div className="sort-dropdown-page">
              <span>최근작성순</span>
              <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />
            </div>
          </div>
          <div className="reviews-body-page">{/* Empty state or list would go here */}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
