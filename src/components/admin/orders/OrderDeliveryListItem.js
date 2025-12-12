import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectItem } from 'features/orders/admDeliveriesSlice';

import { formatDateParts } from 'components/common/orderUtils';

const OrderDeliveryListItem = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectItem(item));
    navigate(`/admin/order/delivery/${item.delvNo}`);
  };

  return (
    <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
      <td>{item.delvNo}</td>
      <td>
        {item.userName}({item.userNick})
        <br />
        <small className="text-muted">{item.userId}</small>
      </td>
      <td>
        {item.delvGetName}
        <br />
        <small className="text-muted">{item.delvGetHp}</small>
      </td>
      <td>
        {item.delvGetJibunAddr
          ? `(${item.delvGetZip}) ${item.delvGetJibunAddr}`
          : `(${item.delvGetZip}) ${item.delvGetRoadAddr}`}
      </td>
      <td>
        {item.delvCompany}
        <br />
        <small className="text-muted">{item.delvComNum}</small>
      </td>
      <td>
        {formatDateParts(item.delvEnddate).date}
        <br />
        {formatDateParts(item.delvEnddate).time}
      </td>
      <td>
        {formatDateParts(item.delvRegdate).date}
        <br />
        {formatDateParts(item.delvRegdate).time}
      </td>
    </tr>
  );
};

export default OrderDeliveryListItem;
