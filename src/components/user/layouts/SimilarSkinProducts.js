import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SimilarSkinProducts.css';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SimilarSkinProducts = ({ userSkin }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('accessToken');

  const convertToCard = (list) =>
    list.map((p, index) => ({
      id: p.prdNo,
      name: p.prdName,
      brand: p.prdCompany,

      // ★ avgRating이 null / undefined 이면 4.0으로 강제, 숫자 변환
      rating: Number(p.avgRating ?? 4.0),

      price: p.prdPrice,
      img: p.prdImg
        ? `/images/${p.prdImg}`
        : `/images/product${index + 1}.jpg`,
    }));

  useEffect(() => {
    const loadFallback = async () => {
      const res = await axios.get(
        'http://localhost:8080/api/products/list/fallback',
        { params: { limit: 4 } }
      );
      setProducts(convertToCard(res.data.data || []));
    };

    const loadSkinRecommend = async () => {
      const res = await axios.get(
        'http://localhost:8080/api/products/list/skin_type',
        { params: { limit: 4, skin: Number(userSkin) } }
      );
      setProducts(convertToCard(res.data.data || []));
    };

    if (!isLoggedIn || !userSkin) {
      loadFallback();
    } else {
      loadSkinRecommend();
    }
  }, [isLoggedIn, userSkin]);

  return (
    <div className="container my-5 text-center similar-skin-section">
      <h5 className="fw-bold text-primary mb-2">내 피부 타입 맞춤 추천</h5>

      <p className="text-muted small mb-4">
        로그인하면 당신의 피부 타입에 맞는 맞춤형 추천을 받을 수 있어요!
      </p>

      <div className="row row-cols-1 row-cols-md-4 g-4 mb-4">
        {products.map((p) => (
          <div key={p.id} className="col">
            <div
              className="card h-100 border-0 shadow-sm product-card position-relative"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <Heart
                size={20}
                className="position-absolute top-0 end-0 m-3 heart-icon"
              />

              <img
                src={p.img}
                className="card-img-top"
                alt={p.name}
                style={{ borderRadius: '10px' }}
              />

              <div className="card-body text-start">
                <h6 className="fw-bold mb-1">{p.name}</h6>
                <p className="text-muted small mb-1">{p.brand}</p>

                {/* ★ safe toFixed */}
                <p className="small mb-2">⭐ {p.rating.toFixed(1)}</p>

                <h6 className="fw-bold text-dark">
                  {p.price.toLocaleString()}원
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isLoggedIn && (
        <div className="mb-2">
          <button
            className="btn btn-primary rounded-pill px-4 me-2"
            onClick={() => navigate('/login')}
          >
            로그인
          </button>
          <button
            className="btn btn-outline-primary rounded-pill px-4"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </button>
        </div>
      )}
    </div>
  );
};

export default SimilarSkinProducts;
