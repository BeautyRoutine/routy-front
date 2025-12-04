import React, { useState, useEffect } from 'react';
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
  const { prdNo } = useParams(); // URL의 :prdNo 값을 가져옴 (예: 101)
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  const [productData, setProductData] = useState(null); //  데이터를 담을 state
  const [loading, setLoading] = useState(true); // 로딩 중인지 체크

  // 연결작업
  useEffect(() => {
    const fetchData = async () => {
      //비동기
      try {
        setLoading(true); //로딩 시작
        //get 요청 주소 : /api/products/101
        const productRes = await api.get(`/api/products/${prdNo}`);
        const reviewRes = await api.get(`/api/products/${prdNo}/reviews`);

        const productObj = productRes.data.data;

        // 최근 본 상품 저장 로직 추가
        if (currentUser?.userId && prdNo && productObj?.prdSubCate) {
          // UI 즉시 업데이트를 위한 상세 정보 구성
          const productDetails = {
            id: productObj.prdNo,
            prdNo: productObj.prdNo,
            name: productObj.prdName,
            brand: productObj.prdCompany,
            price: productObj.prdPrice,
            salePrice: productObj.salePrice,
            discount: productObj.discountRate || productObj.discount,
            image: productObj.prdImg ? `${api.defaults.baseURL}/images/product/${productObj.prdImg}` : null,
            viewedDate: new Date().toISOString(),
          };

          dispatch(
            saveRecentProduct({
              userId: currentUser.userId,
              prdNo,
              prdSubCate: productObj.prdSubCate,
              productDetails, // 추가된 파라미터
            }),
          );
        }

        // 데이터 구조 만들기
        const combinedData = {
          productInfo: productObj, // 백엔드 DTO가 여기, apiResponse로 포장했으니  data.data
          reviewInfo: reviewRes.data.data || { summary: { totalCount: 0, averageRating: 0 }, reviews: [] }, // 리뷰 데이터
          ingredientInfo: { totalCount: 0, ingredients: [] }, // 일단 더미
          purchaseInfo: {}, // 하드코딩인거도 수정해야하는데
        };

        setProductData(combinedData); // state에 저장, 화면 갱신
      } catch (error) {
        //에러나면
        console.error('데이터 로딩 실패:', error);
        alert('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 끝 (돌아가는거 멈춤)
      }
    };

    if (prdNo) {
      //상품번호가 있을때만 서버요청
      fetchData();
    }
  }, [prdNo, currentUser, dispatch]);

  // 로딩 중일 때 화면 돌아가기
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" /> {/*돌아가는 애니메이션 */}
      </div>
    );
  }

  // 데이터가 없으면 에러
  if (!productData) return <div className="text-center py-5">상품 정보를 찾을 수 없습니다.</div>;

  // 데이터 꺼내기
  const { productInfo, reviewInfo, ingredientInfo, purchaseInfo } = productData;

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          {/* 좌측 6칸 차지, productInfo 안에 이미지 */}
          <ProductImageGallery images={productInfo.images ? productInfo.images : { gallery: [] }} />
        </Col>

        <Col md={6}>
          {/*우측 6칸 차지,  상품 정보 리뷰, 버튼 등 전달 */}
          <ProductInfo product={productInfo} reviewSummary={reviewInfo.summary} />
        </Col>
      </Row>

      {/*별점, 우수리뷰 */}
      <Row className="mt-5">
        <Col>
          <ReviewSummary reviewInfo={reviewInfo} />
        </Col>
      </Row>
      <hr className="my-5" />

      {/*성분 분석 */}
      <Row className="mt-5">
        <Col>
          <ProductIngredientAnalysis ingredientInfo={ingredientInfo} />
        </Col>
      </Row>

      <Row>
        <Col>
          {/* 분해한 데이터 전달 */}
          <ProductDetailTabs
            productInfo={productInfo}
            purchaseInfo={purchaseInfo}
            reviewInfo={reviewInfo}
            ingredientInfo={ingredientInfo}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
