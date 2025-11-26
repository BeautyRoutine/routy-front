import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SimilarSkinProducts.css';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SimilarSkinProducts = ({ userSkin }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 임시 더미 상품 → 필요하면 API로 변경 가능
    const prdNos = [101, 102, 103, 104];

    Promise.all(prdNos.map(no => axios.get(`http://localhost:8080/api/products/${no}`)))
      .then(responses => {
        const converted = responses.map((res, index) => {
          const p = res.data;

          return {
            id: p.prdNo,
            name: p.prdName,
            brand: p.prdCompany,
            rating: 4.7,
            tags: ['추천', '피부'],
            discount: null,
            price: p.prdPrice,
            original: null,
            img: `/images/product${index + 1}.jpg`,
          };
        });

        setProducts(converted);
      })
      .catch(err => console.error(err));
  }, []);

  // 상품 상세로 이동
  const goDetail = prdNo => {
    navigate(`/products/${prdNo}`);
  };

  // 버튼 클릭 시 이동
  const handleMoreClick = () => {
    if (userSkin) {
      navigate(`/products?limit=20&skin=${userSkin}`);
    } else {
      navigate(`/products?limit=20`);
    }
  };

  return (
    <div className="container my-5 text-center similar-skin-section">
      <h5 className="fw-bold text-primary mb-1">비슷한 피부 타입 사용자들은 이걸 많이 선택했어요!</h5>
      <p className="text-muted small mb-4">건성·민감성 피부 사용자 12,440명이 선택</p>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map(p => (
          <div key={p.id} className="col">
            <div
              className="card h-100 border-0 shadow-sm product-card position-relative"
              style={{ cursor: 'pointer' }}
              onClick={() => goDetail(p.id)} // 카드 클릭 → 상세 페이지 이동
            >
              {p.discount && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">{p.discount} OFF</span>
              )}

              <Heart size={20} className="position-absolute top-0 end-0 m-3 heart-icon" />

              <img src={p.img} className="card-img-top" alt={p.name} style={{ borderRadius: '10px' }} />

              <div className="card-body text-start">
                <h6 className="fw-bold mb-1">{p.name}</h6>
                <p className="text-muted small mb-1">{p.brand}</p>

                <div className="mb-2">
                  {p.tags.map((tag, i) => (
                    <span key={i} className="badge bg-light text-primary me-1">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="small mb-2">⭐ {p.rating}</p>

                <h6 className="fw-bold text-dark">{p.price.toLocaleString()}원</h6>

                {/* 장바구니 버튼: 카드 클릭 이벤트 막기 */}
                <button
                  className="btn cart-btn w-100 mt-2"
                  onClick={e => {
                    e.stopPropagation(); // 카드 클릭과 분리
                    alert('장바구니에 추가되었습니다.');
                  }}
                >
                  장바구니
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 추천 상품 더보기 버튼 */}
      <div className="mt-4">
        <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleMoreClick}>
          더 많은 추천 상품 보기
        </button>
      </div>
    </div>
  );
};

export default SimilarSkinProducts;
