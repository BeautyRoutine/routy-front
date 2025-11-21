// -----------------------------------------------------------------------------
// src/pages/LoginPage.js -- 추후 수정 예정입니다.
// -----------------------------------------------------------------------------
// LoginPage.js - 로그인 페이지
// - 이메일/비밀번호 로그인 + 카카오 로그인
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../lib/apiClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 스타일 객체
const styles = {
  bg: {
    minHeight: "100vh",
    padding: "40px 0",
    background:
      "radial-gradient(circle at top left, #e9f3ff 0, transparent 55%), " +
      "radial-gradient(circle at bottom right, #ffeaf4 0, transparent 50%), " +
      "#f5f7fb",
  },
  container: {
    maxWidth: 420,
    margin: "0 auto",
    padding: "0 16px",
  },
  card: {
    borderRadius: 28,
    padding: "40px 32px 32px",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 38px rgba(15, 23, 42, 0.12)",
  },
  logoRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 999,
    background: "linear-gradient(135deg, #9be7ff, #c4f5d1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
    color: "#12344a",
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 700,
    color: "#4aa7ff",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    width: "100%",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: "#f7f4ef",
    padding: "12px 16px",
    fontSize: 14,
    outline: "none",
    transition: "all .2s",
  },
  inputFocus: {
    borderColor: "#4aa7ff",
    background: "#ffffff",
    boxShadow: "0 0 0 3px rgba(74, 167, 255, 0.18)",
  },
  inputError: {
    borderColor: "#ef4f4f",
    background: "#fff5f5",
  },
  helper: {
    fontSize: 12,
    marginTop: 6,
    color: "#6b7280",
  },
  errorText: {
    color: "#ef4444",
  },
  checkboxRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 4,
  },
  submitBtn: {
    width: "100%",
    borderRadius: 999,
    padding: "13px 0",
    fontSize: 16,
    fontWeight: 600,
    color: "#ffffff",
    border: "none",
    background:
      "linear-gradient(135deg, #4aa7ff 0%, #7fd0ff 50%, #88f0cd 100%)",
    boxShadow: "0 14px 28px rgba(56, 189, 248, 0.35)",
    cursor: "pointer",
    transition: "all .2s",
  },
  submitDisabled: {
    opacity: 0.5,
    cursor: "default",
    boxShadow: "none",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    margin: "22px 0",
  },
  divider: {
    flexGrow: 1,
    borderTop: "1px solid #e5e7eb",
  },
  dividerText: {
    margin: "0 10px",
    fontSize: 12,
    color: "#9ca3af",
  },
  kakaoBtn: {
    width: "100%",
    borderRadius: 999,
    padding: "12px 0",
    fontSize: 15,
    fontWeight: 600,
    backgroundColor: "#FEE500",
    border: "1px solid #FEE500",
    cursor: "pointer",
  },
};

export default function LoginPage() {
  const [form, setForm] = useState({ userEmail: "", userPw: "" });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [focusField, setFocusField] = useState("");
  const [msg, setMsg] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);

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

  const getInputStyle = (name, error = false) => {
    let s = { ...styles.input };
    if (focusField === name) s = { ...s, ...styles.inputFocus };
    if (error) s = { ...s, ...styles.inputError };
    return s;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "rememberMe") {
      setRememberMe(checked);
    } else if (name === "asAdmin") {
      setAsAdmin(checked);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

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

      const storage = rememberMe ? localStorage : sessionStorage;
      if (token) {
        storage.setItem("token", token);
        if (member) storage.setItem("member", JSON.stringify(member));
      }

      if (redirectTo) navigate(redirectTo, { replace: true });
      else if (asAdmin) navigate("/admin", { replace: true });
      else navigate(-1);
    } catch (err) {
      setMsg(
        err?.response?.data?.resultMsg ||
          err?.message ||
          "로그인 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 카카오 로그인 버튼 클릭 시 처리
  const handleKakaoLogin = () => {
    // 프론트(3000)가 아니라 백엔드(8080)로 바로 보냄....오류나서... 우선... 
    window.location.href = "http://localhost:8080/auth/kakao/login";
  };

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.card}>
          {/* 로고 */}
          <div style={styles.logoRow}>
            <div style={styles.logoCircle}>R</div>
            <div style={styles.logoText}>Routy</div>
            <p style={styles.subText}>
              나만의 뷰티 루틴을 Routy와 함께 시작해보세요.
            </p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>이메일</label>
            <input
              type="email"
              name="userEmail"
              value={form.userEmail}
              onChange={handleChange}
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField("")}
              style={getInputStyle("email", form.userEmail && !isEmailValid)}
              placeholder="your@email.com"
            />
            <div style={styles.helper}>
              Routy에 가입하신 이메일 주소를 입력해주세요.
            </div>
            {form.userEmail && !isEmailValid && (
              <div style={{ ...styles.helper, ...styles.errorText }}>
                올바른 이메일을 입력해주세요.
              </div>
            )}

            <div style={{ height: 18 }} />
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              name="userPw"
              value={form.userPw}
              onChange={handleChange}
              onFocus={() => setFocusField("pw")}
              onBlur={() => setFocusField("")}
              style={getInputStyle("pw", form.userPw && !isPwValid)}
              placeholder="8자 이상 입력해주세요"
            />
            {form.userPw && !isPwValid && (
              <div style={{ ...styles.helper, ...styles.errorText }}>
                비밀번호는 8자 이상이어야 합니다.
              </div>
            )}

            {/* 옵션 */}
            <div style={styles.checkboxRow}>
              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleChange}
                  style={{ marginRight: 6 }}
                />
                로그인 상태 유지
              </label>

              <button
                type="button"
                onClick={() => navigate("/password/reset")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: 13,
                  color: "#4aa7ff",
                  cursor: "pointer",
                }}
              >
                비밀번호 찾기
              </button>
            </div>

            {/* 관리자 */}
            <label style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
              <input
                type="checkbox"
                name="asAdmin"
                checked={asAdmin}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              관리자로 로그인
            </label>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              style={
                isFormValid
                  ? styles.submitBtn
                  : { ...styles.submitBtn, ...styles.submitDisabled }
              }
              disabled={!isFormValid}
            >
              {loading ? "로그인 중..." : "이메일로 로그인"}
            </button>
          </form>

          {msg && (
            <p style={{ ...styles.helper, textAlign: "center", marginTop: 16 }}>
              {msg}
            </p>
          )}

          {/* 구분선 */}
          <div style={styles.dividerRow}>
            <div style={styles.divider}></div>
            <span style={styles.dividerText}>또는</span>
            <div style={styles.divider}></div>
          </div>

          {/* 카카오 */}
          <button
            type="button"
            style={styles.kakaoBtn}
            onClick={handleKakaoLogin}
          >
            카카오로 계속하기
          </button>

          {/* 회원가입 */}
          <p
            style={{
              marginTop: 22,
              textAlign: "center",
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            아직 계정이 없으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "#4aa7ff",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
