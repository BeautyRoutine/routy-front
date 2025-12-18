import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProductEdit = () => {
  const { prdNo } = useParams();
  const navigate = useNavigate();

  const apiBaseUrl = useSelector(state => state.admConfig.apiBaseUrl);

  const [product, setProduct] = useState({
    prdName: '',
    prdPrice: '',
    prdVolume: '',
    prdCompany: '',
    prdMainCate: '',
    prdSubCate: '',
    prdImg: '',
    prdDesc: '',
    prdStock: '',
    prdStatus: '',
    prdIngredients: '',
  });

  const [previewImg, setPreviewImg] = useState('');
  const [showIngredients, setShowIngredients] = useState(false);

  // 기존 상품 정보 로딩
  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/products/${prdNo}`)
      .then(res => {
        setProduct(res.data);
        setPreviewImg(`/images/${res.data.prdImg}`);
      })
      .catch(() => alert('상품 정보를 불러올 수 없습니다.'));
  }, [prdNo, apiBaseUrl]);

  // 인풋 핸들링
  const handleChange = e => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // 이미지 선택 시 미리보기
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    setProduct({ ...product, prdImg: file });

    // preview
    const reader = new FileReader();
    reader.onload = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };

  // 체크박스 토글 핸들러
  const handleIngredientsToggle = e => {
    const checked = e.target.checked;
    setShowIngredients(checked);

    // 체크 해제 시 입력값 초기화
    if (!checked) {
      setProduct({ ...product, prdIngredients: '' });
    }
  };

  // 수정 요청
  const handleSave = async () => {
    try {
      // 이미지 파일 포함하면 multipart/form-data
      const formData = new FormData();
      Object.keys(product).forEach(key => {
        // prdIngredients는 체크박스가 체크되어 있을 때만 전송
        if (key === 'prdIngredients') {
          if (showIngredients) {
            formData.append(key, product[key]);
          }
          return;
        }

        if (key !== 'prdRegdate' && key !== 'prdUpdate') {
          formData.append(key, product[key]);
        }
      });
      console.log(`${apiBaseUrl}/products/${prdNo}`);
      console.log('=== FormData 내용 ===');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      // return;

      await axios.put(`${apiBaseUrl}/products/${prdNo}`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert('상품이 성공적으로 수정되었습니다!');
      navigate(`/admin/products/detail/${prdNo}`);
    } catch (err) {
      console.error(err);
      alert('상품 수정에 실패했습니다.');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 text-center">✏ 상품 수정</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          {/* 이미지 영역 */}
          <div className="text-center mb-4">
            <img
              src={previewImg}
              alt="상품 이미지"
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
          </div>

          {/* 입력 폼 */}
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th style={{ width: '150px' }}>상품명</th>
                <td>
                  <input
                    type="text"
                    name="prdName"
                    className="form-control"
                    value={product.prdName}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>회사명</th>
                <td>
                  <input
                    type="text"
                    name="prdCompany"
                    className="form-control"
                    value={product.prdCompany}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>가격</th>
                <td>
                  <input
                    type="number"
                    name="prdPrice"
                    className="form-control"
                    value={product.prdPrice}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>용량</th>
                <td>
                  <input
                    type="text"
                    name="prdVolume"
                    className="form-control"
                    value={product.prdVolume}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>대분류</th>
                <td>
                  <input
                    type="text"
                    name="prdMainCate"
                    className="form-control"
                    value={product.prdMainCate}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>소분류</th>
                <td>
                  <input
                    type="text"
                    name="prdSubCate"
                    className="form-control"
                    value={product.prdSubCate}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>재고</th>
                <td>
                  <input
                    type="number"
                    name="prdStock"
                    className="form-control"
                    value={product.prdStock}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>상태</th>
                <td>
                  <select name="prdStatus" className="form-select" value={product.prdStatus} onChange={handleChange}>
                    <option value="정상">정상</option>
                    <option value="품절">품절</option>
                    <option value="숨김">숨김</option>
                  </select>
                </td>
              </tr>

              <tr>
                <th>설명</th>
                <td>
                  <textarea
                    name="prdDesc"
                    className="form-control"
                    rows="4"
                    value={product.prdDesc}
                    onChange={handleChange}
                  ></textarea>
                </td>
              </tr>

              {/* 주요 성분 체크박스 */}
              <tr>
                <th className="bg-light">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="showIngredientsCheck"
                      checked={showIngredients}
                      onChange={handleIngredientsToggle}
                    />
                    <label className="form-check-label" htmlFor="showIngredientsCheck">
                      주요 성분
                    </label>
                  </div>
                </th>
                <td colSpan="3">
                  {showIngredients ? (
                    <textarea
                      name="prdIngredients"
                      className="form-control"
                      rows="3"
                      value={product.prdIngredients}
                      onChange={handleChange}
                      placeholder=";를 기준으로 성분을 파싱합니다."
                    />
                  ) : (
                    <div className="text-muted" style={{ padding: '10px', fontStyle: 'italic' }}>
                      주요 성분을 매핑하려면 체크박스를 선택하세요
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 버튼 영역 */}
          <div className="text-center mt-4">
            <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>
              ← 돌아가기
            </button>

            <button className="btn btn-primary" onClick={handleSave}>
              💾 저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
