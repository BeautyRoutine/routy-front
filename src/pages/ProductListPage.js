import React, { useState, useEffect } from 'react';
import api from '../lib/apiClient';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/user/product/CategoryFilter';
import ProductGrid from '../components/user/product/ProductGrid';
import SortBar from '../components/user/product/SortBar';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('popular');

  const [searchParams] = useSearchParams();
  const limit = searchParams.get('limit') || 20;
  const skin = searchParams.get('skin') || null;

  const maincate = searchParams.get('maincate') || null;
  const subcate = searchParams.get('subcate') || null;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get('/api/products/list/skin_cate', {
          params: {
            limit,
            skin,
            maincate, // ★★ 백엔드 요구 파라미터 이름
            subcate, // ★★ 백엔드 요구 파라미터 이름
          },
        });

        const list = res.data.data || [];
        setProducts(list);
      } catch (err) {
        console.error(err);
      }
    };

    loadProducts();
  }, [limit, skin, maincate, subcate]); // ★ 카테고리 변경되면 재로딩

  return (
    <div className="container mt-4 product-page-container">
      <p className="fw-bold mb-3 text-muted">전체 {products.length}개 상품</p>

      <div className="row">
        <div className="col-3">
          <CategoryFilter />
        </div>

        <div className="col-9">
          <div className="mb-3">
            <SortBar total={products.length} sort={sort} onSortChange={value => setSort(value)} />
          </div>

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
