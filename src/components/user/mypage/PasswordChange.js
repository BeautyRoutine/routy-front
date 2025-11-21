import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { X, Lock, Check, AlertCircle } from 'lucide-react';
import { changePassword } from '../../../features/user/userSlice';
import '../../../styles/MyPage.css'; // Reusing MyPage styles for consistency

/**
 * PasswordChange Component
 *
 * 사용자의 비밀번호를 변경하는 모달 컴포넌트입니다.
 * 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인을 입력받아 유효성을 검사하고
 * Redux 액션을 통해 비밀번호 변경 요청을 처리합니다.
 */
const PasswordChange = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // Form State: 입력 필드 값 관리
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI State: 에러 및 성공 메시지 관리
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation State: 실시간 비밀번호 규칙 검증 상태
  const [hasUpperCase, setHasUpperCase] = useState(false); // 대문자 포함 여부
  const [hasSpecialChar, setHasSpecialChar] = useState(false); // 특수문자 포함 여부

  // Refs: 유효성 검사 실패 시 해당 입력 필드로 포커스 이동을 위해 사용
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Effect: 모달이 닫힐 때 모든 상태를 초기화하여 다음 열림 시 깨끗한 상태 유지
  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
      setHasUpperCase(false);
      setHasSpecialChar(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handler: 새 비밀번호 입력 시 실시간 유효성 검사 수행
  const handleNewPasswordChange = e => {
    const val = e.target.value;
    setNewPassword(val);
    // 대문자 포함 여부 체크
    setHasUpperCase(/[A-Z]/.test(val));
    // 특수문자 포함 여부 체크
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(val));
  };

  // Handler: 폼 제출 및 최종 유효성 검사
  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. 필수 입력 체크
    if (!currentPassword) {
      setError('현재 비밀번호를 입력해주세요.');
      currentPasswordRef.current?.focus();
      return;
    }

    if (!newPassword) {
      setError('새 비밀번호를 입력해주세요.');
      newPasswordRef.current?.focus();
      return;
    }

    if (!confirmPassword) {
      setError('새 비밀번호 확인을 입력해주세요.');
      confirmPasswordRef.current?.focus();
      return;
    }

    // 2. 비밀번호 일치 여부 체크
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      confirmPasswordRef.current?.focus();
      return;
    }

    // 3. 길이 체크
    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      newPasswordRef.current?.focus();
      return;
    }

    // 4. 복잡성 규칙 체크 (대문자, 특수문자)
    if (!hasUpperCase || !hasSpecialChar) {
      setError('비밀번호 보안 규칙을 만족해야 합니다.');
      newPasswordRef.current?.focus();
      return;
    }

    // 5. Redux Action Dispatch: 비밀번호 변경 요청
    dispatch(changePassword({ currentPassword, newPassword }))
      .unwrap()
      .then(() => {
        setSuccess('비밀번호가 성공적으로 변경되었습니다.');
        // 성공 시 입력 필드 초기화
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setHasUpperCase(false);
        setHasSpecialChar(false);

        // 1.5초 후 모달 자동 닫기
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 1500);
      })
      .catch(err => {
        setError(typeof err === 'string' ? err : '비밀번호 변경에 실패했습니다.');
      });
  };

  // Helper: 입력 값의 유효성에 따라 CSS 클래스 반환 (시각적 피드백)
  const getInputClass = (value, isValid = true) => {
    if (!value) return '';
    return isValid ? 'valid-input' : 'invalid-input';
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-container password-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-left">
            <div className="header-title-row">
              <Lock size={24} className="header-icon" />
              <h2>비밀번호 변경</h2>
            </div>
            <span className="header-desc">안전한 계정 보호를 위해 비밀번호를 주기적으로 변경해주세요.</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} color="#666" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="password-form-modal">
            {/* 현재 비밀번호 입력 */}
            <div className="form-group">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <div className="input-wrapper">
                <input
                  ref={currentPasswordRef}
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력해주세요"
                  className={getInputClass(currentPassword)}
                />
              </div>
            </div>

            {/* 새 비밀번호 입력 및 규칙 표시 */}
            <div className="form-group">
              <label htmlFor="newPassword">새 비밀번호</label>
              <div className="input-wrapper">
                <input
                  ref={newPasswordRef}
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="새 비밀번호 (8자 이상)"
                  className={getInputClass(newPassword, hasUpperCase && hasSpecialChar && newPassword.length >= 8)}
                />
              </div>
              {/* 비밀번호 규칙 피드백 (O/X) */}
              <div className="password-rules">
                <span className={hasUpperCase ? 'valid' : 'invalid'}>
                  {hasUpperCase ? <Check size={14} /> : <X size={14} />} 대문자 포함
                </span>
                <span className={hasSpecialChar ? 'valid' : 'invalid'}>
                  {hasSpecialChar ? <Check size={14} /> : <X size={14} />} 특수문자 포함
                </span>
              </div>
            </div>

            {/* 새 비밀번호 확인 입력 및 일치 여부 표시 */}
            <div className="form-group">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <div className="input-wrapper">
                <input
                  ref={confirmPasswordRef}
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력해주세요"
                  className={getInputClass(
                    confirmPassword,
                    confirmPassword === newPassword && confirmPassword.length > 0,
                  )}
                />
              </div>
              <div className="password-rules">
                <span
                  className={newPassword && confirmPassword && newPassword === confirmPassword ? 'valid' : 'invalid'}
                >
                  {newPassword && confirmPassword && newPassword === confirmPassword ? (
                    <Check size={14} />
                  ) : (
                    <X size={14} />
                  )}{' '}
                  비밀번호 일치
                </span>
              </div>
            </div>

            {/* 에러 및 성공 메시지 박스 */}
            {error && (
              <div className="message-box error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="message-box success">
                <Check size={16} />
                <span>{success}</span>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="save-btn" onClick={handleSubmit}>
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
