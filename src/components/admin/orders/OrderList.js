import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from '../store';

import OrderListItem from './OrderListItem';

const OrderList = () => {
  const dispatch = useDispatch();
  const apiBaseUrl = useSelector(state => state.config.apiBaseUrl);

  useEffect(() => {
    // 컴포넌트 첫 렌더링 시 실행 hook
    const loadData = async () => {
      console.log(`${apiBaseUrl}/orders/list`);
      try {
        const result = await axios.get(`${apiBaseUrl}/orders/list`);
        console.log(result);
        dispatch(setOrders(result.data));
      } catch (err) {
        console.log('주문목록 불러오기 실패: ', err);
      }
    };
    loadData();
  }, [dispatch]);

  const orders = useSelector(state => state.orders.list);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 text-center">📜 주문 목록 조회</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center shadow-sm rounded">
          <thead className="table-dark align-middle">
            <tr>
              <th>주문번호</th>
              <th>
                주문 회원ID
                <br />
                <small className="opacity-75">(회원번호)</small>
              </th>
              <th>
                주문 회원명
                <br />
                <small className="opacity-75">(닉네임)</small>
              </th>
              <th>수취인 정보</th>
              <th>
                상품금액
                <br />
                <small className="opacity-75">배송비</small>
              </th>
              <th className="text-warning fw-bold">총금액</th>
              <th>주문일시</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <OrderListItem key={i} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
