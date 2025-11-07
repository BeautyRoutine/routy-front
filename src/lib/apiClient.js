/**
 * 공용 API 통신 모듈 (axios 기반)
 * - 회원가입(signUp)
 * - 로그인(login)
 * - 기본 baseURL은 .env 설정값을 사용합니다. (없을 경우 localhost:8080)
 */

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  withCredentials: false, // CORS 쿠키 미사용!!
});

/** 회원가입 API 호출합니다. */
export const signUp = (payload) => api.post("/member/signup", payload);

/** 로그인 API 호출합니다. */
export const login  = (payload) => api.post("/member/login", payload);

export default api;
