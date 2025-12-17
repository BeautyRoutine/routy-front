  import React from 'react';
  import { Heart, Star } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { addLike, removeLike } from 'features/user/userSlice';
  import './ProductGrid.css';

  const ProductGrid = ({ products, isLoggedIn }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { likes } = useSelector(state => state.user);

    const handleCardClick = prdNo => {
      navigate(`/products/${prdNo}`);
    };

    const handleLikeClick = async (e, productId) => {
      e.stopPropagation(); // 카드 클릭 이벤트 막기

      const isLiked = likes.products?.some(item => item.productId === productId);

      try {
        if (isLiked) {
          await dispatch(removeLike({ productId, type: 'PRODUCT' })).unwrap();
        } else {
          await dispatch(addLike({ productId, type: 'PRODUCT' })).unwrap();
        }
      } catch (error) {
        console.error('좋아요 처리 실패:', error);
      }
    };

    return (
      <div className="product-grid container my-4">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {products.map(p => {
            const isLiked = likes.products?.some(item => item.productId === p.prdNo);
            return (
              <div key={p.prdNo} className="col">
                <div
                  className="card h-100 border-0 shadow-sm product-card position-relative"
                  onClick={() => handleCardClick(p.prdNo)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* 하트 버튼 */}
                  <Heart
                    size={20}
                    className="position-absolute top-0 end-0 m-3 heart-icon"
                    onClick={e => handleLikeClick(e, p.prdNo)}
                    fill={isLiked ? '#ff4757' : 'none'}
                    color={isLiked ? '#ff4757' : 'currentColor'}
                    style={{ cursor: 'pointer' }}
                  />

                  {/* 상품 이미지 */}
                  <img
                    src={p.prdImg ? `${process.env.PUBLIC_URL}/images/product/${p.prdImg}` : '/images/no-img.png'}
                    alt={p.prdName}
                    className="card-img-top product-img"
                  />

                  <div className="card-body text-start">
                    {/* 브랜드 */}
                    <p className="text-muted small mb-1">{p.prdCompany}</p>
                    {/* 상품명 */}
                    <h6 className="fw-bold mb-2">{p.prdName}</h6>
                    {/* ★ 평점 + 리뷰수 */}
                    <div className="d-flex align-items-center mb-2">
                      <Star size={16} color="#f4c150" fill="#f4c150" className="me-1" />
                      <span className="fw-semibold">{p.avgRating?.toFixed(1)}</span>
                      <span className="text-muted small ms-1">({p.reviewCount})</span>
                    </div>
                    {/* 가격 */}
                    <h6 className="fw-bold text-dark">{p.prdPrice.toLocaleString()}원</h6>
                    {/* 장바구니 버튼
                  <button
                    className="btn cart-btn w-100 mt-2"
                    onClick={e => {
                      e.stopPropagation();
                      alert('장바구니 기능은 나중에 연결될 예정입니다.');
                    }}
                  >
                    장바구니
                  </button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  export default ProductGrid;
