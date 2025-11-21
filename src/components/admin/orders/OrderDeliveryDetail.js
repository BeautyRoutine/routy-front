import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem, clearSelectedItem } from 'features/orders/admDeliveriesSlice';

import LoadingSpinner from 'components/common/LoadingSpinner';

const OrderDeliveryListDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const { delvNo } = useParams();
  const itemList = useSelector(state => state.admDeliveries.list);
  const selectedItem = useSelector(state => state.admDeliveries.selectedItem);

  const handleBack = () => {
    navigate(-1);
  };
  const getTypeText = value => {
    if (value === 11) return '배송';
    if (value === 12) return '재배송';
    if (value === 13) return '취소';
    if (value === 21) return '교환회수';
    if (value === 22) return '교환재발송';
    if (value === 31) return '반품회수';
    return '';
  };
  const getStatusText = value => {
    if (value === 1) return '배송준비중';
    if (value === 2) return '집화완료';
    if (value === 3) return '배송중';
    if (value === 4) return '지점 도착';
    if (value === 5) return '배송출발';
    if (value === 6) return '배송 완료';
    return '';
  };

  useEffect(() => {
    const loadOrder = async () => {
      dispatch(clearSelectedItem());
      const existence = itemList.find(e => e.DELVNO === parseInt(delvNo));
      setLoading(true);
      try {
        if (existence) {
          console.log(existence);
          dispatch(selectItem(existence));
          return;
        } else {
          console.log(`${apiBaseUrl}/order_delivery/detail/${delvNo}`);
          const response = await axios.get(`${apiBaseUrl}/order_delivery/detail/${delvNo}`);
          dispatch(selectItem(response.data.data));
        }
      } catch (err) {
        console.error('택배번호 조회 실패: ', err);
        setError('택배 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [delvNo, itemList, dispatch, apiBaseUrl]);

  if (loading) return <LoadingSpinner message="택배 정보를 불러오는 중입니다..." />;
  if (error) return <div className="text-danger text-center my-5">{error}</div>;
  if (!selectedItem) return <div className="text-center my-5">해당 택배 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <fieldset>
        <legend className="mb-3">📦 택배 상세 정보</legend>
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
              <td colSpan="3">{selectedItem.ODNO}</td>
            </tr>
            <tr>
              <th className="bg-light">결제자 성명(ID) / 닉네임</th>
              <td>
                {selectedItem.USERNAME}({selectedItem.USERID}) / {selectedItem.USERNICK}
              </td>
              <th className="bg-light">결제자 연락처</th>
              <td>{selectedItem.USERHP}</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold border-bottom pb-2 mb-3 text-primary">택배 정보</h5>
        <table className="table table-hover table-bordered align-middle">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <tbody>
            <tr>
              <th className="bg-light">택배번호</th>
              <td colSpan="3">{selectedItem.DELVNO}</td>
            </tr>
            <tr>
              <th className="bg-light">수령인</th>
              <td>{selectedItem.DELVGETNAME}</td>
              <th className="bg-light">수령인 연락처</th>
              <td>{selectedItem.DELVGETHP}</td>
            </tr>
            <tr>
              <th className="bg-light">택배사</th>
              <td>{selectedItem.DELVCOMPANY}</td>
              <th className="bg-light">송장번호</th>
              <td>{selectedItem.DELVCOMNUM}</td>
            </tr>
            <tr>
              <th className="bg-light">접수 종류</th>
              <td>{getTypeText(selectedItem.DELVTYPE)}</td>
              <th className="bg-light">접수일</th>
              <td>{selectedItem.DELVREGDATE}</td>
            </tr>
            <tr>
              <th className="bg-light">택배 상태</th>
              <td>{getStatusText(selectedItem.DELVSTATUS)}</td>
              <th className="bg-light">완료일</th>
              <td>{selectedItem.DELVENDDATE}</td>
            </tr>
            <tr>
              <th className="bg-light">지번 주소</th>
              <td colSpan="3">
                {selectedItem.DELVGETJIBUNADDR
                  ? `(${selectedItem.DELVGETZIP}) ${selectedItem.DELVGETJIBUNADDR}, ${selectedItem.DELVGETDETAILADDR}`
                  : '없음'}
              </td>
            </tr>
            <tr>
              <th className="bg-light">도로명 주소</th>
              <td colSpan="3">
                {selectedItem.DELVGETROADADDR
                  ? `(${selectedItem.DELVGETZIP}) ${selectedItem.DELVGETROADADDR}, ${selectedItem.DELVGETDETAILADDR}`
                  : '없음'}
              </td>
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

export default OrderDeliveryListDetail;
