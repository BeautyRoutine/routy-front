// -----------------------------------------------------------------------------
// SignupPage.js - 회원가입 페이지
// - 이메일 / 닉네임 / 비밀번호만 우선 사용
// - 기본 유효성: 이메일 형식, 닉네임(2~12자 한/영/숫자), 비밀번호(8~16자)
// - 성공 시 /login 으로 이동
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../lib/apiClient";

const h = React.createElement;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage({ onSuccess }) {
  const [form, setForm] = useState({
    userEmail: "",
    userNick: "",
    userPw: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const isEmailValid = useMemo(
    () => EMAIL_RE.test(form.userEmail.trim()),
    [form.userEmail]
  );
  const isNickValid = useMemo(
    () => /^[가-힣a-zA-Z0-9]{2,12}$/.test(form.userNick.trim()),
    [form.userNick]
  );
  const isPwValid = useMemo(
    () => /^(?=.{8,16}$).*/.test(form.userPw),
    [form.userPw]
  );
  const isFormValid = isEmailValid && isNickValid && isPwValid;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!form.userEmail.trim()) return setMsg("이메일을 입력해주세요.");
    if (!isEmailValid) return setMsg("이메일 형식을 확인해주세요.");
    if (!isNickValid)
      return setMsg("닉네임은 2~12자의 한글/영문/숫자만 가능합니다.");
    if (!isPwValid)
      return setMsg("비밀번호는 8~16자 이내로 입력해주세요.");

    try {
      setLoading(true);
      setMsg("");

      const body = await signUp(form); // { resultCode, resultMsg, data }
      if (body.resultCode === 200) {
        setMsg("회원가입이 완료되었습니다.");
        try {
          onSuccess?.(body?.data?.member);
        } catch {
          // 콜백 에러는 무시합니다. 
        }
        setTimeout(() => navigate("/login"), 600);
      } else {
        setMsg(body.resultMsg || "회원가입 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      const serverMsg =
        error?.body?.resultMsg ||
        error?.message ||
        "회원가입에 실패했습니다. 다시 시도해주세요.";
      setMsg(serverMsg);
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return h(
    "div",
    { className: "container", style: { maxWidth: 420 } },
    h("h2", { className: "my-4" }, "회원가입"),
    h(
      "form",
      { onSubmit, noValidate: true },
      // 이메일
      h(
        "div",
        { className: "mb-3" },
        h("label", { className: "form-label" }, "이메일"),
        h("input", {
          name: "userEmail",
          value: form.userEmail,
          onChange,
          className:
            "form-control " +
            (form.userEmail && !isEmailValid ? "is-invalid" : ""),
          type: "email",
          placeholder: "example@routy.com",
          autoComplete: "email",
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
      // 닉네임
      h(
        "div",
        { className: "mb-3" },
        h("label", { className: "form-label" }, "닉네임"),
        h("input", {
          name: "userNick",
          value: form.userNick,
          onChange,
          className:
            "form-control " +
            (form.userNick && !isNickValid ? "is-invalid" : ""),
          placeholder: "2~12자 (한글/영문/숫자)",
          autoComplete: "nickname",
          required: true,
        }),
        form.userNick &&
          !isNickValid &&
          h(
            "div",
            { className: "invalid-feedback" },
            "닉네임은 2~12자의 한글/영문/숫자만 가능합니다."
          )
      ),
      // 비밀번호
      h(
        "div",
        { className: "mb-4" },
        h("label", { className: "form-label" }, "비밀번호"),
        h("input", {
          name: "userPw",
          value: form.userPw,
          onChange,
          className:
            "form-control " +
            (form.userPw && !isPwValid ? "is-invalid" : ""),
          type: "password",
          placeholder: "8~16자 권장",
          autoComplete: "new-password",
          required: true,
        }),
        form.userPw &&
          !isPwValid &&
          h(
            "div",
            { className: "invalid-feedback" },
            "비밀번호는 8~16자를 권장합니다."
          )
      ),
      // 제출 버튼
      h(
        "button",
        {
          className: "btn btn-primary w-100",
          type: "submit",
          disabled: loading || !isFormValid,
        },
        loading ? "처리 중..." : "회원가입"
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
      )
  );
}
