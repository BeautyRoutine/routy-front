import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RecommendedProducts.css";

const RecommendedProducts = () => {
  const categories = ["전체", "스킨", "로션", "에센스", "크림", "클렌징"];
  const products = [
    {
      id: 1,
      name: "수분 세럼",
      brand: "닥터지",
      rating: 4.8,
      review: "건조한 피부에 탁월한 흡수력",
      img: "/images/product-serum.jpg",
    },
    {
      id: 2,
      name: "비타민 C 크림",
      brand: "라로슈포제",
      rating: 4.6,
      review: "브라이트닝 효과, 탄력 개선 도움",
      img: "/images/product-cream.jpg",
    },
    {
      id: 3,
      name: "티트리 토너",
      brand: "바이오더마",
      rating: 4.7,
      review: "피지 조절, 모공 케어",
      img: "/images/product-toner.jpg",
    },
    {
      id: 4,
      name: "순한 클렌저",
      brand: "세타필",
      rating: 4.9,
      review: "민감성 피부 진정, 약산성",
      img: "/images/product-cleanser.jpg",
    },
  ];

  return (
    <div className="container my-5">
      {/* 제목 & 필터 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">당신을 위한 맞춤 추천</h4>
          <p className="text-muted small mb-0">당신의 피부 타입에 맞는 제품을 찾아보세요</p>
        </div>
        <a href="#" className="text-decoration-none small text-muted">
          전체보기 &gt;
        </a>
      </div>

      {/* 카테고리 버튼 */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`btn btn-sm ${
              i === 0 ? "btn-dark text-white" : "btn-outline-secondary"
            } rounded-pill px-3`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 제품 카드 */}
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map((p) => (
          <div key={p.id} className="col">
            <div className="card h-100 border-0 shadow-sm product-card">
              <img src={p.img} className="card-img-top" alt={p.name} />
              <div className="card-body">
                <h6 className="fw-semibold mb-1">{p.name}</h6>
                <p className="text-muted small mb-1">{p.brand}</p>
                <p className="text-warning small mb-0">
                  ★ {p.rating} <span className="text-muted"> | {p.review}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
