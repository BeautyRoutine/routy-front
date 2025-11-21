// -----------------------------------------------------------------------------
// LogoutPage.js - 로그아웃 페이지
// - 진입 즉시 토큰/회원정보(localStorage & sessionStorage) 제거 후 홈으로 이동
// -----------------------------------------------------------------------------

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("member");
      window.localStorage.removeItem("auth");
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("member");
      window.sessionStorage.removeItem("auth");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Logout storage clear error:", e);
    }

    const t = setTimeout(() => navigate("/", { replace: true }), 400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      className="container"
      style={{ maxWidth: 420, textAlign: "center", marginTop: 80 }}
    >
      <h2 className="mb-3">로그아웃 중...</h2>
      <p className="text-muted">잠시 후 홈으로 이동합니다.</p>
    </div>
  );
}
