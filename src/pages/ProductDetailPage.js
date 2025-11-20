import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import ProductImageGallery from '../layouts/details/ProductImageGallery';
import ProductInfo from '../layouts/details/ProductInfo';
import ProductDetailTabs from '../layouts/details/ProductDetailTabs';
import ReviewSnapshot from '../layouts/details/ReviewSnapshot';

// 더미데이터 받아오기
import { dummyProductData } from './demoProductData';

const ProductDetailPage = () => {
  // TODO: API 연동 시, useEffect와 useState를 사용해 이 데이터를 채웁니다.
  const productData = dummyProductData;

  //구조 분해 할당
  const { productInfo, reviewInfo, ingredientInfo, purchaseInfo } = productData;

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          {/* 좌측 6칸 차지, productInfo 안에 이미지 */}
          <ProductImageGallery images={productInfo.images} />
        </Col>

        <Col md={6}>
          {/*우측 6칸 차지,  상품 정보 리뷰, 버튼 등 전달 */}
          <ProductInfo product={productInfo} reviewSummary={reviewInfo.summary} />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <ReviewSnapshot reviewInfo={reviewInfo} />
        </Col>
      </Row>

      <hr className="my-5" />

      <Row>
        <Col>
          {/* 탭 컴포넌트에는 필요한 모든 데이터를 각각 명시적으로 전달합니다. */}
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
