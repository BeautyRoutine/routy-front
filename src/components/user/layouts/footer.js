import './footer.css';

function Footer() {
  return (
    <>
      <footer className="routy-footer">
        <div className="footer-inner">
          <h2 className="footer-title">Routy</h2>

          <p className="footer-description">개인 맞춤형 화장품 추천과 리뷰를 확인할 수 있는 리뷰 시스템</p>

          <nav className="footer-links" aria-label="footer nav">
            <a href="#underconstruction">이용약관</a>
            <a href="#underconstruction">개인정보 처리방침</a>
            {/* <a href="#support">고객센터</a> */}
            <a href="#underconstruction">입점 문의</a>
          </nav>

          <p className="footer-copy">Copyright © Routy 2025. All rights reserved.</p>

          <p className="footer-disclaimer">
            ⚠️ 연습용 프로젝트 - 개인정보를 수집하지 않으며, 학습 목적으로만 사용됩니다.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
