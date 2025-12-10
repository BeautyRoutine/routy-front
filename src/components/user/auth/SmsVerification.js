import React, { useState } from 'react';
import api from '../../../lib/apiClient';

const SmsVerification = ({ phoneNumber, onVerified }) => {
  const [code, setCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/-/g, '');
    if (!/^01[0-9]{8,9}$/.test(cleanPhone)) {
      alert('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      const response = await api.post('/api/sms/send', {
        phoneNumber: cleanPhone,
      });

      if (response.data.success) {
        alert('인증번호가 발송되었습니다.');
        setIsSent(true);
        setTimer(180);
        setIsTimerActive(true);
        startTimer();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'SMS 발송에 실패했습니다.');
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
          setIsSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (!code) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/-/g, '');

    try {
      const response = await api.post('/api/sms/verify', {
        phoneNumber: cleanPhone,
        code: code,
      });

      if (response.data.verified) {
        alert('인증이 완료되었습니다!');
        setIsVerified(true);
        setIsTimerActive(false);
        if (onVerified) {
          onVerified(true);
        }
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert(error.response?.data?.message || '인증 확인에 실패했습니다.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={phoneNumber}
          disabled
          placeholder="휴대폰 번호"
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
          }}
        />
        <button
          type="button"
          onClick={handleSendCode}
          disabled={isSent || isVerified}
          style={{
            padding: '12px 20px',
            backgroundColor: isVerified ? '#4CAF50' : isSent ? '#999' : '#42A5F5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isVerified || isSent ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            fontWeight: '600',
          }}
        >
          {isVerified ? '인증완료' : isSent ? '발송완료' : '인증번호 발송'}
        </button>
      </div>

      {isSent && !isVerified && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="인증번호 6자리"
            maxLength={6}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          />
          {isTimerActive && (
            <span
              style={{
                color: timer <= 30 ? '#E57373' : '#666',
                fontWeight: '600',
                minWidth: '50px',
              }}
            >
              {formatTime(timer)}
            </span>
          )}
          <button
            type="button"
            onClick={handleVerifyCode}
            style={{
              padding: '12px 20px',
              backgroundColor: '#66BB6A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: '600',
            }}
          >
            확인
          </button>
        </div>
      )}

      {isVerified && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#E8F5E9',
            color: '#4CAF50',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          ✓ 휴대폰 인증이 완료되었습니다
        </div>
      )}
    </div>
  );
};

export default SmsVerification;
