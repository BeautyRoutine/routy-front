// src/components/admin/orders/OrderDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrder } from '../store';
import axios from 'axios';

const OrderDetail = () => {
  const { odNo } = useParams();
  const dispatch = useDispatch();
  const orderList = useSelector(state => state.orders.list);
  const selectedOrder = useSelector(state => state.orders.selectedOrder);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = orderList.find(o => o.ODNO === parseInt(odNo));
    if (existing) {
      dispatch(selectOrder(existing));
    } else {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8085/orders/detail/${odNo}`);
          dispatch(selectOrder(response.data));
        } catch (error) {
          console.error('주문 상세 조회 실패:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [odNo, orderList, dispatch]);

  if (loading || !selectedOrder) return <div>로딩 중...</div>;

  return (
    <div className="container">
      <h3 className="mb-4">📦 주문 상세 정보</h3>
      <form>
        <label>회원명</label>
        <input type="text" value={selectedOrder.USERNAME} readOnly className="form-control" />
        <label>회원ID</label>
        <input type="text" value={selectedOrder.USERID} readOnly className="form-control" />
        <label>상품금액</label>
        <input type="number" value={selectedOrder.ODPRDPRICE} readOnly className="form-control" />
        <label>배송비</label>
        <input type="number" value={selectedOrder.ODDELVPRICE} readOnly className="form-control" />
        <label>주문일시</label>
        <input type="text" value={selectedOrder.ODREGDATE} readOnly className="form-control" />
        {/* 필요한 필드 추가 */}
      </form>
    </div>
  );
};

export default OrderDetail;
