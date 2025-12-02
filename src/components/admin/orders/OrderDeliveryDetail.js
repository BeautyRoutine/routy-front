import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem, clearSelectedItem } from 'features/orders/admDeliveriesSlice';

import { getTypeText, getStatusText } from 'components/common/orderUtils';
import { useHandleBack, RenderingStateHandler } from 'components/common/commonUtils';

const OrderDeliveryDetail = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const { delvNo } = useParams();
  const itemList = useSelector(state => state.admDeliveries.list);
  const selectedItem = useSelector(state => state.admDeliveries.selectedItem);

  const handleBack = useHandleBack();

  useEffect(() => {
    const loadDelivery = async () => {
      dispatch(clearSelectedItem());
      const existence = itemList.find(e => e.DELVNO === parseInt(delvNo));
      setLoading(true);
      try {
        if (existence) {
          dispatch(selectItem(existence));
        } else {
          const response = await axios.get(`${apiBaseUrl}/orders/delivery/detail/${delvNo}`);
          dispatch(selectItem(response.data.data));
        }
      } catch (err) {
        setError('❌ 상세정보 불러오기 실패');
      } finally {
        setLoading(false);
      }
    };
    loadDelivery();
  }, [delvNo, itemList, dispatch, apiBaseUrl]);

  return (
    <div>
      {/* 상태 분기 처리 */}
      <RenderingStateHandler loading={loading} error={error} data={selectedItem} />

      {/* 정상 화면은 조건부로 렌더링 */}
      {selectedItem && (
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
          <div className="text-center mt-3 mb-5">
            <button className="btn btn-outline-secondary px-3" onClick={handleBack}>
              ← 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDeliveryDetail;
