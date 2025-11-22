import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/user/product/CategoryFilter';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const limit = searchParams.get('limit') || 20;
  const skin = searchParams.get('skin') || null;

  const loadProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/products/list/skin_cate', {
        params: {
          limit: limit,
          skin: skin,
        },
      });

      setProducts(res.data.data);
    } catch (err) {
      console.error('상품 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [limit, skin]);

  return (
    <div className="product-page-container container mt-4">
      <div className="row">
        {/* 왼쪽 필터 영역 */}
        <div className="col-3">
          <CategoryFilter />
        </div>
        {/* 오른쪽 상품 목록 영역 */}
        


        {/* 더보기 버튼 */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary px-4 rounded-pill">상품 더보기</button>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
