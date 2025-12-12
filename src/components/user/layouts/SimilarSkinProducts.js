import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SimilarSkinProducts.css';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from 'app/api';

const SimilarSkinProducts = ({ userSkin }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const { currentUser } = useSelector(state => state.user);
  const isLoggedIn = !!currentUser;
  const userId = currentUser?.userId;

  /* =========================
     API 응답 → 카드 데이터
  ========================= */
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
      liked: false,
    }));

  /* =========================
     좋아요 초기 상태 체크
  ========================= */
  const applyLikeStatus = useCallback(
    async (list) => {
      if (!isLoggedIn || !userId) {
        setProducts(list);
        return;
      }

      try {
        const updated = await Promise.all(
          list.map(async (p) => {
            const res = await api.get(
              `/api/users/${userId}/likes/${p.id}/exists`,
              { params: { type: 'PRODUCT' } }
            );
            return { ...p, liked: res.data.data === true };
          })
        );
        setProducts(updated);
      } catch (e) {
        console.error('좋아요 상태 조회 실패', e);
        setProducts(list);
      }
    },
    [isLoggedIn, userId]
  );

  /* =========================
     좋아요 토글
  ========================= */
  const handleToggleLike = async (productId, liked) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // UI 즉시 반영
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, liked: !liked } : p
      )
    );

    try {
      if (liked) {
        await api.delete(
          `/api/users/${currentUser.userId}/likes/${productId}`,
          { params: { type: 'PRODUCT' } }
        );
      } else {
        await api.post(
          `/api/users/${currentUser.userId}/likes/${productId}`,
          null,
          { params: { type: 'PRODUCT' } }
        );
      }
    } catch (e) {
      // 실패 시 롤백
      setProducts(prev =>
        prev.map(p =>
          p.id === productId ? { ...p, liked } : p
        )
      );
      console.error('좋아요 처리 실패', e);
    }
  };

  /* =========================
     추천 상품 로딩
  ========================= */
  useEffect(() => {
    const loadFallback = async () => {
      const res = await axios.get(
        'http://localhost:8080/api/products/list/fallback',
        { params: { limit: 4 } }
      );
      const cards = convertToCard(res.data.data || []);
      applyLikeStatus(cards);
    };

    const loadSkinRecommend = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/products/list/skin_type',
          { params: { limit: 4, skin: Number(userSkin) } }
        );
        const cards = convertToCard(res.data.data || []);
        applyLikeStatus(cards);
      } catch {
        loadFallback();
      }
    };

    if (!userSkin) {
      loadFallback();
      return;
    }

    loadSkinRecommend();
  }, [userSkin, applyLikeStatus]);

  /* =========================
     렌더링
  ========================= */
  return (
    <div className="container my-5 text-center similar-skin-section">
      <h5 className="fw-bold text-primary mb-2">
        내 피부 타입 맞춤 추천
      </h5>

      <div className="row row-cols-1 row-cols-md-4 g-4 mb-4">
        {products.map((p) => (
          <div key={p.id} className="col">
            <div className="card h-100 border-0 shadow-sm position-relative">
              <Heart
                size={22}
                className="position-absolute top-0 end-0 m-3"
                style={{ cursor: 'pointer' }}
                fill={p.liked ? 'red' : 'none'}
                color={p.liked ? 'red' : '#999'}
                onClick={() => handleToggleLike(p.id, p.liked)}
              />

              <img
                src={p.img}
                className="card-img-top"
                alt={p.name}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/products/${p.id}`)}
              />

              <div className="card-body text-start">
                <h6 className="fw-bold">{p.name}</h6>
                <p className="text-muted small">{p.brand}</p>
                <p className="small">⭐ {p.rating.toFixed(1)}</p>
                <h6 className="fw-bold">
                  {p.price.toLocaleString()}원
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarSkinProducts;

