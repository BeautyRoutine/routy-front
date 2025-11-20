import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'styles/AdminHome.css';

import Sidebar from 'components/admin/layouts/SideBar';

import OrderList from 'components/admin/orders/OrderList';
import OrderDetail from 'components/admin/orders/OrderDetail';

const AdminHome = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="admin-content flex-grow-1">
        <Routes>
          {/* 상품 관리 */}
          <Route path="productList" />
          {/* 주문 관리 */}
          <Route path="orderList" Component={OrderList} />
          <Route path="orderList/:odNo" Component={OrderDetail} />
          {/* 회원 관리 */}
          <Route path="members" />
          {/* 게시글 관리 */}
          <Route path="posts" />
        </Routes>
      </div>
    </div>
  );
};

export default AdminHome;
