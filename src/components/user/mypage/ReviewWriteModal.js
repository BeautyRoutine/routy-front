import React, { useState, useRef } from 'react';
import './ReviewWriteModal.css';

const ReviewWriteModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleStarClick = score => {
    setRating(score);
  };

  const handleContentChange = e => {
    const text = e.target.value;
    if (text.length <= 500) {
      setContent(text);
    }
  };

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - images.length;
    const newFiles = files.slice(0, remainingSlots);

    if (newFiles.length === 0) return;

    setImages(prev => [...prev, ...newFiles]);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Create new array excluding the removed index
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the URL of the removed image to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleSubmit = () => {
    // Validation if needed
    if (content.trim().length < 10) {
      alert('리뷰 내용은 최소 10자 이상 작성해주세요.');
      return;
    }

    const reviewData = {
      productNo: product.productNo, // Assuming product object has productNo
      rating,
      content,
      images,
    };
    onSubmit(reviewData);
    handleClose();
  };

  const handleClose = () => {
    // Reset state on close
    setRating(5);
    setContent('');
    setImages([]);
    setPreviewUrls([]);
    onClose();
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-container">
        <div className="review-modal-header">
          <h2>리뷰 작성</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <p className="review-subtitle">제품에 대한 솔직한 리뷰를 작성해주세요</p>

        <div className="product-info-box">
          <span className="product-label">상품명</span>
          <p className="product-name">{product?.productName || '상품명 없음'}</p>
        </div>

        <div className="review-section">
          <label className="section-label">별점</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(score => (
              <span
                key={score}
                className={`star ${score <= rating ? 'filled' : ''}`}
                onClick={() => handleStarClick(score)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="review-section">
          <label className="section-label">리뷰 입력 (500자)</label>
          <div className="textarea-wrapper">
            <textarea
              className="review-textarea"
              placeholder="제품을 사용하면서 느낀 솔직한 후기를 작성해주세요."
              value={content}
              onChange={handleContentChange}
            />
            <span className="char-count">{content.length}/500자</span>
          </div>
        </div>

        <div className="review-section">
          <div className="section-header-row">
            <label className="section-label">사진</label>
            <span className="photo-limit">최대 5장</span>
          </div>
          <div className="photo-upload-area">
            {images.length < 5 && (
              <div className="upload-box" onClick={() => fileInputRef.current.click()}>
                <span className="upload-icon">↑</span>
                <span className="upload-text">사진 추가</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
              </div>
            )}
            {previewUrls.map((url, idx) => (
              <div key={idx} className="preview-box">
                <img src={url} alt={`preview-${idx}`} className="preview-img" />
                <button className="remove-img-btn" onClick={() => handleRemoveImage(idx)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="review-guide-box">
          <h4>리뷰 작성 가이드</h4>
          <ul>
            <li>• 제품을 직접 사용한 경험을 바탕으로 작성해주세요</li>
            <li>• 광고, 욕설, 비방 등 부적절한 내용은 삭제될 수 있습니다</li>
            <li>• 사진이 포함된 리뷰는 추가 포인트가 지급됩니다</li>
          </ul>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleClose}>
            취소
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            리뷰 등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewWriteModal;
