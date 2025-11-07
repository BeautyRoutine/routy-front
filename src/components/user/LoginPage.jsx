/**
 * 로그인 페이지
 * - 이메일/비밀번호를 입력받아 백엔드 API(/member/login) 호출합니다.
 * - 성공 시 토큰 또는 사용자 정보 응답을 받아 화면에 표시합니다.
 * - 실패 시 상태 코드/에러 메시지 표시합니다.
 * - 토큰 저장 및 전역 상태 관리는 추후 구현 가능합니다.
 */

import React, { useState } from 'react';
import { login } from '../../../lib/apiClient'; // axios 통신 모듈

export default function LoginPage() {
  // 폼 입력 상태 관리
  const [form, setForm] = useState({
    userEmail: '',  // 로그인용 이메일
    userPw: '',     // 비밀번호
  });

  // 로딩 상태 및 결과 메시지
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  /** 입력값 변경 처리 */
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /** 로그인 버튼 클릭 시 실행 */
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      // 백엔드 로그인 API 호출
      const { data } = await login(form);
      const nickname = data?.data?.nickname ?? form.userEmail;
      setMsg(`✅ 로그인 성공: ${nickname}`);
      // TODO: 토큰(localStorage 등) 저장 및 전역 상태 갱신 가능
    } catch (err) {
      // 실패 시 응답 메시지 처리
      const code = err?.response?.status;
      const res = err?.response?.data;
      setMsg(`❌ 로그인 실패 (${code ?? '??'}): ${res?.resultMsg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2 className="my-3">로그인</h2>
      <form onSubmit={onSubmit}>
        {/* 입력 필드 */}
        <input className="form-control mb-2" name="userEmail" placeholder="이메일" value={form.userEmail} onChange={onChange} />
        <input className="form-control mb-3" type="password" name="userPw" placeholder="비밀번호" value={form.userPw} onChange={onChange} />
        <button className="btn btn-dark w-100" disabled={loading}>
          {loading ? '처리중…' : '로그인'}
        </button>
      </form>

      {/* 응답 메시지 출력 */}
      {msg && <div className="alert alert-info mt-3">{msg}</div>}
    </div>
  );
}
