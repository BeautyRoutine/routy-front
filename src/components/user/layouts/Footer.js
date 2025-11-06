import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="routy-footer py-5 mt-5">
      <div className="container text-center text-muted small">
        {/* 브랜드명 */}
        <h5 className="fw-bold mb-2 text-primary">Routy</h5>
        <p className="mb-1">개인 맞춤형 화장품 추천과 신뢰할 수 있는 리뷰 시스템</p>

        {/* 링크 목록 */}
        <div className="mb-3">
          <a href="#" className="text-muted mx-2 text-decoration-none">
            이용약관
          </a>
          <a href="#" className="text-muted mx-2 text-decoration-none">
            개인정보 처리방침
          </a>
          <a href="#" className="text-muted mx-2 text-decoration-none">
            고객센터
          </a>
          <a href="#" className="text-muted mx-2 text-decoration-none">
            협업 문의
          </a>
        </div>

        {/* 저작권 문구 */}
        <p className="mb-1">Copyright © Routy 2025. All rights reserved.</p>

        {/* 안내문구 */}
        <p className="small mt-2">
          ⚠️{' '}
          <span className="text-secondary">본 프로젝트는 개인정보를 수집하지 않으며, 학습 목적으로만 사용됩니다.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
