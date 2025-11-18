import React from 'react';
import { Routes, Route } from 'react-router-dom';

import admstore from './store';
import { Provider } from 'react-redux';

import Sidebar from './layouts/SideBar';
import OrderList from './orders/OrderList';
import OrderDetail from './orders/OrderDetail';
import './Adminhome.css';

const AdminHome = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <Provider store={admstore}>
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
      </Provider>
    </div>
  );
};

export default AdminHome;
