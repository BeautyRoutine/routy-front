// -----------------------------------------------------------------------------
// LoginPage.js - 로그인 페이지 (임시 로그인 처리 버전)
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const h = React.createElement;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ onSuccess, onSignup }) {
  const [form, setForm] = useState({ userEmail: '', userPw: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get('redirect');

  const isEmailValid = useMemo(() => EMAIL_RE.test(form.userEmail.trim()), [form.userEmail]);
  const isPwValid = useMemo(() => (form.userPw || '').length >= 8, [form.userPw]);
  const isFormValid = isEmailValid && isPwValid;

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') return setRememberMe(checked);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!form.userEmail.trim()) return setMsg('이메일을 입력해주세요.');
    if (!form.userPw) return setMsg('비밀번호를 입력해주세요.');
    if (!isEmailValid) return setMsg('이메일 형식을 확인해주세요.');
    if (!isPwValid) return setMsg('비밀번호는 8자 이상이어야 합니다.');

    try {
      setLoading(true);
      setMsg('');

      // 🔥 임시 로그인
      await new Promise(r => setTimeout(r, 500));

      const member = {
        userEmail: form.userEmail,
        nickname: '임시사용자',
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', 'TEMP_TOKEN_123');
      storage.setItem('member', JSON.stringify(member));

      onSuccess?.(member);

      if (redirectTo) navigate(redirectTo, { replace: true });
      else navigate('/', { replace: true });

      return;
    } catch (error) {
      console.error(error);
      setMsg(error?.message || '로그인 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return h(
    'div',
    { className: 'container', style: { maxWidth: 420 } },

    h('h2', { className: 'my-4' }, '로그인'),

    // ---------------------------- 폼 시작 ----------------------------
    h(
      'form',
      { onSubmit, noValidate: true },

      // 이메일 입력
      h(
        'div',
        { className: 'mb-3' },
        h('label', { htmlFor: 'email', className: 'form-label' }, '이메일(ID)'),
        h('input', {
          id: 'email',
          name: 'userEmail',
          value: form.userEmail,
          onChange,
          className: 'form-control ' + (form.userEmail && !isEmailValid ? 'is-invalid' : ''),
          type: 'email',
          placeholder: 'example@routy.com',
          required: true,
        }),
        form.userEmail &&
          !isEmailValid &&
          h('div', { className: 'invalid-feedback' }, '유효한 이메일 주소를 입력하세요.')
      ),

      // 비밀번호 입력
      h(
        'div',
        { className: 'mb-2' },
        h('label', { htmlFor: 'password', className: 'form-label' }, '비밀번호'),
        h('input', {
          id: 'password',
          name: 'userPw',
          value: form.userPw,
          onChange,
          className: 'form-control ' + (form.userPw && !isPwValid ? 'is-invalid' : ''),
          type: 'password',
          placeholder: '8자 이상 입력',
          required: true,
        }),
        form.userPw &&
          !isPwValid &&
          h('div', { className: 'invalid-feedback' }, '비밀번호는 8자 이상이어야 합니다.')
      ),

      // 옵션 영역
      h(
        'div',
        { className: 'd-flex align-items-center justify-content-between mb-3' },
        h(
          'div',
          { className: 'form-check' },
          h('input', {
            id: 'rememberMe',
            className: 'form-check-input',
            type: 'checkbox',
            checked: rememberMe,
            onChange,
          }),
          h('label', { className: 'form-check-label', htmlFor: 'rememberMe' }, '로그인 유지')
        ),

        // ---------------------- 🔥 회원가입 버튼 (모달 닫기만) ----------------------
        h(
          'button',
          {
            type: 'button',
            className: 'btn btn-link p-0',
            onClick: () => {
              onSignup?.(); // 모달 닫기
              // 이동은 App.js에서 처리함
            },
          },
          '회원가입'
        )
      ),

      // 로그인 버튼
      h(
        'button',
        { className: 'btn btn-primary w-100', type: 'submit', disabled: loading || !isFormValid },
        loading ? '처리 중...' : '로그인'
      )
    ),
    // ---------------------------- 폼 끝 ----------------------------

    msg && h('p', { className: 'mt-3 text-center text-muted' }, msg),

    // ---------------------------- SNS 로그인 ----------------------------
    h('hr', { className: 'my-4' }),

    h(
      'div',
      { className: 'd-grid gap-2' },
      h(
        'button',
        { className: 'btn btn-outline-secondary', type: 'button' },
        '카카오로 계속하기'
      ),
      h(
        'button',
        { className: 'btn btn-outline-secondary', type: 'button' },
        '구글로 계속하기'
      ),
      h(
        'button',
        { className: 'btn btn-outline-secondary', type: 'button' },
        '네이버로 계속하기'
      )
    )
  );
}
