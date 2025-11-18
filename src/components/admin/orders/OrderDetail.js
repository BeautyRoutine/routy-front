// src/components/admin/orders/OrderDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrder, clearSelectedOrder } from '../store';
import axios from 'axios';
import LoadingSpinner from '../../common/LoadingSpinner';

const OrderDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.config.apiBaseUrl);

  const { odNo } = useParams();
  const orderList = useSelector(state => state.orders.list);
  const selectedOrder = useSelector(state => state.orders.selectedOrder);

  const handleBack = () => {
    navigate(-1);
  };
  const getDeliveryKeyText = () => {
    if (selectedOrder.ODDELVKEYTYPE === 2) return '자유출입가능';
    if (selectedOrder.ODDELVKEYTYPE === 1 && selectedOrder.ODDELVKEY === null) return '없음';
    return `공동현관번호: ${selectedOrder.ODDELVKEY}`;
  };

  useEffect(() => {
    const loadOrder = async () => {
      dispatch(clearSelectedOrder());
      const existence = orderList.find(e => e.ODNO === parseInt(odNo));
      setLoading(true);
      try {
        if (existence) {
          console.log(existence);
          dispatch(selectOrder(existence));
          return;
        } else {
          console.log(`${apiBaseUrl}/orders/detail/${odNo}`);
          const response = await axios.get(`${apiBaseUrl}/orders/detail/${odNo}`);
          dispatch(selectOrder(response.data.data));
        }
      } catch (err) {
        console.error('주문번호 조회 실패: ', err);
        setError('주문 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [odNo, orderList, dispatch, apiBaseUrl]);

  if (loading) return <LoadingSpinner message="주문 정보를 불러오는 중입니다..." />;
  if (error) return <div className="text-danger text-center my-5">{error}</div>;
  if (!selectedOrder) return <div className="text-center my-5">해당 주문 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <fieldset>
        <legend className="mb-3">📦 주문 상세 정보</legend>
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
              <td>{selectedOrder.ODNO}</td>
              <th className="bg-light">결제일</th>
              <td>{selectedOrder.ODREGDATE}</td>
            </tr>
            <tr>
              <th className="bg-light">상품가격 / 택배비</th>
              <td>
                {selectedOrder.ODPRDPRICE} 원 / {selectedOrder.ODDELVPRICE} 원
              </td>
              <th className="bg-light">총 결제금액</th>
              <td>{selectedOrder.ODPRDPRICE + selectedOrder.ODDELVPRICE} 원</td>
            </tr>
            <tr>
              <th className="bg-light">결제자 성명(ID) / 닉네임</th>
              <td colSpan="3">
                {selectedOrder.USERNAME}({selectedOrder.USERID}) / {selectedOrder.USERNICK}
              </td>
            </tr>
            <tr>
              <th className="bg-light">결제자 연락처</th>
              <td colSpan="3">{selectedOrder.USERHP}</td>
            </tr>
          </tbody>
        </table>
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
              <td>{selectedOrder.ODNAME}</td>
              <th className="bg-light">수령인 연락처</th>
              <td>{selectedOrder.ODHP}</td>
            </tr>
            <tr>
              <th className="bg-light">지번 주소</th>
              <td colSpan="3">
                {selectedOrder.ODJIBUNADDR
                  ? `(${selectedOrder.ODZIP}) ${selectedOrder.ODJIBUNADDR}, ${selectedOrder.ODDETAILADDR}`
                  : '없음'}
              </td>
            </tr>
            <tr>
              <th className="bg-light">도로명 주소</th>
              <td colSpan="3">
                {selectedOrder.ODROADADDR
                  ? `(${selectedOrder.ODZIP}) ${selectedOrder.ODROADADDR}, ${selectedOrder.ODDETAILADDR}`
                  : '없음'}
              </td>
            </tr>
            <tr>
              <th className="bg-light">택배 출입방법</th>
              <td>{getDeliveryKeyText()}</td>
              <th className="bg-light">택배 요청사항</th>
              <td>{selectedOrder.ODDELVMSG}</td>
            </tr>
          </tbody>
        </table>
      </fieldset>
      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary px-4" onClick={handleBack}>
          ← 돌아가기
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
