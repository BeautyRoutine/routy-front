import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectItem } from 'features/orders/admOrdersSlice';

const OrderListItem = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectItem(item));
    navigate(`/admin/order/list/${item.ODNO}`);
  };

  return (
    <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
      <td>{item.ODNO}</td>
      <td>
        {item.USERNAME}({item.USERNICK})
        <br />
        <small className="text-muted">{item.USERID}</small>
      </td>
      <td>
        {item.ODNAME}
        <br />
        <small className="text-muted">{item.ODHP}</small>
      </td>
      <td>
        {item.ODPRDPRICE.toLocaleString()}원<br />
        <small className="text-muted">{item.ODDELVPRICE.toLocaleString()}</small>원
      </td>
      <td>{(item.ODPRDPRICE + item.ODDELVPRICE).toLocaleString()}원</td>
      <td>
        {item.ODREGDATE.split(' ')[0]}
        <br />
        {item.ODREGDATE.split(' ')[1]}
      </td>
    </tr>
  );
};

export default OrderListItem;
