import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { prdNo } = useParams(); // URL에서 prdNo 가져오기
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 관리자 API URL
  const apiBaseUrl = 'http://localhost:8085/api/admin/products';

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const result = await axios.get(`${apiBaseUrl}/${prdNo}`);
        setProduct(result.data);
      } catch (err) {
        console.error('상품 정보 불러오기 실패:', err);
        alert('상품 정보를 불러올 수 없습니다.');
      }
      setLoading(false);
    };

    loadProduct();
  }, [prdNo]);

  if (loading) return <div className="text-center mt-5">⏳ 불러오는 중...</div>;
  if (!product) return <div className="text-center mt-5">상품 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 text-center">🧴 상품 상세 정보</h2>

      {/* 상품 정보 카드 */}
      <div className="card shadow-sm">
        <div className="card-body">
          {/* 이미지 */}
          <div className="text-center mb-4">
            <img
              src={`/images/${product.prdImg}`}
              alt={product.prdName}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '1px solid #ddd',
              }}
            />
          </div>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <th style={{ width: '150px' }}>상품 번호</th>
                <td>{product.prdNo}</td>
              </tr>
              <tr>
                <th>상품명</th>
                <td>{product.prdName}</td>
              </tr>
              <tr>
                <th>회사</th>
                <td>{product.prdCompany}</td>
              </tr>
              <tr>
                <th>가격</th>
                <td>{product.prdPrice?.toLocaleString()}원</td>
              </tr>
              <tr>
                <th>용량</th>
                <td>{product.prdVolume}</td>
              </tr>
              <tr>
                <th>대분류</th>
                <td>{product.prdMainCate}</td>
              </tr>
              <tr>
                <th>소분류</th>
                <td>{product.prdSubCate}</td>
              </tr>
              <tr>
                <th>재고</th>
                <td>{product.prdStock}</td>
              </tr>
              <tr>
                <th>상태</th>
                <td>{product.prdStatus || '정상'}</td>
              </tr>
              <tr>
                <th>설명</th>
                <td>{product.prdDesc}</td>
              </tr>
            </tbody>
          </table>

          {/* 버튼 영역 */}
          <div className="text-center mt-4">
            <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>
              ← 목록으로
            </button>

            <button className="btn btn-primary" onClick={() => navigate(`/admin/products/edit/${prdNo}`)}>
              ✏ 수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
