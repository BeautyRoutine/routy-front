// 추후 수정 예정입니다.
import axios from "axios";

// ------------------------
// axios 인스턴스
// ------------------------
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "/",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: 15000,
});

// ------------------------
// 토큰 세팅/해제 유틸
// ------------------------
export function setAuth(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
export function clearAuth() {
  delete api.defaults.headers.common.Authorization;
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("member");
  } catch (_) {}
}

// 시작 시 저장소에 토큰이 있으면 자동 세팅
(() => {
  try {
    const t = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (t) setAuth(t);
  } catch (_) {}
})();

// ------------------------
// 인터셉터 (공통 응답 규격 정규화)
// - 성공: data 자체를 반환
// - 실패: 서버 resultMsg 우선으로 Error 던짐
// ------------------------
api.interceptors.response.use(
  (res) => {
    const data = res?.data;
    // 공통 성공 규격: resultCode === 200
    if (data && typeof data === "object" && "resultCode" in data) {
      if (data.resultCode === 200) return data; // 페이지에서 바로 data.data 접근 가능
      // 200이 아닌데도 HTTP 200으로 온 경우 -> 에러로 던짐
      const err = new Error(data.resultMsg || "REQUEST_FAILED");
      err.response = { status: res.status, data };
      throw err;
    }
    // 비표준 응답이면 원본 유지
    return res;
  },
  (err) => {
    const code = err?.response?.status;
    const msg =
      err?.response?.data?.resultMsg ||
      err?.response?.data?.message ||
      err?.message ||
      "REQUEST_FAILED";

    // 인증 만료/실패 시 선택적으로 초기화
    if (code === 401) {
      // clearAuth(); // 필요 시 주석 해제
    }

    const wrapped = new Error(msg);
    wrapped.response = err?.response;
    throw wrapped;
  }
);

// ------------------------
// 4) API 함수 (로그인/회원가입 우선)
// ------------------------
export function login(body) {
  // body: { userEmail, userPw }
  return api.post("/member/login", body);
}
export function signUp(body) {
  // body: { userEmail, userNick, userPw }
  return api.post("/member/signup", body);
}

// 선택: 마이프로필 / 비번재설정 (페이지에서 필요하면 사용)
export function getMyProfile() {
  return api.get("/member/me");
}
export function requestPwReset(email) {
  return api.post("/member/password/reset", { email });
}

// 선택: 상품 조회 (지금은 프론트 인증만 다루니 유지만)
export function fetchProducts(params) {
  return api.get("/api/products", { params }); // {page,limit,q,sort...}
}
export function fetchProductDetail(prdNo) {
  return api.get(`/api/products/${prdNo}`);
}

export default api;
