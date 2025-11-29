// -----------------------------------------------------------------------------
// LogoutPage.js - 로그아웃 페이지 (Redux 연동 버전)
// - 진입 즉시 Redux logout 액션 + 토큰 제거 후 홈으로 이동
// -----------------------------------------------------------------------------

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";

export default function LogoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      // Redux logout 액션 호출 (localStorage.removeItem('token') 포함)
      dispatch(logout());
      
      // 혹시 남아있을 수 있는 다른 데이터도 정리
      ["member"].forEach((key) => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      });
    } catch (e) {
      console.error("Logout error:", e);
    }

    // 브라우저 뒤로가기 방지 (캐시된 페이지 방지)
    window.history.replaceState({}, "");

    // 홈으로 이동
    const t = setTimeout(() => navigate("/", { replace: true }), 300);

    return () => clearTimeout(t);
  }, [navigate, dispatch]);

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