import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import './ReviewSnapshot.css';

const ReviewSnapshot = ({ reviewInfo }) => {
  //리뷰는 1,2번만, 좋아요 작동시키려고 state 사용.
  const [bestReviews, setBestReviews] = useState(
    //리뷰인포도 리뷰 목록도 있으면 초기값 2개, 없으면 []
    reviewInfo && reviewInfo.reviews ? reviewInfo.reviews.slice(0, 2) : [],
  );

  //초기값때 못받아오는 경우 여기서 리뷰 2개 받아옴
  useEffect(() => {
    if (reviewInfo && reviewInfo.reviews) {
      setBestReviews(reviewInfo.reviews.slice(0, 2));
    }
  }, [reviewInfo]);
  //만약 reviewinfo가 없으면 null 반환
  if (!reviewInfo) return null;

  const { summary } = reviewInfo;

  // --- 좋아요 기능---
  const toggleLike = revNo => {
    //리뷰 번호받아서
    setBestReviews(
      (
        prevReviews, //현재값(prevReviews)
      ) =>
        prevReviews.map(review => {
          //map으로 순회해서 클릭한것만 수정
          if (review.revNo === revNo) {
            ///map으로 체크한 리뷰가 버튼 누른 번호랑 같으면
            const newIsLiked = !review.isLiked; //반전
            const newCount = newIsLiked ? review.likeCount + 1 : review.likeCount - 1; //숫자 업데이트, 좋아요 누르면 +1, 싫어요는 -1
            return { ...review, isLiked: newIsLiked, likeCount: newCount }; //리뷰는 그대로, 좋아요랑 좋아요 수는 수정한 값으로.
          }
          return review;
        }),
    );
  };

  // 별점, 평균낼때도 사용
  const renderStars = rating => {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  return (
    <div className="snapshot-container my-5">
      <Row>
        {/* 별점 통계 왼쪽*/}
        <Col md={4} className="rating-left-col">
          <div className="text-center mb-4">
            <div className="big-score">{summary.averageRating}</div>
            <div className="total-stars">{renderStars(summary.averageRating)}</div>
            <div className="total-count-text">{summary.totalCount}개 리뷰</div>
          </div>

          {/* 점수별 그래프 */}
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map(score => {
              // 만약 없으면 {} 가져오기
              const dist = summary.distribution || {};
              //특정 점수 데이터가 없으면 0이라고 치기
              const count = dist[score] || 0;
              const percent = summary.totalCount > 0 ? (count / summary.totalCount) * 100 : 0;

              return (
                <div key={score} className="rating-bar-row">
                  <div className="rating-label">
                    <span className="text-warning">★</span> {score}
                  </div>
                  <div className="bar-bg">
                    {/*퍼센트만큼 길이를 줌 */}
                    <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="rating-count-num">{count}</div>
                </div>
              );
            })}
          </div>
        </Col>

        {/* 베스트 리뷰 */}
        <Col md={8}>
          <div className="best-review-title">
            <span>베스트 리뷰</span>
          </div>

          <Row className="g-3">
            {bestReviews.map(review => (
              <Col md={6} key={review.revNo}>
                <div className="review-card-compact">
                  <div className="reviewer-info">
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ddd' }}></div>
                    <div>
                      <span className="reviewer-name ms-2">{review.userName}</span>
                    </div>
                    <span className="review-date">{review.revDate}</span>
                  </div>
                  {/* 유저가 준 별점 */}
                  <div style={{ color: '#ffc107', fontSize: '14px' }}>
                    {'★'.repeat(review.revStar)}
                    {'☆'.repeat(5 - review.revStar)}
                  </div>

                  <div className="review-content-compact">{review.revGood || review.revContent}</div>
                  {/* 태그, 아직 미정이라 임시로 채움 */}
                  <div>
                    <div className="review-tags">
                      {review.feedback &&
                        review.feedback.map((tag, idx) => (
                          <span key={idx} className="review-tag">
                            #{tag}
                          </span>
                        ))}
                    </div>
                    {/*좋아요 버튼*/}
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
