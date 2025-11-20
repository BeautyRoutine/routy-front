// -----------------------------------------------------------------------------
// LogoutPage.js - 로그아웃 처리 페이지
// - 진입 즉시 토큰/회원정보 삭제 후 홈으로 이동
// -----------------------------------------------------------------------------

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const h = React.createElement;

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // auth 객체 및 token/member 개별 키 모두 제거
      window.localStorage.removeItem("auth");
      window.sessionStorage.removeItem("auth");

      window.localStorage.removeItem("token");
      window.localStorage.removeItem("member");
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("member");
    } catch (e) {
      console.error("Logout storage clear error:", e);
    }

    const t = setTimeout(() => {
      navigate("/", { replace: true });
    }, 400);

    return () => clearTimeout(t);
  }, [navigate]);

  return h(
    "div",
    {
      className: "container",
      style: { maxWidth: 420, textAlign: "center", marginTop: 80 },
    },
    h("h2", { className: "mb-3" }, "로그아웃 중입니다."),
    h(
      "p",
      { className: "text-muted" },
      "잠시 후 메인 페이지로 이동합니다."
    )
  );
}
