import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderPrdTable = ({ odInfo, apiBaseUrl }) => {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);
  const [rowTotal, setRowTotal] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      if (!odInfo) return; // 주문데이터 없으면 패스
      try {
        const odNo = odInfo.odNo;
        const response = await axios.get(`${apiBaseUrl}/orders/detail_product/${odNo}`);
        console.log(`${apiBaseUrl}/orders/detail_product/${odNo}`);
        console.log(response);
        const list = response.data.data;
        setItemList(list);
        setRowTotal(list.length); // 총 개수
      } catch (err) {
        console.error('주문상품 조회 실패: ', err);
        setItemList([]);
        setRowTotal(0);
      }
    };
    loadProducts();
  }, [odInfo, apiBaseUrl]);

  return (
    <div>
      <h6 className="d-flex justify-content-between align-items-center mb-2 fw-bold" style={{ color: '#0d47a1' }}>
        <span>주문상품 목록</span>
        <small className="text-muted fw-normal text-end">총 {rowTotal}건</small>
      </h6>
      <table className="table table-bordered table-responsive table-hover align-middle text-center shadow-sm rounded mb-5">
        <thead className="table-dark">
          <tr>
            <th>카테고리</th>
            <th>상품명</th>
            <th>업체명</th>
            <th>용량</th>
            <th>수량</th>
            <th>결제금액</th>
          </tr>
        </thead>
        <tbody>
          {itemList.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-muted py-4">
                상품 정보가 없습니다.
              </td>
            </tr>
          ) : (
            itemList.map(item => (
              <tr key={item.prdNo}>
                <td>
                  {item.mainCateStr}
                  <br />
                  <small className="text-muted fw-bold">{item.subCateStr}</small>
                </td>
                <td
                  className="text-primary"
                  onClick={() => navigate(`/admin/product/list/detail/${item.prdNo}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/product/${item.prdImg}`}
                    alt={item.prdName}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      marginRight: '8px',
                      border: '1px solid #ccc', // 테두리 추가
                      borderRadius: '4px', // 모서리 둥글게 (선택사항)
                    }}
                  />{' '}
                  {item.prdName}
                </td>
                <td>{item.prdCompany}</td>
                <td>{item.prdVolume}ml</td>
                <td>{item.ppMapStock}</td>
                <td>{Number(item.ppMapPrice).toLocaleString()} 원</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderPrdTable;
