import axios from "axios";

// ================================
// Axios 인스턴스 생성
// ================================
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  timeout: 10000,
});

// ================================
// Refresh Token 재발급 요청 함수
// ================================
async function requestTokenRefresh() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");

    if (!refreshToken || !userId) {
      throw new Error("No refresh token");
    }

    const res = await api.post("/api/auth/refresh", {
      refreshToken,
      userId,
    });

    return res.data; // { accessToken, refreshToken }
  } catch (e) {
    throw e;
  }
}

// ================================
// 요청 인터셉터 (accessToken 자동 포함)
// ================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// 응답 인터셉터 (401 → refresh 또는 로그아웃)
// ================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // access token 만료 → refresh 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken, refreshToken } = await requestTokenRefresh();

        // 저장
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Authorization 업데이트 후 재요청
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (e) {
        // 재발급 실패 → 강제 로그아웃
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    // 기타 에러
    const message =
      error.response?.data?.message ||
      error.response?.data?.resultMsg ||
      error.message ||
      "알 수 없는 오류가 발생했습니다.";

    return Promise.reject(new Error(message));
  }
);

// ================================
// AUTH 관련 API
// ================================

// 로그인
export const login = (payload) =>
  api.post("/api/auth/login", payload).then((res) => res.data);

// 회원가입
export const signUp = (payload) =>
  api.post("/api/auth/signup", payload).then((res) => res.data);

// ================================
// 휴대폰 인증
// ================================
export const requestPhoneVerify = (payload) =>
  api.post("/api/auth/phone/request", payload).then((res) => res.data);

export const confirmPhoneVerify = (payload) =>
  api.post("/api/auth/phone/confirm", payload).then((res) => res.data);

// ================================
// 성분 검색 (IngredientAddModal.js 용)
// ================================
export const searchIngredients = (params) => {
  const { page = 1, size = 10, keyword = "" } = params || {};

  return api.get("/api/admin/ingredients", {
    params: {
      page,
      page_gap: size,
      ing_name: keyword,
    },
  });
};

// ================================
// 상품 검색
// ================================
export const searchProducts = (keyword) =>
  api.get("/api/search", { params: { keyword } });

// ================================
export default api;
