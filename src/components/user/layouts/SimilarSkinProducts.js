import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SimilarSkinProducts.css';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addLike, removeLike } from 'features/user/userSlice';

const SimilarSkinProducts = ({ userSkin }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { likes } = useSelector(state => state.user);

  const isLoggedIn = !!localStorage.getItem('token');

  const convertToCard = list =>
    list.map((p, index) => ({
      id: p.prdNo,
      name: p.prdName,
      brand: p.prdCompany,
      rating: p.avgRating ? Number(p.avgRating) : 0,
      price: p.prdPrice,
      img: p.prdImg
        ? `${process.env.PUBLIC_URL}/images/product/${p.prdImg}`
        : `${process.env.PUBLIC_URL}/images/product/product${index + 1}.jpg`,
    }));

  const handleLikeClick = async (e, productId) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const isLiked = likes.products?.some(item => item.productId === productId);

    try {
      if (isLiked) {
        await dispatch(removeLike({ productId, type: 'PRODUCT' })).unwrap();
      } else {
        await dispatch(addLike({ productId, type: 'PRODUCT' })).unwrap();
      }
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
    }
  };

  useEffect(() => {
    const loadFallback = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products/list/fallback`,
        { params: { limit: 4 } }
      );
      setProducts(convertToCard(res.data.data || []));
    };

    const loadSkinRecommend = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/list/skin_type`,
          { params: { limit: 4, skin: Number(userSkin) } }
        );
        setProducts(convertToCard(res.data.data || []));
      } catch {
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

      <div className="row row-cols-1 row-cols-md-4 g-4 mb-4">
        {products.map(p => {
          const isLiked = likes.products?.some(item => item.productId === p.id);

          return (
            <div key={p.id} className="col">
              <div className="card h-100 border-0 shadow-sm product-card position-relative">
                <Heart
                  size={22}
                  className="position-absolute top-0 end-0 m-3 heart-icon"
                  onClick={e => handleLikeClick(e, p.id)}
                  fill={isLiked ? '#ff4757' : 'none'}
                  color={isLiked ? '#ff4757' : 'currentColor'}
                />

                <img
                  src={p.img}
                  className="card-img-top product-img"
                  alt={p.name}
                  onClick={() => navigate(`/products/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                />

                <div className="card-body text-start pb-0">
                  <h6 className="fw-bold mb-1">{p.name}</h6>
                  <p className="text-muted small mb-1">{p.brand}</p>
                  <p className="small mb-2">⭐ {p.rating.toFixed(1)}</p>
                  <h6 className="fw-bold text-dark mb-3">
                    {p.price.toLocaleString()}원
                  </h6>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarSkinProducts;

