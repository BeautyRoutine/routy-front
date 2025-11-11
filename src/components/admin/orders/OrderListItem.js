// src/components/admin/orders/OrderListItem.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectOrder } from '../store';

const OrderListItem = ({ order }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectOrder(order));
    navigate(`/admin/orderDetail/${order.ODNO}`);
  };

  return (
    <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
      <td>{order.ODNO}</td>
      <td>
        {order.USERID}
        <br />
        <small className="text-muted">({order.USERNO})</small>
      </td>
      <td>
        {order.USERNAME}
        <br />
        <small className="text-muted">({order.USERNICK})</small>
      </td>
      <td>
        {order.ODNAME}
        <br />
        <small className="text-muted">{order.ODHP}</small>
      </td>
      <td>
        {order.ODPRDPRICE.toLocaleString()}원<br />
        <small className="text-muted">{order.ODDELVPRICE.toLocaleString()}</small>원
      </td>
      <td>{(order.ODPRDPRICE + order.ODDELVPRICE).toLocaleString()}원</td>
      <td>
        {order.ODREGDATE.split(' ')[0]}
        <br />
        {order.ODREGDATE.split(' ')[1]}
      </td>
    </tr>
  );
};

export default OrderListItem;
