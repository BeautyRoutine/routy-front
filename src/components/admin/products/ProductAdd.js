import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductAdd = () => {
  const navigate = useNavigate();
  const apiBaseUrl = 'http://localhost:8085/api/admin/products';

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
    prdStatus: '정상',
  });

  const [previewImg, setPreviewImg] = useState('');

  // input change
  const handleChange = e => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // 이미지 선택
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    setProduct({ ...product, prdImg: file });

    const reader = new FileReader();
    reader.onload = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };

  // 상품 등록
  const handleSave = async () => {
    try {
      const formData = new FormData();

      // 문자열 필드만 append
      Object.keys(product).forEach(key => {
        if (key !== 'prdImg') {
          formData.append(key, product[key]);
        }
      });

      // 파일 append
      if (product.prdImg) {
        formData.append('prdImg', product.prdImg);
      }

      await axios.post(apiBaseUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('상품이 등록되었습니다!');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 text-center">➕ 상품 추가</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          {/* 이미지 업로드 */}
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
            </tbody>
          </table>

          {/* 버튼 */}
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
