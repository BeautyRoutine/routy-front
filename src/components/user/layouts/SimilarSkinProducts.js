import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SimilarSkinProducts.css';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from 'app/api';

const SimilarSkinProducts = ({ userSkin }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');

  // API 응답 → 카드용 데이터 변환
  const convertToCard = (list) =>
    list.map((p, index) => ({
      id: p.prdNo,
      name: p.prdName,
      brand: p.prdCompany,
      rating: p.avgRating ? Number(p.avgRating) : 4.0,
      price: p.prdPrice,
      img: p.prdImg
        ? `/images/${p.prdImg}`
        : `/images/product${index + 1}.jpg`,
    }));

  // 장바구니 추가
  const handleAddToCart = async (prdNo) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await api.post('/api/cart/items', {
        productId: prdNo,
        quantity: 1,
      });
      alert('장바구니에 추가되었습니다.');
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  useEffect(() => {
    const loadFallback = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/products/list/fallback',
          { params: { limit: 4 } }
        );
        setProducts(convertToCard(res.data.data || []));
      } catch (err) {
        console.error('Fallback error:', err);
      }
    };

    const loadSkinRecommend = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/products/list/skin_type',
          { params: { limit: 4, skin: Number(userSkin) } }
        );
        setProducts(convertToCard(res.data.data || []));
      } catch (err) {
        console.error('Skin recommend error:', err);
        loadFallback();
      }
    };

    if (!isLoggedIn || !userSkin) {
      loadFallback();
      return;
    }

    loadSkinRecommend();
  }, [isLoggedIn, userSkin]);

  return (
    <div className="container my-5 text-center similar-skin-section">
      <h5 className="fw-bold text-primary mb-2">내 피부 타입 맞춤 추천</h5>

      <p className="text-muted small mb-4">
        로그인하면 당신의 피부 타입에 맞는 맞춤형 추천을 받을 수 있어요!
      </p>

      {/* 카드 목록 */}
      <div className="row row-cols-1 row-cols-md-4 g-4 mb-4">
        {products.map((p) => (
          <div key={p.id} className="col">
            <div className="card h-100 border-0 shadow-sm product-card position-relative">
              <div className="position-relative">
                <Heart
                  size={22}
                  className="position-absolute top-0 end-0 m-3 heart-icon"
                />
                <img
                  src={p.img}
                  className="card-img-top product-img"
                  alt={p.name}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${p.id}`)}
                />
              </div>

              <div className="card-body text-start pb-0">
                <h6 className="fw-bold mb-1">{p.name}</h6>
                <p className="text-muted small mb-1">{p.brand}</p>
                <p className="small mb-2">⭐ {p.rating.toFixed(1)}</p>
                <h6 className="fw-bold text-dark mb-3">
                  {p.price.toLocaleString()}원
                </h6>
              </div>

              {/* 장바구니 버튼 */}
              <div className="p-3">
                <button
                  className="btn cart-btn w-100"
                  onClick={() => handleAddToCart(p.id)}
                >
                  장바구니
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더 많은 추천 보기 */}
      <div className="mt-3">
        <button
          className="btn btn-outline-primary rounded-pill px-4 more-btn"
          onClick={() => navigate('/recommend/more')}
        >
          더 많은 추천 상품 보기
        </button>
      </div>

      {/* 로그인 유도 */}
      {!isLoggedIn && (
        <div className="mt-3">
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
