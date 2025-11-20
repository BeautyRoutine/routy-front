// -----------------------------------------------------------------------------
// SignupPage.js -회원가입 페이지 (주소 찾기 기능 포함)
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../lib/apiClient";

const h = React.createElement;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage({ onSuccess }) {
  const [form, setForm] = useState({
    userNick: "",
    userEmail: "",
    userPw: "",
    userPwConfirm: "",
    phone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    zipCode: "",
    addr1: "",
    addr2: "",
    agreeTerms: false,
    agreeMarketing: false,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // 기본 유효성
  const isNickValid = useMemo(
    () => /^[가-힣a-zA-Z0-9]{2,20}$/.test(form.userNick.trim()),
    [form.userNick]
  );
  const isEmailValid = useMemo(() => EMAIL_RE.test(form.userEmail.trim()), [form.userEmail]);
  const isPwValid = useMemo(() => /^(?=.{8,16}$).*/.test(form.userPw), [form.userPw]);
  const isPwConfirmValid = useMemo(
    () => !!form.userPw && form.userPw === form.userPwConfirm,
    [form.userPw, form.userPwConfirm]
  );

  const isFormValid =
    isNickValid && isEmailValid && isPwValid && isPwConfirmValid && form.agreeTerms;

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function goBack() {
    navigate(-1);
  }

  // 카카오 주소찾기
  function handleFindAddress() {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

        setForm((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          addr1: addr,
        }));
      },
    }).open();
  }

  function handleKakaoSignup() {
    navigate("/oauth/kakao?redirect=/");
  }

  function handlePhoneVerify() {
    alert("휴대폰 인증 기능은 추후 연동 예정입니다.");
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return setMsg("입력하신 내용을 다시 확인해주세요.");

    try {
      setLoading(true);
      setMsg("");

      const payload = {
        userEmail: form.userEmail,
        userNick: form.userNick,
        userPw: form.userPw,
      };

      const { data, resultCode, resultMsg } = await signUp(payload);

      if (resultCode === 200) {
        setMsg("회원가입이 완료되었습니다.");
        try {
          onSuccess?.(data?.member);
        } catch {}
        setTimeout(() => navigate("/login"), 700);
      } else {
        setMsg(resultMsg || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setMsg(err?.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    fontSize: 14,
    height: 44,
  };

  return h(
    "div",
    { className: "bg-light", style: { minHeight: "100vh", padding: "40px 16px" } },

    h(
      "div",
      {
        className: "bg-white shadow-sm rounded-4 mx-auto",
        style: { maxWidth: 640, padding: "32px 28px" },
      },

      // 뒤로가기
      h(
        "button",
        { type: "button", onClick: goBack, className: "btn btn-link px-0 mb-3 text-muted", style: { fontSize: 14 } },
        "← 돌아가기"
      ),

      // 타이틀
      h(
        "div",
        { className: "text-center mb-4" },
        h("h2", { className: "fw-semibold mb-1", style: { fontSize: 22 } }, "회원가입"),
        h("p", { className: "text-muted", style: { fontSize: 14 } }, "맞춤형 뷰티 루틴을 시작해 보세요.")
      ),

      // 카카오 가입
      h(
        "button",
        {
          type: "button",
          className: "btn w-100 mb-4",
          onClick: handleKakaoSignup,
          style: {
            backgroundColor: "#FEE500",
            borderColor: "#FEE500",
            borderRadius: "999px",
            height: 44,
            fontWeight: 600,
            fontSize: 14,
          },
        },
        "카카오로 가입하기"
      ),

      h(
        "div",
        { className: "d-flex align-items-center text-muted mb-4", style: { fontSize: 12 } },
        h("div", { className: "flex-grow-1 border-top" }),
        h("span", { className: "px-2" }, "이메일로 가입하기"),
        h("div", { className: "flex-grow-1 border-top" })
      ),

      // 이메일 폼
      h(
        "form",
        { onSubmit },

        // 이름
        h("label", { className: "form-label fw-semibold", style: { fontSize: 14.5 } }, "이름"),
        h("input", {
          className: "form-control mb-3",
          name: "userNick",
          value: form.userNick,
          onChange,
          placeholder: "홍길동",
          style: inputStyle,
        }),

        // 이메일
        h("label", { className: "form-label fw-semibold", style: { fontSize: 14.5 } }, "이메일"),
        h("input", {
          className: "form-control mb-3",
          type: "email",
          name: "userEmail",
          value: form.userEmail,
          onChange,
          placeholder: "your@email.com",
          style: inputStyle,
        }),

        // 비밀번호
        h("label", { className: "form-label fw-semibold", style: { fontSize: 14.5 } }, "비밀번호"),
        h("input", {
          className: "form-control mb-3",
          type: "password",
          name: "userPw",
          value: form.userPw,
          onChange,
          placeholder: "8~16자 입력",
          style: inputStyle,
        }),

        // 비밀번호 확인
        h("label", { className: "form-label fw-semibold", style: { fontSize: 14.5 } }, "비밀번호 확인"),
        h("input", {
          className: "form-control mb-4",
          type: "password",
          name: "userPwConfirm",
          value: form.userPwConfirm,
          onChange,
          placeholder: "비밀번호 재입력",
          style: inputStyle,
        }),

        // 주소
        h("label", { className: "form-label fw-semibold", style: { fontSize: 14.5 } }, "주소"),
        h(
          "div",
          { className: "d-flex gap-2 mb-2" },
          h("input", {
            className: "form-control",
            name: "zipCode",
            value: form.zipCode,
            onChange,
            placeholder: "우편번호",
            style: inputStyle,
          }),
          h(
            "button",
            {
              className: "btn btn-outline-secondary",
              type: "button",
              onClick: handleFindAddress,
              style: { fontSize: 13, padding: "0 12px" },
            },
            "주소 찾기"
          )
        ),
        h("input", {
          className: "form-control mb-2",
          name: "addr1",
          value: form.addr1,
          onChange,
          placeholder: "기본 주소",
          style: inputStyle,
        }),
        h("input", {
          className: "form-control mb-4",
          name: "addr2",
          value: form.addr2,
          onChange,
          placeholder: "상세 주소",
          style: inputStyle,
        }),

        // 약관
        h(
          "div",
          { className: "mb-4" },
          h(
            "label",
            { className: "form-check mb-2", style: { fontSize: 14 } },
            h("input", {
              type: "checkbox",
              className: "form-check-input",
              name: "agreeTerms",
              checked: form.agreeTerms,
              onChange,
            }),
            h("span", { className: "ms-2" }, "이용약관 및 개인정보처리방침 동의 (필수)")
          ),
          h(
            "label",
            { className: "form-check", style: { fontSize: 14 } },
            h("input", {
              type: "checkbox",
              className: "form-check-input",
              name: "agreeMarketing",
              checked: form.agreeMarketing,
              onChange,
            }),
            h("span", { className: "ms-2" }, "마케팅 정보 수신 동의 (선택)")
          )
        ),

        msg &&
          h("p", { className: "text-center small mb-2 text-danger" }, msg),

        h(
          "button",
          {
            type: "submit",
            className: "btn btn-primary w-100 mb-3",
            disabled: loading || !isFormValid,
            style: { fontSize: 15, height: 46 },
          },
          loading ? "처리 중..." : "가입하기"
        ),

        h(
          "p",
          { className: "text-center text-muted mb-0", style: { fontSize: 14 } },
          "이미 계정이 있으신가요? ",
          h(
            "button",
            { type: "button", onClick: () => navigate("/login"), className: "btn btn-link p-0", style: { fontSize: 14 } },
            "로그인하기"
          )
        )
      )
    )
  );
}
