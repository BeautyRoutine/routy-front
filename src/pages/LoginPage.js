// -----------------------------------------------------------------------------
// LoginPage.js - 로그인 페이지 컴포넌트입니다. 
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../lib/apiClient"; // 💡 경로만 현재 구조에 맞게 수정

const h = React.createElement;

// 이메일 최소 포맷 검증
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ onSuccess }) {
  const [form, setForm] = useState({ userEmail: "", userPw: "" });
  const [rememberMe, setRememberMe] = useState(true);
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

  function onChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setRememberMe(checked);
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!form.userEmail.trim()) return setMsg("이메일을 입력해주세요.");
    if (!form.userPw) return setMsg("비밀번호를 입력해주세요.");
    if (!isEmailValid) return setMsg("이메일 형식을 확인해주세요.");
    if (!isPwValid) return setMsg("비밀번호는 8자 이상이어야 합니다.");

    try {
      setLoading(true);
      setMsg("");

      // apiClient 기준: 성공 시 { resultCode, resultMsg, data } 반환
      const resp = await login({
        userEmail: form.userEmail.trim(),
        userPw: form.userPw,
      });

      const body = resp;
      const token = body?.data?.token;
      const member = body?.data?.member || null;

      if (token) {
        const storage = rememberMe ? window.localStorage : window.sessionStorage;

        // auth 객체 저장
        const authObj = { token, member };
        storage.setItem("auth", JSON.stringify(authObj));

        // 하위 호환: token / member 개별 저장
        storage.setItem("token", token);
        if (member) storage.setItem("member", JSON.stringify(member));
      }

      setMsg("로그인에 성공했습니다.");
      try {
        onSuccess?.(member);
      } catch (_) {}

      // redirect 우선, 없으면 뒤로가기 -> 홈
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else {
        try {
          navigate(-1);
        } catch {
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      setMsg(err?.message || "로그인 중 오류가 발생했습니다.");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return h(
    "div",
    { className: "container", style: { maxWidth: 420 } },
    h("h2", { className: "my-4" }, "로그인"),
    h(
      "form",
      { onSubmit, noValidate: true },
      // 이메일
      h(
        "div",
        { className: "mb-3" },
        h(
          "label",
          { htmlFor: "email", className: "form-label" },
          "이메일(ID)"
        ),
        h("input", {
          id: "email",
          name: "userEmail",
          value: form.userEmail,
          onChange,
          className:
            "form-control " +
            (form.userEmail && !isEmailValid ? "is-invalid" : ""),
          type: "email",
          inputMode: "email",
          autoComplete: "email",
          placeholder: "example@routy.com",
          required: true,
        }),
        form.userEmail &&
          !isEmailValid &&
          h(
            "div",
            { className: "invalid-feedback" },
            "유효한 이메일 주소를 입력하세요."
          )
      ),
      // 비밀번호
      h(
        "div",
        { className: "mb-2" },
        h(
          "label",
          { htmlFor: "password", className: "form-label" },
          "비밀번호"
        ),
        h("input", {
          id: "password",
          name: "userPw",
          value: form.userPw,
          onChange,
          className:
            "form-control " +
            (form.userPw && !isPwValid ? "is-invalid" : ""),
          type: "password",
          autoComplete: "current-password",
          minLength: 8,
          placeholder: "8자 이상 권장",
          required: true,
        }),
        form.userPw &&
          !isPwValid &&
          h(
            "div",
            { className: "invalid-feedback" },
            "비밀번호는 8자 이상이어야 합니다."
          )
      ),
      // 옵션/링크
      h(
        "div",
        {
          className:
            "d-flex align-items-center justify-content-between mb-3",
        },
        h(
          "div",
          { className: "form-check" },
          h("input", {
            id: "rememberMe",
            className: "form-check-input",
            type: "checkbox",
            name: "rememberMe",
            checked: rememberMe,
            onChange,
          }),
          h(
            "label",
            { className: "form-check-label", htmlFor: "rememberMe" },
            "로그인 유지"
          )
        ),
        h(
          "div",
          { className: "d-flex gap-3" },
          h(
            "button",
            {
              type: "button",
              className: "btn btn-link p-0",
              onClick: () => navigate("/signup"),
            },
            "회원가입"
          ),
          h(
            "button",
            {
              type: "button",
              className: "btn btn-link p-0",
              onClick: () => navigate("/password/reset"),
            },
            "비밀번호 찾기"
          )
        )
      ),
      // 제출
      h(
        "button",
        {
          className: "btn btn-primary w-100",
          type: "submit",
          disabled: loading || !isFormValid,
        },
        loading ? "처리 중..." : "로그인"
      )
    ),
    // 상태 메시지
    msg &&
      h(
        "p",
        {
          className: "mt-3 text-center text-muted",
          "aria-live": "polite",
        },
        msg
      ),
    // SNS 로그인 (라우팅만 연결 – 실제 OAuth는 이후 연동)
    h("hr", { className: "my-4" }),
    h(
      "div",
      { className: "d-grid gap-2" },
      h(
        "button",
        {
          className: "btn btn-outline-secondary",
          type: "button",
          onClick: () =>
            navigate("/oauth/kakao?redirect=" + (redirectTo || "/")),
        },
        "카카오로 계속하기"
      ),
      h(
        "button",
        {
          className: "btn btn-outline-secondary",
          type: "button",
          onClick: () =>
            navigate("/oauth/google?redirect=" + (redirectTo || "/")),
        },
        "구글로 계속하기"
      ),
      h(
        "button",
        {
          className: "btn btn-outline-secondary",
          type: "button",
          onClick: () =>
            navigate("/oauth/naver?redirect=" + (redirectTo || "/")),
        },
        "네이버로 계속하기"
      )
    )
  );
}
