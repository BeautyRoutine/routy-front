import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'styles/AdminHome.css';

import Sidebar from 'components/admin/layouts/SideBar';

import OrderList from 'components/admin/orders/OrderList';
import OrderDetail from 'components/admin/orders/OrderDetail';
import OrderDeliveryList from 'components/admin/orders/OrderDeliveryList';
import OrderDeliveryDetail from 'components/admin/orders/OrderDeliveryDetail';

import ProductList from 'features/adminProducts/ProductList';
import ProductDetail from 'features/adminProducts/ProductDetail';
import ProductAdd from 'features/adminProducts/ProductAdd';
import ProductEdit from 'features/adminProducts/ProductEdit';
import IngredientList from 'features/adminProducts/IngredientList';

const AdminHome = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="admin-content flex-grow-1">
        <Routes>
          {/* 상품 관리 */}
          <Route path="product/list" element={<ProductList />} />
          <Route path="product/detail/:prdNo" element={<ProductDetail />} />
          <Route path="product/edit/:prdNo" element={<ProductEdit />} />
          <Route path="product/add" element={<ProductAdd />} />
          <Route path="product/ing" element={<IngredientList />} />
          {/* 주문 관리 */}
          <Route path="order/list" Component={OrderList} />
          <Route path="order/list/:odNo" Component={OrderDetail} />
          <Route path="order/delivery" Component={OrderDeliveryList} />
          <Route path="order/delivery/:delvNo" Component={OrderDeliveryDetail} />
          {/* 회원 관리 */}
          <Route path="member/list" element={<div>추가 예정</div>} />
          {/* 게시글 관리 */}
          <Route path="post/list" element={<div>추가 예정</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminHome;
