import React from 'react';
import { Modal } from 'react-bootstrap';
import './ReviewDetailModal.css';

//show, onHide, review  onlike 받아오기
const ReviewDetailModal = ({ show, onHide, review, onLikeToggle }) => {
  if (!review) return null;

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="review-dialog">
      <Modal.Body className="p-0">
        <div className="modal-content-wrapper">
          {/* 왼쪽 이미지*/}
          <div className="modal-image-section">
            {review.revImg ? (
              <img src={review.revImg} alt="리뷰 상세" className="modal-img-full" />
            ) : (
              <div className="no-image-placeholder">이미지가 없는 리뷰입니다.</div>
            )}
          </div>

          {/* 오른쪽 리뷰 내용 */}
          <div className="modal-text-section">
            {/* 헤더 (닫기)*/}
            <div className="modal-text-header">
              <div className="user-info">
                <span className="user-name">{review.userName}</span>
                <span className="text-muted ms-2" style={{ fontSize: '12px' }}>
                  {review.revDate}
                </span>
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

              {/* 태그 */}
              <div className="review-tags mt-3">
                {review.feedback &&
                  review.feedback.map((tag, idx) => (
                    <span key={idx} className="review-tag">
                      #{tag}
                    </span>
                  ))}
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
