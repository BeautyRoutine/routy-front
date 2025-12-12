import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'app/api';
import './ProductInfo.css';

// product, reviewSummary props로 받기
function ProductInfo({
  product,
  reviewSummary,
  onMoveToReview,
  onLikeToggle = () => {}, // 방어 코드
  liked = false, // 방어 코드
}) {
  const navigate = useNavigate();

  // 제품 구매 수량
  const [quantity, setQuantity] = useState(1);

  // 수량 변경
  const handleQuantityChange = amount => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // 장바구니 추가
  const handleAddtoCart = async () => {
    try {
      await api.post('/api/cart/items', {
        productId: product.prdNo,
        quantity,
      });
      alert('장바구니에 추가되었습니다.');
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다.');
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
              quantity,
              imageUrl: product.prdImg,
            },
          ],
          summary: {
            totalAmount,
            deliveryFee,
            finalPaymentAmount: totalAmount + deliveryFee,
          },
        },
      });
    } catch (error) {
      console.error('바로 구매 실패:', error);
      alert('바로 구매에 실패했습니다.');
    }
  };

  // 별점 표시
  const renderStars = rating => {
    const fullStars = Math.round(rating || 0);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  const totalPrice = product.prdPrice * quantity;

  return (
    <div className="product-info-container">
      <p className="product-company">{product.prdCompany}</p>
      <h1 className="product-name">{product.prdName}</h1>

      <p className="text-muted" style={{ fontSize: '14px', margin: '4px 0 8px 0' }}>
        {product.prdDesc || '상품 설명 참조'}
      </p>

      <div className="product-price">
        {product.prdPrice.toLocaleString()}
        <span className="won">원</span>
      </div>

      <div className="review-summary" onClick={onMoveToReview} style={{ cursor: 'pointer' }} title="리뷰 보러가기">
        <span className="stars">{renderStars(reviewSummary?.averageRating)}</span>
        <span className="rating-number">{reviewSummary?.averageRating || 0}</span>
        <span className="review-count">{reviewSummary?.totalCount || 0}개 리뷰</span>
      </div>

      <hr />

      <div className="quantity-selector">
        <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}>
          -
        </button>
        <input className="quantity-input" type="text" value={quantity} readOnly />
        <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>
          +
        </button>
      </div>

      <div className="shipping-info">
        <div className="shipping-row">🚚 배송비: 3,000원 (30,000원 이상 무료)</div>
        <div className="shipping-row">📦 평균 배송일: 2-3일</div>
      </div>

      <div className="total-price-section">
        <span className="total-price-label">총 상품금액</span>
        <span className="total-price-amount">{totalPrice.toLocaleString()}원</span>
      </div>

      <div className="action-buttons-group">
        <button className="wishlist-btn" onClick={onLikeToggle}>
          {liked ? '❤️ 좋아요' : '♡ 좋아요'}
        </button>

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
