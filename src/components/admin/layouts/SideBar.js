import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const [openMenu, setOpenMenu] = useState('');

  // console.log(path);
  useEffect(() => {
    if (path.includes('/admin/product/')) {
      setOpenMenu('product');
    } else if (path.includes('/admin/order/')) {
      setOpenMenu('order');
    } else if (path.includes('/admin/member/')) {
      setOpenMenu('member');
    } else if (path.includes('/admin/post/')) {
      setOpenMenu('post');
    }
  }, [location, path]);

  const toggleMenu = menu => {
    setOpenMenu(openMenu === menu ? '' : menu);
  };

  return (
    <div className="sidebar bg-dark text-white vh-100 pt-3 text-center" style={{ width: '250px' }}>
      <h5 className="mb-4">관리자 페이지</h5>

      <div className="menu-group pl-3">
        <Button variant="link" className="menu-button" onClick={() => toggleMenu('product')}>
          상품 관리
        </Button>
        <Collapse in={openMenu === 'product'}>
          <div className="submenu">
            <Link
              to="/admin/product/list"
              className={`submenu-link ${path.includes('/admin/product/list') ? 'active' : ''}`}
            >
              상품 목록
            </Link>
            <Link
              to="/admin/product/rank"
              className={`submenu-link ${path.includes('/admin/product/rank') ? 'active' : ''}`}
            >
              상품 랭킹 수정
            </Link>
            <Link
              to="/admin/product/ing"
              className={`submenu-link ${path.includes('/admin/product/ing') ? 'active' : ''}`}
            >
              성분 목록
            </Link>
            <Link
              to="/admin/product/stats"
              className={`submenu-link ${path.includes('/admin/product/stats') ? 'active' : ''}`}
            >
              상품 통계 조회
            </Link>
          </div>
        </Collapse>
      </div>

      <div className="menu-group pl-3">
        <Button variant="link" className="menu-button" onClick={() => toggleMenu('order')}>
          주문 관리
        </Button>
        <Collapse in={openMenu === 'order'}>
          <div className="submenu">
            <Link
              to="/admin/order/list"
              className={`submenu-link ${path.includes('/admin/order/list') ? 'active' : ''}`}
            >
              주문 목록
            </Link>
            <Link
              to="/admin/order/delivery"
              className={`submenu-link ${path.includes('/admin/order/delivery') ? 'active' : ''}`}
            >
              배송 목록
            </Link>
            <Link
              to="/admin/order/request"
              className={`submenu-link ${path.includes('/admin/order/request') ? 'active' : ''}`}
            >
              교환&환불 요청 조회
            </Link>
            <Link
              to="/admin/order/payout"
              className={`submenu-link ${path.includes('/admin/order/payout') ? 'active' : ''}`}
            >
              정산 조회
            </Link>
          </div>
        </Collapse>
      </div>

      <div className="menu-group pl-3">
        <Button variant="link" className="menu-button" onClick={() => toggleMenu('member')}>
          회원 관리
        </Button>
        <Collapse in={openMenu === 'member'}>
          <div className="submenu">
            <Link
              to="/admin/member/list"
              className={`submenu-link ${path.includes('/admin/member/list') ? 'active' : ''}`}
            >
              회원 목록
            </Link>
            <Link
              to="/admin/member/role"
              className={`submenu-link ${path.includes('/admin/member/role') ? 'active' : ''}`}
            >
              권한 관리
            </Link>
          </div>
        </Collapse>
      </div>

      <div className="menu-group pl-3">
        <Button variant="link" className="menu-button" onClick={() => toggleMenu('post')}>
          게시글 관리
        </Button>
        <Collapse in={openMenu === 'post'}>
          <div className="submenu">
            <Link to="/admin/post/" className={`submenu-link ${path.includes('/admin/post/') ? 'active' : ''}`}>
              공지 목록
            </Link>
            <Link to="/admin/post/" className={`submenu-link ${path.includes('/admin/post/') ? 'active' : ''}`}>
              배너 목록
            </Link>
            <Link to="/admin/post/" className={`submenu-link ${path.includes('/admin/post/') ? 'active' : ''}`}>
              문의 목록
            </Link>
            <Link to="/admin/post/" className={`submenu-link ${path.includes('/admin/post/') ? 'active' : ''}`}>
              후기 목록
            </Link>
            <Link to="/admin/post/" className={`submenu-link ${path.includes('/admin/post/') ? 'active' : ''}`}>
              신고 목록
            </Link>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

export default Sidebar;
