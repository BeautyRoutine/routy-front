/**
 * 회원가입 페이지
 * - 사용자가 입력한 정보를 백엔드 API(/member/signup)로 전송합니다. 
 * - 중복 이메일/닉네임 여부는 백엔드에서 처리합니다. (MyBatis, MemberMapper)
 * - 성공/실패 메시지를 화면에 표시합니다.
 * - 가입 완료 후 로그인 페이지로 이동하는 기능은 추후 구현 가능합니다.
 */

import React, { useState } from 'react';
import { signUp } from '../../../lib/apiClient'; // axios 통신 모듈

export default function SignupPage() {
  // 폼 입력 데이터 상태 관리
  const [form, setForm] = useState({
    userId: '',       // 사용자 ID
    userEmail: '',    // 이메일
    userNick: '',     // 닉네임
    userPw: '',       // 비밀번호
    userName: '',     // 이름
    userHp: '',       // 휴대폰 번호
  });

  // 로딩 및 응답 메시지 상태
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  /** 입력값 변경 시 상태 업데이트 */
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /** 회원가입 버튼 클릭 시 실행 */
  const onSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지
    setLoading(true);
    setMsg('');

    try {
      // 백엔드 API 호출 (POST /member/signup)
      const { data } = await signUp(form);
      const nickname = data?.data?.nickname ?? form.userNick;
      setMsg(`✅ 가입 성공: ${nickname}`);
      // TODO: 가입 완료 후 /login 페이지로 이동하려면 여기서 navigate('/login') 추가 가능
    } catch (err) {
      // 예외 발생 시 (HTTP 상태 코드와 메시지 표시)
      const code = err?.response?.status;
      const res = err?.response?.data;
      setMsg(`❌ 가입 실패 (${code ?? '??'}): ${res?.resultMsg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="my-3">회원가입</h2>
      <form onSubmit={onSubmit}>
        {/* 각 입력 필드 */}
        <input className="form-control mb-2" name="userId" placeholder="아이디" value={form.userId} onChange={onChange} />
        <input className="form-control mb-2" name="userEmail" placeholder="이메일" value={form.userEmail} onChange={onChange} />
        <input className="form-control mb-2" name="userNick" placeholder="닉네임" value={form.userNick} onChange={onChange} />
        <input className="form-control mb-2" type="password" name="userPw" placeholder="비밀번호" value={form.userPw} onChange={onChange} />
        <input className="form-control mb-2" name="userName" placeholder="이름" value={form.userName} onChange={onChange} />
        <input className="form-control mb-3" name="userHp" placeholder="휴대폰" value={form.userHp} onChange={onChange} />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? '처리중…' : '가입하기'}
        </button>
      </form>

      {/* 응답 메시지 출력 */}
      {msg && <div className="alert alert-info mt-3">{msg}</div>}
    </div>
  );
}
