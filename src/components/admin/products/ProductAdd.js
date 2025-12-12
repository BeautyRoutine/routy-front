import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { LoadingOverlay } from 'components/common/commonUtils';

const ProductAdd = () => {
  const navigate = useNavigate();
  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const [loading, setLoading] = useState(false);

  // 상태: product + prdDetail
  const [item, setItem] = useState({
    product: {
      prdName: '',
      prdPrice: '',
      prdVolume: '',
      prdCompany: '',
      prdStock: '',
      prdStatus: '정상',
      prdMainCate: '',
      prdSubCate: '',
      prdImg: '',
      prdDesc: '',
    },
    prdDetail: {
      prdVolume_text: '',
      prdSpec: '',
      prdExpire: '',
      prdUsage: '',
      prdManuf: '',
      prdOrigin: '',
      prdFda: '',
      prdIngredients: '',
      prdCaution: '',
      prdQuality: '',
      prdCs_phone: '',
    },
  });

  // 입력 핸들러 (product / prdDetail 구분)
  const handleChange = (e, section = 'product') => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const [previewImg, setPreviewImg] = useState('');
  // 이미지 선택 → 파일명만 저장
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    // DB에는 파일명만 저장
    setItem(prev => ({
      ...prev,
      product: {
        ...prev.product,
        prdImg: file.name,
      },
    }));

    // 화면 미리보기용
    const reader = new FileReader();
    reader.onload = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };

  // 저장
  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.post(`${apiBaseUrl}/products`, item);
      alert('✅ 새로운 상품이 등록되었습니다!');
      navigate('/admin/product/list');
    } catch (err) {
      console.error(err);
      alert('❌ 상품 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '900px' }}>
      <LoadingOverlay show={loading} />

      <h2 className="mb-4 text-center">🧴 신규 상품 등록</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {/* 이미지 미리보기 */}
          <div className="text-center mb-4">
            <img
              src={previewImg || '/images/default.png'}
              alt="상품 미리보기"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '1px solid #ddd',
              }}
            />
            <div className="mt-2">
              <input type="file" onChange={handleImageChange} />
            </div>
            <div className="mt-1 text-muted">{item.product.prdImg || '선택된 파일 없음'}</div>
          </div>

          {/* 상품 기본 정보 */}
          <table className="table table-bordered">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '30%' }} />
            </colgroup>
            <tbody>
              <tr>
                <th className="bg-light">상품명</th>
                <td>
                  <input
                    type="text"
                    name="prdName"
                    className="form-control"
                    value={item.product.prdName}
                    onChange={e => handleChange(e, 'product')}
                    required
                  />
                </td>
                <th className="bg-light">업체명</th>
                <td>
                  <input
                    type="text"
                    name="prdCompany"
                    className="form-control"
                    value={item.product.prdCompany}
                    onChange={e => handleChange(e, 'product')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">용량</th>
                <td>
                  <input
                    type="number"
                    name="prdVolume"
                    className="form-control"
                    value={item.product.prdVolume}
                    onChange={e => handleChange(e, 'product')}
                  />
                </td>
                <th className="bg-light">재고</th>
                <td>
                  <input
                    type="number"
                    name="prdStock"
                    className="form-control"
                    value={item.product.prdStock}
                    onChange={e => handleChange(e, 'product')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">가격</th>
                <td>
                  <input
                    type="number"
                    name="prdPrice"
                    className="form-control"
                    value={item.product.prdPrice}
                    onChange={e => handleChange(e, 'product')}
                    required
                  />
                </td>
                <th className="bg-light">대표 이미지</th>
                <td>
                  <input
                    type="text"
                    name="prdImg"
                    className="form-control"
                    value={item.product.prdImg}
                    onChange={e => handleChange(e, 'product')}
                    placeholder="파일명 또는 URL"
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">메인 카테고리</th>
                <td>
                  <input
                    type="number"
                    name="prdMainCate"
                    className="form-control"
                    value={item.product.prdMainCate}
                    onChange={e => handleChange(e, 'product')}
                  />
                </td>
                <th className="bg-light">서브 카테고리</th>
                <td>
                  <input
                    type="number"
                    name="prdSubCate"
                    className="form-control"
                    value={item.product.prdSubCate}
                    onChange={e => handleChange(e, 'product')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">상품 설명</th>
                <td colSpan="3">
                  <textarea
                    name="prdDesc"
                    className="form-control"
                    value={item.product.prdDesc}
                    onChange={e => handleChange(e, 'product')}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* 상품 상세 정보 */}
          <h5 className="fw-bold border-bottom pb-2 mb-3 text-primary">상세 정보</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th className="bg-light">용량 또는 중량</th>
                <td>
                  <input
                    type="text"
                    name="prdVolume_text"
                    className="form-control"
                    value={item.prdDetail.prdVolume_text}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
                <th className="bg-light">
                  제품 주요 사양
                  <br />
                  (피부 타입 등)
                </th>
                <td>
                  <input
                    type="text"
                    name="prdSpec"
                    className="form-control"
                    value={item.prdDetail.prdSpec}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">
                  사용 기한 (또는
                  <br />
                  개봉 후 사용기간)
                </th>
                <td colSpan="3">
                  <input
                    type="text"
                    name="prdExpire"
                    className="form-control"
                    value={item.prdDetail.prdExpire}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">사용방법</th>
                <td colSpan="3">
                  <textarea
                    name="prdUsage"
                    className="form-control"
                    rows="3"
                    value={item.prdDetail.prdUsage}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">
                  제조자 및<br />
                  제조판매업자
                </th>
                <td>
                  <input
                    type="text"
                    name="prdManuf"
                    className="form-control"
                    value={item.prdDetail.prdManuf}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
                <th className="bg-light">원산지</th>
                <td>
                  <input
                    type="text"
                    name="prdOrigin"
                    className="form-control"
                    value={item.prdDetail.prdOrigin}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">식약처 심사</th>
                <td colSpan="3">
                  <input
                    type="text"
                    name="prdFda"
                    className="form-control"
                    value={item.prdDetail.prdFda}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">주요 성분</th>
                <td colSpan="3">
                  <textarea
                    name="prdIngredients"
                    className="form-control"
                    rows="3"
                    value={item.prdDetail.prdIngredients}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">주의사항</th>
                <td colSpan="3">
                  <textarea
                    name="prdCaution"
                    className="form-control"
                    rows="3"
                    value={item.prdDetail.prdCaution}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">품질보증기준</th>
                <td colSpan="3">
                  <textarea
                    name="prdQuality"
                    className="form-control"
                    rows="3"
                    value={item.prdDetail.prdQuality}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-light">
                  소비자 상담
                  <br />
                  전화번호
                </th>
                <td colSpan="3">
                  <input
                    type="text"
                    name="prdCs_phone"
                    className="form-control"
                    value={item.prdDetail.prdCs_phone}
                    onChange={e => handleChange(e, 'prdDetail')}
                  />
                </td>
              </tr>
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

export default ProductAdd;
