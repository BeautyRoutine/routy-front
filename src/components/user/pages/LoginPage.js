// -----------------------------------------------------------------------------
// -apiClient 인터셉터 반영했습니다.
// - 응답 규격: { resultCode, resultMsg, resultTime, data: { token, member } }
// - apiClient 인터셉터: 성공 시 data 그대로 반환, 실패 시 Error(resultMsg) throw
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "lib/apiClient";

const EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^.\s@]+\.)+[^.\s@]{2,})$/i;

const h = React.createElement;

export default function LoginPage({ onSuccess }) {
  const [form, setForm] = useState({ userEmail: "", userPw: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect");

  const isEmailValid = useMemo(() => EMAIL_RE.test(form.userEmail.trim()), [form.userEmail]);
  const isPwValid = useMemo(() => (form.userPw || "").length >= 8, [form.userPw]);
  const isFormValid = isEmailValid && isPwValid;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "rememberMe" && type === "checkbox") {
      setRememberMe(checked);
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.userEmail.trim()) return setMsg("ID를 입력해주세요.");
    if (!form.userPw) return setMsg("비밀번호를 입력해주세요.");
    if (!isEmailValid) return setMsg("이메일 형식을 확인해주세요.");
    if (!isPwValid) return setMsg("비밀번호는 8자 이상이어야 합니다.");

    try {
      setLoading(true);
      setMsg("");

      // ✅ apiClient 인터셉터 기준: 성공 시 resp = { resultCode, resultMsg, data: {...} }
      const resp = await login({ userEmail: form.userEmail.trim(), userPw: form.userPw });

      const token = resp?.data?.token;
      const member = resp?.data?.member || null;

      if (token) {
        const storage = rememberMe ? window.localStorage : window.sessionStorage;
        storage.setItem("token", token);
        if (member) storage.setItem("member", JSON.stringify(member));
      }

      setMsg("로그인에 성공했습니다.");
      onSuccess?.(member);

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else {
        // 히스토리가 없을 수 있으니 홈으로 폴백
        try {
          navigate(-1);
        } catch {
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      // 인터셉터가 서버 resultMsg로 Error를 던져줌
      setMsg(err?.message || "로그인 중 오류가 발생했습니다.");
      // eslint-disable-next-line no-console
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

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
        h("label", { htmlFor: "email", className: "form-label" }, "이메일(ID)"),
        h("input", {
          id: "email",
          className:
            "form-control " + (form.userEmail && !isEmailValid ? "is-invalid" : ""),
          name: "userEmail",
          value: form.userEmail,
          onChange,
          type: "email",
          inputMode: "email",
          autoComplete: "email",
          required: true,
          placeholder: "example@routy.com",
        }),
        form.userEmail &&
          !isEmailValid &&
          h("div", { className: "invalid-feedback" }, "유효한 이메일 주소를 입력하세요.")
      ),
      // 비밀번호
      h(
        "div",
        { className: "mb-2" },
        h("label", { htmlFor: "password", className: "form-label" }, "비밀번호"),
        h("input", {
          id: "password",
          className: "form-control " + (form.userPw && !isPwValid ? "is-invalid" : ""),
          name: "userPw",
          value: form.userPw,
          onChange,
          type: "password",
          autoComplete: "current-password",
          minLength: 8,
          required: true,
          placeholder: "8자 이상, 영문/숫자/특수문자 조합 권장",
        }),
        form.userPw &&
          !isPwValid &&
          h("div", { className: "invalid-feedback" }, "비밀번호는 8자 이상이어야 합니다.")
      ),
      // 옵션/링크
      h(
        "div",
        { className: "d-flex align-items-center justify-content-between mb-3" },
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
          h("label", { className: "form-check-label", htmlFor: "rememberMe" }, "로그인 유지")
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
        { className: "mt-3 text-center text-muted", "aria-live": "polite" },
        msg
      ),
    // SNS 로그인 (라우팅만 연결)
    h("hr", { className: "my-4" }),
    h(
      "div",
      { className: "d-grid gap-2" },
      h(
        "button",
        {
          className: "btn btn-outline-secondary",
          type: "button",
          onClick: () => navigate("/oauth/kakao?redirect=" + (redirectTo || "/")),
        },
        "카카오로 계속하기"
      ),
      h(
        "button",
        {
          className: "btn btn-outline-secondary",
          type: "button",
          onClick: () => navigate("/oauth/google?redirect=" + (redirectTo || "/")),
        },
        "구글로 계속하기"
      ),
      h(
        "button",
        {
          className: "btn btn-outline-secondary",
          type: "button",
          onClick: () => navigate("/oauth/naver?redirect=" + (redirectTo || "/")),
        },
        "네이버로 계속하기"
      )
    )
  );
}
