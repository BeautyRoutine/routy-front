import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import './MemberWithdrawal.css';

const MemberWithdrawal = ({ onCancel }) => {
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState('');

  const handleWithdraw = () => {
    if (!agreed) return;
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    // API call for withdrawal would go here
    if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      console.log('Withdrawal requested');
      alert('회원 탈퇴가 완료되었습니다.');
      // Redirect to home or logout
    }
  };

  return (
    <div className="withdrawal-container">
      <h2 className="withdrawal-title">회원탈퇴</h2>

      <div className="warning-box">
        <div className="warning-title">
          <AlertTriangle size={20} />
          <span>탈퇴 전 유의사항을 확인해주세요</span>
        </div>
        <ul className="warning-list">
          <li>회원 탈퇴 시 보유하고 계신 포인트, 쿠폰 등 모든 혜택이 소멸되며 복구되지 않습니다.</li>
          <li>진행 중인 주문, 교환, 반품 처리가 완료되기 전에는 탈퇴하실 수 없습니다.</li>
          <li>작성하신 리뷰와 게시물은 자동으로 삭제되지 않으니, 탈퇴 전 미리 삭제해주시기 바랍니다.</li>
          <li>탈퇴 후 동일한 아이디로 재가입이 불가능할 수 있습니다.</li>
        </ul>
      </div>

      <div className="agreement-section">
        <label className="checkbox-label">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          <span>위 내용을 모두 확인하였으며, 이에 동의합니다.</span>
        </label>
      </div>

      <div className="password-section">
        <div className="input-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="현재 비밀번호를 입력해주세요"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="button-group">
        <button className="btn-cancel" onClick={onCancel}>
          취소
        </button>
        <button className="btn-withdraw" disabled={!agreed || !password} onClick={handleWithdraw}>
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default MemberWithdrawal;
