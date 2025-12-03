import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../lib/apiClient';
import './OrderHistory.css'; // 스타일 재사용

const MyReviewList = () => {
  const { profile } = useSelector(state => state.user);
  const userId = profile?.userId || 'me';

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const ITEMS_PER_PAGE = 5;

  // 데이터 로드 함수
  const loadReviews = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 실제 API 호출
      const response = await api.get(`/api/users/${userId}/reviews`, {
        params: {
          page: page - 1, // Spring Boot Pageable은 0-based index
          size: ITEMS_PER_PAGE,
        },
      });

      // 응답이 배열인 경우 처리 (API_SPECS 예시 기준)
      const newReviews = Array.isArray(response.data) ? response.data : response.data.content || [];

      if (newReviews.length === 0) {
        setHasMore(false);
      } else {
        // 중복 제거 (혹시 모를 key 중복 방지)
        setReviews(prev => {
          const existingIds = new Set(prev.map(r => r.reviewId));
          const uniqueNew = newReviews.filter(r => !existingIds.has(r.reviewId));
          return [...prev, ...uniqueNew];
        });

        if (newReviews.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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

  return (
    <div className="order-history-container">
      <h2 className="page-title">나의 리뷰</h2>
      <div className="order-list">
        {reviews.length === 0 && !loading ? (
          <div className="empty-list">
            <p>작성한 리뷰가 없습니다.</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div
              key={`${review.reviewId}-${index}`}
              className="order-table-row"
              style={{ display: 'flex', padding: '20px', alignItems: 'flex-start' }}
            >
              <div style={{ width: '80px', marginRight: '20px', flexShrink: 0 }}>
                {/* API 응답에 이미지가 없으면 플레이스홀더 사용 */}
                <img
                  src={review.imageUrl || 'https://via.placeholder.com/80'}
                  alt={review.productName}
                  style={{ width: '100%', borderRadius: '4px', border: '1px solid #eee' }}
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
