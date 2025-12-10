import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error("스토리지 삭제 실패:", e);
    }
    
    window.location.replace("/");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
