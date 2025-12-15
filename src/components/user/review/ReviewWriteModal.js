import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FEEDBACK_OPTIONS } from '../../common/reviewUtils';
import api from 'lib/apiClient'; 

const ReviewWriteModal = ({ show, onHide, prdNo, odNo, userInfo, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]); // 선택된 코드들 [101, 501]

  // 이미지 관련
  const [previewImages, setPreviewImages] = useState([]); // 미리보기 URL
  const [uploadFiles, setUploadFiles] = useState([]); // 실제 보낼 File 객체

  // 모달 닫힐 때 초기화
  useEffect(() => {
    if (!show) {
      setRating(5);
      setContent('');
      setSelectedFeedbacks([]);
      setPreviewImages([]);
      setUploadFiles([]);
    }
  }, [show]);

  // 태그 선택 토글
  const toggleFeedback = code => {
    if (selectedFeedbacks.includes(code)) {
      setSelectedFeedbacks(selectedFeedbacks.filter(c => c !== code));
    } else {
      setSelectedFeedbacks([...selectedFeedbacks, code]);
    }
  };

  // 이미지 파일 선택 핸들러
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (files.length + uploadFiles.length > 5) {
      alert('이미지는 최대 5장까지 업로드 가능합니다.');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
    setUploadFiles([...uploadFiles, ...files]);
  };

  // 이미지 삭제 핸들러
  const removeImage = index => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    setUploadFiles(uploadFiles.filter((_, i) => i !== index));
  };

  // ★ 전송 로직 (Multipart/form-data)
  const handleSubmit = async () => {
    if (content.length < 10) {
      alert('리뷰 내용은 최소 10자 이상 작성해주세요.');
      return;
    }

    try {
      const formData = new FormData();

      // 1. JSON 데이터 생성
      const jsonData = {
        userNo: userInfo?.userNo || 0, // 로그인 정보에서 가져옴
        prdNo: prdNo,
        revStar: rating,
        content: content,
        odNo: odNo || 0, // 상품상세는 0, 마이페이지는 실제 주문번호
        userSkin: userInfo?.userSkin, // 유저 정보 넣어서 보냄
        userColor: userInfo?.userColor, // 유저 정보 넣어서 보냄
        feedback: selectedFeedbacks, // [101, 501] 코드 리스트
      };

      // 2. JSON을 Blob으로 변환해서 'data' 키에 추가 (Spring @RequestPart("data")와 매칭)
      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formData.append('data', jsonBlob);

      // 3. 파일들을 'files' 키에 추가 (Spring @RequestPart("files")와 매칭)
      uploadFiles.forEach(file => {
        formData.append('files', file);
      });

      // 4. API 전송
      await api.post(`/api/products/${prdNo}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('리뷰가 등록되었습니다!');
      onHide(); // 모달 닫기
      if (onReviewSubmitted) onReviewSubmitted(); // 부모에게 알림(리스트 갱신용)
    } catch (error) {
      console.error('리뷰 등록 실패', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>리뷰 작성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 별점 */}
        <div className="text-center mb-4">
          <div style={{ fontSize: '2rem', cursor: 'pointer', color: '#ffc107' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} onClick={() => setRating(star)}>
                {star <= rating ? '★' : '☆'}
              </span>
            ))}
          </div>
          <div className="fw-bold">{rating}점</div>
        </div>

        {/* 태그 선택 */}
        <div className="mb-3">
          <Form.Label className="fw-bold">어떤 점이 좋았나요?</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {FEEDBACK_OPTIONS.map(opt => (
              <Button
                key={opt.code}
                variant={
                  selectedFeedbacks.includes(opt.code)
                    ? opt.type === 'POSITIVE'
                      ? 'success'
                      : 'warning'
                    : 'outline-secondary'
                }
                size="sm"
                onClick={() => toggleFeedback(opt.code)}
                className="rounded-pill"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 내용 입력 */}
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="상품에 대한 솔직한 리뷰를 남겨주세요. (10자 이상)"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>

        {/* 사진 업로드 */}
        <Form.Group className="mb-3">
          <Form.Label>사진 첨부 ({uploadFiles.length}/5)</Form.Label>
          <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} />
          <div className="d-flex gap-2 mt-2 overflow-auto">
            {previewImages.map((src, idx) => (
              <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                <img
                  src={src}
                  alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                />
                <button
                  onClick={() => removeImage(idx)}
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'red',
                    color: 'white',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    lineHeight: '1',
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          등록하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewWriteModal;
