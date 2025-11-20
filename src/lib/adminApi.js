// -----------------------------------------------------------------------------
// Admin API 모듈   
// -----------------------------------------------------------------------------

import apiClient from "./apiClient";

// 관리자 회원 목록 조회 
export const fetchAdminMembers = async () => {
  const res = await apiClient.get("/api/admin/members/list");
  return res.data ?? res;
};
