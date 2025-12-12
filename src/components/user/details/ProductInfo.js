import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addLike, removeLike } from 'features/user/userSlice';
import api from 'app/api';
import './ProductInfo.css';

// product, reviewSummary props로 받기
function ProductInfo({ product, reviewSummary, onMoveToReview }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { likes } = useSelector(state => state.user);

  //제품 구매 수량 기억용 state, 기본값1
  const [quantity, setQuantity] = useState(1);

  //수량 변경용 함수
  const handleQuantityChange = amount => {
    // 현재 값에 들어온 (+1,-1) 더해서 최신값 계산
    const newQuantity = quantity + amount;

    // 새 수량이 1일때만 업데이트, 0이나 음수 방지
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Redux에서 좋아요 상태 확인
  const isLiked = likes.products?.some(item => item.productId === product.prdNo);
  // 장바구니 추가
  const handleAddtoCart = async () => {
    try {
      await api.post('/api/cart/items', {
        productId: product.prdNo,
        quantity: quantity,
      });
      alert('장바구니에 추가되었습니다.');
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 좋아요 추가
  const handleAddLike = async () => {
    try {
      if (isLiked) {
        await dispatch(
          removeLike({
            productId: product.prdNo,
            type: 'PRODUCT',
          }),
        ).unwrap();
      } else {
        await dispatch(
          addLike({
            productId: product.prdNo,
            type: 'PRODUCT',
          }),
        ).unwrap();
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // 바로 구매
  const handleBuyNow = () => {
    try {
      const itemPrice = product.salePrice || product.prdPrice;
      const totalAmount = itemPrice * quantity;
      const deliveryFee = totalAmount >= 30000 ? 0 : 3000;

      navigate('/checkout', {
        state: {
          selectedItems: [
            {
              productId: product.prdNo,
              prdNo: product.prdNo,
              name: product.prdName,
              brand: product.prdCompany,
              price: itemPrice,
              quantity: quantity,
              imageUrl: product.prdImg,
            },
          ],
          summary: {
            totalAmount: totalAmount,
            deliveryFee: deliveryFee,
            finalPaymentAmount: totalAmount + deliveryFee,
          },
        },
      });
    } catch (error) {
      console.error('바로 구매 실패:', error);
      alert('바로 구매에 실패했습니다. 다시 시도해주세요.');
    }
  };

  //별점 함수
  const renderStars = rating => {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  //총 상품금액 계산, quantity 바뀔때마다 계산
  const totalPrice = product.prdPrice * quantity;

  return (
    <div className="product-info-container">
      {/* 제조사, 상품명 */}
      <p className="product-company">{product.prdCompany}</p>
      <h1 className="product-name">{product.prdName}</h1>
      <p className="text-muted" style={{ fontSize: '14px', margin: '4px 0 8px 0' }}>
        {product.prdDesc || '상품 설명 참조'}
      </p>

      {/* 가격 */}
      <div className="product-price">
        {/* toLocaleString() 사용해서 3자리마다 , 넣기*/}
        {product.prdPrice.toLocaleString()}
        <span className="won">원</span>
      </div>

      {/* 별점, 리뷰 */}
      <div
        className="review-summary"
        onClick={() => {
          onMoveToReview();
        }}
        style={{ cursor: 'pointer' }}
        title="리뷰 보러가기"
      >
        <span className="stars">{renderStars(reviewSummary.averageRating)}</span>
        <span className="rating-number">{reviewSummary.averageRating}</span>
        <span className="review-count">{reviewSummary.totalCount}개 리뷰</span>
      </div>
      <hr />

      {/*수량 선택 */}
      <div className="quantity-selector">
        <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}>
          -
        </button>
        <input className="quantity-input" type="text" value={quantity} readOnly />
        <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>
          +
        </button>
      </div>

      {/* 배송 정보*/}
      <div className="shipping-info">
        <div className="shipping-row">
          <span>🚚</span>
          <span>배송비: 3,000원 (30,000원 이상 무료)</span>
        </div>
        <div className="shipping-row">
          <span>📦</span>
          <span>평균 배송일: 2-3일</span>
        </div>
      </div>

      {/* 총 상품 금액 */}
      <div className="total-price-section">
        <span className="total-price-label">총 상품금액</span>
        <span className="total-price-amount">{totalPrice.toLocaleString()}원</span>
      </div>

      {/* 버튼들*/}
      <div className="action-buttons-group">
        {/* 좋아요 버튼 */}
        <button className="wishlist-btn" onClick={handleAddLike} style={{ color: isLiked ? '#ff4757' : 'inherit' }}>
          {isLiked ? '♥' : '♡'} 좋아요
        </button>
        {/* 장바구니, 바로구매 버튼 */}
        <div className="buy-buttons">
          <button className="btn-custom btn-cart" onClick={handleAddtoCart}>
            장바구니
          </button>
          <button className="btn-custom btn-buy" onClick={handleBuyNow}>
            바로구매
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
