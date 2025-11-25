import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/user/product/CategoryFilter';
import ProductGrid from '../components/user/product/ProductGrid';
import SortBar from '../components/user/product/SortBar';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  const [searchParams] = useSearchParams();
  const limit = searchParams.get('limit') || 20;
  const skin = searchParams.get('skin') || null;

  const loadProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/products/list/skin_cate', { params: { limit, skin } });

      const list = res.data.data || [];
      setProducts(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [limit, skin]);

  return (
    <div className="container mt-4 product-page-container">
      {/* 상단 전체 상품 개수 */}
      <p className="fw-bold mb-3 text-muted">전체 {products.length}개 상품</p>

      <div className="row">
        {/* 왼쪽 필터 */}
        <div className="col-3">
          <CategoryFilter />
        </div>

        {/* 오른쪽 전체 콘텐츠 (정렬 + 상품) */}
        <div className="col-9">
          {/* 정렬바 */}
          <div className="mb-3">
            <SortBar total={products.length} sort="popular" onSortChange={() => {}} />
          </div>

          {/* 상품 목록 */}
          <ProductGrid products={products} />

          <div className="text-center mt-4">
            <button className="btn btn-outline-primary rounded-pill px-4">상품 더보기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
