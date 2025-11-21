import React, { useState } from 'react';
import { Pagination } from 'react-bootstrap'; // 부트스트랩 페이지네이션 사용
import './ReviewList.css';

const ReviewList = ({ reviewInfo }) => {
  // 정렬 상태 (latest: 최신순, rating: 평점순, like: 좋아요순)
  const [sortOption, setSortOption] = useState('latest');

  // 현재 페이지 번호 -작동 안됨 현재
  const [activePage, setActivePage] = useState(1);

  // 데이터가 없으면 아무것도 안 그림
  if (!reviewInfo || !reviewInfo.reviews) return null;

  //구조분해할당
  const { reviews, summary } = reviewInfo;

  // 별점 그리기 헬퍼
  const renderStars = rating => {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  // 좋아요 클릭 핸들러 (여기서는 UI만 변경하는 척)
  const handleLikeClick = revNo => {
    console.log(`리뷰 ${revNo}번 좋아요 클릭됨 (API 호출 필요)`);
    // 실제로는 여기서 API 호출 후 데이터를 다시 받아오거나 state를 업데이트해야 함
  };

  return (
    <div className="review-list-container">
      {/*  별점 요약 */}
      <div className="review-list-summary">
        {/* 별점 평균 */}
        <div className="summary-left">
          <div className="big-score-text">{summary.averageRating}</div>
          <div className="total-stars-text">{renderStars(summary.averageRating)}</div>
          <div className="total-count-label">{summary.totalCount}개 리뷰</div>
        </div>

        {/* 별점별 막대 그래프 */}
        <div className="summary-right">
          {[5, 4, 3, 2, 1].map(score => {
            const dist = summary.distribution || {};
            const count = dist[score] || 0;
            const percent = summary.totalCount > 0 ? (count / summary.totalCount) * 100 : 0;
            return (
              <div key={score} className="graph-row">
                <div className="graph-label">
                  <span style={{ color: '#ffc107' }}>★</span> {score}
                </div>
                <div className="graph-bar-bg">
                  <div className="graph-bar-fill" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="graph-count">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="sort-tab-area">
        <span className={`sort-btn ${sortOption === 'latest' ? 'active' : ''}`} onClick={() => setSortOption('latest')}>
          최신순
        </span>
        <span>|</span>
        <span className={`sort-btn ${sortOption === 'rating' ? 'active' : ''}`} onClick={() => setSortOption('rating')}>
          평점순
        </span>
        <span>|</span>
        <span className={`sort-btn ${sortOption === 'like' ? 'active' : ''}`} onClick={() => setSortOption('like')}>
          좋아요순
        </span>
      </div>

      {/*리뷰 리스트 */}
      <div className="review-items-wrapper">
        {reviews.map(review => (
          <div key={review.revNo} className="review-item">
            {/* 헤더: 유저 정보 & 신고 */}
            <div className="review-header">
              <div className="user-profile-area">
                {/* 프로필 이미지 */}
                {review.userImg ? (
                  <img src={review.userImg} alt="프로필" className="profile-circle" />
                ) : (
                  <div className="profile-circle"></div>
                )}
                {/*랭크랑 이름, 별점, 날짜 */}
                <div className="d-flex flex-column">
                  <div className="user-info-row">
                    <span className="user-rank-badge">{review.revRank || 'A등급'}</span>
                    <span className="user-name">{review.userName}</span>
                  </div>
                  <div className="user-info-row">
                    <span className="stars-small">{renderStars(review.revStar)}</span>
                    <span className="review-date-text">{review.revDate}</span>
                  </div>
                </div>
              </div>

              {/* 신고하기 버튼- 작동은 안함 */}
              <button className="report-btn">
                <span style={{ fontSize: '14px' }}>⚐</span> 신고하기
              </button>
            </div>

            {/* 본문: 사진 먼저 나오고 텍스트 */}
            <div className="review-body">
              {/* 사진이 있을 때만 표시 */}
              {review.revImg && <img src={review.revImg} alt="리뷰 사진" className="review-attached-img" />}

              <p className="review-text-content">{review.revContent || review.revGood}</p>
            </div>

            {/* 태그*/}
            <div className="review-footer">
              {/* 태그 리스트 */}
              {review.feedback && review.feedback.length > 0 && (
                <div className="tag-list">
                  {review.feedback.map((tag, idx) => (
                    <span key={idx} className="tag-badge">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 좋아요 */}
              <div className="like-button-area">
                <button
                  className={`like-btn-simple ${review.isLiked ? 'active' : ''}`}
                  onClick={() => handleLikeClick(review.revNo)}
                >
                  <span style={{ fontSize: '16px' }}>👍</span>
                  도움이 되었어요
                  <span style={{ fontWeight: 'bold', marginLeft: '2px' }}>{review.likeCount}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="d-flex justify-content-center mt-5">
        <Pagination>
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </div>
    </div>
  );
};

export default ReviewList;
