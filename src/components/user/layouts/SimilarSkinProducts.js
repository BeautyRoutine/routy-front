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
    const loadRecommend = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/products/list/skin_cate',
          {
            params: {
              limit: 4,        // 추천 4개 표시
              skin: userSkin,  // 로그인 유저 피부 타입
              sub_cate: ''     // 카테고리 없이 전체 인기 기준
            }
          }
        );

        const list = res.data.data || [];

        const converted = list.map((p, index) => ({
          id: p.prdNo,
          name: p.prdName,
          brand: p.prdCompany,
          rating: 4.7,             // 백엔드에 없으니 UI용 기본값
          tags: ['추천', '피부'],   // UI용
          discount: null,
          price: p.prdPrice,
          original: null,
          img: p.prdImg
            ? `/images/${p.prdImg}`
            : `/images/product${index + 1}.jpg`, // 기본 이미지 처리
        }));

        setProducts(converted);
      } catch (err) {
        console.error(err);
      }
    };

    loadRecommend();
  }, [userSkin]);

  const goDetail = prdNo => {
    navigate(`/products/${prdNo}`);
  };

  const handleMoreClick = () => {
    if (userSkin) {
      navigate(`/products?limit=20&skin=${userSkin}`);
    } else {
      navigate(`/products?limit=20`);
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="container my-5 text-center similar-skin-section">
      <h5 className="fw-bold text-primary mb-1">비슷한 피부 타입 사용자들은 이걸 많이 선택했어요!</h5>
      <p className="text-muted small mb-4">건성·민감성 피부 사용자들의 인기 상품</p>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map(p => (
          <div key={p.id} className="col">
            <div
              className="card h-100 border-0 shadow-sm product-card position-relative"
              style={{ cursor: 'pointer' }}
              onClick={() => goDetail(p.id)}
            >
              {p.discount && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                  {p.discount} OFF
                </span>
              )}

              <Heart size={20} className="position-absolute top-0 end-0 m-3 heart-icon" />

              <img
                src={p.img}
                className="card-img-top"
                alt={p.name}
                style={{ borderRadius: '10px' }}
              />

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

                <button
                  className="btn cart-btn w-100 mt-2"
                  onClick={e => {
                    e.stopPropagation();
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

      <div className="mt-4">
        <button
          className="btn btn-outline-primary rounded-pill px-4"
          onClick={handleMoreClick}
        >
          더 많은 추천 상품 보기
        </button>
      </div>
    </div>
  );
};

export default SimilarSkinProducts;

