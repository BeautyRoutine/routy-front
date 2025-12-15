import React from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import './ReviewDetailModal.css';
import { formatUserInfo, classifyFeedback } from '../../common/reviewUtils';

//show, onHide, review  onlike 받아오기
const ReviewDetailModal = ({ show, onHide, review, onLikeToggle }) => {
  if (!review) return null;

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="review-dialog">
      <Modal.Body className="p-0">
        <div className="modal-content-wrapper">
          {/* 왼쪽 이미지*/}
          <div className="modal-image-section">
            {review.images && review.images.length > 0 ? (
              <Carousel interval={null} indicators={review.images.length > 1}>
                {review.images.map((imgUrl, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      src={`${process.env.PUBLIC_URL}/${imgUrl}`}
                      alt={`리뷰 ${idx}`}
                      className="d-block w-100 modal-img-full"
                      style={{ objectFit: 'contain', height: '100%' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className="no-image-placeholder">이미지 없음</div>
            )}
          </div>

          {/* 오른쪽 리뷰 내용 */}
          <div className="modal-text-section">
            {/* 헤더 (닫기)*/}
            <div className="modal-text-header">
              <div className="user-info d-flex align-items-center">
                {/*프로필 이미지 */}
                <div className="me-2 flex-shrink-0">
                  {/* flex-shrink-0: 이미지 찌그러짐 방지 */}
                  {review.userImg ? (
                    <img
                      src={review.userImg}
                      alt="프로필"
                      className="profile-circle"
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="profile-circle"
                      style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ddd' }}
                    ></div>
                  )}
                </div>
                <div className="d-flex flex-column">
                  <span className="user-name">{review.userName}</span>
                  <span className="text-muted" style={{ fontSize: '12px', marginTop: '2px', display: 'block' }}>
                    {formatUserInfo(review.userSkin, review.userColor)}
                  </span>
                  <span className="text-muted ms-2" style={{ fontSize: '12px' }}>
                    {review.revDate}
                  </span>
                </div>
              </div>
              <button className="btn-close" onClick={onHide}></button>
            </div>

            {/* 별점 */}
            <div className="modal-stars mb-3">
              <span style={{ color: '#ffc107', fontSize: '18px' }}>
                {'★'.repeat(Math.round(review.revStar))}
                {'☆'.repeat(5 - Math.round(review.revStar))}
              </span>
              <span className="ms-2 fw-bold">{review.revStar}</span>
            </div>

            {/* 옵션 정보 */}
            <p className="text-muted small mb-4">옵션: 더미데이터입니다. 이게 문제인지 테스트중입니다.</p>

            {/* 스크롤 가능한 본문 내용 */}
            <div className="modal-scroll-content">
              <p className="review-text-full">{review.content}</p>

              {/*반응*/}
              <div className="modal-scroll-content">
                <p className="review-text-full">{review.content}</p>

                {/* 태그 영역 */}
                <div className="review-tags mt-3">
                  {review.feedback &&
                    (() => {
                      const { positive, negative } = classifyFeedback(review.feedback);
                      return (
                        <div className="d-flex flex-column gap-2">
                          {/* 긍정 */}
                          {positive.length > 0 && (
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <strong style={{ fontSize: '13px', minWidth: '40px' }}>장점</strong>
                              {positive.map((t, i) => (
                                <span key={i} className="review-tag" style={{ background: '#e3f2fd' }}>
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* 부정 */}
                          {negative.length > 0 && (
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <strong style={{ fontSize: '13px', minWidth: '40px' }}>단점</strong>
                              {negative.map((t, i) => (
                                <span key={i} className="review-tag" style={{ background: '#ffebee' }}>
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                </div>
              </div>
            </div>

            {/* 좋아요 버튼 */}
            <div className="modal-text-footer mt-3">
              <p className="text-muted small mb-2">리뷰가 도움이 되었나요?</p>
              <button
                className={`like-toggle-btn ${review.liked || review.isLiked ? 'liked' : ''}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={e => {
                  e.stopPropagation();
                  if (onLikeToggle) {
                    onLikeToggle(review.revNo);
                  }
                }}
              >
                <span>👍</span>
                <span>{review.likeCount}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewDetailModal;
