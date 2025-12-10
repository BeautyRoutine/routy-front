import axios from 'axios';

/**
 * Axios 인스턴스 생성
 * - baseURL: Spring Boot 서버 주소
 * - withCredentials: 쿠키 전송 허용
 */
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  timeout: 10000, // 10초 타임아웃
});

/**
 * 요청 인터셉터
 * - JWT 토큰을 자동으로 헤더에 추가
 */
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터
 * - 401 에러 시 로그인 페이지로 리다이렉트
 * - 에러 메시지 통일
 */
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }

    // 에러 메시지 추출
    const message = error.response?.data?.message || error.response?.data?.resultMsg || error.message || '알 수 없는 오류가 발생했습니다.';
    return Promise.reject(new Error(message));
  },
);

// -------------------------
// AUTH API
// -------------------------

/**
 * 로그인
 * @param {Object} payload - { userId, userPw }
 * @returns {Promise} AuthResponse
 */
export const login = payload => api.post('/api/auth/login', payload).then(res => res.data);

/**
 * 회원가입
 * @param {Object} payload - SignupRequest
 * @returns {Promise} AuthResponse
 */
export const signUp = payload => api.post('/api/auth/signup', payload).then(res => res.data);

/**
 * 휴대폰 인증 요청
 * @param {Object} payload - { phone }
 * @returns {Promise} ApiResponse
 */
export const requestPhoneVerify = payload => api.post('/api/auth/phone/request', payload).then(res => res.data);

/**
 * 휴대폰 인증 확인
 * @param {Object} payload - { phone, code }
 * @returns {Promise} ApiResponse
 */
export const confirmPhoneVerify = payload => api.post('/api/auth/phone/confirm', payload).then(res => res.data);

// -------------------------
// 성분 관련 API
// -------------------------

// 성분 검색
export const searchIngredients = params => {
  // params: { page, size, keyword }
  const { page = 1, size = 10, keyword = '' } = params || {};
  return api.get('/api/admin/ingredients', {
    params: {
      page,
      page_gap: size,
      ing_name: keyword,
    },
  });
};

// 상품 검색
export const searchProducts = keyword => {
  return api.get('/api/search', {
    params: { keyword },
  });
};

export default api;