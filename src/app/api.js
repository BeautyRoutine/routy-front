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

api.interceptors.response.use(
  response => {
    return response; // 성공 응답은 그대로 반환
  },
  error => {
    // 401, 403 에러 토큰 만료 인증/권한 에러 처리
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token'); // 토큰 삭제
      localStorage.removeItem('user'); // 사용자 정보 삭제
      // 알림
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      // 로그인 페이지로 리다이렉트
      window.location.href = '/#/login';
    }

    return Promise.reject(error); // 기타 에러는 그대로 반환
  },
);

export default api;
