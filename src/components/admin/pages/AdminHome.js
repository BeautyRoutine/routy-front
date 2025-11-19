import React from 'react';
import { Routes, Route } from 'react-router-dom';

import admstore from '../store';
import { Provider } from 'react-redux';

import Sidebar from '../layouts/SideBar';
import OrderList from '../orders/OrderList';
import OrderDetail from '../orders/OrderDetail';
import ProductList from '../products/ProductList';
import ProductDetail from '../products/ProductDetail';
import ProductEdit from '../products/ProductEdit';
import ProductIng from '../ingredient/ProductIng';
import './Adminhome.css';

const AdminHome = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <Provider store={admstore}>
        <div className="admin-content flex-grow-1">
          <Routes>
            {/* 상품 관리 */}
            <Route path="productList" Component={ProductList} />
            <Route path="productIng" Component={ProductIng} />
            <Route path="products/detail/:prdNo" element={<ProductDetail />} />
            <Route path="products/edit/:prdNo" element={<ProductEdit />} />
            {/* 주문 관리 */}
            <Route path="orderList" Component={OrderList} />
            <Route path="orderDetail/:odNo" Component={OrderDetail} />
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
