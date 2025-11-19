import React from 'react';
import LoginPage from '../pages/LoginPage';
import './LoginModal.css';

export default function LoginModal({ onClose, onSuccess, onSignupClick }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <LoginPage
          onSuccess={member => {
            onSuccess?.(member);
            onClose();
          }}
          onSignup={() => {
            onClose(); // 모달 닫기
            onSignupClick?.(); // SignupPage로 이동
          }}
        />
      </div>
    </div>
  );
}
