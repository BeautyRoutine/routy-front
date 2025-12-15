import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'styles/AdminHome.css';

import Sidebar from 'components/admin/layouts/SideBar';

import OrderList from 'components/admin/orders/OrderList';
import OrderDetail from 'components/admin/orders/OrderDetail';

import OrderDeliveryList from 'components/admin/orders/OrderDeliveryList';
import OrderDeliveryDetail from 'components/admin/orders/OrderDeliveryDetail';
import OrderDeliveryAdd from 'components/admin/orders/OrderDeliveryAdd';
import OrderDeliveryEdit from 'components/admin/orders/OrderDeliveryEdit';

import OrderClaimList from 'components/admin/orders/OrderClaimList';
import OrderClaimDetail from 'components/admin/orders/OrderClaimDetail';

import ProductList from 'components/admin/products/ProductList';
import ProductDetail from 'components/admin/products/ProductDetail';
import ProductAdd from 'components/admin/products/ProductAdd';
import ProductEdit from 'components/admin/products/ProductEdit';
import IngredientList from 'components/admin/products/IngredientList';

const AdminHome = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="admin-content flex-grow-1">
        <Routes>
          {/* 상품 관리 */}
          {/* 상품 목록 */}
          <Route path="product/list" element={<ProductList />} />
          <Route path="product/list/detail/:prdNo" element={<ProductDetail />} />
          <Route path="product/list/edit/:prdNo" element={<ProductEdit />} />
          <Route path="product/list/add" element={<ProductAdd />} />
          {/* 성분 목록 */}
          <Route path="product/ing" element={<IngredientList />} />
          {/* 주문 관리 */}
          {/* 주문 목록 */}
          <Route path="order/list" Component={OrderList} />
          <Route path="order/list/:odNo" Component={OrderDetail} />
          {/* 배송 목록 */}
          <Route path="order/delivery" Component={OrderDeliveryList} />
          <Route path="order/delivery/:delvNo" Component={OrderDeliveryDetail} />
          <Route path="order/delivery/add" Component={OrderDeliveryAdd} />
          <Route path="order/delivery/edit/:delvNo" Component={OrderDeliveryEdit} />
          {/* 환불&교환 목록 */}
          <Route path="order/claim" Component={OrderClaimList} />
          <Route path="order/claim/:qnaNo" Component={OrderClaimDetail} />
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
