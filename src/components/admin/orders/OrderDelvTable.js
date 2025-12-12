import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { getTypeText, getStatusText, formatDateParts } from 'components/common/orderUtils';

const OrderDelvTable = ({ odInfo, apiBaseUrl }) => {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);
  const [rowTotal, setRowTotal] = useState(0);

  useEffect(() => {
    const loadDeliveries = async () => {
      if (!odInfo) return; // 주문데이터 없으면 패스
      try {
        const odNo = odInfo.odNo;
        const response = await axios.get(`${apiBaseUrl}/orders/detail_delivery/${odNo}`);
        console.log(`${apiBaseUrl}/orders/detail_delivery/${odNo}`);
        console.log(response);
        const list = response.data.data;
        setItemList(list);
        setRowTotal(list.length); // 총 개수
      } catch (err) {
        console.error('주문택배 조회 실패: ', err);
        setItemList([]);
        setRowTotal(0);
      }
    };
    loadDeliveries();
  }, [odInfo, apiBaseUrl]);

  return (
    <div>
      <h6 className="d-flex justify-content-between align-items-center mb-2 fw-bold" style={{ color: '#0d47a1' }}>
        <span>택배배송 목록</span>
        <small className="text-muted fw-normal text-end">총 {rowTotal}건</small>
      </h6>
      <table className="table table-bordered table-responsive table-hover align-middle text-center shadow-sm rounded mb-5">
        <thead className="table-dark">
          <tr>
            <th>송장번호</th>
            <th>택배사</th>
            <th>접수 종류</th>
            <th>택배 상태</th>
            <th>완료일</th>
            <th>접수일</th>
          </tr>
        </thead>
        <tbody>
          {itemList.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-muted py-4">
                택배 정보가 없습니다.
              </td>
            </tr>
          ) : (
            itemList.map(item => (
              <tr key={item.delvNo}>
                <td
                  className="text-primary"
                  onClick={() => navigate(`/admin/order/delivery/${item.delvNo}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.delvComNum}
                </td>
                <td>{item.delvCompany}</td>
                <td>{getTypeText(item.delvType)}</td>
                <td>{getStatusText(item.delvStatus)}</td>
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDelvTable;
