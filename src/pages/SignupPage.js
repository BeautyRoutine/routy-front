// -----------------------------------------------------------------------------
// SignupPage.js - 회원가입 페이지 !!
// - 이메일, 비밀번호, 이름, 휴대폰, 생년월일, 성별, 주소, 약관동의
// - 휴대폰 인증: requestPhoneVerify / confirmPhoneVerify 사용했습니다. 
// - 주소 찾기: window.daum.Postcode 사용 (index.html 에 스크립트 추가 필요합니다)
// - 성공 -> login 으로 이동
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  requestPhoneVerify,
  confirmPhoneVerify,
  getKakaoLoginUrl,
} from "../lib/apiClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01[0-9]-?\d{3,4}-?\d{4}$/;

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    userPw: "",
    userPwConfirm: "",
    phone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "", // male, female, none
    zipcode: "",
    addr1: "",
    addr2: "",
    agreeTerms: false,
    agreeMarketing: false,
  });

  const [phoneCode, setPhoneCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneRequesting, setPhoneRequesting] = useState(false);
  const [phoneChecking, setPhoneChecking] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // 유효성
  const isEmailValid = useMemo(
    () => EMAIL_RE.test(form.userEmail.trim()),
    [form.userEmail]
  );
  const isPwValid = useMemo(
    () => (form.userPw || "").length >= 8 && (form.userPw || "").length <= 16,
    [form.userPw]
  );
  const isPwSame = useMemo(
    () =>
      form.userPw.length > 0 &&
      form.userPwConfirm.length > 0 &&
      form.userPw === form.userPwConfirm,
    [form.userPw, form.userPwConfirm]
  );
  const isPhoneValid = useMemo(
    () => PHONE_RE.test(form.phone.trim()),
    [form.phone]
  );
  const isBirthValid = useMemo(() => {
    if (!form.birthYear || !form.birthMonth || !form.birthDay) return true; // 선택 옵션
    const y = Number(form.birthYear);
    const m = Number(form.birthMonth);
    const d = Number(form.birthDay);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return false;
    if (y < 1900 || y > new Date().getFullYear()) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    return true;
  }, [form.birthYear, form.birthMonth, form.birthDay]);

  const isFormValid =
    form.userName.trim() &&
    isEmailValid &&
    isPwValid &&
    isPwSame &&
    isPhoneValid &&
    phoneVerified &&
    isBirthValid &&
    form.agreeTerms;

  // 공통 change 핸들러
  function handleChange(e) {
    const { name, value, checked } = e.target;

    if (name === "agreeTerms" || name === "agreeMarketing") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === "gender") {
      setForm((prev) => ({ ...prev, gender: value }));
      return;
    }

    if (name === "phoneCode") {
      setPhoneCode(value);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // 주소 찾기 (다음 우편번호)
  function handleAddressSearch() {
    // window.daum.Postcode 가 로딩되어 있어야 합니다.
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 스크립트가 준비되지 않았습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.roadAddress || data.jibunAddress || "";
        setForm((prev) => ({
          ...prev,
          zipcode: data.zonecode || "",
          addr1: addr,
        }));
      },
    }).open();
  }

  // 휴대폰 인증번호 요청
  async function handlePhoneRequest() {
    if (!isPhoneValid) {
      setMsg("휴대폰 번호 형식을 확인해주세요.");
      return;
    }

    try {
      setPhoneRequesting(true);
      setMsg("");

      await requestPhoneVerify({ phone: form.phone.trim() });
      setMsg("인증번호를 전송했습니다. 3분 이내에 입력해주세요.");
      setPhoneVerified(false);
    } catch (err) {
      setMsg(err?.message || "인증번호 전송 중 오류가 발생했습니다.");
      // eslint-disable-next-line no-console
      console.error("Phone Request Error:", err);
    } finally {
      setPhoneRequesting(false);
    }
  }

  // 휴대폰 인증번호 확인
  async function handlePhoneVerify() {
    if (!phoneCode.trim()) {
      setMsg("인증번호를 입력해주세요.");
      return;
    }

    try {
      setPhoneChecking(true);
      setMsg("");

      await confirmPhoneVerify({
        phone: form.phone.trim(),
        code: phoneCode.trim(),
      });

      setPhoneVerified(true);
      setMsg("휴대폰 인증이 완료되었습니다.");
    } catch (err) {
      setPhoneVerified(false);
      setMsg(err?.message || "인증번호가 올바르지 않습니다.");
      // eslint-disable-next-line no-console
      console.error("Phone Verify Error:", err);
    } finally {
      setPhoneChecking(false);
    }
  }

  // 회원가입 요청
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    // 최소한의 전처리
    if (!form.userName.trim()) return setMsg("이름을 입력해주세요.");
    if (!isEmailValid) return setMsg("이메일 형식을 확인해주세요.");
    if (!isPwValid)
      return setMsg("비밀번호는 8~16자 이내로 입력해주세요.");
    if (!isPwSame) return setMsg("비밀번호가 서로 일치하지 않습니다.");
    if (!isPhoneValid) return setMsg("휴대폰 번호를 확인해주세요.");
    if (!phoneVerified) return setMsg("휴대폰 인증을 완료해주세요.");
    if (!isBirthValid) return setMsg("생년월일 정보를 다시 확인해주세요.");
    if (!form.agreeTerms)
      return setMsg("이용약관 및 개인정보처리방침에 동의해주세요.");

    try {
      setLoading(true);
      setMsg("");

      const payload = {
        userName: form.userName.trim(),
        userEmail: form.userEmail.trim(),
        userPw: form.userPw,
        userPwConfirm: form.userPwConfirm,
        phone: form.phone.trim(),
        birthYear: form.birthYear || null,
        birthMonth: form.birthMonth || null,
        birthDay: form.birthDay || null,
        gender: form.gender || null,
        zipcode: form.zipcode || null,
        addr1: form.addr1 || null,
        addr2: form.addr2 || null,
        agreeTerms: form.agreeTerms,
        agreeMarketing: form.agreeMarketing,
      };

      await signUp(payload);
      setMsg("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (err) {
      setMsg(err?.message || "회원가입 중 오류가 발생했습니다.");
      // eslint-disable-next-line no-console
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // 카카오로 가입하기
  function handleKakaoSignup() {
    const url = getKakaoLoginUrl("/"); // 가입 후 돌아올 경로
    window.location.href = url;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 160px)" }}
    >
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 720 }}>
        <div className="card-body p-4 p-md-5">
          {/* 상단 헤더 */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              type="button"
              className="btn btn-link p-0 small"
              onClick={() => navigate(-1)}
            >
              ← 홈으로 돌아가기
            </button>
          </div>

          <div className="text-center mb-4">
            <div className="mb-2 fw-semibold text-primary">Routy</div>
            <h2 className="h4 mb-2">이메일로 가입하기</h2>
            <p className="text-muted small mb-0">
              나만을 위한 맞춤형 뷰티 루틴을 시작해보세요.
            </p>
          </div>

          {/* 폼 시작 */}
          <form onSubmit={handleSubmit} noValidate>
            {/* 이름 */}
            <div className="mb-3">
              <label className="form-label fw-semibold">이름</label>
              <input
                name="userName"
                value={form.userName}
                onChange={handleChange}
                className="form-control"
                placeholder="홍길동"
                autoComplete="name"
                required
              />
            </div>

            {/* 이메일 */}
            <div className="mb-3">
              <label className="form-label fw-semibold">이메일</label>
              <input
                name="userEmail"
                value={form.userEmail}
                onChange={handleChange}
                type="email"
                className={
                  "form-control" +
                  (form.userEmail && !isEmailValid ? " is-invalid" : "")
                }
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
              {form.userEmail && !isEmailValid && (
                <div className="invalid-feedback">
                  유효한 이메일 주소를 입력해주세요.
                </div>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">비밀번호</label>
                <input
                  name="userPw"
                  value={form.userPw}
                  onChange={handleChange}
                  type="password"
                  className={
                    "form-control" +
                    (form.userPw && !isPwValid ? " is-invalid" : "")
                  }
                  placeholder="8~16자 영문/숫자 조합 권장"
                  autoComplete="new-password"
                  required
                />
                {form.userPw && !isPwValid && (
                  <div className="invalid-feedback">
                    비밀번호는 8~16자 이내로 입력해주세요.
                  </div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  비밀번호 확인
                </label>
                <input
                  name="userPwConfirm"
                  value={form.userPwConfirm}
                  onChange={handleChange}
                  type="password"
                  className={
                    "form-control" +
                    (form.userPwConfirm && !isPwSame ? " is-invalid" : "")
                  }
                  placeholder="비밀번호를 다시 입력해주세요."
                  autoComplete="new-password"
                  required
                />
                {form.userPwConfirm && !isPwSame && (
                  <div className="invalid-feedback">
                    비밀번호가 서로 일치하지 않습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 전화번호 + 인증 */}
            <div className="mb-3">
              <label className="form-label fw-semibold">전화번호</label>
              <div className="d-flex gap-2">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={
                    "form-control" +
                    (form.phone && !isPhoneValid ? " is-invalid" : "")
                  }
                  placeholder="010-1234-5678"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  disabled={phoneVerified}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handlePhoneRequest}
                  disabled={phoneRequesting || phoneVerified}
                >
                  {phoneVerified
                    ? "인증완료"
                    : phoneRequesting
                    ? "전송중..."
                    : "인증요청"}
                </button>
              </div>
              {form.phone && !isPhoneValid && (
                <div className="invalid-feedback d-block">
                  휴대폰 번호 형식을 확인해주세요.
                </div>
              )}
            </div>

            {/* 인증번호 입력 */}
            {!phoneVerified && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  인증번호 입력
                </label>
                <div className="d-flex gap-2">
                  <input
                    name="phoneCode"
                    value={phoneCode}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="인증번호 6자리"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handlePhoneVerify}
                    disabled={phoneChecking || !phoneCode.trim()}
                  >
                    {phoneChecking ? "확인중..." : "인증확인"}
                  </button>
                </div>
              </div>
            )}

            {/* 생년월일 (선택) */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                생년월일 (선택)
              </label>
              <div className="row g-2">
                <div className="col-4">
                  <input
                    name="birthYear"
                    value={form.birthYear}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="년(4자)"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-4">
                  <input
                    name="birthMonth"
                    value={form.birthMonth}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="월"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-4">
                  <input
                    name="birthDay"
                    value={form.birthDay}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="일"
                    inputMode="numeric"
                  />
                </div>
              </div>
              {!isBirthValid && (
                <div className="text-danger small mt-1">
                  생년월일 정보를 다시 확인해주세요.
                </div>
              )}
            </div>

            {/* 성별 (선택) */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                성별 (선택)
              </label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    id="gender-male"
                    type="radio"
                    name="gender"
                    value="male"
                    className="form-check-input"
                    checked={form.gender === "male"}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="gender-male"
                  >
                    남자
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="gender-female"
                    type="radio"
                    name="gender"
                    value="female"
                    className="form-check-input"
                    checked={form.gender === "female"}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="gender-female"
                  >
                    여자
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="gender-none"
                    type="radio"
                    name="gender"
                    value=""
                    className="form-check-input"
                    checked={form.gender === ""}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="gender-none"
                  >
                    선택 안함
                  </label>
                </div>
              </div>
            </div>

            {/* 주소 */}
            <div className="mb-3">
              <label className="form-label fw-semibold">배송 주소</label>
              <div className="d-flex gap-2 mb-2">
                <input
                  name="zipcode"
                  value={form.zipcode}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="우편번호"
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleAddressSearch}
                >
                  주소 찾기
                </button>
              </div>
              <input
                name="addr1"
                value={form.addr1}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder="기본 주소"
                readOnly
              />
              <input
                name="addr2"
                value={form.addr2}
                onChange={handleChange}
                className="form-control"
                placeholder="상세 주소를 입력해주세요"
              />
            </div>

            {/* 약관 동의 */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                약관 동의
              </label>

              <div className="border rounded p-3 mb-2 bg-light">
                <div className="form-check">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    name="agreeTerms"
                    className="form-check-input"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <label
                    className="form-check-label"
                    htmlFor="agreeTerms"
                  >
                    이용약관 및 개인정보처리방침에 동의합니다 (필수)
                  </label>
                </div>
              </div>

              <div className="border rounded p-3 mb-2 bg-light">
                <div className="form-check">
                  <input
                    id="agreeMarketing"
                    type="checkbox"
                    name="agreeMarketing"
                    className="form-check-input"
                    checked={form.agreeMarketing}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="agreeMarketing"
                  >
                    마케팅 정보 수신에 동의합니다 (선택)
                  </label>
                </div>
                <p className="text-muted small mb-0 mt-2">
                  이벤트, 쿠폰, 신제품 등의 정보를 받아보실 수 있어요.
                </p>
              </div>
            </div>

            {/* 가입 혜택 안내 */}
            <div className="mb-4 border rounded p-3 bg-light">
              <div className="fw-semibold mb-2">
                회원가입 시 제공되는 혜택:
              </div>
              <ul className="mb-0 text-muted small">
                <li>맞춤형 뷰티 제품 추천</li>
                <li>피부 타입별 루틴 관리</li>
                <li>리뷰 작성 시 포인트 적립</li>
                <li>신제품 출시 알림 및 첫 구매 할인</li>
              </ul>
            </div>

            {/* 가입 버튼 */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mb-3"
              disabled={loading || !isFormValid}
            >
              {loading ? "처리 중..." : "가입하기"}
            </button>
          </form>

          {/* 상태 메시지 */}
          {msg && (
            <p
              className="mt-2 text-center text-muted small"
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

          {/* 카카오로 가입하기 */}
          <button
            type="button"
            className="btn w-100 py-2"
            style={{
              backgroundColor: "#FEE500",
              borderColor: "#FEE500",
              fontWeight: 500,
            }}
            onClick={handleKakaoSignup}
          >
            카카오로 가입하기
          </button>

          {/* 이미 계정이 있나요 */}
          <p className="mt-4 text-center text-muted small mb-0">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={() => navigate("/login")}
            >
              로그인하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
