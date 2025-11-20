// -----------------------------------------------------------------------------
// LoginPage.js - 로그인 페이지
// - '로그인 상태 유지' 시 localStorage, 아니면 sessionStorage에 토큰 저장
// - 응답 규격: { resultCode, resultMsg, data: { token, member } } 가정
// - 관리자 로그인 체크 시, 성공 후 /admin 으로 이동
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../lib/apiClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ onSuccess }) {
  const [form, setForm] = useState({ userEmail: "", userPw: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [asAdmin, setAsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect");

  const isEmailValid = useMemo(
    () => EMAIL_RE.test(form.userEmail.trim()),
    [form.userEmail]
  );
  const isPwValid = useMemo(
    () => (form.userPw || "").length >= 8,
    [form.userPw]
  );
  const isFormValid = isEmailValid && isPwValid;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === "rememberMe") {
      setRememberMe(checked);
      return;
    }
    if (name === "asAdmin") {
      setAsAdmin(checked);
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!form.userEmail.trim()) {
      setMsg("이메일을 입력해주세요.");
      return;
    }
    if (!form.userPw) {
      setMsg("비밀번호를 입력해주세요.");
      return;
    }
    if (!isEmailValid) {
      setMsg("이메일 형식을 확인해주세요.");
      return;
    }
    if (!isPwValid) {
      setMsg("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const resp = await login({
        userEmail: form.userEmail.trim(),
        userPw: form.userPw,
        asAdmin,
      });

      const token = resp?.data?.token;
      const member = resp?.data?.member || null;

      if (token) {
        const storage = rememberMe
          ? window.localStorage
          : window.sessionStorage;
        storage.setItem("token", token);
        if (member) storage.setItem("member", JSON.stringify(member));
      }

      setMsg("로그인에 성공했습니다.");
      try {
        onSuccess?.(member);
      } catch (_) {}

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (asAdmin) {
        navigate("/admin", { replace: true });
      } else {
        try {
          navigate(-1);
        } catch {
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      setMsg(err?.message || "로그인 중 오류가 발생했습니다.");
      // eslint-disable-next-line no-console
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 160px)" }}
    >
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body p-4">
          {/* 상단 헤더 */}
          <div className="mb-4 text-center">
            <div className="fw-semibold text-primary mb-1">Routy</div>
            <h2 className="h4 mb-2">로그인</h2>
            <p className="text-muted small mb-0">
              나만의 뷰티 루틴을 이어가려면 로그인이 필요해요.
            </p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} noValidate>
            {/* 이메일 */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                이메일
              </label>
              <input
                id="email"
                name="userEmail"
                value={form.userEmail}
                onChange={handleChange}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your@email.com"
                required
                className={
                  "form-control" +
                  (form.userEmail && !isEmailValid ? " is-invalid" : "")
                }
              />
              <div className="form-text">
                Routy에 가입하신 이메일 주소를 입력해주세요.
              </div>
              {form.userEmail && !isEmailValid && (
                <div className="invalid-feedback">
                  유효한 이메일 주소를 입력해주세요.
                </div>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                비밀번호
              </label>
              <input
                id="password"
                name="userPw"
                value={form.userPw}
                onChange={handleChange}
                type="password"
                autoComplete="current-password"
                minLength={8}
                placeholder="8자 이상 입력해주세요"
                required
                className={
                  "form-control" +
                  (form.userPw && !isPwValid ? " is-invalid" : "")
                }
              />
              <div className="form-text">
                영문/숫자 조합으로 8자 이상을 추천드립니다.
              </div>
              {form.userPw && !isPwValid && (
                <div className="invalid-feedback">
                  비밀번호는 8자 이상이어야 합니다.
                </div>
              )}
            </div>

            {/* 옵션 영역 */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="form-check">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="form-check-input"
                  checked={rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="form-check-label">
                  로그인 상태 유지
                </label>
              </div>

              <button
                type="button"
                className="btn btn-link p-0 small"
                onClick={() => navigate("/password/reset")}
              >
                비밀번호 찾기
              </button>
            </div>

            {/* 관리자 로그인 */}
            <div className="form-check mb-3">
              <input
                id="asAdmin"
                name="asAdmin"
                type="checkbox"
                className="form-check-input"
                checked={asAdmin}
                onChange={handleChange}
              />
              <label htmlFor="asAdmin" className="form-check-label small">
                관리자로 로그인
              </label>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={loading || !isFormValid}
            >
              {loading ? "처리 중..." : "이메일로 로그인"}
            </button>
          </form>

          {/* 상태 메시지 */}
          {msg && (
            <p
              className="mt-3 text-center text-muted small"
              aria-live="polite"
            >
              {msg}
            </p>
          )}

          {/* 구분선 */}
          <div className="d-flex align-items-center my-4">
            <div className="flex-grow-1 border-top" />
            <span className="mx-2 text-muted small">또는</span>
            <div className="flex-grow-1 border-top" />
          </div>

          {/* 카카오 로그인만 남김 */}
          <button
            type="button"
            className="btn w-100 py-2"
            style={{
              backgroundColor: "#FEE500",
              borderColor: "#FEE500",
              fontWeight: 500,
            }}
            onClick={() =>
              navigate(
                `/oauth/kakao?redirect=${encodeURIComponent(redirectTo || "/")}`
              )
            }
          >
            카카오로 계속하기
          </button>

          {/* 회원가입 링크 */}
          <p className="mt-4 text-center text-muted small mb-0">
            아직 계정이 없으신가요?{" "}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
