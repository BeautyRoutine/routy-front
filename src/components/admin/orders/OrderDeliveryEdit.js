import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem, clearSelectedItem } from 'features/orders/admDeliveriesSlice';

import { useHandleBack, RenderingStateHandler } from 'components/common/commonUtils';

import AddressFields from 'components/common/AddressFields';

const OrderDeliveryEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const { delvNo } = useParams();
  const itemList = useSelector(state => state.admDeliveries.list);

  const [formData, setFormData] = useState(null);
  const [changedFields, setChangedFields] = useState({});

  const handleBack = useHandleBack();

  // 원본은 유지하고 변경된 필드만 기록하여 axios 보내기
  const handleChange = e => {
    const { name, value } = e.target;
    // 원본 유지
    setFormData(prev => ({ ...prev, [name]: value }));
    // 변경된 필드만 따로 기록
    setChangedFields(prev => ({ ...prev, [name]: value }));
  };

  // 저장
  const handleSave = async () => {
    try {
      setChangedFields(prev => ({
        ...prev,
        qnaNo: formData.qnaNo,
        odNo: formData.odNo,
      }));
      await axios.put(`${apiBaseUrl}/orders/delivery/${delvNo}`, {
        ...changedFields,
        qnaNo: formData.qnaNo,
        odNo: formData.odNo,
      });
      alert('✅ 수정되었습니다!');
      dispatch(clearSelectedItem());
      navigate(`/admin/order/delivery/${delvNo}`);
    } catch (err) {
      console.error(err);
      alert('❌ 수정 중 오류가 발생했습니다.');
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
          setFormData(existence);
        } else {
          const response = await axios.get(`${apiBaseUrl}/orders/delivery/detail/${delvNo}`);
          dispatch(selectItem(response.data.data));
          setFormData(response.data.data);
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
      <RenderingStateHandler loading={loading} error={error} data={formData} />

      {formData && (
        <div>
          <fieldset>
            <legend className="mb-3">📦 택배 정보 수정</legend>
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
                  <td colSpan="3">{formData.delvNo}</td>
                </tr>
                <tr>
                  <th className="bg-light">수령인</th>
                  <td>
                    <input
                      type="text"
                      name="delvGetName"
                      className="form-control"
                      value={formData.delvGetName || ''}
                      onChange={handleChange}
                    />
                  </td>
                  <th className="bg-light">수령인 연락처</th>
                  <td>
                    <input
                      type="text"
                      name="delvGetHp"
                      className="form-control"
                      value={formData.delvGetHp || ''}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="bg-light">택배사</th>
                  <td>
                    <input
                      type="text"
                      name="delvCompany"
                      className="form-control"
                      value={formData.delvCompany || ''}
                      onChange={handleChange}
                    />
                  </td>
                  <th className="bg-light">송장번호</th>
                  <td>
                    <input
                      type="text"
                      name="delvComNum"
                      className="form-control"
                      value={formData.delvComNum || ''}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="bg-light">접수 종류</th>
                  <td>
                    <select
                      name="delvType"
                      className="form-select"
                      value={formData.delvType || ''}
                      onChange={handleChange}
                    >
                      <option value={11}>배송</option>
                      <option value={12}>재배송</option>
                      <option value={13}>취소</option>
                      <option value={21}>교환회수</option>
                      <option value={22}>교환재발송</option>
                      <option value={31}>반품회수</option>
                    </select>
                  </td>
                  <th className="bg-light">택배 상태</th>
                  <td>
                    <select
                      name="delvStatus"
                      className="form-select"
                      value={formData.delvStatus || ''}
                      onChange={handleChange}
                    >
                      <option value={1}>배송준비중</option>
                      <option value={2}>집화완료</option>
                      <option value={3}>배송중</option>
                      <option value={4}>지점 도착</option>
                      <option value={5}>배송출발</option>
                      <option value={6}>배송 완료</option>
                    </select>
                  </td>
                </tr>

                {/* 주소 입력폼 컴포넌트 임포트 */}
                <AddressFields item={formData} setItem={setFormData} handleChange={handleChange} prefix="delvGet" />
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
            <button className="btn btn-success" onClick={handleSave}>
              💾 저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDeliveryEdit;
