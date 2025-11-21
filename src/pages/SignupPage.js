// src/pages/SignupPage.js
// -------------------------------------------------------------
// SignupPage.js - 회원가입 페이지
// - 이메일 가입 + 주소 검색(다음 우편번호) + 카카오 간편 로그인
// - 백엔드 signUp API(/api/auth/signup) 연동  추후 계속 수정예정임..!! 
// -------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  signUp,
  requestPhoneVerify,
  confirmPhoneVerify,
} from "../lib/apiClient"; 

// 이메일, 비밀번호 검증용 정규식 및 상수
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PW_LENGTH = 8;

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
    maxWidth: "980px",
    margin: "0 auto",
    padding: "0 16px",
  },
  backButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    marginBottom: 18,
    fontSize: 14,
    color: "#6b7280",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
  },
  backArrow: {
    fontSize: 16,
  },
  card: {
    borderRadius: 28,
    padding: "40px 54px 32px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  logoRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "linear-gradient(135deg, #9be7ff 0, #c4f5d1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 15,
    color: "#12344a",
  },
  logoText: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "0.02em",
    color: "#4aa7ff",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6,
    color: "#111827",
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: "#6b7280",
  },
  section: {
    marginBottom: 18,
  },
  row: {
    display: "flex",
    gap: 18,
    flexWrap: "wrap",
  },
  field: {
    flex: "1 1 0",
    minWidth: 220,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    width: "100%",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    backgroundColor: "#faf6f2",
    padding: "11px 16px",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    transition:
      "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
  },
  inputError: {
    borderColor: "#f97373",
    backgroundColor: "#fff5f5",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  birthRow: {
    display: "flex",
    gap: 10,
  },
  genderRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 4,
  },
  genderRadio: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#4b5563",
  },
  btnOutline: {
    padding: "9px 16px",
    borderRadius: 999,
    border: "1px solid #111827",
    background: "#111827",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  helper: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  helperError: {
    color: "#ea4a4a",
  },
  alertBase: {
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 12,
  },
  alertError: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
  },
  alertSuccess: {
    backgroundColor: "#ecfdf3",
    color: "#166534",
  },
  boxBase: {
    borderRadius: 18,
    padding: "14px 16px",
    fontSize: 13,
  },
  boxTerms: {
    backgroundColor: "#edf4ff",
  },
  boxMarketing: {
    backgroundColor: "#f3f1ff",
    marginTop: 8,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    fontSize: 13,
    color: "#374151",
  },
  benefitBox: {
    borderRadius: 18,
    padding: "14px 16px",
    backgroundColor: "#f5fbff",
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: "#374151",
  },
  benefitList: {
    listStyle: "disc",
    margin: 0,
    paddingLeft: 18,
    fontSize: 12.5,
    color: "#4b5563",
  },
  submitBtn: {
    width: "100%",
    marginTop: 10,
    height: 52,
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, #4aa7ff 0, #7fd0ff 50%, #88f0cd 100%)",
    boxShadow: "0 14px 28px rgba(56, 189, 248, 0.35)",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  submitDisabled: {
    opacity: 0.5,
    boxShadow: "none",
    cursor: "default",
  },
  // 카카오 간편 로그인 버튼
  socialBtn: {
    width: "100%",
    marginTop: 12,
    height: 48,
    borderRadius: 999,
    border: "none",
    backgroundColor: "#FEE500",
    color: "#3C1E1E",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  optional: {
    color: "#9ca3af",
  },
  required: {
    color: "#f97373",
    fontWeight: 600,
  },
};

// 인풋 포커스용
const onFocusStyle = {
  borderColor: "#4aa7ff",
  boxShadow: "0 0 0 2px rgba(74, 167, 255, 0.18)",
  backgroundColor: "#ffffff",
};

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    phoneCode: "", // 인증번호 입력
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "", // "M" | "F" | "N"
    zipCode: "",
    addr1: "",
    addr2: "",
    agreeTermsRequired: false,
    agreeMarketing: false,
  });

  const [focusField, setFocusField] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [phoneMsg, setPhoneMsg] = useState(""); // 휴대폰 인증 메시지

  // ---------- 유효성 ----------
  const isEmailValid = useMemo(
    () => (form.email ? EMAIL_RE.test(form.email.trim()) : false),
    [form.email]
  );
  const isPasswordValid = useMemo(
    () => form.password.length >= MIN_PW_LENGTH,
    [form.password]
  );
  const isPasswordSame = useMemo(
    () =>
      form.password &&
      form.passwordConfirm &&
      form.password === form.passwordConfirm,
    [form.password, form.passwordConfirm]
  );
  const isFormValid =
    form.name.trim().length > 0 &&
    isEmailValid &&
    isPasswordValid &&
    isPasswordSame &&
    form.agreeTermsRequired &&
    !loading;

  // ---------- 핸들러 ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrorMsg("");
    setSuccessMsg("");
    if (name === "phone" || name === "phoneCode") setPhoneMsg("");
  };

  const handleBack = () => {
    const state = location.state || {};
    if (state.from) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // 휴대폰 인증번호 요청
  const handleRequestPhoneVerify = async () => {
    if (!form.phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    try {
      setPhoneMsg("");
      await requestPhoneVerify({ phone: form.phone.trim() });
      setPhoneMsg("인증번호를 전송했습니다. 문자메시지를 확인해주세요.");
    } catch (err) {
      console.error(err);
      setPhoneMsg(
        err?.message ||
          "인증번호 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  };

  // 인증번호 확인
  const handleConfirmPhoneVerify = async () => {
    if (!form.phone.trim() || !form.phoneCode.trim()) {
      alert("전화번호와 인증번호를 모두 입력해주세요.");
      return;
    }

    try {
      setPhoneMsg("");
      await confirmPhoneVerify({
        phone: form.phone.trim(),
        code: form.phoneCode.trim(),
      });
      setPhoneMsg("휴대폰 인증이 완료되었습니다.");
    } catch (err) {
      console.error(err);
      setPhoneMsg(
        err?.message ||
          "인증번호 확인 중 오류가 발생했습니다. 번호를 다시 확인해주세요."
      );
    }
  };

  // 회원가입 API 연동
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        userEmail: form.email.trim(),
        userPw: form.password,
        userPwConfirm: form.passwordConfirm,
        userName: form.name.trim(),
        phone: form.phone.trim(),
        birthYear: form.birthYear.trim(),
        birthMonth: form.birthMonth.trim(),
        birthDay: form.birthDay.trim(),
        gender: form.gender, // "M" | "F" | "N"
        zipcode: form.zipCode.trim(),
        addr1: form.addr1.trim(),
        addr2: form.addr2.trim(),
        agreeTerms: form.agreeTermsRequired,
        agreeMarketing: form.agreeMarketing,
      };

      await signUp(payload);

      setSuccessMsg("회원가입이 완료되었습니다. 로그인 후 이용해 주세요.");

      setTimeout(() => {
        navigate("/login", {
          state: {
            fromSignup: true,
            redirect: location.state?.redirect,
          },
        });
      }, 800);
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg(
        err?.message ||
          "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  // 다음 우편번호 API 연동
  const handleFindAddress = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address;
        const zonecode = data.zonecode;

        setForm((prev) => ({
          ...prev,
          zipCode: zonecode,
          addr1: fullAddress,
        }));
      },
    }).open();
  };

  // 카카오 간편 로그인 / 가입 버튼 클릭 시 처리
  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8080/auth/kakao/login";
  };

  // 인풋 스타일 조합
  const getInputStyle = (name, hasError = false) => {
    const base = { ...styles.input };
    if (focusField === name) {
      Object.assign(base, onFocusStyle);
    }
    if (hasError) {
      Object.assign(base, styles.inputError);
    }
    return base;
  };

  // ---------- 렌더링 ----------
  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        {/* 상단 뒤로가기 */}
        <button type="button" onClick={handleBack} style={styles.backButton}>
          <span style={styles.backArrow}>←</span> 홈으로 돌아가기
        </button>

        {/* 메인 카드 */}
        <div style={styles.card}>
          {/* 헤더 / 로고 */}
          <div style={styles.header}>
            <div style={styles.logoRow}>
              <div style={styles.logoCircle}>R</div>
              <span style={styles.logoText}>Routy</span>
            </div>
            <h2 style={styles.title}>이메일로 가입하기</h2>
            <p style={styles.subtitle}>
              나만을 위한 맞춤형 뷰티 루틴을 시작하세요
            </p>
          </div>

          {/* 알림 메시지 */}
          {errorMsg && (
            <div style={{ ...styles.alertBase, ...styles.alertError }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ ...styles.alertBase, ...styles.alertSuccess }}>
              {successMsg}
            </div>
          )}

          {/* 폼 시작 */}
          <form onSubmit={handleSubmit}>
            {/* 1. 기본 정보 */}
            <div style={styles.section}>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>이름</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="홍길동"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    style={getInputStyle("name")}
                    onFocus={() => setFocusField("name")}
                    onBlur={() => setFocusField("")}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>이메일</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    style={getInputStyle(
                      "email",
                      form.email && !isEmailValid
                    )}
                    onFocus={() => setFocusField("email")}
                    onBlur={() => setFocusField("")}
                  />
                  {form.email && !isEmailValid && (
                    <div style={{ ...styles.helper, ...styles.helperError }}>
                      올바른 이메일 형식을 입력해 주세요.
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="8자 이상 입력해주세요"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    style={getInputStyle(
                      "password",
                      form.password && !isPasswordValid
                    )}
                    onFocus={() => setFocusField("password")}
                    onBlur={() => setFocusField("")}
                  />
                  {form.password && !isPasswordValid && (
                    <div style={{ ...styles.helper, ...styles.helperError }}>
                      비밀번호는 최소 {MIN_PW_LENGTH}자 이상이어야 합니다.
                    </div>
                  )}
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>비밀번호 확인</label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    disabled={loading}
                    style={getInputStyle(
                      "passwordConfirm",
                      form.passwordConfirm && !isPasswordSame
                    )}
                    onFocus={() => setFocusField("passwordConfirm")}
                    onBlur={() => setFocusField("")}
                  />
                  {form.passwordConfirm && !isPasswordSame && (
                    <div style={{ ...styles.helper, ...styles.helperError }}>
                      비밀번호가 일치하지 않습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. 추가 정보 */}
            <div style={styles.section}>
              <div style={styles.row}>
                {/* 전화번호 + 인증 */}
                <div style={styles.field}>
                  <label style={styles.label}>전화번호</label>

                  {/* 전화번호 + 인증요청 */}
                  <div style={styles.inputGroup}>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="010-1234-5678"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={loading}
                      style={getInputStyle("phone")}
                      onFocus={() => setFocusField("phone")}
                      onBlur={() => setFocusField("")}
                    />
                    <button
                      type="button"
                      style={styles.btnOutline}
                      onClick={handleRequestPhoneVerify}
                      disabled={loading}
                    >
                      인증요청
                    </button>
                  </div>

                  {/* 인증번호 입력 + 확인 */}
                  <div style={{ ...styles.inputGroup, marginTop: 8 }}>
                    <input
                      type="text"
                      name="phoneCode"
                      placeholder="인증번호 6자리"
                      value={form.phoneCode}
                      onChange={handleChange}
                      disabled={loading}
                      style={getInputStyle("phoneCode")}
                      onFocus={() => setFocusField("phoneCode")}
                      onBlur={() => setFocusField("")}
                    />
                    <button
                      type="button"
                      style={styles.btnOutline}
                      onClick={handleConfirmPhoneVerify}
                      disabled={loading}
                    >
                      인증확인
                    </button>
                  </div>

                  {phoneMsg && <div style={styles.helper}>{phoneMsg}</div>}
                </div>

                {/* 생년월일 */}
                <div style={styles.field}>
                  <label style={styles.label}>
                    생년월일 <span style={styles.optional}>(선택)</span>
                  </label>
                  <div style={styles.birthRow}>
                    <input
                      type="text"
                      name="birthYear"
                      placeholder="년(4자)"
                      value={form.birthYear}
                      onChange={handleChange}
                      disabled={loading}
                      style={getInputStyle("birthYear")}
                      onFocus={() => setFocusField("birthYear")}
                      onBlur={() => setFocusField("")}
                    />
                    <input
                      type="text"
                      name="birthMonth"
                      placeholder="월"
                      value={form.birthMonth}
                      onChange={handleChange}
                      disabled={loading}
                      style={getInputStyle("birthMonth")}
                      onFocus={() => setFocusField("birthMonth")}
                      onBlur={() => setFocusField("")}
                    />
                    <input
                      type="text"
                      name="birthDay"
                      placeholder="일"
                      value={form.birthDay}
                      onChange={handleChange}
                      disabled={loading}
                      style={getInputStyle("birthDay")}
                      onFocus={() => setFocusField("birthDay")}
                      onBlur={() => setFocusField("")}
                    />
                  </div>
                </div>
              </div>

              {/* 성별 */}
              <div style={styles.field}>
                <label style={styles.label}>
                  성별 <span style={styles.optional}>(선택)</span>
                </label>
                <div style={styles.genderRow}>
                  <label style={styles.genderRadio}>
                    <input
                      type="radio"
                      name="gender"
                      value="M"
                      checked={form.gender === "M"}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>남자</span>
                  </label>
                  <label style={styles.genderRadio}>
                    <input
                      type="radio"
                      name="gender"
                      value="F"
                      checked={form.gender === "F"}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>여자</span>
                  </label>
                  <label style={styles.genderRadio}>
                    <input
                      type="radio"
                      name="gender"
                      value="N"
                      checked={form.gender === "N"}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>선택 안함</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. 배송 주소 */}
            <div style={styles.section}>
              <div style={styles.field}>
                <label style={styles.label}>배송 주소</label>
                <div style={{ ...styles.inputGroup, marginBottom: 8 }}>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="우편번호"
                    value={form.zipCode}
                    onChange={handleChange}
                    disabled={loading}
                    style={getInputStyle("zipCode")}
                    onFocus={() => setFocusField("zipCode")}
                    onBlur={() => setFocusField("")}
                  />
                  <button
                    type="button"
                    style={styles.btnOutline}
                    onClick={handleFindAddress}
                    disabled={loading}
                  >
                    주소 찾기
                  </button>
                </div>
                <input
                  type="text"
                  name="addr1"
                  placeholder="기본 주소"
                  value={form.addr1}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ ...getInputStyle("addr1"), marginBottom: 8 }}
                  onFocus={() => setFocusField("addr1")}
                  onBlur={() => setFocusField("")}
                />
                <input
                  type="text"
                  name="addr2"
                  placeholder="상세 주소를 입력하세요"
                  value={form.addr2}
                  onChange={handleChange}
                  disabled={loading}
                  style={getInputStyle("addr2")}
                  onFocus={() => setFocusField("addr2")}
                  onBlur={() => setFocusField("")}
                />
              </div>
            </div>

            {/* 4. 약관 & 마케팅 동의 */}
            <div style={styles.section}>
              <div style={{ ...styles.boxBase, ...styles.boxTerms }}>
                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="agreeTermsRequired"
                    checked={form.agreeTermsRequired}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>
                    이용약관 및 개인정보처리방침에 동의합니다{" "}
                    <span style={styles.required}>(필수)</span>
                  </span>
                </label>
              </div>

              <div style={{ ...styles.boxBase, ...styles.boxMarketing }}>
                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={form.agreeMarketing}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>
                    마케팅 정보 수신에 동의합니다{" "}
                    <span style={styles.optional}>(선택)</span>
                  </span>
                </label>
                <p style={styles.helper}>
                  이벤트, 쿠폰, 신제품 등의 정보를 받아보실 수 있습니다.
                </p>
              </div>
            </div>

            {/* 5. 혜택 설명 */}
            <div style={styles.section}>
              <div style={styles.benefitBox}>
                <p style={styles.benefitTitle}>회원가입 시 제공되는 혜택:</p>
                <ul style={styles.benefitList}>
                  <li>맞춤형 뷰티 제품 추천</li>
                  <li>피부 타입별 루틴 관리</li>
                  <li>리뷰 작성 시 포인트 적립</li>
                  <li>신제품 출시 알림 및 첫 구매 할인</li>
                </ul>
              </div>
            </div>

            {/* 가입하기 버튼 */}
            <button
              type="submit"
              style={
                isFormValid
                  ? styles.submitBtn
                  : { ...styles.submitBtn, ...styles.submitDisabled }
              }
              disabled={!isFormValid}
            >
              {loading ? "가입하는 중..." : "가입하기"}
            </button>

            {/* 카카오 간편 가입 / 로그인 */}
            <button
              type="button"
              style={styles.socialBtn}
              onClick={handleKakaoLogin}
              disabled={loading}
            >
              카카오로 간편 가입 / 로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
