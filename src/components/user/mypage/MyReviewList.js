import React, { useState, useEffect, useRef } from 'react';
import api from '../../../lib/apiClient';
import { DEMO_MY_REVIEWS } from '../data/mypageMocks';
import './OrderHistory.css'; // 스타일 재사용

const MyReviewList = () => {
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
      // Spring Boot Pageable 대응: ?page=0 (0부터 시작) 또는 1부터 시작. 보통 0.
      // 여기서는 프론트 page가 1부터 시작하므로 -1 처리하거나 백엔드에 맞춤.
      // API_SPECS.md에는 쿼리 파라미터 명세가 없지만 통상적으로 page, size 사용
      const response = await api.get('/api/users/me/reviews', {
        params: {
          page: page, // 1-based index로 가정하거나 0-based라면 page - 1
          size: ITEMS_PER_PAGE,
        },
      });

      // 응답이 배열인 경우 처리 (API_SPECS 예시 기준)
      // 만약 Page 객체({ content: [], ... })라면 response.data.content로 접근
      const newReviews = Array.isArray(response.data) ? response.data : response.data.content || [];

      if (newReviews.length === 0) {
        setHasMore(false);
      } else {
        // 중복 제거 (혹시 모를 key 중복 방지)
        setReviews(prev => {
          const existingIds = new Set(prev.map(r => r.id || r.reviewId));
          const uniqueNew = newReviews.filter(r => !existingIds.has(r.id || r.reviewId));
          return [...prev, ...uniqueNew];
        });

        if (newReviews.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
      // 폴백: 첫 페이지 로드 실패 시에만 데모 데이터 표시 (개발 편의)
      if (page === 1) {
        const demoSlice = DEMO_MY_REVIEWS.slice(0, ITEMS_PER_PAGE);
        setReviews(demoSlice);
        // 데모 데이터도 더 있는지 체크
        if (DEMO_MY_REVIEWS.length <= ITEMS_PER_PAGE) setHasMore(false);
      } else {
        setHasMore(false);
      }
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
              key={`${review.id || review.reviewId}-${index}`}
              className="order-table-row"
              style={{ display: 'flex', padding: '20px', alignItems: 'flex-start' }}
            >
              <div style={{ width: '80px', marginRight: '20px', flexShrink: 0 }}>
                {/* API 응답 필드명에 따라 productImage 혹은 imageUrl 사용 */}
                <img
                  src={review.productImage || review.imageUrl || 'https://via.placeholder.com/80'}
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
                  <span style={{ fontSize: '13px', color: '#999' }}>{review.date || review.createdAt}</span>
                </div>
                <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', marginBottom: '0' }}>
                  {review.content}
                </p>
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
