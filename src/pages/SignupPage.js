// -----------------------------------------------------------------------------
// SignupPage.js - 회원가입 페이지입니다.
// - 유효성: 이메일 포맷, 닉네임(2~12, 한/영/숫자), 비밀번호(8~16 추천)
// - 성공 시 /login 으로 네비게이트
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { signUp } from "../../../lib/apiClient";

const h = React.createElement;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage({ onSuccess }) {
  const [form, setForm] = useState({ userEmail: '', userNick: '', userPw: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();

  const isEmailValid = useMemo(() => EMAIL_RE.test(form.userEmail.trim()), [form.userEmail]);
  const isNickValid = useMemo(() => /^[가-힣a-zA-Z0-9]{2,12}$/.test(form.userNick.trim()), [form.userNick]);
  const isPwValid = useMemo(() => /^(?=.{8,16}$).*/.test(form.userPw), [form.userPw]); // 8~16자 권장
  const isFormValid = isEmailValid && isNickValid && isPwValid;

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!form.userEmail.trim()) return setMsg('이메일을 입력해주세요.');
    if (!isEmailValid) return setMsg('이메일 형식을 확인해주세요.');
    if (!isNickValid) return setMsg('닉네임은 2~12자의 한글/영문/숫자만 가능합니다.');
    if (!isPwValid) return setMsg('비밀번호는 8~16자 이내로 입력해주세요.');

    try {
      setLoading(true);
      setMsg('');

      //const { data, resultCode, resultMsg } = await signUp(form);

      // -----------------------------------------------------------------------
      // 🔥 임시 회원가입 처리 (API 없이 테스트용)
      // -----------------------------------------------------------------------
      await new Promise(r => setTimeout(r, 500)); // 로딩 효과
      const resultCode = 200;
      const data = {
        member: {
          userEmail: form.userEmail,
          userNick: form.userNick,
        },
      };
      // -----------------------------------------------------------------------
      if (resultCode === 200) {
        setMsg('회원가입이 완료되었습니다.');
        try {
          onSuccess?.(data?.member);
        } catch (_) {}
        setTimeout(() => {
          window.location.hash = '#/'; // HashRouter 기준 홈 이동
        }, 600);
      } else {
        //setMsg(resultMsg || '회원가입 처리 중 오류가 발생했습니다.');
        setMsg('회원가입 처리 중 오류가 발생했습니다.'); // 임시 메시지
      }
    } catch (error) {
      const serverMsg = error?.response?.data?.resultMsg || error?.response?.data?.message || error?.message;
      setMsg(serverMsg || '회원가입에 실패했습니다. 다시 시도해주세요.');
      // eslint-disable-next-line no-console
      console.error('Signup Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return h(
    'div',
    { className: 'container', style: { maxWidth: 420 } },
    h('h2', { className: 'my-4' }, '회원가입'),
    h(
      'form',
      { onSubmit, noValidate: true },
      // 이메일
      h(
        'div',
        { className: 'mb-3' },
        h('label', { className: 'form-label' }, '이메일'),
        h('input', {
          name: 'userEmail',
          value: form.userEmail,
          onChange,
          className: 'form-control ' + (form.userEmail && !isEmailValid ? 'is-invalid' : ''),
          type: 'email',
          placeholder: 'example@routy.com',
          autoComplete: 'email',
          required: true,
        }),
        form.userEmail &&
          !isEmailValid &&
          h('div', { className: 'invalid-feedback' }, '유효한 이메일 주소를 입력하세요.'),
      ),
      // 닉네임
      h(
        'div',
        { className: 'mb-3' },
        h('label', { className: 'form-label' }, '닉네임'),
        h('input', {
          name: 'userNick',
          value: form.userNick,
          onChange,
          className: 'form-control ' + (form.userNick && !isNickValid ? 'is-invalid' : ''),
          placeholder: '2~12자 (한글/영문/숫자)',
          autoComplete: 'nickname',
          required: true,
        }),
        form.userNick &&
          !isNickValid &&
          h('div', { className: 'invalid-feedback' }, '닉네임은 2~12자의 한글/영문/숫자만 가능합니다.'),
      ),
      // 비밀번호
      h(
        'div',
        { className: 'mb-4' },
        h('label', { className: 'form-label' }, '비밀번호'),
        h('input', {
          name: 'userPw',
          value: form.userPw,
          onChange,
          className: 'form-control ' + (form.userPw && !isPwValid ? 'is-invalid' : ''),
          type: 'password',
          placeholder: '8~16자 권장',
          autoComplete: 'new-password',
          required: true,
        }),
        form.userPw && !isPwValid && h('div', { className: 'invalid-feedback' }, '비밀번호는 8~16자를 권장합니다.'),
      ),
      // 제출
      h(
        'button',
        {
          className: 'btn btn-primary w-100',
          type: 'submit',
          disabled: loading || !isFormValid,
        },
        loading ? '처리 중...' : '회원가입',
      ),
    ),
    // 상태 메시지
    msg && h('p', { className: 'mt-3 text-center text-muted', 'aria-live': 'polite' }, msg),
  );
}
