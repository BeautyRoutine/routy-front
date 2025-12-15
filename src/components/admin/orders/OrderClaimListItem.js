import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectItem } from 'features/orders/admDeliveriesSlice';

import { getQATypeText, getQAStatusText, formatDateParts } from 'components/common/orderUtils';

const OrderClaimListItem = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectItem(item));
    navigate(`/admin/order/delivery/${item.delvNo}`);
  };

  return (
    <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
      <td>{item.qnaNo}</td>
      <td>
        {item.userName}({item.userNick})
        <br />
        <small className="text-muted">{item.userId}</small>
      </td>
      <td>{getQATypeText(item.qnaType)}</td>
      <td className={item.qnaStatus === 1 ? 'text-info fw-bold' : ''}>{getQAStatusText(item.qnaStatus)}</td>
      <td>
        {formatDateParts(item.qnaDate).date}
        <br />
        {formatDateParts(item.qnaDate).time}
      </td>
    </tr>
  );
};

export default OrderClaimListItem;
