import axios from 'axios';

// 1. Axios 인스턴스 생성 및 기본 URL 설정
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터 설정: 모든 요청에 토큰을 자동 첨부
api.interceptors.request.use(
  config => {
    // 로컬 스토리지 키 'token' 사용 (이전 확인 결과)
    const token = localStorage.getItem('token');

    if (token) {
      // HTTP 규약에 따라 'Authorization: Bearer 토큰' 형식으로 헤더에 주입
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
