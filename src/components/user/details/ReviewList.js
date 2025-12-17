import React, { useState, useEffect } from 'react';
import { Pagination, Form } from 'react-bootstrap'; // 부트스트랩 페이지네이션 사용
import ReviewDetailModal from './ReviewDetailModal';
import './ReviewList.css';
import { formatUserInfo } from '../../common/reviewUtils';
import ReviewTagList from 'components/user/review/ReviewTagList';

const ReviewList = ({ reviewInfo, onLikeToggle, onFilterChange }) => {
  // 정렬 상태 (추천순, new: 최신순, rating: 평점순, like: 좋아요순)
  const [sortOption, setSortOption] = useState('recommended');
  //필터링기능
  const [skinFilter, setSkinFilter] = useState(''); // 빈값이면 전체
  const [colorFilter, setColorFilter] = useState('');

  //  모달 상태 on off, 모달 담을 state
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [activePage, setActivePage] = useState(1);

  //구조분해할당
  const { reviews, summary } = reviewInfo || {};

  useEffect(() => {
    // 모달이 열려있고(selectedReview), 목록 데이터(reviews)가 있을 때
    if (selectedReview && reviews) {
      // 리스트에서 현재 모달에 뜬 것과 똑같은 화면을 찾음
      const updatedReview = reviews.find(r => r.revNo === selectedReview.revNo);

      // 찾았으면 모달 데이터를 최신으로 교체
      if (updatedReview) {
        setSelectedReview(updatedReview);
      }
    }
  }, [reviewInfo, reviews, selectedReview]);

  // 데이터가 없으면 아무것도 안 그림
  if (!reviewInfo || !reviewInfo.reviews) return null;

  //필터 함수
  const applyFilters = (page, sort, skin, color) => {
    // 부모(ProductDetailTabs)에게 요청
    if (onFilterChange) {
      onFilterChange(page, sort, skin, color);
    }
  };

  //페이지 변경
  const handlePageChange = pageNumber => {
    setActivePage(pageNumber);
    if (onFilterChange) {
      onFilterChange(pageNumber, sortOption, skinFilter, colorFilter);
    }
  };

  //정렬 변경용 핸들러
  const handleSortClick = newSort => {
    setSortOption(newSort);
    setActivePage(1); // 정렬 바꾸면 1페이지로 초기화
    applyFilters(1, newSort, skinFilter, colorFilter);

    // 부모에게 데이터 다시 달라고 요청
    applyFilters(1, newSort, skinFilter, colorFilter);
  };

  //피부 컬러 타입 변경 핸들러
  const handleSkinChange = e => {
    const val = e.target.value;
    setSkinFilter(val);
    setActivePage(1); // 필터 바꾸면 1페이지로
    applyFilters(1, sortOption, val, colorFilter);
  };

  const handleColorChange = e => {
    const val = e.target.value;
    setColorFilter(val);
    setActivePage(1);
    applyFilters(1, sortOption, skinFilter, val);
  };

  //페이지수
  const totalPages = summary.totalCount ? Math.ceil(summary.totalCount / 10) : 0;

  // 별점 그리기 헬퍼
  const renderStars = rating => {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  // 좋아요 클릭 핸들러
  const handleLikeClick = (e, revNo) => {
    e.stopPropagation(); // 모달 방지
    if (onLikeToggle) {
      //함수 체크
      onLikeToggle(revNo);
    } else {
      console.error('onLikeToggle 함수가 전달되지 않았습니다!');
    }
  };

  // 리뷰 카드 클릭하면 실행되는 함수
  const handleReviewClick = review => {
    setSelectedReview(review); // 선택된 리뷰 저장
    setShowModal(true); // 모달 열기
  };

  //만약 리뷰가 0개면 보여줄 return
  if (summary.totalCount === 0) {
    return (
      <div className="text-center py-5" style={{ color: '#999' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
        <h4>아직 등록된 리뷰가 없습니다.</h4>
        <p>첫 번째 리뷰를 작성하고 포인트를 받아보세요!</p>
      </div>
    );
  }

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
      {/*필터링 기능 */}
      <div className="d-flex gap-2 mb-3 justify-content-end">
        <Form.Select size="sm" style={{ width: '120px' }} value={skinFilter} onChange={handleSkinChange}>
          <option value="">모든 피부</option>
          <option value="1">건성</option>
          <option value="2">중성</option>
          <option value="3">지성</option>
          <option value="4">복합성</option>
          <option value="5">수부지</option>
        </Form.Select>

        <Form.Select size="sm" style={{ width: '120px' }} value={colorFilter} onChange={handleColorChange}>
          <option value="">모든 톤</option>
          <option value="1">봄웜톤</option>
          <option value="2">여름쿨톤</option>
          <option value="3">가을웜톤</option>
          <option value="4">겨울쿨톤</option>
        </Form.Select>
      </div>
      {/* 정렬 옵션 */}
      <div className="sort-tab-area">
        <span
          className={`sort-btn ${sortOption === 'recommended' ? 'active' : ''}`}
          onClick={() => handleSortClick('recommended')}
        >
          추천순
        </span>
        <span>|</span>
        <span className={`sort-btn ${sortOption === 'new' ? 'active' : ''}`} onClick={() => handleSortClick('new')}>
          최신순
        </span>
        <span>|</span>
        <span
          className={`sort-btn ${sortOption === 'rating' ? 'active' : ''}`}
          onClick={() => handleSortClick('rating')}
        >
          평점순
        </span>
        <span>|</span>
        <span className={`sort-btn ${sortOption === 'like' ? 'active' : ''}`} onClick={() => handleSortClick('like')}>
          좋아요순
        </span>
      </div>

      {/*리뷰 리스트 */}
      <div className="review-items-wrapper">
        {reviews.map(review => (
          <div
            key={review.revNo}
            className="review-item"
            onClick={() => handleReviewClick(review)}
            style={{ cursor: 'pointer' }}
          >
            {/* 헤더: 유저 정보 & 신고 */}
            <div className="review-header">
              <div className="user-profile-area">
                {/* 프로필 이미지 */}
                {review.userImg ? (
                  <img src={review.userImg} alt="프로필" className="profile-circle" />
                ) : (
                  <div className="profile-circle"></div>
                )}
                {/*이름, 별점, 날짜 */}
                <div className="d-flex flex-column">
                  <div className="user-info-row">
                    <span className="user-name">{review.userName}</span>
                  </div>
                  {/*피부 타입, 피부톤 추가 */}
                  <span className="text-muted" style={{ fontSize: '12px', marginTop: '2px', display: 'block' }}>
                    {formatUserInfo(review.userSkin, review.userColor)}
                  </span>
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
            <div className="review-body d-flex justify-content-between" style={{ minHeight: '80px' }}>
              {/* 텍스트*/}
              <div className="review-text-wrapper" style={{ flex: 1, paddingRight: '15px' }}>
                <p className="review-text-content" style={{ margin: 0, wordBreak: 'break-all' }}>
                  {review.content}
                </p>
              </div>

              {/* 이미지 (오른쪽에 고정 크기로 배치) */}
              {(review.revImg || (review.images && review.images.length > 0)) && (
                <div className="review-image-wrapper" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                  <img
                    src={`${process.env.PUBLIC_URL}${review.revImg || review.images[0]}`}
                    alt="리뷰 썸네일"
                    className="review-attached-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #eee',
                    }}
                  />
                </div>
              )}
            </div>

            {/* 태그*/}
            <div className="review-footer">
              <ReviewTagList feedback={review.feedback} />

              {/* 좋아요 */}
              <div className="like-button-area">
                <button
                  className={`like-btn-simple ${review.liked || review.isLiked ? 'active' : ''}`}
                  onClick={e => handleLikeClick(e, review.revNo)}
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
        {totalPages > 0 && (
          <Pagination>
            {/* << 맨 처음으로 */}
            <Pagination.First onClick={() => handlePageChange(1)} disabled={activePage === 1} />
            {/* < 이전 */}
            <Pagination.Prev onClick={() => handlePageChange(activePage - 1)} disabled={activePage === 1} />

            {/* 숫자 버튼 자동 생성 */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === activePage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}

            {/* > 다음 */}
            <Pagination.Next onClick={() => handlePageChange(activePage + 1)} disabled={activePage === totalPages} />
            {/* >> 맨 끝으로 */}
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={activePage === totalPages} />
          </Pagination>
        )}
      </div>

      <ReviewDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        review={selectedReview}
        onLikeToggle={onLikeToggle}
      />
    </div>
  );
};

export default ReviewList;
