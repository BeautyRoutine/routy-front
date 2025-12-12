import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';

/**
 * @param {boolean} show 모달 표시 여부
 * @param {function} handleClose 모달 닫기 함수
 * @param {string} productName 상품명
 * @param {object} existingReview 수정 시 받아올 기존 리뷰 데이터 (없으면 null/undefined)
 */
const ReviewModal = ({ show, handleClose, productName, existingReview }) => {
  // 모드 확인 (데이터가 있으면 수정 모드)
  const isEditMode = !!existingReview;

  // 상태 관리
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState(''); //내용입력 저장칸
  const [option, setOption] = useState(''); // 선택지-아직 임시임
  const [images, setImages] = useState([]); // 이미지 파일 객체 배열
  const [previewUrls, setPreviewUrls] = useState([]); // 이미지 미리보기 URL

  // 초기화
  useEffect(() => {
    if (isEditMode && show) {
      // 수정 모드면 기존 데이터 채워넣기
      setRating(existingReview.rating);
      setContent(existingReview.content);
      setOption(existingReview.option || ''); //이미지 주소 있으면 띄워주고, 없으면 빈칸
      setPreviewUrls(existingReview.images || []);
    } else if (!show) {
      // 모달 닫히면 싹 비우기 (초기화)
      setRating(5);
      setContent('');
      setOption('');
      setImages([]);
      setPreviewUrls([]);
    }
  }, [show, isEditMode, existingReview]);

  // 이미지 파일 선택(3개까지)
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert('이미지는 최대 3장까지만 가능합니다.');
      return;
    }
    setImages(files);

    // 미리보기 URL 생성
    const urls = files.map(file => URL.createObjectURL(file)); //메모리 이미지 가져다가 미리보기
    setPreviewUrls(urls);
  };

  // 등록/수정 버튼 클릭
  const handleSubmit = () => {
    if (content.length < 10) {
      alert('최소 10자 이상 작성해주세요!');
      return;
    }
    if (option === '') {
      alert('선택지를 선택해주세요!');
      return;
    }

    const payload = {
      productName,
      rating,
      content,
      option,
      images,
    };

    if (isEditMode) {
      console.log('>> [수정 요청] 백엔드로 보낼 데이터:', payload);
      alert('리뷰가 수정되었습니다!');
    } else {
      console.log('>> [등록 요청] 백엔드로 보낼 데이터:', payload);
      alert('리뷰가 등록되었습니다!');
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? '리뷰 수정' : '리뷰 작성'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h5 className="mb-4 fw-bold text-primary">{productName}</h5>

        {/*  별점 */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">별점</Form.Label>
          <div className="d-flex align-items-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                style={{ cursor: 'pointer', fontSize: '24px', color: star <= rating ? '#FFD700' : '#ddd' }}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
            <span className="ms-2 text-muted fw-bold">{rating}점</span>
          </div>
        </Form.Group>

        {/*추가 선택지 */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">이 제품의 특징을 선택해주세요</Form.Label>
          <Form.Select value={option} onChange={e => setOption(e.target.value)}>
            <option value="">선택해주세요</option>
            <option value="MOIST">아주 촉촉해요</option>
            <option value="NORMAL">보통이에요</option>
            <option value="DRY">조금 건조해요</option>
            <option value="OILY">유분기가 많아요</option>
          </Form.Select>
        </Form.Group>

        {/* 내용 입력 */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">리뷰 내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="제품 리뷰를 10자 이상 작성해주세요."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="text-end text-muted small mt-1">{content.length} / 500자</div>
        </Form.Group>

        {/* 이미지 업로드 */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">사진 첨부 (선택)</Form.Label>
          <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} />
          {/* 미리보기 */}
          <div className="d-flex gap-2 mt-2">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                style={{
                  width: '80px',
                  height: '80px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Image src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        {/* 수정 모드일 때만 삭제 버튼 표시 */}
        <div>
          {isEditMode && (
            <Button variant="danger" onClick={handleDelete}>
              삭제하기
            </Button>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditMode ? '수정 완료' : '등록하기'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
