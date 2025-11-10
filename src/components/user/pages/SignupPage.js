// -----------------------------------------------------------------------------
// SignupPage.js - 회원가입 페이지 컴포넌트
// 추후 계속 수정예정입니다.! 
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "lib/apiClient";

const EMAIL_RE =
  /^(([^<()>[\]\\.,;:\s@"]+(\.[^<()>[\]\\.,;:\s@"]+)*)|(".+"))@(([^.\s@]+\.)+[^.\s@]{2,})$/i;

const h = React.createElement;

export default function SignupPage({ onSuccess }) {
  const [form, setForm] = useState({ userEmail: "", userNick: "", userPw: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // 유효성
  const isEmailValid = useMemo(() => EMAIL_RE.test(form.userEmail.trim()), [form.userEmail]);
  const isNickValid = useMemo(
    () => /^[가-힣a-zA-Z0-9]{2,12}$/.test(form.userNick.trim()),
    [form.userNick]
  );
  const isPwValid = useMemo(
    () => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,16}$/.test(form.userPw),
    [form.userPw]
  );
  const isFormValid = isEmailValid && isNickValid && isPwValid;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.userEmail.trim()) return setMsg("이메일을 입력해주세요.");
    if (!isEmailValid) return setMsg("이메일 형식을 확인해주세요.");
    if (!isNickValid) return setMsg("닉네임은 2~12자의 한글/영문/숫자만 가능합니다.");
    if (!isPwValid)
      return setMsg("비밀번호는 8~16자, 영문·숫자·특수문자를 모두 포함해야 합니다.");

    try {
      setLoading(true);
      setMsg("");
      const { data } = await signUp(form);

      if (data?.resultCode === 200) {
        setMsg("회원가입이 완료되었습니다.");
        onSuccess?.();
        setTimeout(() => navigate("/login"), 800);
      } else {
        setMsg(data?.resultMsg || "회원가입 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      const code = error?.response?.status;
      const serverMsg =
        error?.response?.data?.resultMsg ||
        error?.response?.data?.message ||
        error?.message;
      const fallback =
        code === 409
          ? "이미 등록된 이메일입니다."
          : "회원가입에 실패했습니다. 다시 시도해주세요.";
      setMsg(serverMsg || fallback);
      // eslint-disable-next-line no-console
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };

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
            "form-control " + (form.userEmail && !isEmailValid ? "is-invalid" : ""),
          type: "email",
          placeholder: "example@routy.com",
          autoComplete: "email",
          required: true,
        }),
        form.userEmail &&
          !isEmailValid &&
          h("div", { className: "invalid-feedback" }, "유효한 이메일 주소를 입력하세요.")
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
            "form-control " + (form.userNick && !isNickValid ? "is-invalid" : ""),
          placeholder: "2~12자 (한글/영문/숫자)",
          autoComplete: "nickname",
          required: true,
        }),
        form.userNick &&
          !isNickValid &&
          h(
            "div",
            { className: "invalid-feedback" },
            "닉네임은 2~12자의 한글, 영문, 숫자만 가능합니다."
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
          className: "form-control " + (form.userPw && !isPwValid ? "is-invalid" : ""),
          type: "password",
          placeholder: "8~16자, 영문+숫자+특수문자 조합",
          autoComplete: "new-password",
          required: true,
        }),
        form.userPw &&
          !isPwValid &&
          h(
            "div",
            { className: "invalid-feedback" },
            "비밀번호는 8~16자, 영문·숫자·특수문자를 포함해야 합니다."
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
        loading ? "처리 중..." : "회원가입"
      )
    ),
    // 상태 메시지
    msg &&
      h(
        "p",
        { className: "mt-3 text-center text-muted", "aria-live": "polite" },
        msg
      )
  );
}
