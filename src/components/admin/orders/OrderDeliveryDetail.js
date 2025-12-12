import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem, clearSelectedItem } from 'features/orders/admDeliveriesSlice';

import { getTypeText, getStatusText } from 'components/common/orderUtils';
import { useHandleBack, RenderingStateHandler } from 'components/common/commonUtils';

const OrderDeliveryDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const { delvNo } = useParams();
  const itemList = useSelector(state => state.admDeliveries.list);
  const selectedItem = useSelector(state => state.admDeliveries.selectedItem);

  const handleBack = useHandleBack();

  // 삭제
  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 이 택배 정보를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiBaseUrl}/orders/delivery/${delvNo}`);
      alert('데이터 삭제되었습니다.');
      navigate('/admin/order/delivery');
    } catch (err) {
      console.error(err);
      alert('데이터 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const loadDelivery = async () => {
      dispatch(clearSelectedItem());
      const existence = itemList.find(e => e.delvNo === parseInt(delvNo));
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
                  <td colSpan="3">{selectedItem.odNo}</td>
                </tr>
                <tr>
                  <th className="bg-light">결제자 성명(ID) / 닉네임</th>
                  <td>
                    {selectedItem.userName}({selectedItem.userId}) / {selectedItem.userNick}
                  </td>
                  <th className="bg-light">결제자 연락처</th>
                  <td>{selectedItem.userHp}</td>
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
                  <td colSpan="3">{selectedItem.delvNo}</td>
                </tr>
                <tr>
                  <th className="bg-light">수령인</th>
                  <td>{selectedItem.delvGetName}</td>
                  <th className="bg-light">수령인 연락처</th>
                  <td>{selectedItem.delvGetHp}</td>
                </tr>
                <tr>
                  <th className="bg-light">택배사</th>
                  <td>{selectedItem.delvCompany}</td>
                  <th className="bg-light">송장번호</th>
                  <td>{selectedItem.delvComNum}</td>
                </tr>
                <tr>
                  <th className="bg-light">접수 종류</th>
                  <td>{getTypeText(selectedItem.delvType)}</td>
                  <th className="bg-light">접수일</th>
                  <td>{selectedItem.delvRegdate}</td>
                </tr>
                <tr>
                  <th className="bg-light">택배 상태</th>
                  <td>{getStatusText(selectedItem.delvStatus)}</td>
                  <th className="bg-light">완료일</th>
                  <td>{selectedItem.delvEnddate}</td>
                </tr>
                <tr>
                  <th className="bg-light">지번 주소</th>
                  <td colSpan="3">
                    {selectedItem.delvGetJibunAddr
                      ? `(${selectedItem.delvGetZip}) ${selectedItem.delvGetJibunAddr}, ${selectedItem.delvGetDetailAddr}`
                      : '없음'}
                  </td>
                </tr>
                <tr>
                  <th className="bg-light">도로명 주소</th>
                  <td colSpan="3">
                    {selectedItem.delvGetRoadAddr
                      ? `(${selectedItem.delvGetZip}) ${selectedItem.delvGetRoadAddr}, ${selectedItem.delvGetDetailAddr}`
                      : '없음'}
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
          <div className="text-center mt-3 mb-5">
            <button className="btn btn-outline-secondary px-3 me-2" onClick={handleBack}>
              ← 돌아가기
            </button>

            <button className="btn btn-secondary me-2" onClick={() => navigate('/admin/order/delivery')}>
              ← 목록으로
            </button>

            <button className="btn btn-primary me-2" onClick={() => navigate(`/admin/order/delivery/edit/${delvNo}`)}>
              ✏ 수정하기
            </button>

            <button className="btn btn-danger" onClick={handleDelete}>
              🗑 삭제하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDeliveryDetail;
