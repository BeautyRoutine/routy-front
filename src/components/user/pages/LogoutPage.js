// -----------------------------------------------------------------------------
// LogoutPage.js - 로그아웃 페이지(진입 즉시 처리)
// - 토큰/회원정보(localStorage & sessionStorage) 제거 후 홈으로 이동합니다.
// - API 로그아웃 엔드포인트가 있으면 이후 버전에서 연동 가능 (지금은 클라이언트 정리만 합니다.) 
// -----------------------------------------------------------------------------

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const h = React.createElement;

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // 클라이언트 상태 정리합니다. 
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("member");
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("member");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Logout storage clear error:", e);
    }

    // UX: 메시지 잠깐 노출 후 홈 이동합니다. 
    const t = setTimeout(() => navigate("/", { replace: true }), 400);
    return () => clearTimeout(t);
  }, [navigate]);

  return h(
    "div",
    { className: "container", style: { maxWidth: 420, textAlign: "center", marginTop: 80 } },
    h("h2", { className: "mb-3" }, "로그아웃 중..."),
    h("p", { className: "text-muted" }, "잠시 후 홈으로 이동합니다.")
  );
}
