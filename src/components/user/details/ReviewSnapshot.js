// src/components/user/layouts/details/ReviewSnapshot.js

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import './ReviewSnapshot.css';

const ReviewSnapshot = ({ reviewInfo }) => {

  const [bestReviews, setBestReviews] = useState(
    reviewInfo && reviewInfo.reviews ? reviewInfo.reviews.slice(0, 2) : [],
  );


  useEffect(() => {
    if (reviewInfo && reviewInfo.reviews) {
      setBestReviews(reviewInfo.reviews.slice(0, 2));
    }
  }, [reviewInfo]);

  if (!reviewInfo) return null;

  const { summary } = reviewInfo;

  // --- 좋아요 기능 로직 ---
  const toggleLike = revNo => {
    setBestReviews(prevReviews =>
      prevReviews.map(review => {
        if (review.revNo === revNo) {
          const newIsLiked = !review.isLiked;
          const newCount = newIsLiked ? review.likeCount + 1 : review.likeCount - 1;
          return { ...review, isLiked: newIsLiked, likeCount: newCount };
        }
        return review;
      }),
    );
  };

  // 별점 그리기 헬퍼
  const renderStars = rating => {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  // 랭크 배지 클래스
  const getRankBadgeClass = rank => {
    if (rank === 'DIAMOND' || rank === 'A') return 'rank-diamond';
    if (rank === 'PLATINUM' || rank === 'B') return 'rank-platinum';
    return 'rank-general';
  };

  return (
    <div className="snapshot-container my-5">
      <Row>
        {/* === 왼쪽: 별점 통계 === */}
        <Col md={4} className="rating-left-col">
          <div className="text-center mb-4">
            <div className="big-score">{summary.averageRating}</div>
            <div className="total-stars">{renderStars(summary.averageRating)}</div>
            <div className="total-count-text">{summary.totalCount}개 리뷰</div>
          </div>

          {/* 점수별 분포 그래프 */}
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map(score => {
              // summary.distribution이 없을 경우를 대비해 안전하게 처리
              const dist = summary.distribution || {};
              const count = dist[score] || 0;
              const percent = summary.totalCount > 0 ? (count / summary.totalCount) * 100 : 0;

              return (
                <div key={score} className="rating-bar-row">
                  <div className="rating-label">
                    <span className="text-warning">★</span> {score}
                  </div>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="rating-count-num">{count}</div>
                </div>
              );
            })}
          </div>
        </Col>

        {/* === 오른쪽: 베스트 리뷰 2개 === */}
        <Col md={8}>
          <div className="best-review-title">
            <span>베스트 리뷰</span>
            <span style={{ fontSize: '12px', color: '#999', fontWeight: 'normal' }}>* 전문가 선정</span>
          </div>

          <Row className="g-3">
            {bestReviews.map(review => (
              <Col md={6} key={review.revNo}>
                <div className="review-card-compact">
                  <div className="reviewer-info">
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ddd' }}></div>
                    <div>
                      <span className={`reviewer-rank ${getRankBadgeClass(review.revRank)}`}>{review.revRank}</span>
                      <span className="reviewer-name ms-2">{review.userName}</span>
                    </div>
                    <span className="review-date">{review.revDate}</span>
                  </div>

                  <div style={{ color: '#ffc107', fontSize: '14px' }}>
                    {'★'.repeat(review.revStar)}
                    {'☆'.repeat(5 - review.revStar)}
                  </div>

                  <div className="review-content-compact">{review.revGood || review.revContent}</div>

                  <div>
                    <div className="review-tags">
                      {review.feedback &&
                        review.feedback.map((tag, idx) => (
                          <span key={idx} className="review-tag">
                            #{tag}
                          </span>
                        ))}
                    </div>

                    <div className="like-btn-area">
                      <button
                        className={`like-toggle-btn ${review.isLiked ? 'liked' : ''}`}
                        onClick={() => toggleLike(review.revNo)}
                      >
                        <span>👍</span>
                        <span>{review.likeCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewSnapshot;
