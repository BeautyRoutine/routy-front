import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyReviews, deleteReview } from '../../../features/user/userSlice';
import './OrderHistory.css'; // 스타일 재사용

const MyReviewList = () => {
  const dispatch = useDispatch();
  const { profile, myReviews, loading } = useSelector(state => state.user);
  const userNo = profile?.userNo;

  const [visibleReviews, setVisibleReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const ITEMS_PER_PAGE = 5;

  // 초기 데이터 로드
  useEffect(() => {
    if (userNo) {
      dispatch(fetchMyReviews(userNo));
    }
  }, [dispatch, userNo]);

  // 클라이언트 사이드 페이지네이션 처리
  useEffect(() => {
    if (!myReviews) return;

    const start = 0;
    const end = page * ITEMS_PER_PAGE;
    const sliced = myReviews.slice(start, end);

    setVisibleReviews(sliced);
    setHasMore(end < myReviews.length);
  }, [myReviews, page]);

  // IntersectionObserver 설정
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading]);

  const handleDelete = async reviewId => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      await dispatch(deleteReview({ userNo, reviewId }));
    }
  };

  return (
    <div className="order-history-container">
      <h2 className="page-title">나의 리뷰</h2>
      <div className="order-list">
        {visibleReviews.length === 0 && !loading ? (
          <div className="empty-list">
            <p>작성한 리뷰가 없습니다.</p>
          </div>
        ) : (
          visibleReviews.map((review, index) => (
            <div
              key={`${review.reviewId}-${index}`}
              className="order-table-row"
              style={{ display: 'flex', padding: '20px', alignItems: 'flex-start', position: 'relative' }}
            >
              <div style={{ width: '80px', marginRight: '20px', flexShrink: 0 }}>
                {/* API 응답에 이미지가 없으면 플레이스홀더 사용 */}
                <img
                  src={
                    review.revMainImg
                      ? `${process.env.PUBLIC_URL}${review.revMainImg}`
                      : `${process.env.PUBLIC_URL}/images/product/no-image.png`
                  }
                  alt={review.productName}
                  style={{ width: '100%', borderRadius: '4px', border: '1px solid #eee' }}
                  onError={e => (e.target.src = 'https://via.placeholder.com/80')}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>
                  {review.productName}
                </h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: '#ffc107', fontSize: '14px' }}>{'★'.repeat(review.rating)}</span>
                  <span style={{ fontSize: '12px', color: '#e0e0e0' }}>|</span>
                  <span style={{ fontSize: '13px', color: '#999' }}>{review.createdAt}</span>
                </div>
                <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', marginBottom: '0' }}>
                  {review.content}
                </p>
                {/* 리뷰 상세 이미지가 있다면 표시 (목록 API에는 없을 수 있음) */}
                {review.images && review.images.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    {review.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="review"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(review.reviewId)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#666',
                }}
              >
                삭제
              </button>
            </div>
          ))
        )}
        {hasMore && (
          <div ref={observerRef} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            {loading ? '불러오는 중...' : '더 보기'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewList;
