import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

function Sidebar() {
  const [openMenu, setOpenMenu] = useState('');

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
            <Link to="/admin/productList" className="submenu-link">
              상품 목록
            </Link>
            <Link to="/admin/productRank" className="submenu-link">
              상품 랭킹 수정
            </Link>
            <Link to="/admin/productIng" className="submenu-link">
              성분 목록
            </Link>
            <Link to="/admin/productStats" className="submenu-link">
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
            <Link to="/admin/orderList" className="submenu-link">
              주문 목록
            </Link>
            <Link to="/admin/orderDelivery" className="submenu-link">
              배송 목록
            </Link>
            <Link to="/admin/orderRequest" className="submenu-link">
              교환&환불 요청 조회
            </Link>
            <Link to="/admin/ordersPayout" className="submenu-link">
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
            <Link to="/admin/memberList" className="submenu-link">
              회원 목록
            </Link>
            <Link to="/admin/memberRole" className="submenu-link">
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
            <Link to="/admin/posts" className="submenu-link">
              공지 목록
            </Link>
            <Link to="/admin/posts" className="submenu-link">
              배너 목록
            </Link>
            <Link to="/admin/posts" className="submenu-link">
              문의 목록
            </Link>
            <Link to="/admin/posts" className="submenu-link">
              후기 목록
            </Link>
            <Link to="/admin/posts" className="submenu-link">
              신고 목록
            </Link>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

export default Sidebar;
