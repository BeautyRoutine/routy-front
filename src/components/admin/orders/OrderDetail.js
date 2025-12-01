import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem, clearSelectedItem } from 'features/orders/admOrdersSlice';

import { getDeliveryKeyText } from 'components/common/orderUtils';

import LoadingSpinner from 'components/common/LoadingSpinner';
import OrderPrdTable from './OrderPrdTable';
import OrderDelvTable from './OrderDelvTable';

const OrderDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const { odNo } = useParams();
  const itemList = useSelector(state => state.admOrders.list);
  const selectedItem = useSelector(state => state.admOrders.selectedItem);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadOrder = async () => {
      dispatch(clearSelectedItem());
      const existence = itemList.find(e => e.ODNO === parseInt(odNo));
      setLoading(true);
      try {
        if (existence) {
          dispatch(selectItem(existence));
          return;
        } else {
          const response = await axios.get(`${apiBaseUrl}/orders/detail/${odNo}`);
          dispatch(selectItem(response.data.data));
        }
      } catch (err) {
        console.error('주문번호 조회 실패: ', err);
        setError('주문 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [odNo, itemList, dispatch, apiBaseUrl]);

  if (loading) return <LoadingSpinner message="주문 정보를 불러오는 중입니다..." />;
  if (error) return <div className="text-danger text-center my-5">{error}</div>;
  if (!selectedItem) return <div className="text-center my-5">해당 주문 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <fieldset>
        <legend className="mb-3">📜 주문 상세 정보</legend>
        <h5 className="fw-bold border-bottom pb-2 mb-3 text-primary">주문 정보</h5>
        <table className="table table-hover table-bordered align-middle">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <tbody>
            <tr>
              <th className="bg-light">주문번호</th>
              <td>{selectedItem.ODNO}</td>
              <th className="bg-light">결제일</th>
              <td>{selectedItem.ODREGDATE}</td>
            </tr>
            <tr>
              <th className="bg-light">상품가격 / 택배비</th>
              <td>
                {Number(selectedItem.ODPRDPRICE).toLocaleString()} 원 /{' '}
                {Number(selectedItem.ODDELVPRICE).toLocaleString()} 원
              </td>
              <th className="bg-light">총 결제금액</th>
              <td>{Number(selectedItem.ODPRDPRICE + selectedItem.ODDELVPRICE).toLocaleString()} 원</td>
            </tr>
            <tr>
              <th className="bg-light">결제자 성명(ID) / 닉네임</th>
              <td colSpan="3">
                {selectedItem.USERNAME}({selectedItem.USERID}) / {selectedItem.USERNICK}
              </td>
            </tr>
            <tr>
              <th className="bg-light">결제자 연락처</th>
              <td colSpan="3">{selectedItem.USERHP}</td>
            </tr>
          </tbody>
        </table>

        <OrderPrdTable odInfo={selectedItem} apiBaseUrl={apiBaseUrl} />

        <h5 className="fw-bold border-bottom pb-2 mb-3 text-primary">배송 정보</h5>
        <table className="table table-hover table-bordered align-middle">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <tbody>
            <tr>
              <th className="bg-light">수령인</th>
              <td>{selectedItem.ODNAME}</td>
              <th className="bg-light">수령인 연락처</th>
              <td>{selectedItem.ODHP}</td>
            </tr>
            <tr>
              <th className="bg-light">지번 주소</th>
              <td colSpan="3">
                {selectedItem.ODJIBUNADDR
                  ? `(${selectedItem.ODZIP}) ${selectedItem.ODJIBUNADDR}, ${selectedItem.ODDETAILADDR}`
                  : '없음'}
              </td>
            </tr>
            <tr>
              <th className="bg-light">도로명 주소</th>
              <td colSpan="3">
                {selectedItem.ODROADADDR
                  ? `(${selectedItem.ODZIP}) ${selectedItem.ODROADADDR}, ${selectedItem.ODDETAILADDR}`
                  : '없음'}
              </td>
            </tr>
            <tr>
              <th className="bg-light">택배 출입방법</th>
              <td>{getDeliveryKeyText(selectedItem.ODDELVKEYTYPE, selectedItem.ODDELVKEY)}</td>
              <th className="bg-light">택배 요청사항</th>
              <td>{selectedItem.ODDELVMSG}</td>
            </tr>
          </tbody>
        </table>

        <OrderDelvTable odInfo={selectedItem} apiBaseUrl={apiBaseUrl} />
      </fieldset>
      <div className="text-center mt-3 mb-5">
        <button className="btn btn-outline-secondary px-3" onClick={handleBack}>
          ← 돌아가기
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
