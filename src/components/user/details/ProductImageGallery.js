import React, { useState } from 'react';
import './ProductImageGallery.css';

//images props 받기
function ProductImageGallery({ images }) {
  //현재 이미지 순서 기억용 상태, 0번째 이미지부터 시작
  const [selectedIndex, setSelectedIndex] = useState(0);

  //이미지 클릭시 호출될 함수, 썸네일 순서가 index
  const handleThumbnailClick = index => {
    // state 값 index로 변경, 화면 새로고침
    setSelectedIndex(index);
  };

  // 이미지 없으면(undefined) !로 true로 변환, 이미지는 있는데 갤러리가 없으면 똑같이, 갤러리는 있는데 비어있으면(0이면)
  if (!images || !images.gallery || images.gallery.length === 0) {
    return <div>이미지가 없습니다.</div>;
  }

  return (
    <div className="gallery-container">
      {/*메인 이미지, 기본값은 0, selectedIndex에 따라 바뀜 */}
      <img
        src={`${process.env.PUBLIC_URL}/images/product/${images.gallery[selectedIndex]}`}
        alt="상품 메인 이미지"
        className="main-image"
      />

      {/* 썸네일 목록 */}
      <div className="thumbnail-list">
        {/* images.gallery 배열을 .map()으로 순회, imageSrc(이미지 주소),index(번호) */}
        {images.gallery.map((imageSrc, index) => (
          <div
            // 항목 구별용 key
            key={index}
            // 현재 선택된 썸네일이 맞으면 active 클래스 추가(css에서 강조표시)
            className={`thumbnail ${selectedIndex === index ? 'active' : ''}`}
            // 클릭하면 handleThumbnailClick 호출
            onClick={() => handleThumbnailClick(index)}
          >
            {/*실제 사진 출력 코드, 대체 텍스트도. */}
            <img src={`/images/product/${imageSrc}`} alt={`상품 썸네일 ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductImageGallery;
