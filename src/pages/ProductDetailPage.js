import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import ProductImageGallery from 'components/user/details/ProductImageGallery';
import ProductInfo from 'components/user/details/ProductInfo';
import ProductDetailTabs from 'components/user/details/ProductDetailTabs';
import ReviewSummary from 'components/user/details/ReviewSummary';
import ProductIngredientAnalysis from 'components/user/details/ProductIngredientAnalysis';

const ProductDetailPage = () => {
  const { prdNo } = useParams(); // URL의 :prdNo 값을 가져옴 (예: 101)
  console.log('현재 URL 파라미터 값:', prdNo); // <--- 이거 확인해보세요. undefined 뜰 겁니다.
  // 1. 데이터를 담을 그릇 (처음엔 비어있음)
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 중인지 체크

  // 2. 화면 켜지자마자 서버에 데이터 요청 (진짜 연결!)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await axios.get(`/api/products/${prdNo}`);

        console.log('상품 데이터 도착:', productRes.data);
        // 백엔드 API 3개를 동시에 찌릅니다. (상품, 리뷰, 성분)
        // const [productRes, reviewRes, ingredientRes] = await Promise.all([
        //axios.get(`/api/products/${prdNo}`),
        //axios.get(`/api/products/${prdNo}/reviews`),
        //axios.get(`/api/products/${prdNo}/ingredients`),
        // ]);

        // 3. 받아온 데이터를 하나로 합침 (더미 데이터 구조랑 똑같이 만듦)
        const combinedData = {
          productInfo: productRes.data, // 백엔드 DTO가 여기 들어감
          // reviewInfo: reviewRes.data.data, // 리뷰 데이터
          // ingredientInfo: ingredientRes.data.data, // 성분 데이터
          reviewInfo: { summary: { totalCount: 0, averageRating: 0 }, reviews: [] }, // 임시 빈값
          ingredientInfo: { totalCount: 0, ingredients: [] }, // 임시 빈값
          purchaseInfo: {}, // 구매정보는 하드코딩이라 빈 객체
        };

        setProductData(combinedData); // state에 저장! -> 화면 갱신됨
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        alert('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 끝
      }
    };

    if (prdNo) {
      fetchData();
    }
  }, [prdNo]);

  // 로딩 중일 때 뺑글이 보여주기
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // 데이터가 없으면 에러 메시지
  if (!productData) return <div className="text-center py-5">상품 정보를 찾을 수 없습니다.</div>;

  // 4. 데이터 꺼내기 (여기서부터는 기존 코드랑 똑같음!)
  const { productInfo, reviewInfo, ingredientInfo, purchaseInfo } = productData;
  // // 더미데이터 받아오기
  // import { dummyProductData } from './demoProductData';

  // const ProductDetailPage = () => {
  //   // TODO: API 연동 시, useEffect와 useState를 사용해 이 데이터를 채웁니다.
  //   const productData = dummyProductData;

  //   //구조 분해 할당
  //   const { productInfo, reviewInfo, ingredientInfo, purchaseInfo } = productData;

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
