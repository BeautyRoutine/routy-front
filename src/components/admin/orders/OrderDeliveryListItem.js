import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectItem } from 'features/orders/admDeliveriesSlice';

const OrderDeliveryListItem = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectItem(item));
    navigate(`/admin/order/delivery/${item.DELVNO}`);
  };

  return (
    <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
      <td>{item.DELVNO}</td>
      <td>
        {item.USERNAME}({item.USERNICK})
        <br />
        <small className="text-muted">{item.USERID}</small>
      </td>
      <td>
        {item.DELVGETNAME}
        <br />
        <small className="text-muted">{item.DELVGETHP}</small>
      </td>
      <td>{item.DELVGETJIBUNADDR ? `(${item.DELVGETZIP}) ${item.DELVGETJIBUNADDR}` : `(${item.DELVGETZIP}) -`}</td>
      <td>
        {item.DELVCOMPANY}
        <br />
        <small className="text-muted">{item.DELVCOMNUM}</small>
      </td>
      <td>
        {item.DELVENDDATE ? (
          <>
            {item.DELVENDDATE.split(' ')[0]}
            <br />
            {item.DELVENDDATE.split(' ')[1]}
          </>
        ) : (
          '-'
        )}
      </td>
      <td>
        {item.DELVREGDATE.split(' ')[0]}
        <br />
        {item.DELVREGDATE.split(' ')[1]}
      </td>
    </tr>
  );
};

export default OrderDeliveryListItem;
