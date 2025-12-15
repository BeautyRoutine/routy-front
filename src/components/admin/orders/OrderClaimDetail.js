import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem, clearSelectedItem } from 'features/orders/admDeliveriesSlice';

import { getQATypeText, getQAStatusText } from 'components/common/orderUtils';
import { RenderingStateHandler } from 'components/common/commonUtils';

import OrderPrdTable from './OrderPrdTable';

const OrderDeliveryDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const { qnaNo } = useParams();
  const itemList = useSelector(state => state.admDeliveries.list);
  const selectedItem = useSelector(state => state.admDeliveries.selectedItem);

  // 삭제
  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 이 택배 정보를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiBaseUrl}/orders/delivery/${qnaNo}`);
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
      const existence = itemList.find(e => e.qnaNo === parseInt(qnaNo));
      console.log(existence);
      setLoading(true);
      try {
        if (existence) {
          dispatch(selectItem(existence));
        } else {
          const response = await axios.get(`${apiBaseUrl}/orders/claim/detail/${qnaNo}`);
          dispatch(selectItem(response.data.data));
        }
      } catch (err) {
        setError('❌ 상세정보 불러오기 실패');
      } finally {
        setLoading(false);
      }
    };
    loadDelivery();
  }, [qnaNo, itemList, dispatch, apiBaseUrl]);

  return (
    <div>
      {/* 상태 분기 처리 */}
      <RenderingStateHandler loading={loading} error={error} data={selectedItem} />

      {/* 정상 화면은 조건부로 렌더링 */}
      {selectedItem && (
        <div>
          <fieldset>
            <legend className="mb-3">♻️ 환불&교환 상세 정보</legend>
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

            <OrderPrdTable odInfo={selectedItem} apiBaseUrl={apiBaseUrl} />

            <h5 className="d-flex justify-content-between align-items-center fw-bold border-bottom text-primary pb-2 mb-3">
              요청 정보
              {selectedItem.delvNo == null && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() =>
                    navigate(`/admin/order/delivery/add?od_no=${selectedItem.odNo}&qna_no=${selectedItem.qnaNo}`)
                  }
                >
                  <i class="bi bi-plus-square" /> 택배 추가
                </button>
              )}
            </h5>
            <table className="table table-hover table-bordered align-middle">
              <colgroup>
                <col style={{ width: '20%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '30%' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th className="bg-light">요청번호</th>
                  <td>{selectedItem.qnaNo}</td>
                  <th className="bg-light">택배번호</th>
                  <td
                    style={{ cursor: 'pointer' }}
                    className={selectedItem.delvNo > 0 ? 'text-info fw-bold' : ''}
                    onClick={() => navigate(`/admin/order/delivery/${selectedItem.delvNo}`)}
                  >
                    {selectedItem.delvNo}
                  </td>
                </tr>
                <tr>
                  <th className="bg-light">요청 유형</th>
                  <td>{getQATypeText(selectedItem.qnaType)}</td>
                  <th className="bg-light">요청 상태</th>
                  <td>{getQAStatusText(selectedItem.qnaStatus)}</td>
                </tr>
                <tr>
                  <th className="bg-light">요청자 메시지</th>
                  <td colSpan={3}>{selectedItem.qnaQ}</td>
                </tr>
                <tr>
                  <th className="bg-light">관리자 메시지</th>
                  <td colSpan={3}>{selectedItem.qnaA}</td>
                </tr>
              </tbody>
            </table>
          </fieldset>
          <div className="text-center mt-3 mb-5">
            <button className="btn btn-secondary me-2" onClick={() => navigate('/admin/order/claim')}>
              ← 목록으로
            </button>

            {/* <button className="btn btn-primary me-2" onClick={() => navigate(`/admin/order/delivery/edit/${qnaNo}`)}>
              ✏ 수정하기
            </button> */}

            {/* <button className="btn btn-danger" onClick={handleDelete}>
              🗑 삭제하기
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDeliveryDetail;
