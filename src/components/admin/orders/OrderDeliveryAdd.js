import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

import OrderPrdTable from './OrderPrdTable';
import AddressFields from 'components/common/AddressFields';

const OrderDeliveryAdd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const [item, setItem] = useState({
    odNo: '',
    delvCompany: '',
    delvComNum: '',
    delvType: 11,
    delvGetName: '',
    delvGetHp: '',
    delvGetZip: '',
    delvGetJibunAddr: '',
    delvGetRoadAddr: '',
    delvGetDetailAddr: '',
    delvGetBcCode: '',
  });

  // Get Param
  useEffect(() => {
    const odNoParam = searchParams.get('od_no');
    if (odNoParam) {
      setItem(prev => ({ ...prev, odNo: odNoParam }));
    }
  }, [searchParams]);

  const handleChange = e => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.post(`${apiBaseUrl}/orders/delivery`, item);
      alert('✅ 새로운 택배가 등록되었습니다!');
      navigate('/admin/order/delivery');
    } catch (err) {
      console.error(err);
      alert('❌ 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '900px' }}>
      <h2 className="mb-4 text-center">📦 신규 택배 등록</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {/* 주문번호가 있으면 주문상품 목록 표시 */}
          {item.odNo && <OrderPrdTable odInfo={{ odNo: item.odNo }} apiBaseUrl={apiBaseUrl} />}

          {/* 택배 정보 입력 */}
          <table className="table table-bordered">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '30%' }} />
            </colgroup>
            <tbody>
              <tr>
                <th className="bg-light">주문번호 (odNo)</th>
                <td>
                  <input
                    type="number"
                    name="odNo"
                    className="form-control"
                    value={item.odNo}
                    onChange={handleChange}
                    required
                  />
                </td>
                <th className="bg-light">택배 타입</th>
                <td>
                  <select name="delvType" className="form-select" value={item.delvType} onChange={handleChange}>
                    <option value={11}>배송</option>
                    <option value={12}>재배송</option>
                    <option value={13}>취소</option>
                    <option value={21}>교환회수</option>
                    <option value={22}>교환재발송</option>
                    <option value={31}>반품회수</option>
                  </select>
                </td>
              </tr>

              <tr>
                <th className="bg-light">택배사</th>
                <td>
                  <input
                    type="text"
                    name="delvCompany"
                    className="form-control"
                    value={item.delvCompany}
                    onChange={handleChange}
                    required
                  />
                </td>
                <th className="bg-light">운송장 번호</th>
                <td>
                  <input
                    type="text"
                    name="delvComNum"
                    className="form-control"
                    value={item.delvComNum}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">수령인 이름</th>
                <td>
                  <input
                    type="text"
                    name="delvGetName"
                    className="form-control"
                    value={item.delvGetName}
                    onChange={handleChange}
                    required
                  />
                </td>
                <th className="bg-light">수령인 연락처</th>
                <td>
                  <input
                    type="text"
                    name="delvGetHp"
                    className="form-control"
                    value={item.delvGetHp}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              {/* 주소 입력폼 컴포넌트 임포트 */}
              <AddressFields item={item} setItem={setItem} handleChange={handleChange} prefix="delvGet" />
            </tbody>
          </table>

          <div className="text-center mt-4">
            <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>
              ← 취소
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              💾 등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDeliveryAdd;
