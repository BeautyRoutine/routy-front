import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectItem } from 'features/orders/admOrdersSlice';

const OrderListItem = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectItem(item));
    navigate(`/admin/order/list/${item.odNo}`);
  };

  return (
    <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
      <td>{item.odNo}</td>
      <td>
        {item.userName}({item.userNick})
        <br />
        <small className="text-muted">{item.userId}</small>
      </td>
      <td>
        {item.odName}
        <br />
        <small className="text-muted">{item.odHp}</small>
      </td>
      <td>
        {item.odPrdPrice.toLocaleString()}원<br />
        <small className="text-muted">{item.odDelvPrice.toLocaleString()}</small>원
      </td>
      <td>{(item.odPrdPrice + item.odDelvPrice).toLocaleString()}원</td>
      <td>
        {item.odRegdate.split(' ')[0]}
        <br />
        {item.odRegdate.split(' ')[1]}
      </td>
    </tr>
  );
};

export default OrderListItem;
