import React from 'react';
import { Carousel } from 'react-bootstrap';
function BannerCarousel() {
  return (
    <div className="container mt-4">
      <Carousel interval={2500} controls indicators>
        <Carousel.Item>
          <div
            className="d-flex justify-content-between align-items-center p-4 rounded-4 text-white"
            style={{ backgroundColor: "#F97316" }}
          >
            <div>
              <h3>세럼 특가</h3>
              <p>고농축 영양 세럼</p>
              <small>피부 속부터 탄탄하게</small>
            </div>
            <img
              src="/images/serum.jpg"
              alt="세럼"
              className="rounded-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div
            className="d-flex justify-content-between align-items-center p-4 rounded-4 text-white"
            style={{ backgroundColor: "#10B981" }}
          >
            <div>
              <h3>올인원 코스메틱</h3>
              <p>한 번에 끝나는 뷰티</p>
              <small>시간 절약 솔루션</small>
            </div>
            <img
              src="/images/allinone.jpg"
              alt="올인원"
              className="rounded-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div
            className="d-flex justify-content-between align-items-center p-4 rounded-4 text-white"
            style={{ backgroundColor: "#8B5CF6" }}
          >
            <div>
              <h3>향수 컬렉션</h3>
              <p>당신만의 시그니처</p>
              <small>프리미엄 향 100종</small>
            </div>
            <img
              src="/images/perfume.jpg"
              alt="향수"
              className="rounded-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default BannerCarousel;
