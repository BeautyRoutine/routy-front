import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'styles/AdminHome.css';

import Sidebar from 'components/admin/layouts/SideBar';

import OrderList from 'components/admin/orders/OrderList';
import OrderDetail from 'components/admin/orders/OrderDetail';

import ProductList from 'features/products/ProductList';
import ProductDetail from 'features/products/ProductDetail';
import ProductAdd from 'features/products/ProductAdd';
import ProductEdit from 'features/products/ProductEdit';
import IngredientList from 'features/products/IngredientList';

const AdminHome = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="admin-content flex-grow-1">
        <Routes>
          {/* 상품 관리 */}
          <Route path="productList" Component={ProductList} />
          <Route path="products/detail/:prdNo" element={<ProductDetail />} />
          <Route path="products/edit/:prdNo" element={<ProductEdit />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="productIng" Component={IngredientList} />

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
