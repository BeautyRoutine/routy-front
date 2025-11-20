import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'styles/AdminHome.css';

import Sidebar from 'components/admin/layouts/SideBar';

import OrderList from 'components/admin/orders/OrderList';
import OrderDetail from 'components/admin/orders/OrderDetail';
import OrderDeliveryList from 'components/admin/orders/OrderDeliveryList';
import OrderDeliveryDetail from 'components/admin/orders/OrderDeliveryDetail';

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
<<<<<<< HEAD
          <Route path="productList" Component={ProductList} />
          <Route path="products/detail/:prdNo" element={<ProductDetail />} />
          <Route path="products/edit/:prdNo" element={<ProductEdit />} />
          <Route path="products/add" element={<ProductAdd />} />

          <Route path="productIng" Component={IngredientList} />      

=======
          <Route path="product/list" />
>>>>>>> 07aaab5 (feat: 라우트 정리, 기능 탬플릿화)
          {/* 주문 관리 */}
          <Route path="order/list" Component={OrderList} />
          <Route path="order/list/:odNo" Component={OrderDetail} />
          <Route path="order/delivery" Component={OrderDeliveryList} />
          <Route path="order/delivery/:delvNo" Component={OrderDeliveryDetail} />
          {/* 회원 관리 */}
          <Route path="member/list" />
          {/* 게시글 관리 */}
          <Route path="post/list" />
        </Routes>
      </div>
    </div>
  );
};

export default AdminHome;
