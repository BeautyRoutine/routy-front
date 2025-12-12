import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from 'lib/apiClient';
import { saveRecentProduct } from 'features/user/userSlice';
import ProductImageGallery from 'components/user/details/ProductImageGallery';
import ProductInfo from 'components/user/details/ProductInfo';
import ProductDetailTabs from 'components/user/details/ProductDetailTabs';
import ReviewSummary from 'components/user/details/ReviewSummary';
import ProductIngredientAnalysis from 'components/user/details/ProductIngredientAnalysis';

const ProductDetailPage = () => {
  const { prdNo } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 상품 좋아요 상태
  const [productLiked, setProductLiked] = useState(false);

  // 탭 이동용
  const [activeTab, setActiveTab] = useState('desc');
  const tabsRef = useRef(null);

  const handleMoveToReview = () => {
    setActiveTab('review');
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ======================
  // 리뷰 좋아요 (기존)
  // ======================
  const handleLikeToggle = async revNo => {
    if (!currentUser) return alert('로그인이 필요합니다.');
    try {
      await api.post(`/api/reviews/${revNo}/like`, null, {
        params: { userNo: currentUser?.userNo || 0 },
      });

      setProductData(prev => {
        if (!prev) return null;

        const updatedReviews = prev.reviewInfo.reviews.map(review => {
          if (review.revNo === revNo) {
            const currentStatus = review.liked || review.isLiked;
            const newStatus = !currentStatus;
            return {
              ...review,
              liked: newStatus,
              isLiked: newStatus,
              likeCount: newStatus ? review.likeCount + 1 : review.likeCount - 1,
            };
          }
          return review;
        });

        return {
          ...prev,
          reviewInfo: {
            ...prev.reviewInfo,
            reviews: updatedReviews,
          },
        };
      });
    } catch (error) {
      console.error('리뷰 좋아요 오류:', error);
      alert('처리에 실패했습니다.');
    }
  };

  // ======================
  // ✅ 상품 좋아요 초기값 조회
  // ======================
  useEffect(() => {
    if (!currentUser || !prdNo) return;

    const fetchLikeStatus = async () => {
      try {
        const res = await api.get(
          `/api/users/${currentUser.userId}/likes/${prdNo}/exists`,
          { params: { type: 'PRODUCT' } }
        );
        setProductLiked(res.data.data === true);
      } catch (e) {
        console.error('상품 좋아요 여부 조회 실패', e);
      }
    };

    fetchLikeStatus();
  }, [currentUser, prdNo]);

  // ======================
  // ✅ 상품 좋아요 토글 (백엔드 기준)
  // ======================
  const handleProductLikeToggle = async () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (productLiked) {
        // 좋아요 취소
        await api.delete(
          `/api/users/${currentUser.userId}/likes/${prdNo}`,
          { params: { type: 'PRODUCT' } }
        );
      } else {
        // 좋아요 추가
        await api.post(
          `/api/users/${currentUser.userId}/likes/${prdNo}`,
          null,
          { params: { type: 'PRODUCT' } }
        );
      }

      setProductLiked(prev => !prev);
    } catch (error) {
      console.error('상품 좋아요 처리 실패', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // ======================
  // 상품 상세 데이터 로딩
  // ======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const analysisParams = {
          userId: currentUser?.userId || null,
          userSkin: currentUser?.userSkin || null,
        };

        const productRes = await api.get(`/api/products/${prdNo}`);
        const reviewRes = await api.get(`/api/products/${prdNo}/reviews`, {
          params: { userNo: currentUser?.userNo || 0 },
        });
        const ingredientRes = await api.get(`/api/products/${prdNo}/analysis`, {
          params: analysisParams,
        });

        const productObj = productRes.data.data;

        if (currentUser?.userId && prdNo && productObj?.prdSubCate) {
          const productDetails = {
            id: productObj.prdNo,
            prdNo: productObj.prdNo,
            name: productObj.prdName,
            brand: productObj.prdCompany,
            price: productObj.prdPrice,
            salePrice: productObj.salePrice,
            discount: productObj.discountRate || productObj.discount,
            image: productObj.prdImg
              ? `${api.defaults.baseURL}/images/product/${productObj.prdImg}`
              : null,
            viewedDate: new Date().toISOString(),
          };

          dispatch(
            saveRecentProduct({
              userId: currentUser.userId,
              prdNo,
              prdSubCate: productObj.prdSubCate,
              productDetails,
            })
          );
        }

        setProductData({
          productInfo: productObj,
          reviewInfo:
            reviewRes.data.data || {
              summary: { totalCount: 0, averageRating: 0 },
              reviews: [],
            },
          ingredientInfo: ingredientRes.data.data,
          purchaseInfo: {},
        });
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        alert('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (prdNo) fetchData();
  }, [prdNo, currentUser, dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!productData) return <div className="text-center py-5">상품 정보를 찾을 수 없습니다.</div>;

  const { productInfo, reviewInfo, ingredientInfo, purchaseInfo } = productData;

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <ProductImageGallery images={productInfo.images || { gallery: [] }} />
        </Col>

        <Col md={6}>
          <ProductInfo
            product={productInfo}
            reviewSummary={reviewInfo.summary}
            onMoveToReview={handleMoveToReview}
            liked={productLiked}
            onLikeToggle={handleProductLikeToggle}
          />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <ReviewSummary reviewInfo={reviewInfo} onLikeToggle={handleLikeToggle} />
        </Col>
      </Row>

      <hr className="my-5" />

      <Row className="mt-5">
        <Col>
          <ProductIngredientAnalysis ingredientInfo={ingredientInfo} productInfo={productInfo} />
        </Col>
      </Row>

      <Row>
        <Col>
          <div ref={tabsRef} style={{ paddingTop: '20px' }}>
            <ProductDetailTabs
              activeTab={activeTab}
              onTabSelect={setActiveTab}
              productInfo={productInfo}
              purchaseInfo={purchaseInfo}
              reviewInfo={reviewInfo}
              ingredientInfo={ingredientInfo}
              onLikeToggle={handleLikeToggle}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
