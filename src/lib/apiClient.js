import axios from "axios";

// API 기본 설정
const apiBaseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
});

// --------------------------
// 토큰 꺼내오기
// --------------------------
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

// --------------------------
// 요청 인터셉터
// --------------------------
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------------
// 응답 인터셉터
// --------------------------
api.interceptors.response.use(
  (res) => {
    const body = res.data;

    // 백엔드에서 { resultCode, resultMsg, data } 형태로 줄 때 처리
    if (body && typeof body === "object" && "resultCode" in body) {
      if (body.resultCode === 200) return body;

      const err = new Error(body.resultMsg || "요청 오류");
      err.body = body;
      throw err;
    }

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

// -------------------------
// 인증 관련 API
// -------------------------

// 로그인
// payload: { userEmail, userPw, asAdmin(false 기본) }
export const login = (payload) =>
  api.post("/api/auth/login", payload);

// 회원가입
export const signUp = (payload) =>
  api.post("/api/auth/signup", payload);

// 휴대폰 인증번호 요청
export const requestPhoneVerify = (payload) =>
  api.post("/api/auth/phone/request", payload);

// 휴대폰 인증번호 확인
export const confirmPhoneVerify = (payload) =>
  api.post("/api/auth/phone/verify", payload);

// -------------------------
// 카카오 로그인 URL (단순 문자열)
// -------------------------
export function getKakaoUrl() {
  const base = apiBaseURL.replace(/\/+$/, ""); // 끝 / 제거
  // 백엔드의 /auth/kakao/login 으로 보내면, 거기서 카카오로 redirect 해줌
  return `${base}/auth/kakao/login`;
}

export default api;
