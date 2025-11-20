// -----------------------------------------------------------------------------
// 공통 API 클라이언트 모듈
// -----------------------------------------------------------------------------

import axios from "axios";

// 기본 axios 인스턴스
// REACT_APP_API_BASE_URL 사용, 없으면 로컬 서버로 요청합니다.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
});

// 토큰 읽기
// - localStorage / sessionStorage 에 저장된 auth 객체 또는 token 문자열에서 토큰을 꺼냅니다.
function getToken() {
  try {
    const auth =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");

    if (auth) {
      const parsed = JSON.parse(auth);
      if (parsed?.token) return parsed.token;
    }

    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      null
    );
  } catch {
    return null;
  }
}

// 요청 인터셉터
// - 매 요청마다 Authorization 헤더에 Bearer 토큰을 붙입니다.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
// - 백엔드 공통 응답 규격 { resultCode, resultMsg, data } 기준으로 처리합니다.
// - resultCode === 200 이면 그대로 body 반환, 아니면 Error 로 던집니다.
// - 그 외 형식이면 axios 기본 응답(res)을 그대로 돌려줍니다.
api.interceptors.response.use(
  (res) => {
    const body = res.data;

    // 공통 응답 포맷인 경우
    if (body && typeof body === "object" && "resultCode" in body) {
      if (body.resultCode === 200) return body;

      const err = new Error(body.resultMsg || "요청 오류");
      err.body = body;
      throw err;
    }

    // 공통 포맷이 아닌 경우에는 원래 axios 응답을 그대로 사용
    return res;
  },
  (err) => {
    const msg =
      err?.response?.data?.resultMsg ||
      err?.response?.data?.message ||
      err.message ||
      "네트워크 오류";

    const wrapped = new Error(msg);
    wrapped.original = err;
    return Promise.reject(wrapped);
  }
);

// -----------------------------------------------------------------------------
// 인증 관련 API
// -----------------------------------------------------------------------------

// 로그인
// payload 예시: { userEmail, userPw }
export const login = (payload) =>
  api.post("/api/auth/login", payload);

// 회원가입
// payload 예시: { userEmail, userPw, userNick, ... }
export const signUp = (payload) =>
  api.post("/api/auth/signup", payload);

export default api;
